import { useState, useEffect } from "react";
import axios from "axios";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart items from API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const { data } = await axios.get("http://localhost:3000/cart", {
          headers: {
            Authorization: token,
          },
        });
        // New cart shape: { cart: { products: [{ product: {...}, quantity }] } } or array when formatted
        const serverCart = data.cart;
        let normalized = [];
        if (Array.isArray(serverCart)) {
          // Already formatted array of items
          normalized = serverCart.map(i => ({
            id: i.id || i.product?.id || i.product?._id,
            name: i.name || i.product?.name,
            price: i.price || i.product?.price,
            description: i.description || i.product?.description || "",
            image: i.image || i.product?.image || "",
            quantity: i.quantity || 1,
          }));
        } else if (serverCart?.products) {
          normalized = serverCart.products.map(item => ({
            id: item.product.id || item.product._id,
            name: item.product.name,
            price: item.product.price,
            description: item.product.description || "",
            image: item.product.image || "",
            quantity: item.quantity,
          }));
        }
        setCartItems(normalized);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQuantityAPI = async (id, newQuantity) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.put(`http://localhost:3000/cart/${id}`, {
        quantity: newQuantity,
      }, {
        headers: {
          Authorization: token,
        },
      });

      setCartItems(data.cart || []);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const increaseQty = (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      updateQuantityAPI(id, item.quantity + 1);
    }
  };

  const decreaseQty = (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (item && item.quantity > 1) {
      updateQuantityAPI(id, item.quantity - 1);
    } else if (item && item.quantity === 1) {
      removeItem(id);
    }
  };

  const removeItem = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.delete(`http://localhost:3000/cart/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      setCartItems(data.cart || []);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + parseInt(item.price) * item.quantity,
    0
  );
  const shipping = cartItems.length > 0 ? 49 : 0;
  const discount = 100;
  const total = subtotal + shipping - discount;

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const orderData = {
      id: Date.now(),
      items: cartItems,
      subtotal,
      shipping,
      discount,
      total,
      date: new Date().toLocaleDateString(),
    };

    const existingOrders = sessionStorage.getItem("orderHistory");
    const orders = existingOrders ? JSON.parse(existingOrders) : [];
    orders.push(orderData);
    sessionStorage.setItem("orderHistory", JSON.stringify(orders));

    // Clear cart via API
    try {
      const token = sessionStorage.getItem("token");
      for (const item of cartItems) {
        await axios.delete(`http://localhost:3000/cart/${item.id}`, {
          headers: {
            Authorization: token,
          },
        });
      }
      setCartItems([]);
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Checkout error, but order saved locally");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-main text-main">
      <div className="flex gap-6 p-10 flex-1">
      
        <div className="w-2/3 bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-5 text-main">Your Cart</h2>

        {cartItems.length === 0 && (
          <p className="accent text-center py-10">Your cart is empty</p>
        )}

        {cartItems.map((item) => (
          <div 
            key={item.id}
            className="flex justify-between items-center border-b border-gray-700 py-4"
          >
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-24 h-24 rounded-md border border-gray-700" 
            />

            <div className="flex flex-col flex-1 ml-4">
              <h3 className="text-lg font-semibold text-main">{item.name}</h3>
              <p className="accent">₹{item.price}</p>

             
              <div className="flex items-center mt-2">
                <button 
                  className="px-3 py-1 bg-gray-700 text-main rounded-l hover:bg-gray-600"
                  onClick={() => decreaseQty(item.id)}
                >
                  -
                </button>

                <span className="px-4 py-1 bg-gray-900 text-main">
                  {item.quantity}
                </span>

                <button 
                  className="px-3 py-1 bg-gray-700 text-main rounded-r hover:bg-gray-600"
                  onClick={() => increaseQty(item.id)}
                >
                  +
                </button>
              </div>
            </div>

            
            <button 
              className="text-red-400 font-semibold hover:underline hover:text-red-200"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      
      <div className="w-1/3 bg-gray-800 p-6 rounded-xl shadow h-fit">
        <h2 className="text-2xl font-bold mb-5 text-main">Order Summary</h2>

        <div className="flex justify-between py-2">
          <span className="accent">Subtotal</span>
          <span className="accent">₹{subtotal}</span>
        </div>

        <div className="flex justify-between py-2">
          <span className="accent">Shipping</span>
          <span className="accent">₹{shipping}</span>
        </div>

        <div className="flex justify-between py-2">
          <span className="accent">Discount</span>
          <span className="accent">-₹{discount}</span>
        </div>

        <hr className="my-3 border-gray-700" />

        <div className="flex justify-between font-bold text-xl text-main">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button 
          onClick={handleCheckout}
          className="w-full mt-6 btn-main py-3"
        >
          Proceed to Checkout
        </button>
      </div>

    </div>
    </div>
  );
};

export default CartPage;
