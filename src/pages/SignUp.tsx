import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    department: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Background Image */}
      <div className="hidden lg:block lg:w-2/3">
        <img
          src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
          alt="Power lines at sunset"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/3 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          {/* Logo and Navigation */}
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-4xl font-bold text-red-600">BSES</h1>
            <div className="mt-4 flex gap-8">
              <Link to="/" className="text-gray-500 hover:text-red-600">
                Login
              </Link>
              <span className="text-red-600 border-b-2 border-red-600 pb-1">
                Sign Up
              </span>
            </div>
          </div>

          {/* Form Title */}
          <h2 className="text-xl font-semibold mb-6 text-center">
            New Registration
          </h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">User ID</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 bg-gray-50 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-2 bg-gray-50 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter Full Name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-2 bg-gray-50 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">Select Department</option>
                <option value="Regulatory">Regulatory</option>
                <option value="Legal">Legal</option>
                
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 bg-gray-50 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;