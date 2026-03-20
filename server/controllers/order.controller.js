const Order = require('../models/Order.model');
const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');

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

    // Build order items and validate stock
    const orderItems = [];
    let total = 0;

    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.product._id);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${cartItem.product.name} no longer exists`,
        });
      }

      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
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

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      total,
      paymentMethod,
      paymentStatus: 'paid',
    });

    // Decrement stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

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

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

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

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
