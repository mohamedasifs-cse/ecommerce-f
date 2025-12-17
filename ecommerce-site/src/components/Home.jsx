import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate(); 
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const savedProducts = sessionStorage.getItem("products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      const defaultProducts = [
        { id: 1, name: "Smart Watch", image: "data:image/jpeg;base64,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", price: "1999", quantity: 0 },
        { id: 2, name: "JBL speaker", image: "data:image/jpeg;base64,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", price: "40000", quantity: 0 },
        { id: 3, name: "Power Bank", image: "data:image/jpeg;base64,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", price: "1499", quantity: 0 },
      ];
      setProducts(defaultProducts);
      sessionStorage.setItem("products", JSON.stringify(defaultProducts));
    }
  }, []);

  const goToProducts = () => {
    navigate("/products");
  };

  const topThree = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section - Modern Gradient */}
      <div className="relative overflow-hidden py-24 px-4 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold border border-blue-500/30">
              🎉 Welcome to Factory LOT
            </span>
          </div>
          <h1 className="text-6xl sm:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-tight">
            Elevate Your Style
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={goToProducts}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Shop Now <span className="text-xl">→</span>
            </button>
            <button
              onClick={goToProducts}
              className="px-8 py-4 border-2 border-gray-400 text-gray-300 hover:text-white hover:border-white font-bold rounded-lg transition-all duration-300 hover:bg-white/10"
            >
              Explore Collection
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {[
          { number: "5K+", label: "Happy Customers" },
          { number: "100+", label: "Premium Products" },
          { number: "24/7", label: "Customer Support" },
          { number: "2M+", label: "Orders Shipped" }
        ].map((stat, idx) => (
          <div key={idx} className="text-center p-6 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-blue-500/50 transition-all">
            <div className="text-3xl font-black text-blue-400 mb-2">{stat.number}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Featured Products Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Featured Collection
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Handpicked selections featuring our most popular and highly-rated products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {topThree.map((item) => (
            <div
              key={item.id}
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20"
            >
              {/* Image Container */}
              <div className="relative h-80 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                  NEW
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {item.name}
                </h3>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                  <span className="text-xs text-gray-400 ml-2">(128 reviews)</span>
                </div>
                <p className="text-sm text-gray-400 mb-6">
                  Premium Quality • Comfort Fit • Durable Design
                </p>

                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 line-through">₹{parseInt(item.price) + 500}</div>
                    <div className="text-2xl font-black text-blue-400">₹{item.price}</div>
                  </div>
                  <button
                    onClick={goToProducts}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all transform hover:scale-110 duration-300 shadow-lg"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <button
            onClick={goToProducts}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            View All Products
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { icon: "🚚", title: "Free Shipping", desc: "On orders over ₹500" },
            { icon: "🔄", title: "Easy Returns", desc: "30-day return policy" },
            { icon: "🛡️", title: "Secure Payment", desc: "100% secure checkout" }
          ].map((feature, idx) => (
            <div key={idx} className="text-center p-8 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-800/80 transition-all">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative overflow-hidden py-20 px-4 mb-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers enjoying premium footwear. Limited time offers available now!
          </p>
          <button
            onClick={goToProducts}
            className="px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg rounded-lg shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300"
          >
            Shop The Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;