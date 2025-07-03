import { Link, useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Base_URL from "../../apiConfig.js";

const Signup = () => {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    avatar: null,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChangeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const onFileChangeHandler = (e) => {
    setInput({ ...input, avatar: e.target.files?.[0] || null });
  };

  const onSubmitEventHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("address", input.address);
    formData.append("phone", input.phone);
    if (input.avatar) formData.append("avatar", input.avatar);

    try {
      const res = await axios.post(
        `${Base_URL}/api/v1/user/register`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 py-4">
        <div className="bg-white shadow-md rounded-lg max-w-md w-full px-5 py-6">
          <h2 className="text-xl font-bold text-center text-indigo-700 mb-4">Create an Account</h2>
          <form onSubmit={onSubmitEventHandler} className="space-y-3">
            {/* Avatar Upload */}
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture
              </label>
              <input
                type="file"
                name="avatar"
                id="avatar"
                accept="image/*"
                onChange={onFileChangeHandler}
                className="block w-full text-sm text-gray-600 file:border file:rounded file:px-2 file:py-1 file:bg-indigo-50 file:text-indigo-700"
              />
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={input.name}
                onChange={onChangeEventHandler}
                required
                className="w-full mt-0.5 px-2 py-1.5 border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={input.email}
                onChange={onChangeEventHandler}
                required
                className="w-full mt-0.5 px-2 py-1.5 border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={input.phone}
                onChange={onChangeEventHandler}
                required
                placeholder="03XX-XXXXXXX"
                className="w-full mt-0.5 px-2 py-1.5 border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={input.password}
                onChange={onChangeEventHandler}
                required
                className="w-full mt-0.5 px-2 py-1.5 border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={input.address}
                onChange={onChangeEventHandler}
                required
                className="w-full mt-0.5 px-2 py-1.5 border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-white font-semibold rounded-md text-sm flex items-center justify-center ${
                loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading && (
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3.536-3.536A9 9 0 103.515 13.05L4 12z"
                  />
                </svg>
              )}
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-3 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
