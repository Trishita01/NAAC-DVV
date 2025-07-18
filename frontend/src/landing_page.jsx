import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  FaHome,
  FaTable,
  FaChartLine,
  FaFileAlt,
//   FaFileLines,
//   FaBuildingColumns,
FaUniversity,
  FaBuilding,
  FaGraduationCap,
  FaSchool,
  FaUser,
  FaUserTie,
  FaUserCog,
  FaChalkboardTeacher
} from "react-icons/fa";
import { FaB } from 'react-icons/fa6';

const LandingPage = () => {
const [activeTab, setActiveTab] = useState(null);
const toggleTab = (index) => {
setActiveTab(activeTab === index ? null : index);
};

const navigate=useNavigate();
return (
<div className="min-h-screen w-screen bg-white">
<header className="flex justify-between items-center px-8 py-3 bg-white shadow-sm">
<div className="flex items-center">
<h1 className="text-xl font-bold text-[#5D6096]">NAAC DVV System</h1>
</div>
<nav className="hidden md:flex space-x-4">
<a href="#" className="text-[#1F2937] hover:text-[#5D6096] transition-colors">Features</a>
<a href="#" className="text-[#1F2937] hover:text-[#5D6096] transition-colors">Solutions</a>
<a href="#" className="text-[#1F2937] hover:text-[#5D6096] transition-colors">How It Works</a>
<a href="#" className="text-[#1F2937] hover:text-[#5D6096] transition-colors">Contact</a>
</nav>
<div className="flex space-x-3 pl-8">
<button className="pl-4 py-2 text-[#1F2937] border rounded-lg hover:!bg-[#5D6096] hover:!text-white transition-all duration-300 cursor-pointer !rounded-button whitespace-nowrap shadow-sm !bg-white"
onClick={() => navigate('/login')}
>Log In</button>
<button className="px-4 py-2 !bg-[#F4A261] text-white rounded-lg hover:bg-[#F4A261]/90 transition-all duration-300 cursor-pointer !rounded-button whitespace-nowrap shadow-md"
onClick={() => navigate('/register')}
>Register</button>
</div>
</header>
<section className="relative bg-gradient-to-r from-[#5D6096] to-[#7A7CB8] text-white overflow-hidden">
<div className="container mx-auto px-8 py-16 flex flex-col md:flex-row items-center">
<div className="md:w-1/2 z-10">
<h2 className="text-4xl font-bold mb-4">Simplifying NAAC Accreditation</h2>
<p className="text-lg mb-8">A powerful tool for institutions to streamline documentation, track metrics, and simulate NAAC scores based on quantitative data.</p>
<div className="flex space-x-4">
<button className="px-6 py-3 !bg-white text-[#5D6096] font-medium rounded-lg hover:bg-opacity-90 hover:scale-105 transform transition-all duration-300 cursor-pointer !rounded-button whitespace-nowrap shadow-lg">Request a Demo</button>
<button className="px-6 py-3 border-2  text-white font-medium rounded-lg !bg-transparent !border-white hover:!bg-white hover:!text-[#5D6096] transition-all duration-300 cursor-pointer !rounded-button whitespace-nowrap">Start Free Trial</button>
</div>
<p className="mt-8 text-white/90 flex items-center">
<i className="fas fa-check-circle mr-2"></i>
Trusted by academic institutions across India
</p>
</div>
<div className="md:w-1/2 mt-10 md:mt-0 z-10">
<img src="https://static.readdy.ai/image/522f6c6a8e562be9cb7fa12032709455/aa46f798de64e6039935832327ab1612.png" alt="NAAC Dashboard Transformation" className="w-full h-auto rounded-lg shadow-2xl object-cover transform hover:scale-105 transition-transform duration-300"/>
</div>
</div>
</section>
{/* Other sections remain unchanged for brevity - same JSX conversion logic applies */}

{/* Core Features */}
<section className="py-16 px-8 bg-[#F6F8FA]">
<div className="container mx-auto">
<h2 className="text-3xl font-bold text-center mb-12 text-[#1F2937]">Core Features</h2>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
{/* Feature 1 */}
<div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
<div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
<FaHome className="text-teal-600 text-2xl" />
</div>
<h3 className="text-xl text-gray-950 font-semibold mb-2">Digital Nest</h3>
<p className="text-gray-600">Efficiently gather and organize all required documentation from multiple departments.</p>
</div>
{/* Feature 2 */}
<div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
<div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
<FaTable className="text-purple-600 text-2xl" />
</div>
<h3 className="text-xl text-gray-950 font-semibold mb-2">Excel-Free Ready-to-Fill Interface</h3>
<p className="text-gray-600">Structured data entry made easy, without the spreadsheets.</p>
</div>
{/* Feature 3 */}
<div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
<div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
<FaChartLine className=" text-orange-600 text-2xl"/>
</div>
<h3 className="text-xl text-gray-950 font-semibold mb-2">Smart Metric Monitoring System</h3>
<p className="text-gray-600">Automatically monitor key indicators aligned with accreditation criteria.</p>
</div>
{/* Feature 4 */}
<div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
<FaFileAlt className=" text-blue-600 text-2xl"/>
</div>
<h3 className="text-xl text-gray-950 font-semibold mb-2">NAAC Score Simulation</h3>
<p className="text-gray-600">Predict your institution's performance with accurate quantitative score simulations.</p>
</div>
</div>
</div>
</section>
{/* How It Works */}
<section className="py-16 px-8 bg-white">
<div className="container mx-auto">
<h2 className="text-3xl font-bold text-center mb-3 text-[#1F2937]">Your NAAC Process, Simplified in 3 Steps</h2>
<p className="text-gray-600 text-center mb-12">Transform your accreditation journey with our streamlined approach</p>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/* Step 1 */}
<div className="flex flex-col items-center text-center">
<div className="w-14 h-14 bg-[#5D6096] rounded-full flex items-center justify-center text-white text-xl font-bold mb-6 shadow-md">
1
</div>
<h3 className="text-xl text-gray-950 font-semibold mb-3">Upload Data from Departments</h3>
<p className="text-gray-600">Collect and upload data from all departments through our intuitive interface.</p>
</div>
{/* Step 2 */}
<div className="flex flex-col items-center text-center">
<div className="w-14 h-14 bg-[#5D6096] rounded-full flex items-center justify-center text-white text-xl font-bold mb-6 shadow-md">
2
</div>
<h3 className="text-xl text-gray-950 font-semibold mb-3">System Validates & Maps to NAAC Criteria</h3>
<p className="text-gray-600">The system automatically validates and maps your data to NAAC criteria.</p>
</div>
{/* Step 3 */}
<div className="flex flex-col items-center text-center">
<div className="w-14 h-14 bg-[#5D6096] rounded-full flex items-center justify-center text-white text-xl font-bold mb-6 shadow-md">
3
</div>
<h3 className="text-x text-gray-950 font-semibold mb-3">Simulate Score & Download Reports</h3>
<p className="text-gray-600">Get instant score simulations and download ready-to-submit reports.</p>
</div>
</div>
</div>
</section>
{/* Designed for Academic Institutions */}
<section className="py-16 px-8 bg-[#F6F8FA]">
<div className="container mx-auto">
<h2 className="text-3xl font-bold text-center mb-12 text-[#1F2937]">Designed for Academic Institutions</h2>
<div className="flex flex-wrap justify-center gap-8">
{/* Institution Type 1 */}
<div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center w-64">
<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
<FaUniversity className=" text-gray-600 text-2xl"/>
</div>
<h3 className="text-xl font-semibold mb-2 text-gray-950">Universities</h3>
</div>
{/* Institution Type 2 */}
<div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center w-64">
<div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
<FaBuilding className=" text-teal-600 text-2xl"/>
</div>
<h3 className="text-xl font-semibold mb-2 text-gray-950">Autonomous Institutions</h3>
</div>
{/* Institution Type 3 */}
<div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center w-64">
<div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
<FaGraduationCap className=" text-red-900 text-2xl"/>
</div>
<h3 className="text-xl font-semibold mb-2 text-gray-950">Affiliated PG Institutions</h3>
</div>
{/* Institution Type 4 */}
<div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center w-64">
<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
<FaSchool className=" text-gray-600 text-2xl"/>
</div>
<h3 className="text-xl font-semibold mb-2 text-gray-950">Affiliated UG Institutions</h3>
</div>
</div>
</div>
</section>
{/* Who Is It For? */}
<section className="py-16 px-8 bg-white">
<div className="container mx-auto">
<h2 className="text-3xl font-bold text-center mb-12 text-[#1F2937]">Who Is It For?</h2>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
{/* User Type 1 */}
<div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
<FaUserTie className=" text-blue-600 text-2xl"/>
</div>
<h3 className="text-xl text-gray-950 font-semibold mb-2">IQAC Coordinators</h3>
<p className="text-gray-600">Streamline data collection, coordination, and documentation management.</p>
</div>
{/* User Type 2 */}
<div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
<FaUserCog className=" text-blue-600 text-2xl"/>
</div>
<h3 className="text-xl text-gray-950 font-semibold mb-2">College Admin</h3>
<p className="text-gray-600">Monitor data collection progress and reporting.</p>
</div>
{/* User Type 3 */}
<div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
<FaChalkboardTeacher className=" text-blue-600 text-2xl"/>
</div>
<h3 className="text-xl text-gray-950 font-semibold mb-2">Faculty Members</h3>
<p className="text-gray-600">Easy data submission for individual contributions.</p>
</div>
{/* User Type 4 */}
<div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
<FaUser className=" text-blue-600 text-2xl"/>
</div>
<h3 className="text-xl text-gray-950 font-semibold mb-2">Mentors</h3>
<p className="text-gray-600">Empowering Mentors to Track and Elevate Student Performance.</p>
</div>
</div>
</div>
</section>
{/* FAQ Section */}
<section className="py-16 px-8 bg-[#F6F8FA]">
<div className="container mx-auto">
<h2 className="text-3xl font-bold text-center mb-12 text-[#1F2937]">Frequently Asked Questions</h2>
<div className="max-w-3xl mx-auto space-y-4">
{/* FAQ Item 1 */}
<div className="border border-gray-200 rounded-lg overflow-hidden">
<button
className="w-full px-6 py-4 text-left font-semibold flex justify-between items-center !bg-white text-gray-950 hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap"
onClick={() => toggleTab(1)}
>
<style>
{`
.faq-content {
max-height: 0;
overflow: hidden;
transition: max-height 0.3s ease-out;
}
.faq-content.active {
max-height: 500px;
transition: max-height 0.5s ease-in;
}
`}
</style>
<span>How does this platform help in NAAC accreditation?</span>
<i className={`fas ${activeTab === 1 ? 'fa-chevron-up' : 'fa-chevron-down'} text-blue-600`}></i>
</button>
{activeTab === 1 && (
<div className={`px-6 py-4 bg-white faq-content ${activeTab === 1 ? 'active' : ''}`}>
<p className="text-gray-600">Our platform streamlines the entire NAAC accreditation process by digitizing data collection, automating metric calculations, providing real-time score simulations, and generating ready-to-submit reports. This significantly reduces manual effort and improves accuracy.</p>
</div>
)}
</div>
{/* FAQ Item 2 */}
<div className="border border-gray-200 rounded-lg overflow-hidden">
<button
className="w-full px-6 py-4 text-left font-semibold flex justify-between items-center !bg-white text-gray-950 hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap"
onClick={() => toggleTab(2)}
>
<span>Is it necessary to upload Excel templates, or is everything built-in?</span>
<i className={`fas ${activeTab === 2 ? 'fa-chevron-up' : 'fa-chevron-down'} text-blue-600`}></i>
</button>
{activeTab === 2 && (
<div className="px-6 py-4 bg-white">
<p className="text-gray-600">Our system is completely Excel-free. All forms and templates are built directly into the platform with an intuitive interface, eliminating the need for spreadsheet uploads or downloads. This reduces errors and simplifies the data entry process.</p>
</div>
)}
</div>
{/* FAQ Item 3 */}
<div className="border border-gray-200 rounded-lg overflow-hidden">
<button
className="w-full px-6 py-4 text-left font-semibold flex justify-between items-center !bg-white hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap text-gray-950"
onClick={() => toggleTab(3)}
>
<span>Can I track NAAC metrics like seat fill percentage, research output, and MoUs on this platform?</span>
<i className={`fas ${activeTab === 3 ? 'fa-chevron-up' : 'fa-chevron-down'} text-blue-600`}></i>
</button>
{activeTab === 3 && (
<div className="px-6 py-4 bg-white">
<p className="text-gray-600">Yes, our platform tracks all NAAC metrics including seat fill percentage, research output, MoUs, and many more. The system provides real-time dashboards and visualizations for these metrics, helping you identify areas for improvement.</p>
</div>
)}
</div>
{/* FAQ Item 4 */}
<div className="border border-gray-200 rounded-lg overflow-hidden">
<button
className="w-full px-6 py-4 text-left font-semibold flex justify-between items-center !bg-white hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap text-gray-950"
onClick={() => toggleTab(4)}
>
<span>Can different departments collaborate on the same platform?</span>
<i className={`fas ${activeTab === 4 ? 'fa-chevron-up' : 'fa-chevron-down'} text-blue-600`}></i>
</button>
{activeTab === 4 && (
<div className="px-6 py-4 bg-white">
<p className="text-gray-600">Absolutely. Our platform is designed for multi-department collaboration with role-based access controls. Each department can input their specific data while administrators can oversee the entire process, ensuring seamless coordination across the institution.</p>
</div>
)}
</div>
{/* FAQ Item 5 */}
<div className="border border-gray-200 rounded-lg overflow-hidden">
<button
className="w-full px-6 py-4 text-left font-semibold flex justify-between items-center !bg-white hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap text-gray-950"
onClick={() => toggleTab(5)}
>
<span>Can I generate AQAR and SSR reports directly from the system?</span>
<i className={`fas ${activeTab === 5 ? 'fa-chevron-up' : 'fa-chevron-down'} text-blue-600`}></i>
</button>
{activeTab === 5 && (
<div className="px-6 py-4 bg-white">
<p className="text-gray-600">Yes, our system automatically generates AQAR and SSR reports based on the data entered. These reports are formatted according to NAAC requirements and can be downloaded in various formats including PDF and Word, ready for submission.</p>
</div>
)}
</div>
</div>
<div className="text-center mt-12">
<h3 className="text-xl text-gray-950 font-semibold mb-4">Still Have Questions?</h3>
<button className="px-6 py-3 !bg-[#F4A261] text-white font-medium rounded-lg hover:bg-[#F4A261]/90 transition duration-300 cursor-pointer !rounded-button whitespace-nowrap shadow-lg">Contact Us</button>
</div>
</div>
</section>
{/* CTA Section */}
<section className="py-16 px-8 bg-[#5D6096] text-white">
<div className="container mx-auto text-center">
<h2 className="text-3xl font-bold mb-4">Want to get NAAC-ready?</h2>
<p className="text-xl mb-8">Connect with us today to streamline your data and improve your accreditation process.</p>
<button className="px-8 py-4 !bg-[#F4A261] text-white font-semibold rounded-lg hover:bg-[#F4A261]/90 transition duration-300 cursor-pointer !rounded-button whitespace-nowrap shadow-lg">Contact Us</button>
</div>
</section>
{/* Footer */}
<footer className="bg-[#1F2937] text-gray-100 pt-16 pb-8 px-8">
<div className="container mx-auto">
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/* Company Info */}
<div className="col-span-1">
<h1 className="text-2xl font-bold mb-4">Smart NAAC Scoring System</h1>
<address className="not-italic text-gray-300 mb-6">
IEM Consultancy Services<br />
Godrej Genesis Building, 15th Floor, Unit No.1502,<br />
Sector-V, Block EP & GP, Salt Lake City,<br />
Kolkata – 700 091, West Bengal, India.
</address>
<div>
<h4 className="font-semibold mb-3">Follow Us</h4>
<div className="flex space-x-4">
<a href="#" className="text-gray-300 hover:text-white cursor-pointer">
<i className="fab fa-facebook-f text-xl"></i>
</a>
<a href="#" className="text-gray-300 hover:text-white cursor-pointer">
<i className="fab fa-instagram text-xl"></i>
</a>
<a href="#" className="text-gray-300 hover:text-white cursor-pointer">
<i className="fab fa-twitter text-xl"></i>
</a>
<a href="#" className="text-gray-300 hover:text-white cursor-pointer">
<i className="fab fa-linkedin-in text-xl"></i>
</a>
</div>
</div>
</div>
{/* Links - Product */}
<div>
<h3 className="text-lg font-semibold mb-4">Product</h3>
<ul className="space-y-2">
<li><a href="#" className="text-gray-300 hover:text-white cursor-pointer">Features</a></li>
<li><a href="#" className="text-gray-300 hover:text-white cursor-pointer">Pricing</a></li>
<li><a href="#" className="text-gray-300 hover:text-white cursor-pointer">Demo</a></li>
<li><a href="#" className="text-gray-300 hover:text-white cursor-pointer">Security</a></li>
</ul>
</div>
{/* Links - About Us */}
<div>
<h3 className="text-lg font-semibold mb-4">About Us</h3>
<ul className="space-y-2">
<li><a href="#" className="text-gray-300 hover:text-white cursor-pointer">Company</a></li>
<li><a href="#" className="text-gray-300 hover:text-white cursor-pointer">Contact</a></li>
<li><a href="#" className="text-gray-300 hover:text-white cursor-pointer">Target Audience</a></li>
<li><a href="#" className="text-gray-300 hover:text-white cursor-pointer">FAQ</a></li>
</ul>
</div>
</div>
{/* Copyright */}
<div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
<p>© 2025 IEM Consultancy Services. All Rights Reserved.</p>
</div>
</div>
</footer>
</div>


);
};
export default LandingPage;
