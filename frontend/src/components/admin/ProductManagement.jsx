import React from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardSideBar from "./DashboardSideBar";

const mockProducts = [
  {
    id: 1,
    name: "Notebook",
    category: "Stationery",
    price: "$4.99",
    stock: 120,
  },
  {
    id: 2,
    name: "Marker Set",
    category: "Art Supplies",
    price: "$9.99",
    stock: 85,
  },
  {
    id: 3,
    name: "A4 Paper",
    category: "Office Paper",
    price: "$3.50",
    stock: 200,
  },
];

const ProductManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar on the left */}
      <div className="w-64 bg-gray-900 text-white">
        <DashboardSideBar />
      </div>

      {/* Main Content on the right */}
      <div className="flex-1 p-6">
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

        <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4">{product.price}</td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4 space-x-2">
                    <button
                      onClick={() => navigate(`/dashboard/product/edit/${product.id}`)}
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
      </div>
    </div>
  );
};

export default ProductManagement;
