const mongoose = require('mongoose');
const Product = require('./Product.model');

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Compound unique index — one review per user per product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Static method to calculate average rating
ReviewSchema.statics.calcAvgRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      avgRating: Math.round(result[0].avgRating * 10) / 10,
      reviewCount: result[0].reviewCount,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      avgRating: 0,
      reviewCount: 0,
    });
  }
};

// Post save hook — recalculate avg rating
ReviewSchema.post('save', async function () {
  await this.constructor.calcAvgRating(this.product);
});

// Post findOneAndDelete hook — recalculate avg rating
ReviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calcAvgRating(doc.product);
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
