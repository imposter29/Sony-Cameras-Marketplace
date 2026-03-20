const Product = require('../models/Product.model');
const Category = require('../models/Category.model');

// @desc    Get all products with filtering, sorting, pagination
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sensor,
      mount,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};

    // Category filter by slug
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) filter.category = cat._id;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Specs filters
    if (sensor) {
      filter['specs.sensor'] = { $regex: sensor, $options: 'i' };
    }
    if (mount) {
      filter['specs.mount'] = { $regex: mount, $options: 'i' };
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { avgRating: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
exports.getFeatured = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .populate('category', 'name slug')
      .limit(8);

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get products for comparison
// @route   GET /api/products/compare?ids=id1,id2,id3
exports.getCompare = async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product ids',
      });
    }

    const idArray = ids.split(',');
    const products = await Product.find({ _id: { $in: idArray } }).populate(
      'category',
      'name slug'
    );

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get product by slug
// @route   GET /api/products/:slug
exports.getBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate(
      'category',
      'name slug'
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create product
// @route   POST /api/products (admin)
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id (admin)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id (admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
