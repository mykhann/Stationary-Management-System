import React from 'react';
import { Link, useNavigate } from 'react-router-dom';



const HeroSection = () => {
  const navigate=useNavigate()
  return (
    <>
    <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-16 py-20  min-h-screen">
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Smart Stationery Management
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Streamline your inventory and shop essential supplies effortlessly.
        </p>
        <div className="flex justify-center md:justify-start gap-4">
          <button onClick={()=>navigate("/products")} className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
            Shop Now
          </button>
          <Link to="/about"><button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition">
            About Us
          </button></Link>
        </div>
      </div>

      <div className="w-full md:w-1/2 mb-10 md:mb-0 flex justify-center">
        <img
          src="https://plus.unsplash.com/premium_photo-1663956066898-282c7609afc9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c3RhdGlvbmFyeXxlbnwwfHwwfHx8MA%3D%3D"
          alt="Stationery illustration"
          className="w-full max-w-md rounded-2xl shadow-xl"
        />
      </div>
      
    </section>
    </>
  );
};

export default HeroSection;
