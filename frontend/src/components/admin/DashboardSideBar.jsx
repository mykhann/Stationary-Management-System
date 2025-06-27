import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../reduxStore/authSlice";
import axios from "axios";
import BASE_URL from "../../apiConfig.js";
const DashboardSideBar = ({ closeSidebar }) => {
  const dispatch=useDispatch()
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const handleLogout = async(e) => {
      e.preventDefault();
     try {
      const res=await axios.post(`${BASE_URL}/api/v1/user/logout`,{},{withCredentials:true})
      
     } catch (error) {
      console.log(error)
     }
     finally{
      dispatch(setUser(null));
      navigate("/login")
     }
    };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Inventory Management", path: "/dashboard/product-management" },
    { name: "Order Management", path: "/dashboard/order-management" },
    { name: "Suppliers Management", path: "/dashboard/supplier-management" },
    { name: "Predictive Insights", path: "/dashboard/analytics" },
    { name: "Descriptive Insights", path: "/dashboard/descriptive" },
    { name: "Customers List", path: "/dashboard/customer-management" },
    { name: "Re-Orders List", path: "/dashboard/re-orders" },
  ];

  return (
    <aside className="min-h-screen overflow-y-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <Link to="/dashboard">        <h1 className="text-2xl font-bold text-white" >StationeryPro</h1>
</Link>
        <button onClick={closeSidebar} className="md:hidden text-white">
          ✕
        </button>
      </div>
      <nav className="space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={closeSidebar}
            className="block hover:bg-gray-800 p-2 rounded text-white"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="pt-8 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full text-left p-2 text-red-400 hover:bg-gray-800 rounded"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSideBar;
