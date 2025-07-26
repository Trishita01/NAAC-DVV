import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaUser,
  FaCheckCircle,
  FaChevronDown,
  FaIdCard,
  FaBuilding,
  FaUniversity,
  FaEnvelope,
  FaMobileAlt,
  FaArrowRight,
  FaLock,
} from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    institutionName: '',
    institutionType: 'university',
    aisheId: '',
    institutionalEmail: '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const institutionTypes = [
    'university',
    'autonomous',
    'affiliated UG',
    'affiliated PG',
  ];

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
        if (!value.trim()) msg = 'Full name is required';
        else if (value.length < 3) msg = 'Name must be at least 3 characters';
        break;
      case 'email':
        if (!value.trim()) msg = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) msg = 'Please enter a valid email address';
        break;
      case 'password':
        if (!value.trim()) msg = 'Password is required';
        else if (value.length < 8) msg = 'Password must be at least 8 characters';
        break;
      case 'confirmPassword':
        if (!value.trim()) msg = 'Please confirm password';
        else if (value !== formData.password) msg = 'Passwords do not match';
        break;
      case 'institutionName':
        if (!value.trim()) msg = 'Institution name is required';
        break;
      case 'institutionType':
        if (!value) msg = 'Please select institution type';
        break;
      case 'aisheId':
        if (!value.trim()) msg = 'AISHE ID is required';
        else if (!/^[A-Z0-9-]+$/i.test(value)) msg = 'Please enter a valid AISHE ID';
        break;
      case 'institutionalEmail':
        if (!value.trim()) msg = 'Institutional email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) msg = 'Please enter a valid institutional email';
        break;
      case 'phoneNumber':
        if (!value.trim()) msg = 'Phone number is required';
        else if (!/^\+?[0-9]{10,15}$/.test(value)) msg = 'Please enter a valid phone number';
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: msg }));
  };

  const getInputClasses = (f) => {
    const error = touched[f] && errors[f];
    const valid = touched[f] && !errors[f];
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

    // mark all fields as touched for validation
    Object.keys(formData).forEach(key => {
      setTouched(prev => ({ ...prev, [key]: true }));
      validateField(key, formData[key]);
    });

    // ensure no validation errors
    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) return;

    // Prepare the data for submission
    const submissionData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      institutionName: formData.institutionName,
      institutionType: formData.institutionType,
      aisheId: formData.aisheId,
      institutionalEmail: formData.institutionalEmail,
      phoneNumber: formData.phoneNumber
    };

    try {
      const { data } = await axios.post(
        'http://localhost:3000/api/v1/auth/iqacRegister',
        submissionData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Success:', data);
      navigate('/iqac-dashboard');
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      // Show error to user
      alert(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="h-auto min-h-screen w-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-xl font-bold text-gray-900 text-center mb-6">
          IQAC Coordinator Registration
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {[
            { id: 'name', label: 'Full Name', Icon: FaUser, type: 'text' },
            { id: 'email', label: 'Email', Icon: FaEnvelope, type: 'email' },
            { id: 'password', label: 'Password', Icon: FaLock, type: 'password' },
            { id: 'confirmPassword', label: 'Confirm Password', Icon: FaLock, type: 'password' },
            { id: 'institutionName', label: 'Institution Name', Icon: FaBuilding, type: 'text' },
            { id: 'aisheId', label: 'AISHE ID', Icon: FaIdCard, type: 'text' },
            { id: 'institutionalEmail', label: 'Institutional Email', Icon: FaEnvelope, type: 'email' },
            { id: 'phoneNumber', label: 'Phone Number', Icon: FaMobileAlt, type: 'tel'}
          ].map(({ id, label, Icon, type }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Icon />
                </div>
                <input
                  id={id}
                  name={id}
                  type={type}
                  className={`${getInputClasses(id)} text-gray-900`}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  value={formData[id]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={id === 'mobileNumber' ? 10 : undefined}
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
          ))}

          {/* Institution Type dropdown */}
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

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              
              className="relative flex justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <span className="absolute left-4 inset-y-0 flex items-center">
                <FaArrowRight className="text-blue-300 group-hover:text-blue-200" />
              </span>
              Proceed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
