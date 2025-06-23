// SupplierManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../apiConfig";
import DashboardSideBar from "./DashboardSideBar";
import SupplierForm from "./SupplierForm";
import { Pencil, Trash2, Plus } from "lucide-react";

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [editData, setEditData] = useState({});
  const [adding, setAdding] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/supplier/get`, {
        withCredentials: true,
      });
      setSuppliers(res.data.suppliers);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplierId(supplier._id);
    setEditData({
      name: supplier.name,
      contactPerson: supplier.contactPerson || "",
      email: supplier.email,
      phone: supplier.phone || "",
      address: supplier.address,
    });
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleNewChange = (e) => {
    setNewSupplier({ ...newSupplier, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.patch(
        `${BASE_URL}/api/v1/supplier/${editingSupplierId}/update`,
        editData,
        { withCredentials: true }
      );
      setEditingSupplierId(null);
      setEditData({});
      fetchSuppliers();
    } catch (err) {
      console.error("Failed to update supplier:", err);
    }
  };

  const handleSaveNew = async () => {
    try {
      await axios.post(`${BASE_URL}/api/v1/supplier/create`, newSupplier, {
        withCredentials: true,
      });
      setAdding(false);
      setNewSupplier({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
      });
      fetchSuppliers();
    } catch (err) {
      console.error("Failed to create supplier:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/v1/supplier/${id}/delete`, {
        withCredentials: true,
      });
      fetchSuppliers();
    } catch (err) {
      console.error("Failed to delete supplier:", err);
    }
  };

  return (
    <div className="flex flex-col  md:flex-row min-h-screen bg-gray-100">
      <div className="hidden md:block w-full md:w-64 bg-gray-900 text-white">
        <DashboardSideBar />
      </div>

      <div className="flex-1 p-4 sm:p-6 ">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Supplier Management
          </h2>
          <button
            onClick={() => setAdding(!adding)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
          >
            <Plus className="inline w-4 h-4 mr-1" />
            Add Supplier
          </button>
        </div>

        <div className="overflow-auto rounded-2xl shadow-md bg-white">
          <table className="min-w-[640px] w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Contact Person</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Address</th>
                <th className="p-4">Items Supplied</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adding && (
                <SupplierForm
                  formData={newSupplier}
                  onChange={handleNewChange}
                  onSave={handleSaveNew}
                  onCancel={() => setAdding(false)}
                />
              )}

              {suppliers.map((supplier) =>
                editingSupplierId === supplier._id ? (
                  <SupplierForm
                    key={supplier._id}
                    formData={editData}
                    onChange={handleChange}
                    onSave={handleSaveEdit}
                    onCancel={() => setEditingSupplierId(null)}
                    isEditing
                  />
                ) : (
                  <tr
                    key={supplier._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4">{supplier.name}</td>
                    <td className="p-4">{supplier.contactPerson}</td>
                    <td className="p-4">{supplier.email}</td>
                    <td className="p-4">{supplier.phone}</td>
                    <td className="p-4">{supplier.address}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(supplier.itemsSupplied || []).map((item) => (
                          <span
                            key={item._id}
                            className="bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded text-xs"
                          >
                            {item.productName}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleEdit(supplier)}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(supplier._id)}
                        className="text-red-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
              {suppliers.length === 0 && !adding && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-6">
                    No suppliers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupplierManagement;
