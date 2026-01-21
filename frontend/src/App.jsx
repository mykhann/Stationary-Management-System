import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './components/layout/Home.jsx';
import Products from './components/products/Products.jsx';
import Login from './components/auth/Login.sx';
import Signup from './components/auth/Signup.jsx';
import About from './components/auth/About.jsx';
import Contact from './components/auth/Contact.jsx';
import ProductDetails from './components/products/ProductDetails.jsx';
import { Provider } from 'react-redux';
import { store } from './reduxStore/store.js';
import { ToastContainer } from 'react-toastify';
import ProfileDetails from './components/auth/ProfileDetails.jsx';
import Dashboard from './components/admin/Dashboard.jsx';
import Cart from './components/order/Cart.jsx';
import Checkout from './components/order/Checkout.jsx/index.js';
import OrderHistory from './components/order/OrderHistory.jsx';
import ProductManagement from './components/admin/ProductManagement.jsx';
import CustomerManagement from './components/admin/CustomerManagement.jsx';
import OrdersManagement from './components/admin/OrdersManagement.jsx';
import ReorderList from './components/admin/ReOrderList.jsx';
import AddProduct from './components/admin/AddProduct.jsx';
import SupplierManagement from './components/admin/SuppliersManagement.jsx';
import ProtectedRoutes from './components/admin/ProtectedRoutes.jsx';
import Layout from './components/layout/Layout.jsx';

// Redux Persist
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

// Stripe Elements
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
import PredictveAnalytics from '@components/admin/PredictiveAnalytics';
import DescriptiveAnalysis from '@components/admin/Descriptive';
import LatestArrivals from '@components/products/LatestArrivals';

let persistor = persistStore(store);

// Use Vite env for publishable key
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const router = createBrowserRouter([
  { path: '/', element: <Layout><Home /></Layout> },
  { path: '/about', element: <Layout><About /></Layout> },
  { path: '/contact', element: <Layout><Contact /></Layout> },
  { path: '/products', element: <Layout><Products /></Layout> },
  { path: '/login', element: <Layout><Login /></Layout> },
  { path: '/signup', element: <Layout><Signup /></Layout> },
  { path: '/products/:id', element: <Layout><ProductDetails /></Layout> },
  { path: '/profile', element: <Layout><ProfileDetails /></Layout> },
  { path: '/latest', element: <Layout><LatestArrivals /></Layout> },
  { path: '/checkout', element: <Layout><Checkout /></Layout> },
  { path: '/cart', element: <Cart /> },

  // {
  //   path: '/checkout',
  //   element: (
  //     <Elements
  //     //  stripe={stripePromise}
  //      >
  //       <Layout><Checkout /></Layout>
  //     </Elements>
  //   ),
  // },
  { path: '/history', element: <Layout><OrderHistory /></Layout> },

  // Admin routes
  { path: '/dashboard', element: <ProtectedRoutes><Dashboard /></ProtectedRoutes> },
  { path: '/dashboard/product-management', element: <ProtectedRoutes><ProductManagement /></ProtectedRoutes> },
  { path: '/dashboard/customer-management', element: <ProtectedRoutes><CustomerManagement /></ProtectedRoutes> },
  { path: '/dashboard/order-management', element: <ProtectedRoutes><OrdersManagement /></ProtectedRoutes> },
  { path: '/dashboard/add-product', element: <ProtectedRoutes><AddProduct /></ProtectedRoutes> },
  { path: '/dashboard/supplier-management', element: <ProtectedRoutes><SupplierManagement /></ProtectedRoutes> },
  { path: '/dashboard/re-orders', element: <ProtectedRoutes><ReorderList /></ProtectedRoutes> },
  { path: '/dashboard/analytics', element: <ProtectedRoutes><PredictveAnalytics /></ProtectedRoutes> },
  { path: '/dashboard/descriptive', element: <ProtectedRoutes><DescriptiveAnalysis /></ProtectedRoutes> },
]);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
      <ToastContainer position="bottom-right"
  autoClose={4000} />
    </Provider>
  );
}

export default App;
