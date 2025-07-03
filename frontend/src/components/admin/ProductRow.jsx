// src/pages/ProductRow.jsx
import React, { useState } from "react";
import { Pencil, Trash2, Save } from "lucide-react";
import axios from "axios";
import BASE_URL from "../../apiConfig";

const ProductRow = ({ product, onUpdate, fetchProducts ,analytics }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...product });
  
  // analytics 
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };
  
//  get trend status 
const getTrendStatus = (category) => {
  const catKey = category?.toLowerCase();
  const trendData = analytics[catKey];

  if (!trendData || trendData.length < 2) return "Stable";

  const latest = trendData[trendData.length - 1];
  const pctChange = latest.pctChange;

  if (pctChange > 20) return "Increasing";
  if (pctChange < -20) return "Decreasing";
  return "Stable";
};

const trend = getTrendStatus(product.category);



  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/v1/item/update/${product._id}`,
        editedData,
        { withCredentials: true }
      );
      const updated = response.data.updatedItem || editedData;
      onUpdate?.(product._id, updated);
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update product.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}/api/v1/item/delete/${product._id}`, {
        withCredentials: true,
      });
      fetchProducts()
      
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete product.");
    }
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-4">
        <img
          src={product.avatar || "/placeholder.png"}
          alt={product.productName}
          className="w-16 h-16 object-cover rounded-md border"
        />
      </td>
      <td className="p-4">
        {isEditing ? (
          <input
            name="productName"
            value={editedData.productName}
            onChange={handleChange}
            className="border p-1 rounded w-full"
          />
        ) : (
          product.productName
        )}
      </td>
      <td className="p-4">
        {isEditing ? (
          <input
            name="category"
            value={editedData.category}
            onChange={handleChange}
            className="border p-1 rounded w-full"
          />
        ) : (
          product.category
        )}
      </td>
      <td className="p-4">
        {isEditing ? (
          <input
            name="price"
            type="number"
            value={editedData.price}
            onChange={handleChange}
            className="border p-1 rounded w-full"
          />
        ) : (
          `Rs. ${product.price}`
        )}
      </td>
      <td className="p-4">
        {isEditing ? (
          <input
            name="stock"
            type="number"
            value={editedData.stock}
            onChange={handleChange}
            className="border p-1 rounded w-full"
          />
        ) : (
          product.stock
        )}
      </td>
      <td className="p-4">
        {isEditing ? (
          <input
            name="reorderLevel"
            type="number"
            value={editedData.reorderLevel}
            onChange={handleChange}
            className="border p-1 rounded w-full"
          />
        ) : (
          product.reorderLevel ?? "-"
        )}
      </td>
      <td className="p-4">
  {isEditing ? (
    <input
      name="category"
      value={editedData.category}
      onChange={handleChange}
      className="border p-1 rounded w-full"
    />
  ) : (
    <span>
     
      <span
        className={`text-xs px-2 py-1 rounded-full ml-2 ${
          trend === "Stable"
            ? "bg-green-100 text-green-800"
            : trend.includes("Increasing")
            ? "bg-blue-100 text-blue-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {trend}
      </span>
    </span>
  )}
</td>

      <td className="p-4">
        {isEditing ? (
          <input
            name="reorderStock"
            type="number"
            value={editedData.reorderStock}
            onChange={handleChange}
            className="border p-1 rounded w-full"
          />
        ) : (
          product.reorderStock ?? "-"
        )}
      </td>
      <td className="p-4 space-x-2">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="inline-flex items-center text-green-600 hover:underline"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center text-blue-600 hover:underline"
          >
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </button>
        )}
        <button
          onClick={handleDelete}
          className="inline-flex items-center text-red-500 hover:underline"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;
