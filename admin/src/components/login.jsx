// src/components/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseclient';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaSignInAlt, FaHome } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        handleRedirect();
      }
    };
    checkUser();
  }, []);

  const handleRedirect = () => {
    // Check if we're on admin subdomain or main domain
    const hostname = window.location.hostname;
    const isAdminSubdomain = hostname.startsWith('admin.');
    const isLocalhost = hostname === 'localhost';
    
    if (process.env.REACT_APP_BUILD_TARGET === 'admin' || isAdminSubdomain) {
      // If on admin subdomain, navigate to admin panel
      navigate('/');
    } else if (isLocalhost) {
      // For local development
      navigate('/admin');
    } else {
      // If on main domain, redirect to admin subdomain
      window.location.href = process.env.REACT_APP_ADMIN_URL || 'https://admin.yourdomain.com';
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Successful login
        handleRedirect();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const goToMainSite = () => {
    const mainUrl = process.env.REACT_APP_MAIN_URL || 'https://yourdomain.com';
    window.location.href = mainUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative z-10 w-full max-w-md px-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
              <FaUser className="text-pink-600 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
            <p className="text-sm text-gray-500 mt-2">Civil Surgeon Office, Sindhudurg</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-pink-600 focus:ring-pink-500" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-pink-600 hover:text-pink-700">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 disabled:bg-pink-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <FaSignInAlt />
                <span>Login to Admin Panel</span>
              </>
            )}
          </button>

          {/* Security Note */}
          <p className="text-xs text-gray-500 text-center mt-6">
            This is a secure area. Unauthorized access is prohibited.
          </p>
        </form>

        {/* Additional Info */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Civil Surgeon Office, Sindhudurg</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;