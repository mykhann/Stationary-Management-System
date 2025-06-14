import React, { useState } from "react";
import DashBoardSideBar from "./DashboardSideBar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSingleProduct } from "../../reduxStore/productSlice";

const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    name: "",
    price: "",
    description: "",
    file: null,
    stock: "",
    category: "",
  });

  const onChangeFileHandler = (e) => {
    setInput({
      ...input,
      file: e.target.files?.[0],
    });
  };

  const onChangeInputHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("stock", input.stock);
    formData.append("category", input.category);
    formData.append("price", input.price);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      const res = await axios.post("http://localhost:8000/api/v1/products/create", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res.data);
      if (res.data.success) {
        toast.success("Product created successfully");
        navigate("/Dashboard");
        dispatch(setSingleProduct(res.data.products));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <DashBoardSideBar />
      <div className="flex-grow flex bg-gray-900 items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-lg p-6 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Add Product</h2>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Product Name */}
              <div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={input.name}
                  onChange={onChangeInputHandler}
                  className="w-full p-3 bg-gray-600 text-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Product Price */}
              <div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  onChange={onChangeInputHandler}
                  value={input.price}
                  className="w-full p-3 bg-gray-600 text-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  placeholder="Enter product price"
                  required
                />
              </div>

              {/* Product Description */}
              <div className="col-span-2">
                <textarea
                  id="description"
                  name="description"
                  onChange={onChangeInputHandler}
                  value={input.description}
                  rows="3"
                  className="w-full p-3 bg-gray-600 text-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  placeholder="Enter product description"
                  required
                />
              </div>

              {/* Product Category */}
              <div>
                <input
                  type="text"
                  id="category"
                  name="category"
                  onChange={onChangeInputHandler}
                  value={input.category}
                  className="w-full p-3 bg-gray-600 text-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  placeholder="Enter product category"
                  required
                />
              </div>

              {/* Product Stock */}
              <div>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  onChange={onChangeInputHandler}
                  value={input.stock}
                  className="w-full p-3 bg-gray-600 text-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  placeholder="Enter stock quantity"
                  required
                />
              </div>

              {/* Picture Upload */}
              <div className="col-span-2">
                <label htmlFor="image" className="flex items-center justify-center p-3 bg-cyan-900 text-white border border-gray-300 rounded cursor-pointer hover:bg-cyan-950  transition duration-300 w-36 transform hover:scale-105">
                  Product picture
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={onChangeFileHandler}
                    accept="image/*"
                    className="hidden"
                    required
                  />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-4 bg-cyan-900 text-white px-6 py-2 rounded hover:bg-cyan-950 transition duration-300 w-full transform hover:scale-105"
            >
              Add Product
            </button>
            <button
              onClick={() => navigate("/Dashboard")}
              type="button" // Change to button type
              className="mt-4 bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800 transition duration-300 w-full transform hover:scale-105"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
