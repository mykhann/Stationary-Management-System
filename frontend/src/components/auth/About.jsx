import FooterSection from "@components/layout/FooterSection";
import Navbar from "@components/shared/Navbar";
import React from "react";

const AboutSection = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pt-20 max-w-4xl mx-auto px-6 py-12 mt-16 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          About Us
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4 text-center">
          At Stationery Hub, we believe that quality stationery fuels creativity and productivity. 
          Our e-commerce platform is dedicated to providing a curated selection of office and school supplies, 
          from everyday essentials to premium products, all at competitive prices.
        </p>
        <p className="text-gray-600 leading-relaxed text-center">
          Whether you're a student, professional, or business owner, we aim to simplify your stationery shopping experience 
          with fast delivery, secure payment options, and exceptional customer support.
        </p>
      </main>

    </div>
  );
};

export default AboutSection;
