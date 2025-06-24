import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCartItems } from '../../reduxStore/cartSlice';
import { toast } from 'react-toastify';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const ProductCard = ({ products }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    if (products.stock > 0) {
      dispatch(setCartItems(products));
      toast.success("Product added to cart");
    }
  };

  const isOutOfStock = products.stock === 0;

  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out overflow-hidden flex flex-col">
      
      {/* Product Image and Add to Cart */}
      <div 
        className="relative cursor-pointer overflow-hidden h-48"
        onClick={() => navigate(`/products/${products._id}`)}
      >
        <img
          src={products.avatar || '/placeholder-stationery.png'}
          alt={products.name}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        />
        
        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isOutOfStock) addToCartHandler();
          }}
          disabled={isOutOfStock}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md focus:outline-none transition
            ${isOutOfStock
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-2 focus:ring-indigo-400"
            }`}
          aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
          title={isOutOfStock ? "Out of stock" : "Add to cart"}
        >
          <ShoppingCartIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 
          className="text-lg font-semibold text-indigo-800 cursor-pointer hover:text-indigo-600 truncate"
          onClick={() => navigate(`/products/${products._id}`)}
          title={products.productName}
        >
          {products.productName}
        </h3>

        <p className="mt-2 text-gray-600 flex-grow line-clamp-3">
          {products.description || "No description available."}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-green-700 font-bold text-lg">${products.price?.toFixed(2)}</p>
          <p className={`font-semibold ${isOutOfStock ? "text-red-600" : "text-green-600"}`}>
            {isOutOfStock ? "Out of stock" : `In stock: ${products.stock}`}
          </p>
        </div>

        <button
          onClick={() => navigate(`/products/${products._id}`)}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-center font-semibold transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
