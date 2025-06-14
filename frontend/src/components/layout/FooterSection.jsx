import React from "react";
import {
  FaWhatsapp,
  FaTwitter,
  FaEnvelope,
  FaInstagram,
} from "react-icons/fa";

const FooterSection = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 to-indigo-800 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center space-y-6">
        {/* Logo */}
        <h1 className="text-3xl font-extrabold text-indigo-400 select-none">
          Stationery<span className="text-indigo-600">.</span>
        </h1>

        {/* Social Icons */}
        <div className="flex space-x-8 text-indigo-300">
          <a
            href="https://wa.me/yourwhatsappphonenumber"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="hover:text-green-500 transition"
          >
            <FaWhatsapp className="h-7 w-7" />
          </a>

          <a
            href="https://instagram.com/yourinstagramhandle"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-pink-500 transition"
          >
            <FaInstagram className="h-7 w-7" />
          </a>

          <a
            href="https://twitter.com/yourtwitterhandle"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-blue-400 transition"
          >
            <FaTwitter className="h-7 w-7" />
          </a>

          <a
            href="mailto:example@gmail.com"
            aria-label="Email"
            className="flex items-center space-x-2 text-indigo-300 hover:text-indigo-100 transition font-medium"
          >
            <FaEnvelope className="h-6 w-6" />
            <span>Stationery@gmail.com</span>
          </a>
        </div>

        {/* Copyright */}
        <p className="text-indigo-400 text-sm select-none">
          &copy; {new Date().getFullYear()} Stationery. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
