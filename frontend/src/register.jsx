import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaCheckCircle,
  FaChevronDown,
  FaIdCard,
  FaBuilding,
  FaUniversity,
  FaEnvelope,
  FaMobileAlt,
  FaArrowRight

} from "react-icons/fa";
const Register = () => {
const [formData, setFormData] = useState({
username: '',
institutionName: '',
institutionType: '',
aisheId: '',
email: '',
confirmEmail: '',
mobileNumber: ''
});
const [errors, setErrors] = useState({
username: '',
institutionName: '',
institutionType: '',
aisheId: '',
email: '',
confirmEmail: '',
mobileNumber: ''
});
const [touched, setTouched] = useState({
username: false,
institutionName: false,
institutionType: false,
aisheId: false,
email: false,
confirmEmail: false,
mobileNumber: false
});
const institutionTypes = [
'University',
'Autonomous College',
'Affiliated UG College',
'Affiliated PG College',
]
const handleChange = (e) => {
const { name, value } = e.target;
setFormData({
...formData,
[name]: value
});
validateField(name, value);
};
const handleBlur = (e) => {
const { name } = e.target;
setTouched({
...touched,
[name]: true
});
validateField(name, formData[name]);
};
const validateField = (name, value) => {
let errorMessage = '';
switch (name) {
case 'username':
if (!value.trim()) {
errorMessage = 'Username is required';
} else if (value.length < 3) {
errorMessage = 'Username must be at least 3 characters';
}
break;
case 'institutionName':
if (!value.trim()) {
errorMessage = 'Institution name is required';
}
break;
case 'institutionType':
if (!value) {
errorMessage = 'Please select institution type';
}
break;
case 'aisheId':
if (!value.trim()) {
errorMessage = 'AISHE ID is required';
} else if (!/^[A-Z0-9-]+$/i.test(value)) {
errorMessage = 'Please enter a valid AISHE ID';
}
break;
case 'email':
if (!value.trim()) {
errorMessage = 'Email is required';
} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
errorMessage = 'Please enter a valid email address';
}
break;
case 'confirmEmail':
if (!value.trim()) {
errorMessage = 'Please confirm email';
} else if (value !== formData.email) {
errorMessage = 'Emails do not match';
}
break;
case 'mobileNumber':
if (!value.trim()) {
errorMessage = 'Mobile number is required';
} else if (!/^[0-9]{10}$/.test(value)) {
errorMessage = 'Please enter a valid 10-digit mobile number';
}
break;
default:
break;
}
setErrors(prev => ({
...prev,
[name]: errorMessage
}));
};
const handleSubmit = (e) => {
e.preventDefault();
const allTouched = Object.keys(touched).reduce((acc, key) => {
return { ...acc, [key]: true };
}, {});
setTouched(allTouched);
Object.keys(formData).forEach(key => {
validateField(key, formData[key]);
});
const hasErrors = Object.values(errors).some(error => error !== '');
if (!hasErrors) {
console.log('Form submitted:', formData);
}
};
const getInputClasses = (fieldName) => {
return `w-full h-12 pl-10 pr-4 border ${
touched[fieldName] && errors[fieldName]
? 'border-red-500 focus:border-red-500 focus:ring-red-200'
: touched[fieldName] && !errors[fieldName]
? 'border-green-500 focus:border-green-500 focus:ring-green-200'
: 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
} rounded-lg focus:outline-none focus:ring-2 transition-all duration-200`;
};
const navigate = useNavigate();
return (
<div className="h-[1500px] w-[1520px] bg-gray-50">
    <div className="bg-[#1a237e] text-white py-3 px-4 flex items-center justify-between">
<div className="flex items-center space-x-2">
<i className="fas fa-university text-xl"></i>
<span className="text-lg font-semibold">NAAC DVV System</span>
</div>
<div className="flex items-center space-x-4">
<div className="flex items-center space-x-2">
<div className="bg-blue-400 rounded-full w-8 h-8 flex items-center justify-center">JD</div>
<div className="text-sm">
<div>Guest User</div>
<div className="text-xs text-gray-300">Please login to continue</div>
</div>
</div>
</div>
</div>
<div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
<div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
<div className="text-center mb-8">
<h1 className="text-xl font-bold text-gray-900">College Registration</h1>
<div className="mt-9 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
<i className="fas fa-user-tie mr-2"></i>
IQAC Coordinator Registration
</div>
</div>
<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
<div className="space-y-6">
<div className="space-y-6">
{/* Username Field */}
<div>
<label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
Username
</label>
<div className="relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-950">
<FaUser className=" text-gray-400"/>
</div>
<input
id="username"
name="username"
type="text"
autoComplete="username"
required
className={`${getInputClasses('username')} text-black`}
placeholder="Enter your username"
value={formData.username}
onChange={handleChange}
onBlur={handleBlur}
aria-describedby="username-error"
/>
{touched.username && !errors.username && (
<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
<FaUser className=" text-green-500"/>
</div>
)}
</div>
{touched.username && errors.username && (
<p className="mt-1 text-sm text-red-600" id="username-error">
{errors.username}
</p>
)}
</div>
{/* Institution Name Field */}
<div>
<label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-1">
Name of the Institution
</label>
<div className="relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<FaBuilding className=" text-gray-400"/>
</div>
<input
id="institutionName"
name="institutionName"
type="text"
required
className={`${getInputClasses('institutionName')} text-black`}
placeholder="Enter institution name"
value={formData.institutionName}
onChange={handleChange}
onBlur={handleBlur}
aria-describedby="institutionName-error"
/>
{touched.institutionName && !errors.institutionName && (
<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
<FaCheckCircle className=" text-green-500"/>
</div>
)}
</div>
{touched.institutionName && errors.institutionName && (
<p className="mt-1 text-sm text-red-600" id="institutionName-error">
{errors.institutionName}
</p>
)}
</div>
{/* Institution Type Field */}
<div>
<label htmlFor="institutionType" className="block text-sm font-medium text-gray-700 mb-1">
Institution Type
</label>
<div className="relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<FaUniversity className=" text-gray-400"/>
</div>
<select
id="institutionType"
name="institutionType"
required
className={`${getInputClasses('institutionType')} appearance-none text-gray-950`}
value={formData.institutionType}
onChange={handleChange}
onBlur={handleBlur}
aria-describedby="institutionType-error"
>
<option value="" disabled>Select institution type</option>
{institutionTypes.map((type) => (
<option key={type} value={type}>{type}</option>
))}
</select>
<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
{touched.institutionType && !errors.institutionType ? (
<FaCheckCircle className=" text-green-500"/>
) : (
<FaChevronDown className=" text-gray-400"/>
)}
</div>
</div>
</div>
{touched.institutionType && errors.institutionType && (
<p className="mt-1 text-sm text-red-600" id="institutionType-error">
{errors.institutionType}
</p>
)}
</div>
{/* MHRD AISHE ID Field */}
<div>
<label htmlFor="aisheId" className="block text-sm font-medium text-gray-700 mb-1">
MHRD AISHE ID
</label>
<div className="relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<FaIdCard className=" text-gray-400"/>
</div>
<input
id="aisheId"
name="aisheId"
type="text"
required
className={`${getInputClasses('aisheId')} text-gray-950` }
placeholder="Enter AISHE ID"
value={formData.aisheId}
onChange={handleChange}
onBlur={handleBlur}
aria-describedby="aisheId-error"
/>
{touched.aisheId && !errors.aisheId && (
<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
<FaCheckCircle className=" text-green-500"/>
</div>
)}
</div>
{touched.aisheId && errors.aisheId && (
<p className="mt-1 text-sm text-red-600" id="aisheId-error">
{errors.aisheId}
</p>
)}
</div>
{/* Institution Email Field */}
<div>
<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
Institution Email ID
</label>
<div className="relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<FaEnvelope className=" text-gray-400"/>
</div>
<input
id="email"
name="email"
type="email"
autoComplete="email"
required
className={`${getInputClasses('email')} text-gray-950`}
placeholder="Enter institution email"
value={formData.email}
onChange={handleChange}
onBlur={handleBlur}
aria-describedby="email-error"
/>
{touched.email && !errors.email && (
<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
<FaCheckCircle className=" text-green-500"/>
</div>
)}
</div>
{touched.email && errors.email && (
<p className="mt-1 text-sm text-red-600" id="email-error">
{errors.email}
</p>
)}
</div>


{/* Mobile Number Field */}
<div>
<label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
Mobile Number for Communication
</label>
<div className="relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<FaMobileAlt className=" text-gray-400"/>
</div>
<input
id="mobileNumber"
name="mobileNumber"
type="tel"
required
className={`${getInputClasses('mobileNumber')} text-gray-950`}
placeholder="Enter 10-digit mobile number"
value={formData.mobileNumber}
onChange={handleChange}
onBlur={handleBlur}
maxLength={10}
aria-describedby="mobileNumber-error"
/>
{touched.mobileNumber && !errors.mobileNumber && (
<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
<FaCheckCircle className=" text-green-500"/>
</div>
)}
</div>
{touched.mobileNumber && errors.mobileNumber && (
<p className="mt-1 text-sm text-red-600" id="mobileNumber-error">
{errors.mobileNumber}
</p>
)}
</div>
</div>
<div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
<button
type="button"
className="!rounded-button whitespace-nowrap cursor-pointer group relative flex justify-center py-3 px-6 border border-gray-300 text-sm font-medium rounded-md text-gray-700 !bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
>
Cancel
</button>
<button
type="submit"
className="!rounded-button whitespace-nowrap cursor-pointer group relative flex justify-center py-3 px-6 border border-transparent text-sm font-medium rounded-md text-white !bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
onClick={()=>navigate('/iqac-dashboard')}
>
<span className="absolute left-0 inset-y-0 flex items-center pl-1">
<FaArrowRight className=" text-blue-400 group-hover:text-blue-300"/>
</span>
Proceed
</button>
</div>
</form>
</div>
</div>
</div>

);
};
export default Register;
