const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');

// @desc    Get user cart
// @route   GET /api/cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name price images stock slug'
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        const newQty = existingItem.quantity + quantity;
        if (newQty > product.stock) {
          return res.status(400).json({
            success: false,
            message: 'Insufficient stock',
          });
        }
        existingItem.quantity = newQty;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name price images stock slug'
    );

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update item quantity
// @route   PUT /api/cart/item/:productId
exports.updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not in cart',
      });
    }

    item.quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name price images stock slug'
    );

    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/item/:productId
exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { items: { product: productId } } },
      { new: true }
    ).populate('items.product', 'name price images stock slug');

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { new: true }
    );

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
