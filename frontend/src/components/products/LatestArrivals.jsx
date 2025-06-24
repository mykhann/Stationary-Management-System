import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCartItems } from "../../reduxStore/cartSlice";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../apiConfig";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

const LatestArrivals = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestArrivals = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/v1/item/latestArrivals`);
        setItems(data.latestArrivals);
      } catch (error) {
        console.error("Failed to fetch latest arrivals", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestArrivals();
  }, []);

  const handleAddToCart = (item) => {
    if (item.stock > 0) {
      dispatch(setCartItems(item));
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 pt-24 pb-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">✨ Latest Arrivals</h2>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Fetching fresh items...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {items.map((item) => {
            const isOutOfStock = item.stock === 0;

            return (
              <div
                key={item._id}
                className="bg-white shadow-md hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300 flex flex-col"
              >
                <div className="relative group">
                  {item.avatar?.[0] && (
                    <img
                      src={item.avatar[0]}
                      alt={item.productName}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={isOutOfStock}
                    title={isOutOfStock ? "Out of stock" : "Add to Cart"}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow transition-all duration-200
                      ${isOutOfStock
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-600 group-hover:bg-indigo-700 text-white"}
                    `}
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {item.productName}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {item.description}
                  </p>

                  <div className="flex justify-between items-center mt-auto mb-4">
                    <span className="text-indigo-600 font-bold text-base">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className={`text-sm font-medium ${isOutOfStock ? "text-red-600" : "text-green-600"}`}>
                      {isOutOfStock ? "Out of stock" : `Stock: ${item.stock}`}
                    </span>
                  </div>

                  <button
                    onClick={() => handleViewDetails(item._id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 rounded-md transition font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default LatestArrivals;
