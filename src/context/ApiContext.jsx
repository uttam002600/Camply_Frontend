import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  // Theme state management
  const [theme, setTheme] = useState("light");
  const [authUser, setAuthUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Initial loading state
  const navigate = useNavigate();

  // Check auth state on initial load
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/auth/verify", {
          withCredentials: true,
        });

        setAuthUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
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
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
