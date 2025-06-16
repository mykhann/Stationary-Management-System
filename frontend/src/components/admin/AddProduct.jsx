import React, { useState, useEffect } from "react";
import DashBoardSideBar from "./DashboardSideBar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSingleProduct } from "../../reduxStore/productSlice";
import BASE_URL from "../../apiConfig";

const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    productName: "",
    description: "",
    avatar: null,
    stock: "",
    category: "",
    supplier: "",
    price: "",
  });

  const [suppliersList, setSuppliersList] = useState([]);

  // Fetch supplier list from API
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/supplier/get`, {
          withCredentials: true,
        });
        setSuppliersList(res.data.suppliers);
      } catch (err) {
        console.error("Failed to fetch suppliers:", err);
      }
    };

    fetchSuppliers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput((prev) => ({ ...prev, avatar: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(input).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/item/create`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Product added!");
        dispatch(setSingleProduct(res.data.product));
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating item.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <DashBoardSideBar />
      <div className="flex-grow bg-gray-50 py-8 px-4 flex justify-center items-start">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6 space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center">Add New Product</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700">Product Name</label>
              <input
                type="text"
                name="productName"
                value={input.productName}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>

            <div>
              <label className="text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                value={input.category}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>

            <div>
              <label className="text-gray-700">Supplier</label>
              <select
                name="supplier"
                value={input.supplier}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              >
                <option value="">Select Supplier</option>
                {suppliersList.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-gray-700">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={input.price}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>

            <div>
              <label className="text-gray-700">Stock</label>
              <input
                type="number"
                name="stock"
                value={input.stock}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-700">Description</label>
              <textarea
                name="description"
                rows="3"
                value={input.description}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-700">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full mt-1 px-3 py-2 border rounded bg-white"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded transition"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
