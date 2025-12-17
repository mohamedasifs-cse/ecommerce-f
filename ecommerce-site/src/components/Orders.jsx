import { useState, useEffect } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = sessionStorage.getItem("orderHistory");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Order History</h1>

      {orders.length === 0 ? (
        <p className="text-lg text-gray-600">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-100 px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                    <p className="text-lg font-semibold">Date: {order.date}</p>
                  </div>
                  <p className="text-2xl font-bold text-indigo-600">₹{order.total}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-sm">Product</th>
                      <th className="px-6 py-3 text-center font-semibold text-sm">Qty</th>
                      <th className="px-6 py-3 text-right font-semibold text-sm">Price</th>
                      <th className="px-6 py-3 text-right font-semibold text-sm">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <span className="font-semibold text-sm">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-sm">{item.quantity}</td>
                        <td className="px-6 py-4 text-right text-sm">₹{item.price}</td>
                        <td className="px-6 py-4 text-right font-semibold text-sm">
                          ₹{parseInt(item.price) * item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 px-6 py-4 border-t">
                <div className="flex justify-end gap-12">
                  <div>
                    <p className="text-gray-600 text-sm">Subtotal</p>
                    <p className="font-semibold">₹{order.subtotal}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Shipping</p>
                    <p className="font-semibold">₹{order.shipping}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Discount</p>
                    <p className="font-semibold">-₹{order.discount}</p>
                  </div>
                  <div className="border-l-2 border-gray-300 pl-4">
                    <p className="text-gray-600 text-sm">Total</p>
                    <p className="text-xl font-bold text-indigo-600">₹{order.total}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;