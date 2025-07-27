import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './auth/authProvider';
import axiosInstance from './contextprovider/axios';

import {
  FaUser,
  FaCheckCircle,
  FaChevronDown,
  FaIdCard,
  FaBuilding,
  FaUniversity,
  FaEnvelope,
  FaMobileAlt,
  FaLock,
} from 'react-icons/fa';

import LandingNavbar from './components/landing-navbar';

const Register = () => {
  const [showIQACForm, setShowIQACForm] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'faculty',
    institutionName: '',
    institutionType: '',
    aisheId: '',
    institutionalEmail: '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const institutionTypes = ['university', 'autonomous', 'affiliated UG', 'affiliated PG'];

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleBlur = ({ target: { name } }) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let msg = '';
    switch (name) {
      case 'name':
        if (!value.trim()) msg = 'Name is required';
        break;
      case 'email':
      case 'institutionalEmail':
        if (!value.trim()) msg = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) msg = 'Enter a valid email';
        break;
      case 'password':
        if (!value.trim()) msg = 'Password is required';
        else if (value.length < 8) msg = 'Password must be at least 8 characters';
        break;
      case 'confirmPassword':
        if (value !== formData.password) msg = 'Passwords do not match';
        break;
      case 'role':
        if (!showIQACForm) {
          if (!value.trim()) msg = 'Role is required';
        }
        break;
      case 'institutionName':
        if (!value.trim()) msg = 'Institution name is required';
        break;
      case 'institutionType':
        if (!value.trim()) msg = 'Institution type is required';
        break;
      case 'aisheId':
        if (!value.trim()) msg = 'AISHE ID is required';
        else if (!/^[A-Z0-9-]+$/i.test(value)) msg = 'Invalid AISHE ID';
        break;
      case 'phoneNumber':
        if (!value.trim()) msg = 'Phone number is required';
        else if (!/^\+?[0-9]{10,15}$/.test(value)) msg = 'Enter a valid phone number';
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: msg }));
  };

  const getInputClasses = (field) => {
    const error = touched[field] && errors[field];
    const valid = touched[field] && !errors[field];
    return `w-full h-12 pl-10 pr-4 border ${
      error
        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
        : valid
        ? 'border-green-500 focus:border-green-500 focus:ring-green-200'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
    } rounded-lg focus:outline-none focus:ring-2 transition-all duration-200`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const newTouched = {};
    Object.keys(formData).forEach(key => {
      newTouched[key] = true;
      validateField(key, formData[key]);
    });
    setTouched(newTouched);

    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) return;

    const submissionData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      ...(showIQACForm && {
        institutionName: formData.institutionName,
        institutionType: formData.institutionType,
        aisheId: formData.aisheId,
        institutionalEmail: formData.institutionalEmail,
        phoneNumber: formData.phoneNumber,
      }),
    };

    setIsSubmitting(true);
    try {
      const endpoint = showIQACForm ? 'auth/iqacRegister' : 'auth/register';
      const response = await axiosInstance.post(endpoint, submissionData);

      if (response.data.success) {
        // The backend should set HTTP-only cookies
        // The auth provider will handle the user state update
        const loginSuccess = await login(
          submissionData.email, 
          submissionData.password,
          submissionData.role
        );
        
        if (loginSuccess) {
          navigate('/dashboard');
        } else {
          setErrors(prev => ({ ...prev, global: 'Registration successful but login failed. Please log in manually.' }));
        }
      } else {
        setErrors(prev => ({ ...prev, global: response.data.message || 'Registration failed' }));
      }
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred during registration.';
      setErrors(prev => ({ ...prev, global: message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (id, label, Icon, type = 'text') => (
    <div key={id}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Icon /></div>
        <input
          id={id}
          name={id}
          type={type}
          className={`${getInputClasses(id)} text-gray-900`}
          placeholder={`Enter ${label.toLowerCase()}`}
          value={formData[id]}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched[id] && !errors[id] && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500">
            <FaCheckCircle />
          </div>
        )}
      </div>
      {touched[id] && errors[id] && (
        <p className="mt-1 text-sm text-red-600">{errors[id]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-full h-full bg-gray-50"> 
      <LandingNavbar />
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 mt-12">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {showIQACForm ? 'IQAC Coordinator Registration' : 'User Registration'}
          </h2>
          <p className="text-gray-600 text-sm">Please fill in your details to create an account</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {renderField('name', 'Full Name', FaUser)}
          {renderField('email', 'Email', FaEnvelope, 'email')}
          {renderField('password', 'Password', FaLock, 'password')}
          {renderField('confirmPassword', 'Confirm Password', FaLock, 'password')}
          {!showIQACForm && (
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <FaUser />
                </div>
                <select
                  id="role"
                  name="role"
                  className={`${getInputClasses('role')} appearance-none text-gray-900`}
                  value={formData.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select role</option>
                  <option value="faculty">Faculty</option>
                  <option value="hod">HOD</option>
                  <option value="college_authority">College Authority</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                  <FaChevronDown />
                </div>
              </div>
              {touched.role && errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>
          )}

          {showIQACForm && (
            <>
              {renderField('institutionName', 'Institution Name', FaBuilding)}
              <div>
                <label htmlFor="institutionType" className="block text-sm font-medium text-gray-700 mb-1">
                  Institution Type
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FaUniversity />
                  </div>
                  <select
                    id="institutionType"
                    name="institutionType"
                    className={`${getInputClasses('institutionType')} appearance-none text-gray-900`}
                    value={formData.institutionType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="" disabled>Select type</option>
                    {institutionTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                    <FaChevronDown />
                  </div>
                </div>
                {touched.institutionType && errors.institutionType && (
                  <p className="mt-1 text-sm text-red-600">{errors.institutionType}</p>
                )}
              </div>
              {renderField('aisheId', 'AISHE ID', FaIdCard)}
              {renderField('institutionalEmail', 'Institutional Email', FaEnvelope, 'email')}
              {renderField('phoneNumber', 'Phone Number', FaMobileAlt, 'tel')}
            </>
          )}

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`relative flex justify-center px-6 py-3 ${
                isSubmitting ? '!bg-blue-400' : '!bg-blue-600 hover:!bg-blue-700'
              } text-white rounded-lg font-semibold transition`}
            >
              {isSubmitting ? 'Processing...' : 'Proceed'}
              {isSubmitting && (
                <svg
                  className="animate-spin ml-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
            </button>
          </div>

          {!showIQACForm && (
            <div className="pt-4 text-center">
              <p className="text-sm text-gray-600">
                Are you an IQAC Supervisor?{' '}
                <button
                  type="button"
                  className="!text-blue-600 !underline !bg-white !hover:bg-blue-600 !hover:text-white"
                  onClick={() => setShowIQACForm(true)}
                >
                  Register as IQAC Supervisor
                </button>
              </p>
            </div>
          )}

          {errors.global && (
            <div className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {errors.global}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
