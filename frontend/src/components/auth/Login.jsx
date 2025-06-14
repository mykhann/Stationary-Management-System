import { Link, useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { useState } from "react";
import axios from "axios";
import { setUser } from "../../reduxStore/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import BASE_URL from "../../apiConfig.js";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const onChangeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const onSubmitEventHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/user/login`,
        input,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred", {
        position: "top-right",
      });
    }
  };

  return (
    <>
    
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  px-4">
        <div className="bg-white shadow-xl rounded-lg max-w-md w-full p-8">
          <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
            Welcome Back
          </h2>
          <form onSubmit={onSubmitEventHandler} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={input.email}
                onChange={onChangeEventHandler}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={input.password}
                onChange={onChangeEventHandler}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="********"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition"
            >
              Log In
            </button>
          </form>

          <div className="mt-6 text-center text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 hover:text-indigo-700 font-semibold underline"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
