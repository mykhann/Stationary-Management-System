// src/pages/ProductManagement.jsx
import React, { useState, useEffect } from "react";
import { PlusCircle, Menu, Pencil, Trash2, Save, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardSideBar from "./DashboardSideBar";
import BASE_URL from "../../apiConfig";
import ProductRow from "./ProductRow";

const ProductManagement = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCards, setExpandedCards] = useState({});
  const [editingCards, setEditingCards] = useState({});
  const [editData, setEditData] = useState({});

  const productsPerPage = 4;
  const [analytics, setAnalytics] = useState({});

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/analytics/descriptive`, {
        withCredentials: true,
      });
      setAnalytics(res.data);
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v1/item/get`, {
        withCredentials: true,
      });
      setProducts(data.items);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchesSearch = p.productName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filtered.length / productsPerPage);
  const currentProducts = filtered.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleUpdate = (updatedId, updatedData) => {
    setProducts((prev) =>
      prev.map((item) =>
        item._id === updatedId ? { ...item, ...updatedData } : item
      )
    );
  };

  const handleDelete = async (id) => {
    // reuse the deletion logic from ProductRow
    await axios.delete(`${BASE_URL}/api/v1/item/delete/${id}`, {
      withCredentials: true,
    });
    setProducts((prev) => prev.filter((item) => item._id !== id));
  };

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const startEdit = (p) => {
    setEditingCards((prev) => ({ ...prev, [p._id]: true }));
    setEditData((prev) => ({
      ...prev,
      [p._id]: {
        productName: p.productName,
        category: p.category,
        price: p.price,
        stock: p.stock,
        reorderLevel: p.reorderLevel,
        reorderStock: p.reorderStock,
      },
    }));
  };

  const cancelEdit = (id) => {
    setEditingCards((prev) => ({ ...prev, [id]: false }));
  };

  const saveEditCard = async (id) => {
    try {
      const payload = editData[id];
      const res = await axios.put(
        `${BASE_URL}/api/v1/item/update/${id}`,
        payload,
        { withCredentials: true }
      );
      handleUpdate(id, res.data.updatedItem || payload);
      setEditingCards((prev) => ({ ...prev, [id]: false }));
    } catch (err) {
      console.error(err);
      alert("Failed to update product.");
    }
  };

  const onCardChange = (id, field, value) => {
    setEditData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

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
          fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
        `}
      >
        <DashboardSideBar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 p-6">
        {/* Mobile header */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-900"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-xl font-semibold">Product Management</h2>
          <button
            onClick={() => navigate("/dashboard/add-product")}
            className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-sm">Add</span>
          </button>
        </div>

        {/* Desktop header */}
        <div className="hidden md:flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Product Management</h1>
          <button
            onClick={() => navigate("/dashboard/add-product")}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-3">
          <input
            type="text"
            placeholder="Search by product name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1 rounded-full border ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                } hover:bg-blue-500 hover:text-white`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p>Loading products…</p>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {currentProducts.map((p) => {
                const isEditing = editingCards[p._id];
                const data = editData[p._id] || {};
                return (
                  <div
                    key={p._id}
                    className="relative bg-white rounded-2xl shadow p-4 space-y-2"
                  >
                    <div className="flex items-center">
                      <img
                        src={p.avatar}
                        alt={p.productName}
                        className="w-12 h-12 object-cover rounded mr-3"
                      />
                      <div className="flex-1 space-y-1">
                        {isEditing ? (
                          <input
                            name="productName"
                            value={data.productName}
                            onChange={(e) =>
                              onCardChange(p._id, "productName", e.target.value)
                            }
                            className="border p-1 rounded w-full"
                          />
                        ) : (
                          <h3 className="font-semibold">{p.productName}</h3>
                        )}
                        {isEditing ? (
                          <input
                            name="category"
                            value={data.category}
                            onChange={(e) =>
                              onCardChange(p._id, "category", e.target.value)
                            }
                            className="border p-1 rounded w-full"
                          />
                        ) : (
                          <p className="text-sm text-gray-600">{p.category}</p>
                        )}
                      </div>

                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveEditCard(p._id)}
                            className="p-1 text-green-600"
                          >
                            <Save className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => cancelEdit(p._id)}
                            className="p-1 text-gray-700 ml-2"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(p)}
                            className="p-1 text-gray-700"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="p-1 text-red-600 ml-2"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => toggleExpand(p._id)}
                      className="text-blue-600 text-sm"
                    >
                      {expandedCards[p._id] ? "See less" : "See more"}
                    </button>

                    {expandedCards[p._id] && (
                      <div className="pt-2 border-t border-gray-200 space-y-1 text-sm">
                        <p>
                          <strong>Price:</strong>{" "}
                          {isEditing ? (
                            <input
                              name="price"
                              type="number"
                              value={data.price}
                              onChange={(e) =>
                                onCardChange(p._id, "price", e.target.value)
                              }
                              className="border p-1 rounded w-full"
                            />
                          ) : (
                            `Rs. ${p.price}`
                          )}
                        </p>
                        <p>
                          <strong>Stock:</strong>{" "}
                          {isEditing ? (
                            <input
                              name="stock"
                              type="number"
                              value={data.stock}
                              onChange={(e) =>
                                onCardChange(p._id, "stock", e.target.value)
                              }
                              className="border p-1 rounded w-full"
                            />
                          ) : (
                            p.stock
                          )}
                        </p>
                        <p>
                          <strong>Reorder Level:</strong>{" "}
                          {isEditing ? (
                            <input
                              name="reorderLevel"
                              type="number"
                              value={data.reorderLevel}
                              onChange={(e) =>
                                onCardChange(
                                  p._id,
                                  "reorderLevel",
                                  e.target.value
                                )
                              }
                              className="border p-1 rounded w-full"
                            />
                          ) : (
                            p.reorderLevel ?? "-"
                          )}
                        </p>
                        <p>
                          <strong>Reorder Stock:</strong>{" "}
                          {isEditing ? (
                            <input
                              name="reorderStock"
                              type="number"
                              value={data.reorderStock}
                              onChange={(e) =>
                                onCardChange(
                                  p._id,
                                  "reorderStock",
                                  e.target.value
                                )
                              }
                              className="border p-1 rounded w-full"
                            />
                          ) : (
                            p.reorderStock ?? "-"
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto bg-white shadow-md rounded-2xl">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="p-4 text-left">Image</th>
                    <th className="p-4 text-left">Product</th>
                    <th className="p-4 text-left hidden sm:table-cell">
                      Category
                    </th>
                    <th className="p-4 text-left hidden sm:table-cell">
                      Price
                    </th>
                    <th className="p-4 text-left hidden md:table-cell">
                      Stock
                    </th>
                    <th className="p-4 text-left hidden lg:table-cell">
                      reorderLevel
                    </th>
                    <th className="p-4 text-left hidden lg:table-cell">
                      Trend
                    </th>
                    <th className="p-4 text-left hidden lg:table-cell">
                      reorder Quantity
                    </th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((p) => (
                    <ProductRow
                      key={p._id}
                      product={p}
                      onUpdate={handleUpdate}
  
                      analytics={analytics}
                      fetchProducts={fetchProducts}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => setCurrentPage((n) => Math.max(n - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((n) => Math.min(n + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ProductManagement;
