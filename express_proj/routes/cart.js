const express = require("express");
const auth = require("../middleware/authMiddleware");
// Use exact paths/casing matching user's files
const cartController = require("../controller/cartController");
const router = express.Router();

// Optional authentication middleware - allows guest access
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    // Create a guest user ID if no token provided
    req.userData = { id: "guest_" + Date.now(), email: "guest@guest.com", role: "guest" };
    return next();
  }

  let extractedToken = token;
  if (token.startsWith("Bearer ")) {
    extractedToken = token.slice(7);
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(extractedToken, process.env.SECRET_KEY);
    req.userData = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (error) {
    // If token is invalid, treat as guest
    req.userData = { id: "guest_" + Date.now(), email: "guest@guest.com", role: "guest" };
    next();
  }
};

// Apply optional authentication middleware to all cart routes
router.use(optionalAuth);

// GET user's cart
router.get("/", cartController.getCart);

// Add to cart
router.post("/", cartController.addToCart);

// Future: update quantity and delete endpoints can be added when controller exposes them

module.exports = router;
