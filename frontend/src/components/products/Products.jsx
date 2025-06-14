import React, { useState } from "react";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";
import useFetchProducts from "../customHooks/useFetchProducts";

const Products = () => {
  useFetchProducts();
  const { products = [] } = useSelector((store) => store.product);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Map display name to actual category value
  const categories = [
    { label: "All", value: "All" },
    { label: "Paper Products", value: "paper" },
    { label: "Notebooks", value: "notebook" },
    { label: "Writing Tools", value: "writing" },
    { label: "Organizing Tools", value: "organizing" },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const matchesSearch = product.productName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="max-w-7xl mx-auto p-4 pt-24">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-full border text-sm font-medium ${
                selectedCategory === category.value
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} products={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found.
          </p>
        )}
      </div>
    </section>
  );
};

export default Products;
