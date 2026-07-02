const Order = require('../models/Order.model');
const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');
const { sendMail } = require('../utils/mailer');

// Allowed order status transitions. Any transition not listed here is rejected.
const STATUS_TRANSITIONS = {
  placed: ['confirmed', 'shipped', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

// Return every item's quantity back to inventory. Idempotent at the call site:
// callers must ensure the order is not already cancelled before invoking this.
const restoreStock = async (order) => {
  for (const item of order.items) {
    if (!item.product) continue;
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }
};

// @desc    Place order
// @route   POST /api/orders
exports.placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Get cart
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product'
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    // Build order items (snapshot price/name) and validate product existence.
    const orderItems = [];
    let total = 0;

    for (const cartItem of cart.items) {
      const product = cartItem.product;

      if (!product) {
        return res.status(400).json({
          success: false,
          message: 'A product in your cart no longer exists',
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        price: product.price,
        quantity: cartItem.quantity,
      });

      total += product.price * cartItem.quantity;
    }

    // Atomically decrement stock per item using a conditional update so two
    // concurrent orders can never oversell the last unit. Each update only
    // succeeds if stock is still >= quantity at write time.
    const decremented = [];
    for (const item of orderItems) {
      const result = await Product.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );

      if (result.modifiedCount !== 1) {
        // Roll back everything we already decremented, then fail cleanly.
        for (const done of decremented) {
          await Product.updateOne(
            { _id: done.product },
            { $inc: { stock: done.quantity } }
          );
        }
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name}`,
        });
      }
      decremented.push(item);
    }

    let order;
    try {
      order = await Order.create({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        total,
        paymentMethod,
        paymentStatus: 'paid',
      });
    } catch (createErr) {
      // Order creation failed after stock was decremented — restore it.
      for (const done of decremented) {
        await Product.updateOne(
          { _id: done.product },
          { $inc: { stock: done.quantity } }
        );
      }
      throw createErr;
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    // Order confirmation email (non-blocking; logs in dev when SMTP is unset).
    sendMail({
      to: req.user.email,
      subject: `Order confirmed — ₹${total}`,
      text: `Thank you for your order! We received your order of ${orderItems.length} item(s) totalling ₹${total}. Order ID: ${order._id}.`,
    }).catch(() => {});

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my orders
// @route   GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders/all
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Ensure user can only see their own orders (unless admin)
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel order
// @route   PATCH /api/orders/:id/cancel
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (!['placed', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage',
      });
    }

    order.status = 'cancelled';
    await order.save();

    // Restore stock (order was not previously cancelled — guarded above).
    await restoreStock(order);

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (admin)
// @route   PATCH /api/orders/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // No-op if the status is unchanged.
    if (status === order.status) {
      return res.json({ success: true, order });
    }

    // Validate the transition against the allowed-transition map.
    const allowed = STATUS_TRANSITIONS[order.status] || [];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change order status from '${order.status}' to '${status}'`,
      });
    }

    const wasCancelled = order.status === 'cancelled';
    order.status = status;
    await order.save();

    // Admin cancelling an order must return its stock to inventory.
    // Guard against restoring twice for an already-cancelled order.
    if (status === 'cancelled' && !wasCancelled) {
      await restoreStock(order);
    }

    // Status-update email (non-blocking). populate user email if needed.
    const populated = await order.populate('user', 'email');
    if (populated.user?.email) {
      sendMail({
        to: populated.user.email,
        subject: `Order ${order._id} — status: ${status}`,
        text: `Your order status has been updated to "${status}".`,
      }).catch(() => {});
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
