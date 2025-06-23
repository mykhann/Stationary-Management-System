import { useState } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../reduxStore/authSlice";
import { FaEye } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { cartItems } = useSelector((store) => store.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(setUser(null));
    navigate("/login");
  };

  const navigateToDashboard = () => {
    if (user?.role === "admin") navigate("/dashboard");
  };

  const cartItemCount = cartItems.length;

  return (
    <nav className="fixed w-full bg-white shadow-md z-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <h1 className="text-3xl font-extrabold text-indigo-600 select-none">
                Stationery<span className="text-indigo-400">.</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-10 font-medium text-gray-700">
            {user?.role === "admin" ? (
              <button
                onClick={navigateToDashboard}
                className="text-indigo-600 hover:text-indigo-800 transition"
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/"
                  className="hover:text-indigo-600 transition px-3 py-2 rounded-md"
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="hover:text-indigo-600 transition px-3 py-2 rounded-md"
                >
                  Products
                </Link>
                <Link
                  to="/latest"
                  className="hover:text-indigo-600 transition px-3 py-2 rounded-md"
                >
                  Latest Arrivals
                </Link>
                <Link
                  to="/about"
                  className="hover:text-indigo-600 transition px-3 py-2 rounded-md"
                >
                  About
                </Link>
                
                <Link
                  to="/contact"
                  className="hover:text-indigo-600 transition px-3 py-2 rounded-md"
                >
                  Contact
                </Link>
              </>
            )}
          </div>

          {/* Right Side: Profile & Cart */}
          <div className="flex items-center space-x-6">
            {/* Profile */}
            {user ? (
              <div className="relative">
                <UserIcon
                  onClick={toggleProfileMenu}
                  className="h-7 w-7 text-indigo-600 cursor-pointer hover:text-indigo-800 transition"
                />

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 text-gray-700">
                    <Link
                      to="/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-indigo-100 rounded"
                    >
                      View Profile
                    </Link>
                    <Link
                      to="/history"
                      onClick={() => setProfileMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-indigo-100 rounded"
                    >
                      Order History
                    </Link>
                    {user.role === "admin" && (
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          navigateToDashboard();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-indigo-200 rounded"
                      >
                        Dashboard
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white rounded"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-800 transition"
                aria-label="Login"
              >
                <UserIcon className="h-6 w-6" />
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-indigo-600 hover:text-indigo-800 transition"
              aria-label="Cart"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-sm">
          {user?.role === "admin" ? (
            <button
              onClick={() => {
                toggleMenu();
                navigateToDashboard();
              }}
              className="block w-full text-left px-6 py-3 text-indigo-600 hover:bg-indigo-100 transition font-medium"
            >
              Dashboard
            </button>
          ) : (
            <>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block px-6 py-3 text-gray-700 hover:bg-indigo-100 transition font-medium"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setIsOpen(false)}
                className="block px-6 py-3 text-gray-700 hover:bg-indigo-100 transition font-medium"
              >
                Products
              </Link>
               <Link
                to="/latest"
                onClick={() => setIsOpen(false)}
                className="block px-6 py-3 text-gray-700 hover:bg-indigo-100 transition font-medium"
              >
                Latest Arrivals
              </Link>
              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className="block px-6 py-3 text-gray-700 hover:bg-indigo-100 transition font-medium"
              >
                About
              </Link>
             
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="block px-6 py-3 text-gray-700 hover:bg-indigo-100 transition font-medium"
              >
                Contact
              </Link>
              
              
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
