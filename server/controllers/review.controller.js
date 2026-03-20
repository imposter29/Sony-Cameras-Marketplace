const Review = require('../models/Review.model');

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add review
// @route   POST /api/reviews/product/:productId
exports.addReview = async (req, res) => {
  try {
    const { rating, title, body, images } = req.body;

    const review = await Review.create({
      user: req.user._id,
      product: req.params.productId,
      rating,
      title,
      body,
      images: images || [],
    });

    const populatedReview = await Review.findById(review._id).populate(
      'user',
      'name avatar'
    );

    res.status(201).json({ success: true, review: populatedReview });
  } catch (error) {
    // Handle duplicate review error (compound unique index)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Ownership check
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review',
      });
    }

    const { rating, title, body, images } = req.body;
    if (rating !== undefined) review.rating = rating;
    if (title !== undefined) review.title = title;
    if (body !== undefined) review.body = body;
    if (images !== undefined) review.images = images;

    await review.save();

    const populatedReview = await Review.findById(review._id).populate(
      'user',
      'name avatar'
    );

    res.json({ success: true, review: populatedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Ownership check
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    // Use findOneAndDelete to trigger the post hook
    await Review.findOneAndDelete({ _id: review._id });

    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
