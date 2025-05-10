import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import { toast } from "react-toastify";
import { useApi } from "../context/ApiContext";

const Login = () => {
  const { authUser, isAuthenticated, loading, googleLogin } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-black-900)] p-4">
      <div className="w-full max-w-md bg-[var(--bg-black-100)] rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-black-900)] mb-2">
            Welcome Back
          </h1>
          <p className="text-[var(--text-black-700)]">
            Sign in to access your account
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <GoogleOAuthProvider clientId="493469432414-k0gid9jplj9sl7am4nuhia9vaneb5og7.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={googleLogin}
                onError={() => {
                  toast.error("Google login failed");
                }}
                useOneTap
                theme="filled_blue"
                size="large"
                shape="rectangular"
                text="continue_with"
                width="300"
              />
            </GoogleOAuthProvider>
          </div>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-[var(--bg-black-50)]"></div>
            <span className="flex-shrink mx-4 text-[var(--text-black-700)]">
              or
            </span>
            <div className="flex-grow border-t border-[var(--bg-black-50)]"></div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--text-black-700)] mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 rounded-lg border border-[var(--bg-black-50)] bg-[var(--bg-black-900)] focus:outline-none focus:ring-2 focus:ring-[var(--skin-color)]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--text-black-700)] mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 rounded-lg border border-[var(--bg-black-50)] bg-[var(--bg-black-900)] focus:outline-none focus:ring-2 focus:ring-[var(--skin-color)]"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-[var(--bg-black-50)] text-[var(--skin-color)] focus:ring-[var(--skin-color)]"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-[var(--text-black-700)]"
                >
                  Remember me
                </label>
              </div>

              <a
                href="#"
                className="text-sm text-[var(--skin-color)] hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="button"
              className="w-full py-2 px-4 bg-[var(--skin-color)] text-white rounded-lg hover:bg-opacity-90 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--skin-color)] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-[var(--text-black-700)]">
            Don't have an account?{" "}
            <a
              href="#"
              className="font-medium text-[var(--skin-color)] hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
