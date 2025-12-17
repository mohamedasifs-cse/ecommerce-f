import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/products");

        // Data is an array directly from the API
        const productList = Array.isArray(data) ? data : data.products || [];
        
        if (productList.length === 0) {
          throw new Error("No products found in database");
        }

        // Add quantity property to each product
        const productsWithQty = productList.map((p) => ({
          ...p,
          quantity: 0,
        }));

        setProducts(productsWithQty);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const updateQuantity = (productId, change) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== productId) return product;
        const newQty = Math.max(0, (product.quantity || 0) + change);
        return { ...product, quantity: newQty };
      })
    );
  };

  const onAddToCart = async (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) {
      alert("Product not found");
      return;
    }

    // Log the product being sent
    const cartData = {
      productId: product._id || product.id,
      quantity: 1,
    };
    console.log("Sending to cart:", cartData);

    try {
      const token = sessionStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const res = await axios.post("http://localhost:3000/cart", cartData, {
        headers,
      });

      if (res.status >= 200 && res.status < 300) {
        updateQuantity(id, 1);
        console.log("✓ Product added to cart:", res.data.message);
        alert("✓ Added to cart successfully!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
      alert(`Failed to add to cart: ${errorMsg}`);
    }
  };

  const onIncrement = (id) => updateQuantity(id, 1);
  const onDecrement = (id) => updateQuantity(id, -1);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <p className="text-gray-500">Make sure the Express server is running on port 3000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Products
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our premium collection of cutting-edge electronics designed for innovation and performance
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            image={product.image}
            price={product.price}
            quantity={product.quantity || 0}
            onAddToCart={() => onAddToCart(product.id)}
            onIncrement={() => onIncrement(product.id)}
            onDecrement={() => onDecrement(product.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
