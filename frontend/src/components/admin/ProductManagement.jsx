// src/pages/ProductManagement.jsx
import React, { useState, useEffect } from "react";
import { PlusCircle, Menu } from "lucide-react";
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

  const productsPerPage = 4;

  // Fetch products
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/v1/item/get`, { withCredentials: true })
      .then(({ data }) => setProducts(data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Reset page on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Filter logic
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

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar (same as Dashboard) */}
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

      {/* Main content */}
      <main className="flex-1  ml-0 p-6 bg-gray-100">
        {/* Mobile header */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h2 className="text-2xl font-semibold">Product Management</h2>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-900 focus:outline-none"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Desktop header + Add button */}
        <div className="hidden md:flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Product Management</h1>
          <button
            onClick={() => navigate("/dashboard/add-product")}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Search & Filter */}
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
                } hover:bg-blue-500 hover:text-white transition`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <p>Loading products…</p>
        ) : (
          <>
            {/* Products table */}
            <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                  <tr>
                    {[
                      "Image",
                      "Product",
                      "Category",
                      "Price",
                      "Stock",
                      "Actions",
                    ].map((h) => (
                      <th key={h} className="p-4 text-left">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((p) => (
                    <ProductRow
                      key={p._id}
                      product={p}
                      refreshProducts={() =>
                        axios
                          .get(`${BASE_URL}/api/v1/item/get`, {
                            withCredentials: true,
                          })
                          .then((res) => setProducts(res.data.items))
                          .catch(console.error)
                      }
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() =>
                  setCurrentPage((n) => Math.max(n - 1, 1))
                }
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
