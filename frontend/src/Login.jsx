import React, { useState, useContext, useEffect } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Building2,
  ChevronDown,
  CheckCircle,
  Mail,
  UserPlus,
  ArrowLeft,
} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import { AuthContext } from './contextprovider/authcontext.jsx';
import api from './api';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { login, isAuthenticated } = useContext(AuthContext);
  
  // Signup fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleSignupPasswordVisibility = () => {
    setShowSignupPassword(!showSignupPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const errors = {};
    if (!role) errors.role = 'Please select a role';
    if (!username) errors.username = 'Username is required';
    if (!password) errors.password = 'Password is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    if (isLoading) return;

    setIsLoading(true);
    setFormErrors({});

    try {
      const response = await axiosInstance.post('/auth/login', { 
        username, 
        password,
        role
      });
      
      const { accessToken, refreshToken } = response.data;
      
      // Call the login function from AuthContext with tokens
      await login({ accessToken, refreshToken });
      
      // Role-based navigation
      const roleRoutes = {
        'IQAC supervisor': '/iqac-dashboard',
        'college admin': '/admin-dashboard',
        'Faculty': '/faculty-dashboard',
        'HOD': '/hod-dashboard'
      };
      
      navigate(roleRoutes[role] || '/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setFormErrors({
        form: error.response?.data?.message || 'Login failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = () => {
    if (!fullName || !email || !signupUsername || !signupPassword || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (signupPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (signupPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    alert('Account created successfully! Please login with your credentials.');
    // Reset form and switch to login mode
    setFullName('');
    setEmail('');
    setSignupUsername('');
    setSignupPassword('');
    setConfirmPassword('');
    setIsSignupMode(false);
  };

  const switchToSignup = () => {
    setIsSignupMode(true);
    setIsDropdownOpen(false);
  };

  const switchToLogin = () => {
    setIsSignupMode(false);
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="h-full w-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a237e] text-white py-3 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building2 className="text-xl" />
          <span className="text-lg font-semibold">NAAC DVV System</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Building2 className="text-blue-600 text-4xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">
              Automated NAAC DVV Evaluation System
            </h2>
            <p className="text-gray-600 mt-2">
              {isSignupMode ? 'Create your account' : 'Sign in to access your account'}
            </p>
          </div>

          {/* Login Form */}
          {!isSignupMode && (
            <div className="space-y-6">
              {/* Role Selector */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Login as
                </label>
                <div className="relative border-black">
                  <button
                    type="button"
                    onClick={toggleDropdown}
                    className="w-full bg-white border border-black rounded-lg py-3 px-4 text-left text-black cursor-pointer focus:outline-none focus:ring-2 focus:ring-black flex justify-between items-center"
                    aria-haspopup="listbox"
                    aria-expanded={isDropdownOpen}
                    style={{ backgroundColor: 'white', color: 'black' }}
                  >
                    {role || 'Select your role'}
                    <ChevronDown className="text-gray-400 border-black" />
                  </button>
                  {isDropdownOpen && (
                    <div
                      className="absolute z-10 mt-1 w-full border border-gray-300 rounded-lg shadow-lg"
                      style={{ backgroundColor: 'white', color: 'black' }}
                    >
                      <div
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setRole('IQAC supervisor');
                          setIsDropdownOpen(false);
                        }}
                        role="option"
                        tabIndex={0}
                        style={{ color: 'black' }}
                      >
                        IQAC supervisor
                      </div>
                      <div
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setRole('Faculty');
                          setIsDropdownOpen(false);
                        }}
                        role="option"
                        tabIndex={0}
                        style={{ color: 'black' }}
                      >
                        Faculty
                      </div>
                      <div
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setRole('college admin');
                          setIsDropdownOpen(false);
                        }}
                        role="option"
                        tabIndex={0}
                        style={{ color: 'black' }}
                      >
                        college admin
                      </div>
                      <div
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setRole('HOD');
                          setIsDropdownOpen(false);
                        }}
                        role="option"
                        tabIndex={0}
                        style={{ color: 'black' }}
                      >
                        HOD
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Username Field */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                {formErrors.form && (
                  <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                    {formErrors.form}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center gap-2 ${
                    isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white py-3 rounded-lg transition-colors`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : 'Login'}
                </button>
              </div>

              {/* Signup Link */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  New user?{' '}
                  <button
                    type="button"
                    onClick={switchToSignup}
                    className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:underline"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Signup Form */}
          {isSignupMode && (
            <div className="space-y-6">
              {/* Back to Login Button */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="flex items-center text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back to Login
                </button>
              </div>

              {/* Full Name Field */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <UserPlus />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleSignup)}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleSignup)}
                  />
                </div>
              </div>

              {/* Username Field */}
              <div>
                <label
                  htmlFor="signupUsername"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User />
                  </div>
                  <input
                    id="signupUsername"
                    name="signupUsername"
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Choose a username"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleSignup)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="signupPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock />
                  </div>
                  <input
                    id="signupPassword"
                    name="signupPassword"
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Create a password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleSignup)}
                  />
                  <button
                    type="button"
                    onClick={toggleSignupPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Toggle password visibility"
                  >
                    {showSignupPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleSignup)}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Toggle password visibility"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="button"
                  onClick={handleSignup}
                  className="w-full py-3 px-6 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
                >
                  Create Account
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-gray-500">
            <div className="flex justify-center items-center mb-2">
              <CheckCircle className="text-green-500 mr-2 w-4 h-4" />
              <span>Your credentials are securely encrypted</span>
            </div>
            <p>© 2025 Automated NAAC DVV Evaluation System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;