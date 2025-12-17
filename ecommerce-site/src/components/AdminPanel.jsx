import { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/products");
      setProducts(Array.isArray(data) ? data : data.products || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products");
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description || "",
      image: product.image,
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/products/${editingProduct}`,
        form,
        {
          headers: { Authorization: token },
        }
      );
      
      alert("Product updated successfully!");
      setEditingProduct(null);
      setForm({ name: "", price: "", description: "", image: "" });
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error.response?.data?.message || "Failed to update product");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`http://localhost:3000/products/${id}`, {
        headers: { Authorization: token },
      });
      
      alert("Product deleted successfully!");
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setForm({ name: "", price: "", description: "", image: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Admin Panel - Manage Products
        </h1>

        {/* Editing Form */}
        {editingProduct && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className="border p-2 rounded"
                type="number"
                required
              />
              <input
                name="image"
                placeholder="Image URL"
                value={form.image}
                onChange={handleChange}
                className="border p-2 rounded md:col-span-2"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="border p-2 rounded md:col-span-2"
                rows="3"
              />
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className={`border-b hover:bg-gray-50 ${
                    editingProduct === product.id ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-4 font-semibold">{product.name}</td>
                  <td className="p-4 text-indigo-600 font-bold">₹{product.price}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {product.description?.substring(0, 50)}
                    {product.description?.length > 50 ? "..." : ""}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No products found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
