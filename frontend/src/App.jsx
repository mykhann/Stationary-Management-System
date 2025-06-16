import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/layout/Home";
import Products from "./components/products/Products";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import About from "./components/auth/About"
import Contact from "./components/auth/Contact"
import ProductDetails from "@components/products/ProductDetails";
import { Provider } from "react-redux";
import { store } from "./reduxStore/store"; 
import { ToastContainer } from "react-toastify";
import ProfileDetails from "@components/auth/ProfileDetails";
import Dashboard from "@components/admin/Dashboard";
import Cart from "@components/order/Cart";
import Checkout from "@components/order/Checkout";

// redux persist
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import ProtectedRoutes from "@components/admin/ProtectedRoutes";
import Layout from "@components/layout/Layout";
import OrderHistory from "@components/order/OrderHistory";
import ProductManagement from "@components/admin/ProductManagement";
import CustomerManagement from "@components/admin/CustomerManagement";
import OrdersManagement from "@components/admin/OrdersManagement";
import ReorderList from "@components/admin/ReOrderList";
import AddProduct from "@components/admin/AddProduct";
import SupplierManagement from "@components/admin/SuppliersManagement";

let persistor = persistStore(store);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout> <Home /></Layout>
  },
  {
    path: "/about",
    element: <Layout> <About /></Layout>
  },
  {
    path: "/contact",
    element: <Layout><Contact /></Layout>
  },
  {
    path: "/products",
    element: <Layout> <Products /></Layout>
  },
  {
    path: "/login",
    element: <Layout> <Login /></Layout>
  },
  {
    path: "/signup",
    element: <Layout> <Signup /></Layout>
  },
  {
    path: "/products/:id",
    element: <Layout> <ProductDetails /></Layout>
  },
  {
    path: "/profile",
    element: <Layout> <ProfileDetails /></Layout>
  },
 
  {
    path: "/cart",
    element:  <Cart />
  },
  {
    path: "/checkout",
    element: <Layout> <Checkout /></Layout>
  },
  {
    path: "/history",
    element: <Layout> <OrderHistory /></Layout>
  },

  // admin routes
  {
    path: "/dashboard",

    element: (
      <ProtectedRoutes>
        <Dashboard />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/dashboard/product-management",
    element: (
      <ProtectedRoutes>
        <ProductManagement />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/dashboard/customer-management",
    element: (
      <ProtectedRoutes>
        <CustomerManagement />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/dashboard/order-management",
    element: (
      <ProtectedRoutes>
        <OrdersManagement/>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/dashboard/add-product",
    element: (
      <ProtectedRoutes>
        <AddProduct/>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/dashboard/supplier-management",
    element: (
      <ProtectedRoutes>
        <SupplierManagement/>
      </ProtectedRoutes>
    ),
  },

  {
    path: "dashboard/re-orders",
    element: (
      <ProtectedRoutes>
        <ReorderList />
      </ProtectedRoutes>
    ),
  },

]);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
      <ToastContainer />
    </Provider>
  );
}

export default App;
