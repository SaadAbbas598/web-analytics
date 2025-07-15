import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    web_id: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://webanalytics.softsincs.com/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.detail || "Invalid credentials"}`);
        return;
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // Optionally save token or user
      // localStorage.setItem("token", data.token);
      // localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow px-5 py-6 border border-gray-100">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-2">
              <LogIn className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Welcome Back</h1>
            <p className="text-gray-500 text-xs">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            {/* Web ID */}
            <div>
              <label htmlFor="web_id" className="block text-xs text-gray-700 mb-1">Web ID</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  id="web_id"
                  name="web_id"
                  value={formData.web_id}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Web ID"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Password"
                />
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link to="#" className="text-blue-600 hover:underline">Forgot password?</Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 text-sm rounded hover:bg-blue-700 transition font-medium"
            >
              Sign In
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-600">
            Don’t have an account?{" "}
            <Link to="/" className="text-blue-600 font-medium underline">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
