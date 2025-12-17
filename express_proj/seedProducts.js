// Script to insert initial products into MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    name: "Shoes",
    price: 1799,
    originalPrice: 2999,
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAPEBUQEA8…",
    category: "Wearables"
  },
  {
    name: "Watch",
    price: 1999,
    originalPrice: 4999,
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUSEhM…",
    category: "Watch"
  },
  {
    name: "JBL Speaker",
    price: 40000,
    originalPrice: 74999,
    image: "https://www.thesoundfactor.com/cdn/shop/products/1-500x500.jpg?v=16262…",
    category: "Sound System"
  },
  {
    name: "Airpods",
    price: 2399,
    originalPrice: 3999,
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMPERUQEBA…",
    category: "airbuds"
  }
];

async function seedProducts() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';
    await mongoose.connect(mongoUri);
    await Product.deleteMany({}); // Optional: clear existing
    await Product.insertMany(products);
    console.log('Products inserted successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error inserting products:', err);
    process.exit(1);
  }
}

seedProducts();
