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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/item/get`, {
          withCredentials: true,
        });
        setProducts(response.data.items);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed z-40 md:static md:translate-x-0 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-gray-900 text-white`}
      >
        <DashboardSideBar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:ml-64 w-full">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden mb-4 text-gray-700"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Product Management</h2>
          <button
            onClick={() => navigate("/dashboard/add-product")}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Search and Category Filter */}
        <div className="mb-6 space-y-3">
          <input
            type="text"
            placeholder="Search by product name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2"
          />

          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1 rounded-full border ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                } hover:bg-blue-500 hover:text-white transition`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <>
            <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="p-4 text-left">Image</th>
                    <th className="p-4 text-left">Product</th>
                    <th className="p-4 text-left">Category</th>
                    <th className="p-4 text-left">Price</th>
                    <th className="p-4 text-left">Stock</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product) => (
                    <ProductRow
                      key={product._id}
                      product={product}
                      refreshProducts={() => {
                        axios
                          .get(`${BASE_URL}/api/v1/item/get`, {
                            withCredentials: true,
                          })
                          .then((res) => setProducts(res.data.items))
                          .catch(console.error);
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
