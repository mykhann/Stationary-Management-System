import React from "react";
import Navbar from "@components/shared/Navbar";
import FooterSection from "./FooterSection";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-[calc(100vh-4rem)] flex flex-col">
        {children}
      </main>
      <FooterSection />
    </>
  );
};

export default Layout;
