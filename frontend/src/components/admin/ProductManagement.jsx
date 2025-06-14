import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardSideBar from "./DashboardSideBar";
import BASE_URL from "../../apiConfig";

const ProductManagement = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/item/get`, {
          withCredentials: true,
        });
        setProducts(response.data.items); // Adjust key if needed
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed z-40 md:static md:translate-x-0 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-gray-900 text-white`}
      >
        <DashboardSideBar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:ml-64 w-full">
        {/* Hamburger on mobile */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden mb-4 text-gray-700"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Product Management</h2>
          <button
            onClick={() => navigate("/dashboard/add-product")}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="p-4 text-left">Image</th>
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Stock</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    {/* Image Cell */}
                    <td className="p-4">
                      <img
                        src={product.avatar || "/placeholder.png"} 
                        alt={product.productName}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                    </td>
                    <td className="p-4">{product.productName}</td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4">Rs. {product.price}</td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4 space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/product/edit/${product._id}`)
                        }
                        className="inline-flex items-center text-blue-600 hover:underline"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button className="inline-flex items-center text-red-500 hover:underline">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
