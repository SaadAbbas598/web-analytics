import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Globe, Hash } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    domain: '',
    web_id: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("https://webanalytics.softsincs.com/api/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          domain: formData.domain,
          web_id: formData.web_id,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Signup failed: ${data.detail || "Unknown error"}`);
        return;
      }

      if (data.script) {
        const userConfirmed = window.confirm(
          "Signup successful!\n\nCopy the script below and paste it into your website's HTML:\n\n" +
          data.script +
          "\n\nClick OK to copy it to clipboard."
        );

        if (userConfirmed) {
          await navigator.clipboard.writeText(data.script);
          alert("Script copied to clipboard!");
        } else {
          alert("You can copy the script later from your dashboard.");
        }
      } else {
        alert("Signup successful!");
      }

      localStorage.setItem("userData", JSON.stringify(data));
      navigate("/dashboard");

    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow px-5 py-5 border border-gray-100">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full mb-1">
              <UserPlus className="w-5 h-5 text-indigo-600" />
            </div>
            <h1 className="text-lg font-bold text-gray-800">Sign Up</h1>
            <p className="text-gray-500 text-xs">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-sm" autoComplete="off">
            {[
              { id: 'name', label: 'Full Name', type: 'text', icon: <User className="w-4 h-4" /> },
              { id: 'email', label: 'Email', type: 'email', icon: <Mail className="w-4 h-4" /> },
              { id: 'domain', label: 'Domain', type: 'text', icon: <Globe className="w-4 h-4" /> },
              { id: 'web_id', label: 'Web ID', type: 'text', icon: <Hash className="w-4 h-4" /> },
              { id: 'password', label: 'Password', type: 'password', icon: <Lock className="w-4 h-4" /> },
              { id: 'confirmPassword', label: 'Confirm Password', type: 'password', icon: <Lock className="w-4 h-4" /> }
            ].map(({ id, label, type, icon }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-gray-700 text-xs mb-1">{label}</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
                  <input
                    type={type}
                    id={id}
                    name={id}
                    value={formData[id]}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder={label}
                  />
                </div>
              </div>
            ))}

            <div className="flex items-center">
              <input type="checkbox" required className="w-3.5 h-3.5 text-indigo-600 border-gray-300 rounded" />
              <span className="ml-2 text-gray-600 text-xs">
                I agree to <Link to="#" className="text-indigo-600 underline">Terms</Link> & <Link to="#" className="text-indigo-600 underline">Privacy</Link>
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 text-sm rounded hover:bg-indigo-700 transition font-medium"
            >
              Create Account
            </button>
          </form>

          <div className="mt-3 text-center text-xs text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-medium underline">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
