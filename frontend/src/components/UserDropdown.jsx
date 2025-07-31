import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaSignOutAlt, FaUserCircle, FaEnvelope, FaCog } from 'react-icons/fa';
import { useAuth } from '../auth/authProvider';
import { useNavigate } from 'react-router-dom';

const UserDropdown = ({ user, className = '' }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div 
        className="cursor-pointer group"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 transform transition-transform duration-200 group-hover:scale-110">
          <FaUser className=""/>
        </div>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div 
          className="fixed top-16 right-6 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[9999] transform transition-all duration-200 scale-100 opacity-100"
          style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
        >
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <FaUserCircle className="text-lg"/>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {user?.name || 'User Name'}
                </div>
                <div className="text-sm text-gray-500 flex items-center mt-1">
                  <FaEnvelope className="mr-1 text-xs"/>
                  {user?.email || 'user@example.com'}
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Role: {user?.role || 'IQAC Supervisor'}
            </div>
          </div>

          {/* Menu Options */}
          <div className="py-1">
            
            
            
            
            
            
            <button 
              className="w-full px-4 py-2 !bg-white text-left text-sm !text-red-600 hover:bg-red-50 flex items-center transition-colors duration-200"
              onClick={() => {
                setShowDropdown(false);
                handleLogout();
              }}
            >
              <FaSignOutAlt className="mr-3 text-red-500"/>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
