import Navbar from "@components/shared/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  decreaseQuantity,
  increaseQuantity,
  removeCartItem,
} from "../../reduxStore/cartSlice";
import { FaTrash } from "react-icons/fa";

const Cart = () => {
  const user = useSelector((store) => store.auth.user);
  const { cartItems = [] } = useSelector((store) => store.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const proceedToCheckout = () => {
    navigate("/checkout");
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto p-4">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 mt-48 text-lg font-medium">
            Your cart is empty.
          </p>
        ) : (
          <div className="mt-48 space-y-4">
            {cartItems.map((product) => (
              <div
                key={product._id}
                className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-md"
              >
                <img
                  src={product.avatar}
                  alt={product.name}
                  className="w-full sm:w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 mt-4 sm:mt-0 sm:ml-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-500">
                    Price: ${product.price}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => dispatch(decreaseQuantity(product._id))}
                      className="bg-gray-300 px-2 py-1 rounded"
                    >
                      -
                    </button>
                    <p className="text-sm text-gray-500">
                      {product.quantity}
                    </p>
                    <button
                      onClick={() => dispatch(increaseQuantity(product._id))}
                      className="bg-gray-300 px-2 py-1 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => dispatch(removeCartItem(product._id))}
                  className="mt-4 sm:mt-0 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition-colors duration-200"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="p-4 bg-gray-100 mt-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Cart Summary</h3>
            <p className="mt-2">
              Total Price:{" "}
              <span className="font-bold">
                $
                {cartItems.reduce(
                  (total, product) =>
                    total + product.price * product.quantity,
                  0
                )}
              </span>
            </p>

            {!user ? (
              <>
                <button
                  disabled
                  className="mt-4 w-full bg-gray-400 text-white py-2 rounded-md transition-colors duration-200 cursor-not-allowed"
                >
                  Proceed to Checkout
                </button>
                <p className="mt-3 text-sm text-center text-gray-700">
                  Please{" "}
                  <span
                    onClick={() => navigate("/login")}
                    className="font-bold text-blue-700 cursor-pointer hover:underline"
                  >
                    login
                  </span>{" "}
                  first to complete your order.
                </p>
              </>
            ) : (
              <button
                onClick={proceedToCheckout}
                className="mt-4 w-full bg-indigo-700 text-white py-2 rounded-md hover:bg-indigo-900 transition-colors duration-200"
              >
                Proceed to Checkout
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
