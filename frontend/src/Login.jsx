import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUniversity,
  FaBell,
  FaChevronDown,
  FaCheckCircle,
} from 'react-icons/fa';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!role) {
      alert('Please select a role');
      return;
    }

    // 🚀 Navigate based on selected role
    if (role === 'IQAC supervisor') {
      navigate('/iqac-dashboard');
    } else if (role === 'college admin') {
      navigate('/admin-dashboard');
    }
     else if (role === 'Faculty') {
      navigate('/fac-dashboard');
    } 
    else if (role === 'HOD') {
      navigate('/hod-dashboard');
    }  else {
      alert('Role not recognized, please select a valid role');
    }
  };

  return (
    <div className="h-[800px] w-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a237e] text-white py-3 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaUniversity className="text-xl" />
          <span className="text-lg font-semibold">NAAC DVV System</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
           
          </div>
         
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <FaUniversity className="text-blue-600 text-4xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">
              Automated NAAC DVV Evaluation System
            </h2>
            <p className="text-gray-600 mt-2">Sign in to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
      className="w-full  bg-white border border-black rounded-lg py-3 px-4 text-left text-black cursor-pointer focus:outline-none focus:ring-2 focus:ring-black flex justify-between items-center"
      aria-haspopup="listbox"
      aria-expanded={isDropdownOpen}
      style={{ backgroundColor: 'white', color: 'black' }}
    >
      {role || 'Select your role'}
      <FaChevronDown className="text-gray-400 border-black" />
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
                  <FaUser />
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
                  <FaLock />
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
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                Proceed
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            <div className="flex justify-center items-center mb-2">
              <FaCheckCircle className="text-green-500 mr-2" />
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
