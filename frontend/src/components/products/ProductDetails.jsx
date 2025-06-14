import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { setSingleProduct } from "../../reduxStore/productSlice";
import { setCartItems } from "../../reduxStore/cartSlice";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import BASE_URL from "../../apiConfig.js";

const ProductDetails = () => {
  const { singleProduct } = useSelector((store) => store.product);
  const { products = [] } = useSelector((store) => store.product);
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/item/${id}`);
        if (res.data.success) {
          dispatch(setSingleProduct(res.data.item));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching product");
      }
    };
    fetchProduct();
  }, [id, dispatch]);

  const handleAddToCart = () => {
    dispatch(setCartItems(products));

    toast.success(`${singleProduct?.productName || "Product"} added to cart`);
  };

  return (
    <>
      <div className="flex"></div>

      {/* Back Arrow */}
      <div className="absolute top-10 z-50 mt-32 left-64">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2"
        >
          <ArrowUturnLeftIcon className="h-6 font-bold w-full ml-32 text-gray-800" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center mt-40 cursor-pointer p-6 rounded-lg shadow-md">
        <div className="overflow-hidden rounded-md w-80 h-80 mr-6">
          <img
            src={singleProduct?.avatar}
            alt={singleProduct?.name}
            className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
          />
        </div>

        <div className="flex flex-col space-y-4 max-w-xl">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {singleProduct?.productName}
          </h1>

          {/* Price on top */}
          <p className="text-3xl font-bold text-indigo-600">
            ${singleProduct?.price?.toFixed(2)}
          </p>

          <p className="text-gray-700 text-base leading-relaxed">
            {singleProduct?.description}
          </p>

          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {singleProduct?.name}
          </h2>

          {/* Stock info */}
          <p className="text-sm font-medium text-gray-600">
            <span className="font-semibold text-gray-900">Stock:</span>{" "}
            {singleProduct?.stock > 0 ? (
              <span className="text-green-600">
                {singleProduct.stock} available
              </span>
            ) : (
              <span className="text-red-600">Out of stock</span>
            )}
          </p>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={singleProduct?.stock <= 0}
            className={`px-4 py-2 mt-4 text-white font-semibold rounded-lg shadow-md transition duration-300 ${
              singleProduct?.stock > 0
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
