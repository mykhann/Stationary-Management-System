import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu, Package, Tag, Truck, IndianRupee, Layers, Image as ImageIcon, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setSingleProduct } from "../../reduxStore/productSlice";
import DashBoardSideBar from "./DashboardSideBar";
import BASE_URL from "../../apiConfig";

const AddProduct = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [suppliersList, setSuppliersList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [input, setInput] = useState({
    productName: "",
    description: "",
    avatar: null,
    stock: "",
    category: "",
    supplier: "",
    price: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

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
    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar (Desktop) */}
      <div className="hidden md:block w-64 bg-gray-900 text-white">
        <DashBoardSideBar closeSidebar={closeSidebar} />
      </div>

      {/* Sidebar (Mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-gray-900 text-white">
            <DashBoardSideBar closeSidebar={closeSidebar} />
          </div>
          <div className="flex-1 bg-black bg-opacity-50" onClick={closeSidebar} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 w-full">
        {/* Top Bar (Mobile) */}
        <div className="flex items-center justify-between p-4 md:hidden bg-white shadow">
          <button onClick={toggleSidebar}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Add Product</h2>
          <div className="w-6" />
        </div>

        <main className="px-4 py-2 md:px-6 md:py-4">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              Add Product
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full bg-white p-4 md:p-6 rounded-lg shadow-sm space-y-4 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div>
                <label className="text-gray-700 flex items-center gap-2">
                  <Package size={16} /> Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  value={input.productName}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-gray-700 flex items-center gap-2">
                  <Tag size={16} /> Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={input.category}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Supplier */}
              <div>
                <label className="text-gray-700 flex items-center gap-2">
                  <Truck size={16} /> Supplier
                </label>
                <select
                  name="supplier"
                  value={input.supplier}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
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

              {/* Price */}
              <div>
                <label className="text-gray-700 flex items-center gap-2">
                  <IndianRupee size={16} /> Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={input.price}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Stock */}
              <div>
                <label className="text-gray-700 flex items-center gap-2">
                  <Layers size={16} /> Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={input.stock}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="text-gray-700 flex items-center gap-2">
                  <FileText size={16} /> Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={input.description}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="text-gray-700 flex items-center gap-2">
                  <ImageIcon size={16} /> Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full mt-1 px-3 py-1.5 text-sm border rounded bg-white"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-4 py-1.5 text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 text-sm bg-blue-700 hover:bg-blue-800 text-white rounded transition flex items-center"
              >
                {isSubmitting && (
                  <svg
                    className="animate-spin h-4 w-4 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3.536-3.536A9 9 0 103.515 13.05L4 12z"
                    ></path>
                  </svg>
                )}
                {isSubmitting ? "Adding..." : "Add Item"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddProduct;
