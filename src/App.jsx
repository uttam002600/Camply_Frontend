import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import { ApiProvider, useApi } from "./context/ApiContext";
import Login from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import Customers from "./pages/Customers";
import Footer from "./component/common/Footer";
import Navbar from "./component/common/Navbar";

// Layout component that includes navbar and footer
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* This renders the matched child route */}
      </main>
      <Footer />
    </div>
  );
};

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApi();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <ApiProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes with layout */}
            <Route element={<MainLayout />}>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/campaigns"
                element={
                  <ProtectedRoute>
                    <Campaigns />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute>
                    <Customers />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ApiProvider>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
