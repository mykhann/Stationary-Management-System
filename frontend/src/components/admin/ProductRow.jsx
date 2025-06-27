// src/pages/ProductRow.jsx
import React, { useState } from "react";
import { Pencil, Trash2, Save } from "lucide-react";
import axios from "axios";
import BASE_URL from "../../apiConfig";

const ProductRow = ({ product, onUpdate, refreshProducts }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...product });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

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
      refreshProducts(product._id);
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
