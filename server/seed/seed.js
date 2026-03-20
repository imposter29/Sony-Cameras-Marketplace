const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Category = require('../models/Category.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');

const categories = [
  {
    name: 'Alpha Series',
    slug: 'alpha-series',
    description: 'Sony Alpha mirrorless cameras for professionals and enthusiasts',
  },
  {
    name: 'ZV Series',
    slug: 'zv-series',
    description: 'Sony ZV vlogging cameras designed for content creators',
  },
  {
    name: 'Cinema Line',
    slug: 'cinema-line',
    description: 'Sony Cinema Line cameras for filmmakers',
  },
  {
    name: 'Lenses',
    slug: 'lenses',
    description: 'Sony E-mount lenses for Alpha and Cinema Line cameras',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Camera accessories, batteries, memory cards, and more',
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
    const products = [
      {
        name: 'Sony A7 IV',
        slug: 'sony-a7-iv',
        description:
          'The Sony A7 IV is a versatile full-frame mirrorless camera that delivers outstanding image quality with its 33MP sensor, advanced autofocus, and 4K 60fps video capabilities. Perfect for hybrid shooters who need exceptional stills and video performance.',
        category: catMap['alpha-series'],
        price: 249990,
        stock: 24,
        isFeatured: true,
        images: [
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
        ],
        specs: {
          sensor: '33MP Full-frame BSI CMOS',
          autofocus: '759 phase-detect points',
          video: '4K 60fps 10-bit',
          ISO: '100-51200',
          burst: '10fps',
          mount: 'E-mount',
          battery: '580 shots',
          weight: '658g',
        },
      },
      {
        name: 'Sony A7R V',
        slug: 'sony-a7r-v',
        description:
          'The Sony A7R V pushes resolution boundaries with its 61MP full-frame sensor, AI-based autofocus processing unit, and 8-step image stabilization. The ultimate camera for landscape, studio, and detail-oriented photography.',
        category: catMap['alpha-series'],
        price: 349990,
        stock: 15,
        isFeatured: true,
        images: [
          'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800',
        ],
        specs: {
          sensor: '61MP Full-frame BSI CMOS',
          autofocus: '693 phase-detect points',
          video: '4K 60fps 10-bit',
          ISO: '100-32000',
          burst: '10fps',
          mount: 'E-mount',
          battery: '530 shots',
          weight: '723g',
        },
      },
      {
        name: 'Sony A7S III',
        slug: 'sony-a7s-iii',
        description:
          'The Sony A7S III is the ultimate low-light video powerhouse with its 12.1MP full-frame sensor, 4K 120fps recording, and extraordinary ISO range up to 102400. Built for professional videographers and filmmakers.',
        category: catMap['alpha-series'],
        price: 349990,
        stock: 10,
        isFeatured: true,
        images: [
          'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=800',
        ],
        specs: {
          sensor: '12.1MP Full-frame BSI CMOS',
          autofocus: '759 phase-detect points',
          video: '4K 120fps 10-bit',
          ISO: '80-102400',
          burst: '10fps',
          mount: 'E-mount',
          battery: '600 shots',
          weight: '699g',
        },
      },
      {
        name: 'Sony A1',
        slug: 'sony-a1',
        description:
          'The Sony A1 is the flagship Alpha camera offering 50.1MP resolution, 30fps blackout-free shooting, 8K video, and an unmatched autofocus system. The ultimate tool for sports, wildlife, and professional photography.',
        category: catMap['alpha-series'],
        price: 549990,
        stock: 6,
        isFeatured: true,
        images: [
          'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800',
        ],
        specs: {
          sensor: '50.1MP Full-frame BSI CMOS',
          autofocus: '759 phase-detect points',
          video: '8K 30fps 10-bit',
          ISO: '100-32000',
          burst: '30fps',
          mount: 'E-mount',
          battery: '530 shots',
          weight: '737g',
        },
      },
      {
        name: 'Sony A9 III',
        slug: 'sony-a9-iii',
        description:
          'The Sony A9 III features the world\'s first full-frame global shutter sensor, enabling 120fps blackout-free shooting with zero rolling shutter distortion. Designed for professional sports and action photography.',
        category: catMap['alpha-series'],
        price: 599990,
        stock: 5,
        isFeatured: false,
        images: [
          'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=800',
        ],
        specs: {
          sensor: '24.6MP Full-frame Global Shutter',
          autofocus: '759 phase-detect points',
          video: '4K 120fps',
          ISO: '250-25600',
          burst: '120fps',
          mount: 'E-mount',
          battery: '530 shots',
          weight: '703g',
        },
      },
      {
        name: 'Sony A6700',
        slug: 'sony-a6700',
        description:
          'The Sony A6700 is a compact APS-C powerhouse featuring a 26MP sensor, advanced AI autofocus, and 4K 120fps video. The ideal mirrorless camera for creators seeking performance in a portable form factor.',
        category: catMap['alpha-series'],
        price: 149990,
        stock: 30,
        isFeatured: true,
        images: [
          'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800',
        ],
        specs: {
          sensor: '26MP APS-C BSI CMOS',
          autofocus: '759 phase-detect points',
          video: '4K 120fps 10-bit',
          ISO: '100-32000',
          burst: '11fps',
          mount: 'E-mount',
          battery: '570 shots',
          weight: '493g',
        },
      },
      {
        name: 'Sony ZV-E10',
        slug: 'sony-zv-e10',
        description:
          'The Sony ZV-E10 is a compact interchangeable-lens vlog camera with a 24.2MP APS-C sensor, real-time Eye AF, and product showcase setting. Perfect for vloggers and content creators on a budget.',
        category: catMap['zv-series'],
        price: 69990,
        stock: 41,
        isFeatured: false,
        images: [
          'https://images.unsplash.com/photo-1613274554329-70f997f5789f?w=800',
        ],
        specs: {
          sensor: '24.2MP APS-C Exmor CMOS',
          autofocus: '425 phase-detect points',
          video: '4K 30fps',
          ISO: '100-32000',
          burst: '11fps',
          mount: 'E-mount',
          battery: '440 shots',
          weight: '343g',
        },
      },
      {
        name: 'Sony ZV-E1',
        slug: 'sony-zv-e1',
        description:
          'The Sony ZV-E1 is a compact full-frame vlog camera with a 12.1MP sensor, exceptional low-light performance, and cinematic video capabilities. The ultimate vlogging camera for serious content creators.',
        category: catMap['zv-series'],
        price: 199990,
        stock: 18,
        isFeatured: true,
        images: [
          'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800',
        ],
        specs: {
          sensor: '12.1MP Full-frame BSI CMOS',
          autofocus: '627 phase-detect points',
          video: '4K 60fps 10-bit',
          ISO: '80-102400',
          burst: '10fps',
          mount: 'E-mount',
          battery: '570 shots',
          weight: '483g',
        },
      },
      {
        name: 'Sony FX3',
        slug: 'sony-fx3',
        description:
          'The Sony FX3 is a compact full-frame cinema camera delivering professional filmmaking capabilities in the smallest Cinema Line body. Features S-Cinetone, 4K 120fps, and a built-in cooling system.',
        category: catMap['cinema-line'],
        price: 429990,
        stock: 8,
        isFeatured: true,
        images: [
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800',
        ],
        specs: {
          sensor: '12.1MP Full-frame BSI CMOS',
          autofocus: '627 phase-detect points',
          video: '4K 120fps 10-bit',
          ISO: '80-102400',
          burst: '10fps',
          mount: 'E-mount',
          battery: '600 shots',
          weight: '715g',
        },
      },
      {
        name: 'Sony FX30',
        slug: 'sony-fx30',
        description:
          'The Sony FX30 brings Cinema Line quality to a more accessible price point with its 26MP APS-C sensor, 4K 120fps recording, and S-Cinetone color science. An excellent entry into professional filmmaking.',
        category: catMap['cinema-line'],
        price: 199990,
        stock: 12,
        isFeatured: false,
        images: [
          'https://images.unsplash.com/photo-1626072778346-0ab0e13e0a29?w=800',
        ],
        specs: {
          sensor: '26MP APS-C BSI CMOS',
          autofocus: '759 phase-detect points',
          video: '4K 120fps 10-bit',
          ISO: '100-51200',
          burst: '30fps',
          mount: 'E-mount',
          battery: '560 shots',
          weight: '579g',
        },
      },
    ];

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
