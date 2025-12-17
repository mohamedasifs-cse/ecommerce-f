

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cart");
const authRouter = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");
const createDB = require("./config/db");
createDB();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/auth", authRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Havox E-commerce API Server is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ GET http://localhost:${PORT}/products - Get all products`);
  console.log(`✓ GET http://localhost:${PORT}/products/:id - Get product by ID`);
  console.log(`✓ POST http://localhost:${PORT}/products - Add new product`);
  console.log(`✓ PUT http://localhost:${PORT}/products/:id - Update product`);
  console.log(`✓ DELETE http://localhost:${PORT}/products/:id - Delete product`);
  console.log(`✓ GET http://localhost:${PORT}/cart - Get cart items`);
  console.log(`✓ POST http://localhost:${PORT}/cart - Add to cart`);
  console.log(`✓ PUT http://localhost:${PORT}/cart/:id - Update cart quantity`);
  console.log(`✓ DELETE http://localhost:${process.env.PORT}/cart/:id - Remove from cart`);
});
