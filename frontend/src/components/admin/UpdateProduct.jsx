import React from "react";
import DashBoardSideBar from "./DashboardSideBar";
import { useSelector } from "react-redux";
import { FaEdit, FaTrash } from "react-icons/fa";
import useFetchProducts from "@components/customHooks/UseFetchProducts";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ViewProducts = () => {
  const { products } = useSelector((store) => store.product);
  const navigate = useNavigate();
  useFetchProducts();
  const params=useParams()
  const productId=params.id

 

  return (
    <div className="flex flex-col md:flex-row">
      <DashBoardSideBar />
      <div className="flex-grow p-6 bg-gray-900">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">View Products</h1>
        </div>
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md p-4">
          <table className="min-w-full bg-gray-700 rounded-lg">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Product Name</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Stock</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b text-white border-gray-600 bg-gray-800 cursor-pointer  hover:bg-gray-900">
                  <td className="py-3 px-4">{product?.name}</td>
                  <td className="py-3 px-4">${product?.price}</td>
                  <td className="py-3 px-4">{product?.stock}</td>
                  <td className="py-3 px-4">{product?.description}</td>
                  <td className="py-3 px-4">{product?.category}</td>
                  <td className="py-3 px-4">
                    <img src={product.avatars[0]} className="w-16 h-16 object-cover rounded" alt={product?.name} />
                  </td>
                  <td className="py-3 px-4 flex space-x-2">
                    <FaEdit onClick={() => navigate(`/admin/product/edit/${product?._id}`)} className="text-blue-500 cursor-pointer text-xl hover:text-blue-700" title="Edit" />
                    
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

export default ViewProducts;
