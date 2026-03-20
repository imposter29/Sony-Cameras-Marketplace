const User = require('../models/User.model');

// @desc    Get user profile
// @route   GET /api/users/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile (name + avatar)
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user addresses
// @route   GET /api/users/addresses
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add address
// @route   POST /api/users/addresses
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { label, line1, city, state, pincode, phone, isDefault } = req.body;

    if (isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses.push({ label, line1, city, state, pincode, phone, isDefault });
    await user.save();

    res.status(201).json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update address
// @route   PUT /api/users/addresses/:addressId
exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    const { label, line1, city, state, pincode, phone, isDefault } = req.body;

    if (isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    if (label !== undefined) address.label = label;
    if (line1 !== undefined) address.line1 = line1;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (pincode !== undefined) address.pincode = pincode;
    if (phone !== undefined) address.phone = phone;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await user.save();

    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:addressId
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    address.deleteOne();
    await user.save();

    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get wishlist
// @route   GET /api/users/wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'wishlist',
      'name slug price originalPrice images avgRating reviewCount stock'
    );
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle wishlist item
// @route   POST /api/users/wishlist/:productId
exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    const index = user.wishlist.indexOf(productId);

    if (index > -1) {
      // Remove from wishlist
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { wishlist: productId },
      });
    } else {
      // Add to wishlist
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { wishlist: productId },
      });
    }

    const updatedUser = await User.findById(req.user._id).populate(
      'wishlist',
      'name slug price originalPrice images avgRating reviewCount stock'
    );

    res.json({
      success: true,
      wishlist: updatedUser.wishlist,
      added: index === -1,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
