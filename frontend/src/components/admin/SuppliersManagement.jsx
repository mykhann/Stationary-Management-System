// src/pages/SupplierManagement.jsx
import React, { useEffect, useState } from "react";
import { Plus, Menu, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardSideBar from "./DashboardSideBar";
import SupplierForm from "./SupplierForm";
import BASE_URL from "../../apiConfig";

const SupplierManagement = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/supplier/get`, {
        withCredentials: true,
      });
      setSuppliers(res.data.suppliers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChange = (e) =>
    setNewSupplier({ ...newSupplier, [e.target.name]: e.target.value });
  const handleEditChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  const startEdit = (s) => {
    setEditingId(s._id);
    setEditData({
      name: s.name,
      contactPerson: s.contactPerson || "",
      email: s.email,
      phone: s.phone || "",
      address: s.address || "",
    });
  };

  const saveNew = async () => {
    await axios.post(`${BASE_URL}/api/v1/supplier/create`, newSupplier, {
      withCredentials: true,
    });
    setAdding(false);
    setNewSupplier({ name: "", contactPerson: "", email: "", phone: "", address: "" });
    fetchSuppliers();
  };

  const saveEdit = async () => {
    await axios.patch(
      `${BASE_URL}/api/v1/supplier/${editingId}/update`,
      editData,
      { withCredentials: true }
    );
    setEditingId(null);
    fetchSuppliers();
  };

  const deleteOne = async (id) => {
    await axios.delete(`${BASE_URL}/api/v1/supplier/${id}/delete`, {
      withCredentials: true,
    });
    fetchSuppliers();
  };

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 w-64 bg-gray-900 text-white z-40
          transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static
        `}
      >
        <DashboardSideBar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 p-6">
        {/* Mobile header */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} className="text-gray-800" />
          </button>
          <h2 className="text-xl font-semibold">Supplier Management</h2>
          <button
            onClick={() => setAdding(!adding)}
            className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add</span>
          </button>
        </div>

        {/* Desktop header */}
        <div className="hidden md:flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Supplier Management</h1>
          <button
            onClick={() => setAdding(!adding)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            <Plus className="w-5 h-5" />
            <span>Add Supplier</span>
          </button>
        </div>

        {/* Desktop form above table */}
        {adding && editingId === null && (
          <table className="mb-4">
            <tbody>
              <SupplierForm
              formData={newSupplier}
              onChange={handleNewChange}
              onSave={saveNew}
              onCancel={() => setAdding(false)}
            />
            </tbody>
          </table>
        )}

        {loading ? (
          <p>Loading suppliers…</p>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {suppliers.map((s) => (
                <div
                  key={s._id}
                  className="bg-white rounded-2xl shadow p-4 space-y-2"
                >
                  <div className="flex items-center">
                    <div className="flex-1">
                      <h3 className="font-semibold">{s.name}</h3>
                      <p className="text-sm text-gray-600">
                        {s.contactPerson}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleExpand(s._id)}
                      className="text-blue-600 text-sm"
                    >
                      {expanded[s._id] ? "See less" : "See more"}
                    </button>
                  </div>

                  {expanded[s._id] && (
                    <div className="pt-2 border-t border-gray-200 space-y-1 text-sm">
                      <p>
                        <strong>Email:</strong> {s.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {s.phone}
                      </p>
                      <p>
                        <strong>Address:</strong> {s.address}
                      </p>
                      <p>
                        <strong>Items:</strong>{" "}
                        {(s.itemsSupplied || []).map((i) => (
                          <span
                            key={i._id}
                            className="bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded text-xs mr-1"
                          >
                            {i.productName}
                          </span>
                        ))}
                      </p>
                      <div className="flex space-x-4 pt-2">
                        <button
                          onClick={() => startEdit(s)}
                          className="text-blue-600 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteOne(s._id)}
                          className="text-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-auto rounded-2xl shadow-md bg-white">
              <table className="min-w-full text-sm text-left">
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
                  {adding && editingId === null && (
                    <SupplierForm
                      formData={newSupplier}
                      onChange={handleNewChange}
                      onSave={saveNew}
                      onCancel={() => setAdding(false)}
                    />
                  )}

                  {suppliers.map((s) =>
                    editingId === s._id ? (
                      <SupplierForm
                        key={s._id}
                        formData={editData}
                        onChange={handleEditChange}
                        onSave={saveEdit}
                        onCancel={() => setEditingId(null)}
                        isEditing
                      />
                    ) : (
                      <tr
                        key={s._id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="p-4">{s.name}</td>
                        <td className="p-4">{s.contactPerson}</td>
                        <td className="p-4">{s.email}</td>
                        <td className="p-4">{s.phone}</td>
                        <td className="p-4">{s.address}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {(s.itemsSupplied || []).map((i) => (
                              <span
                                key={i._id}
                                className="bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded text-xs"
                              >
                                {i.productName}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 flex gap-4">
                          <button
                            onClick={() => startEdit(s)}
                            className="flex items-center text-blue-600 hover:underline gap-1"
                          >
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => deleteOne(s._id)}
                            className="flex items-center text-red-600 hover:underline gap-1"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </td>
                      </tr>
                    )
                  )}

                  {suppliers.length === 0 && !adding && (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center text-gray-500 py-6"
                      >
                        No suppliers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SupplierManagement;
