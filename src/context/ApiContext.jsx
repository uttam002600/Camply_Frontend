import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { useLocation } from "react-router-dom";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  // Theme state management
  const [theme, setTheme] = useState("light");
  const [authUser, setAuthUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Initial loading state
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [customerError, setCustomerError] = useState(null);

  const location = useLocation();

  const verifyAuth = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/auth/verify", {
        withCredentials: true,
      });
      setAuthUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setAuthUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Call verifyAuth on every route change
  useEffect(() => {
    verifyAuth();
  }, [location.pathname]);

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const response = await axiosInstance.get("/customer/get");
      setCustomers(response.data.data);
      console.log("the data of customer is", response);
      return response.data.data;
    } catch (error) {
      setCustomerError(
        error.response?.data?.message || "Failed to fetch customers"
      );
      throw error;
    } finally {
      setLoadingCustomers(false);
    }
  };

  // Load initial customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const refreshToken = async () => {
    try {
      await axiosInstance.post(
        "/auth/refresh-token",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      logout();
      throw error;
    }
  };

  const googleLogin = async (credentialResponse) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/google-login", {
        token: credentialResponse.credential,
      });

      const { user } = response.data.data;
      setAuthUser(user);
      setIsAuthenticated(true);

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Google login failed";
      toast.error(errorMessage);
      console.error("Google Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setAuthUser(null);
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout Error:", error);
    }
  };

  const CustomValueEditor = ({
    fieldData,
    operator,
    value,
    handleOnChange,
    title,
  }) => {
    const isNumericField = [
      "total_spent",
      "order_count",
      "last_purchase",
    ].includes(fieldData.name);
    const inputType = isNumericField ? "number" : "text";

    const handleValueChange = (e) => {
      const newValue = isNumericField
        ? e.target.value === ""
          ? ""
          : Number(e.target.value)
        : e.target.value;
      handleOnChange(newValue);
    };

    return (
      <input
        type={inputType}
        value={value}
        onChange={handleValueChange}
        className="border border-gray-300 px-2 py-1 rounded w-full"
        placeholder={title}
        min={isNumericField ? "0" : undefined}
        step={isNumericField ? "any" : undefined}
      />
    );
  };

  return (
    <ApiContext.Provider
      value={{
        authUser,
        isAuthenticated,
        loading,
        axiosInstance,
        googleLogin,
        logout,
        theme,
        toggleTheme,
        refreshToken,
        CustomValueEditor,
        customers,
        loadingCustomers,
        customerError,
        fetchCustomers,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
