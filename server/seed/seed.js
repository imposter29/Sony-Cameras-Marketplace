const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Category = require('../models/Category.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');

const categories = [
  {
    name: 'Interchangeable-lens Cameras',
    slug: 'interchangeable-lens-cameras',
    description: 'Sony Alpha mirrorless and DSLR cameras with interchangeable lens system',
  },
  {
    name: 'Vlog Cameras',
    slug: 'vlog-cameras',
    description: 'Sony ZV series vlogging cameras designed for content creators',
  },
  {
    name: 'Handycam Camcorders',
    slug: 'handycam-camcorders',
    description: 'Sony Handycam camcorders for capturing life moments in stunning video',
  },
  {
    name: 'Compact Cameras',
    slug: 'compact-cameras',
    description: 'Sony compact point-and-shoot cameras with powerful features in a pocket size',
  },
  {
    name: 'Cinema Line Cameras',
    slug: 'cinema-line-cameras',
    description: 'Sony Cinema Line cameras for professional filmmakers and cinematographers',
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing categories and products');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);

    const catMap = {};
    createdCategories.forEach((cat) => {
      catMap[cat.slug] = cat._id;
    });

    // Create products
    const scrapedDataPath = path.join(__dirname, '..', '..', 'scraper', 'sony_cameras_data.json');
    const scrapedData = JSON.parse(fs.readFileSync(scrapedDataPath, 'utf8'));

    const products = scrapedData.map((item, index) => {
      let catId = catMap['interchangeable-lens-cameras']; // default
      const searchStr = (item.name + ' ' + (item.model || '')).toLowerCase();
      if (searchStr.includes('zv') || searchStr.includes('vlog')) {
        catId = catMap['vlog-cameras'];
      } else if (searchStr.includes('fx') || searchStr.includes('cinema')) {
        catId = catMap['cinema-line-cameras'];
      } else if (searchStr.includes('handycam') || searchStr.includes('hdr') || searchStr.includes('fdr-ax') || searchStr.includes('camcorder')) {
        catId = catMap['handycam-camcorders'];
      } else if (searchStr.includes('rx') || searchStr.includes('compact') || searchStr.includes('cyber-shot') || searchStr.includes('dsc-')) {
        catId = catMap['compact-cameras'];
      }

      const slug = item.model.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      return {
        name: item.name,
        slug: slug || `product-${index}`,
        description: item.description || 'Experience the best of photography with Sony.',
        category: catId,
        price: item.price && item.price > 0 ? item.price : Math.floor(Math.random() * 300000) + 100000,
        stock: Math.floor(Math.random() * 40) + 10,
        isFeatured: index < 6,
        images: item.images && item.images.length > 0 
          ? item.images 
          : ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'],
        specs: {
          model: item.model,
          autofocus: item.features?.find(f => f.toLowerCase().includes('af') || f.toLowerCase().includes('focus')) || 'Advanced Hybrid AF',
          sensor: item.features?.find(f => f.toLowerCase().includes('sensor') || f.toLowerCase().includes('megapixels')) || 'Sony Exmor CMOS Sensor',
          mount: 'E-mount'
        },
        features: Array.isArray(item.features) ? item.features : [],
      };
    });

    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} products`);

    // Create admin user (check if exists first)
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('Admin user already exists, skipping...');
    } else {
      await User.create({
        name: 'Sony Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
      });
      console.log('Admin user created');
    }

    console.log('Seed completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDB();
