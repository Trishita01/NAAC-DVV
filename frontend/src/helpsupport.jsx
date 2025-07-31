

import React, { useState } from 'react';
import {
FaArrowLeft,
FaArrowRight,
FaBell,
FaSearch,
FaUsers,FaEdit, FaSignInAlt,
FaTachometerAlt, FaFileAlt, FaChartLine, FaPaperPlane, FaSignOutAlt, FaDownload, FaCog, FaQuestionCircle
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/iqac-sidebar';

const HelpSupport = () => {
const navigate = useNavigate();
const [activeTab, setActiveTab] = useState(0);
const [activeCriteria, setActiveCriteria] = useState(null);
const [activeFaq, setActiveFaq] = useState(null);
const [collapsed, setCollapsed] = useState(false);
const [formData, setFormData] = useState({
category: '',
subject: '',
message: '',
file: null
});
const [isSubmitted, setIsSubmitted] = useState(false);
const handleFormChange = (e) => {
const { name, value } = e.target;
setFormData(prev => ({ ...prev, [name]: value }));
};
const handleSubmit = (e) => {
e.preventDefault();
console.log('Form submitted:', formData);
setIsSubmitted(true);
setTimeout(() => {
setIsSubmitted(false);
setFormData({
category: '',
subject: '',
message: '',
file: null
});
}, 3000);
};
const tabs = [
{ id: 0, name: 'Getting Started' },
{ id: 1, name: 'Criteria Help' },
{ id: 2, name: 'FAQs' },
{ id: 3, name: 'Video Tutorials' },
{ id: 4, name: 'Contact Support' }
];
const criteriaData = [
{
id: 1,
title: 'Criteria 1: Curricular Aspects',
requiredData: [
'Academic flexibility metrics',
'Curriculum enrichment details',
'Feedback system documentation'
],
documents: [
'Syllabus revision records',
'Value-added course certificates',
'Stakeholder feedback analysis'
],
mistakes: [
'Incomplete feedback analysis',
'Missing certificate attachments',
'Incorrect data period selection'
],
templates: [
{ name: 'Curriculum Enrichment Template', format: 'XLSX' },
{ name: 'Feedback Analysis Format', format: 'DOCX' }
]
},
{
id: 2,
title: 'Criteria 2: Teaching-Learning and Evaluation',
requiredData: [
'Student enrollment statistics',
'Teaching-learning process details',
'Student performance metrics'
],
documents: [
'Student satisfaction survey results',
'Learning outcome attainment records',
'Faculty profile documentation'
],
mistakes: [
'Inconsistent enrollment data',
'Incomplete faculty profiles',
'Missing learning outcome assessments'
],
templates: [
{ name: 'Student Satisfaction Survey Template', format: 'XLSX' },
{ name: 'Learning Outcome Assessment Format', format: 'DOCX' }
]
},
{
id: 3,
title: 'Criteria 3: Research, Innovations and Extension',
requiredData: [
'Research publication metrics',
'Innovation ecosystem details',
'Extension activities documentation'
],
documents: [
'Research paper citations',
'Patent documentation',
'Extension activity reports'
],
mistakes: [
'Duplicate research entries',
'Incomplete citation information',
'Missing extension activity evidence'
],
templates: [
{ name: 'Research Publication Template', format: 'XLSX' },
{ name: 'Extension Activity Report Format', format: 'DOCX' }
]
},
{
id: 4,
title: 'Criteria 4: Infrastructure and Learning Resources',
requiredData: [
'Physical facility metrics',
'Library resource details',
'IT infrastructure documentation'
],
documents: [
'Infrastructure photographs',
'Library acquisition records',
'IT facility usage statistics'
],
mistakes: [
'Outdated infrastructure data',
'Incomplete library records',
'Missing IT facility documentation'
],
templates: [
{ name: 'Infrastructure Documentation Template', format: 'XLSX' },
{ name: 'Library Resources Format', format: 'DOCX' }
]
},
{
id: 5,
title: 'Criteria 5: Student Support and Progression',
requiredData: [
'Student support metrics',
'Student progression details',
'Student participation documentation'
],
documents: [
'Scholarship disbursement records',
'Placement statistics',
'Student achievement evidence'
],
mistakes: [
'Incomplete scholarship data',
'Missing progression evidence',
'Inconsistent achievement records'
],
templates: [
{ name: 'Student Progression Template', format: 'XLSX' },
{ name: 'Scholarship Documentation Format', format: 'DOCX' }
]
},
{
id: 6,
title: 'Criteria 6: Governance, Leadership and Management',
requiredData: [
'Institutional vision metrics',
'Strategy development details',
'Faculty empowerment documentation'
],
documents: [
'E-governance implementation records',
'Faculty development program reports',
'Institutional quality assurance initiatives'
],
mistakes: [
'Incomplete governance documentation',
'Missing faculty development evidence',
'Inconsistent quality assurance data'
],
templates: [
{ name: 'Governance Documentation Template', format: 'XLSX' },
{ name: 'Faculty Development Report Format', format: 'DOCX' }
]
},
{
id: 7,
title: 'Criteria 7: Institutional Values and Best Practices',
requiredData: [
'Gender equity promotion metrics',
'Environmental consciousness details',
'Best practices documentation'
],
documents: [
'Gender sensitization program reports',
'Green campus initiative evidence',
'Best practice implementation records'
],
mistakes: [
'Incomplete best practice documentation',
'Missing environmental initiative evidence',
'Inconsistent gender equity data'
],
templates: [
{ name: 'Best Practices Documentation Template', format: 'XLSX' },
{ name: 'Environmental Initiative Report Format', format: 'DOCX' }
]
}
];
const faqs = [
{
id: 1,
question: 'How do I reset my password if I forget it?',
answer: 'Click on the "Forgot Password" link on the login page. Enter your registered email address, and you will receive a password reset link. Follow the instructions in the email to create a new password.'
},
{
id: 2,
question: 'What file formats are accepted for document uploads?',
answer: 'The system accepts PDF, DOCX, XLSX, JPG, and PNG formats. For best results, we recommend using PDF for text documents, XLSX for data spreadsheets, and JPG/PNG for images. Maximum file size is 10MB per upload.'
},
{
id: 3,
question: 'How can I track my criteria submission progress?',
answer: 'Your dashboard displays a progress tracker for each criteria. Completed sections are marked in green, partially completed in yellow, and pending sections in gray. Click on any criteria to see detailed completion status.'
},
{
id: 4,
question: 'What should I do if I encounter an error during data submission?',
answer: 'First, take a screenshot of the error message. Then, check your data for any formatting issues or required fields that might be missing. If the problem persists, contact support through the "Contact Support" section with the error details.'
},
{
id: 5,
question: 'Can I save my progress and continue later?',
answer: 'Yes, the system automatically saves your progress as you work. You can click the "Save Draft" button at any time to manually save your current progress. When you log back in, you can continue from where you left off.'
},
{
id: 6,
question: 'How do I know if my submission is complete?',
answer: 'After completing all required fields and uploading necessary documents, click the "Review Submission" button. The system will check for any missing information. If everything is complete, you\'ll see a confirmation message and can proceed to final submission.'
},
{
id: 7,
question: 'Can I edit my submission after it\'s been submitted?',
answer: 'Once a criteria is fully submitted, you cannot edit it directly. If you need to make changes, you must contact your institution\'s NAAC coordinator who can request an unlock for that specific criteria section.'
},
{
id: 8,
question: 'What happens if I miss the submission deadline?',
answer: 'The system automatically closes access to data entry after the deadline. If you have extenuating circumstances, your institution\'s NAAC coordinator can request a deadline extension through the administrative portal.'
}
];
const videoTutorials = [
{
id: 1,
title: 'Getting Started with NAAC DVV System',
duration: '5:23',
thumbnail: 'https://readdy.ai/api/search-image?query=Professional%20educational%20video%20thumbnail%20showing%20a%20computer%20screen%20with%20data%20entry%20form%20and%20a%20person%20pointing%20at%20important%20fields%2C%20clean%20modern%20interface%2C%20blue%20accent%20colors%2C%20educational%20technology%20concept&width=400&height=225&seq=1&orientation=landscape',
description: 'Learn the basics of navigating the NAAC DVV system and understanding the dashboard.'
},
{
id: 2,
title: 'How to Upload Documents Correctly',
duration: '4:17',
thumbnail: 'https://readdy.ai/api/search-image?query=Educational%20tutorial%20thumbnail%20showing%20document%20upload%20process%20with%20file%20icons%20and%20progress%20bar%2C%20clean%20modern%20interface%20with%20blue%20accent%20colors%2C%20professional%20looking%20screenshot%20of%20upload%20interface&width=400&height=225&seq=2&orientation=landscape',
description: 'Step-by-step guide on uploading various document types and ensuring they meet requirements.'
},
{
id: 3,
title: 'Completing Criteria 1 Submission',
duration: '8:45',
thumbnail: 'https://readdy.ai/api/search-image?query=Educational%20video%20thumbnail%20showing%20data%20entry%20form%20with%20curriculum%20details%20being%20filled%2C%20professional%20clean%20interface%20with%20blue%20accent%20colors%2C%20educational%20technology%20concept%20with%20form%20fields%20visible&width=400&height=225&seq=3&orientation=landscape',
description: 'Detailed walkthrough of all requirements for Criteria 1 submission.'
},
{
id: 4,
title: 'Understanding Data Validation Process',
duration: '6:32',
thumbnail: 'https://readdy.ai/api/search-image?query=Educational%20technology%20thumbnail%20showing%20data%20validation%20process%20with%20checkmarks%20and%20error%20indicators%2C%20professional%20clean%20interface%20with%20blue%20accent%20colors%2C%20dashboard%20with%20validation%20results%20and%20statistics&width=400&height=225&seq=4&orientation=landscape',
description: 'Learn how the DVV validation process works and how to respond to queries.'
},
{
id: 5,
title: 'Troubleshooting Common Issues',
duration: '7:19',
thumbnail: 'https://readdy.ai/api/search-image?query=Educational%20tutorial%20thumbnail%20showing%20error%20messages%20and%20troubleshooting%20steps%2C%20professional%20clean%20interface%20with%20blue%20accent%20colors%2C%20problem-solving%20concept%20with%20warning%20symbols%20and%20resolution%20steps&width=400&height=225&seq=5&orientation=landscape',
description: 'Solutions for the most common problems faced during data submission.'
},
{
id: 6,
title: 'Best Practices for Document Organization',
duration: '5:51',
thumbnail: 'https://readdy.ai/api/search-image?query=Educational%20video%20thumbnail%20showing%20organized%20document%20folders%20and%20filing%20system%2C%20professional%20clean%20interface%20with%20blue%20accent%20colors%2C%20document%20management%20concept%20with%20labeled%20folders%20and%20organization%20structure&width=400&height=225&seq=6&orientation=landscape',
description: 'Tips and tricks for organizing your documents before uploading to the system.'
}
];
const getStartedSteps = [
{
icon: 'FaSignInAlt',
title: 'Login & Authentication',
description: 'Access the system using your institutional email and password. First-time users should complete profile setup.'
},
{
icon: 'FaTachometerAlt',
title: 'Navigate Dashboard',
description: 'Familiarize yourself with the dashboard layout, criteria sections, and progress indicators.'
},
{
icon: 'FaEdit',
title: 'Begin Data Entry',
description: 'Select a criteria to start working on. Follow the guided process to enter data and upload documents.'
}
];
const navItems = [
    { icon: 'FaTachometerAlt', text: 'Dashboard', path: '/dashboard' },
    
    { icon: 'FaFileAlt', text: 'Data Entry Forms', path: '/criteria1.1.1' },
   
    { icon: 'FaQuestionCircle', text: 'Help and Support' , path: '/helpsupport'},
  
    { icon: 'FaSignOutAlt', text: 'Logout', path: '/logout' },
  ];

return (

    <div className="flex min-h-screen w-[1520px] bg-gray-50">
          {/* Sidebar */}
         <div className={`flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
                 <Sidebar 
                   navItems={navItems} 
                   collapsed={collapsed} 
                   setCollapsed={setCollapsed} 
                   navigate={navigate} 
                 />
               </div> 
    
          <div className="flex-1 overflow-auto">
            <nav className="mt-4 space-y-1">
              {navItems.map(({ icon, text,path }) => (
                <div key={text} 
                onClick={() => navigate(path)}
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white">
                  
                  {!collapsed && <span className="ml-2">{text}</span>}
                </div>
              ))}
            </nav>
          </div>
{/* Header */}
<div className={`${collapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
<header className="bg-white shadow-sm">
<div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
<div className="flex flex-col md:flex-row md:items-center md:justify-between">
<div>
<h1 className="text-3xl font-bold text-gray-900">Help & Support Center</h1>
<p className="mt-1 text-sm text-gray-500">
Welcome to the NAAC DVV System support portal. Find guidance, tutorials, and assistance for faculty members.
</p>
</div>
<div className="mt-4 md:mt-0">
<div className="relative">
<input
type="text"
placeholder="Search for help topics..."
className="w-full md:w-64 pl-10 pr-4 py-2 text-gray-950 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
/>
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<FaSearch className=" text-gray-400"/>
</div>
</div>
</div>
</div>
<div className="mt-4">
<nav className="flex" aria-label="Breadcrumb">
<ol className="flex items-center space-x-2">
<li>
<a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Home</a>
</li>
<li className="flex items-center">
<i className="fas fa-chevron-right text-gray-400 text-xs mx-1"></i>
<span className="text-blue-600 text-sm">Help & Support</span>
</li>
</ol>
</nav>
</div>
</div>
</header>
{/* Tab Navigation */}
<div className="bg-white shadow-sm border-b">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<nav className="flex overflow-x-auto py-2">
{tabs.map(tab => (
<button
key={tab.id}
onClick={() => setActiveTab(tab.id)}
className={`whitespace-nowrap px-4 py-2 font-medium text-sm rounded-lg mr-2 cursor-pointer !rounded-button ${
activeTab === tab.id
? '!bg-blue-100 text-blue-700'
: 'text-gray-600 !bg-white hover:!bg-gray-100'
}`}
>
{tab.name}
</button>
))}
</nav>
</div>
</div>
{/* Main Content */}
<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
{/* Getting Started */}
{activeTab === 0 && (
<div className="bg-white rounded-lg shadow-sm p-6">
<h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started Guide</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{getStartedSteps.map((step, index) => (
<div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
<div className="flex items-center mb-4">
<div className="!bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center mr-4">
<step.icon className="text-xl" />
</div>
<h3 className="text-lg font-semibold">{step.title}</h3>
</div>
<p className="text-gray-600 mb-4">{step.description}</p>
<a href="#" className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center cursor-pointer">
Learn More <i className="fas fa-arrow-right ml-1"></i>
</a>
</div>
))}
</div>
<div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-6">
<h3 className="text-lg font-semibold text-blue-800 mb-4">Important System Requirements</h3>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="flex items-start">
<div className="flex-shrink-0 mt-1">
<i className="fas fa-check-circle text-green-500"></i>
</div>
<div className="ml-3">
<p className="text-gray-700">Use modern browsers like Chrome, Firefox, or Edge for optimal experience</p>
</div>
</div>
<div className="flex items-start">
<div className="flex-shrink-0 mt-1">
<i className="fas fa-check-circle text-green-500"></i>
</div>
<div className="ml-3">
<p className="text-gray-700">Enable JavaScript and cookies for all system features</p>
</div>
</div>
<div className="flex items-start">
<div className="flex-shrink-0 mt-1">
<i className="fas fa-check-circle text-green-500"></i>
</div>
<div className="ml-3">
<p className="text-gray-700">Minimum screen resolution of 1280×720 recommended</p>
</div>
</div>
<div className="flex items-start">
<div className="flex-shrink-0 mt-1">
<i className="fas fa-check-circle text-green-500"></i>
</div>
<div className="ml-3">
<p className="text-gray-700">Stable internet connection for document uploads</p>
</div>
</div>
</div>
</div>

</div>
)}
{/* Criteria Help */}
{activeTab === 1 && (
<div className="bg-white rounded-lg shadow-sm p-6">
<h2 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Help for Each Criteria</h2>
<p className="text-gray-600 mb-6">
Expand each criteria section below to view detailed guidance on required data, document uploads, common mistakes, and available templates.
</p>
<div className="space-y-4">
{criteriaData.map((criteria) => (
<div key={criteria.id} className="border border-gray-200 rounded-lg overflow-hidden">
<button
onClick={() => setActiveCriteria(activeCriteria === criteria.id ? null : criteria.id)}
className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer !rounded-button whitespace-nowrap"
>
<span className="font-medium text-gray-900">{criteria.title}</span>
<i className={`fas ${activeCriteria === criteria.id ? 'fa-chevron-up' : 'fa-chevron-down'} text-gray-500`}></i>
</button>
{activeCriteria === criteria.id && (
<div className="p-4 bg-white">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
<i className="fas fa-clipboard-list text-blue-600 mr-2"></i>
Required Data
</h3>
<ul className="space-y-2">
{criteria.requiredData.map((item, index) => (
<li key={index} className="flex items-start">
<i className="fas fa-check text-green-500 mt-1 mr-2"></i>
<span className="text-gray-700">{item}</span>
</li>
))}
</ul>
</div>
<div>
<h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
<i className="fas fa-file-upload text-blue-600 mr-2"></i>
Documents to Upload
</h3>
<ul className="space-y-2">
{criteria.documents.map((item, index) => (
<li key={index} className="flex items-start">
<i className="fas fa-file-pdf text-red-500 mt-1 mr-2"></i>
<span className="text-gray-700">{item}</span>
</li>
))}
</ul>
</div>
</div>
<div className="mt-6">
<h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
<i className="fas fa-exclamation-triangle text-amber-500 mr-2"></i>
Common Mistakes to Avoid
</h3>
<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
<ul className="space-y-2">
{criteria.mistakes.map((item, index) => (
<li key={index} className="flex items-start">
<i className="fas fa-times-circle text-amber-500 mt-1 mr-2"></i>
<span className="text-gray-700">{item}</span>
</li>
))}
</ul>
</div>
</div>
<div className="mt-6">
<h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
<i className="fas fa-download text-blue-600 mr-2"></i>
Sample Templates
</h3>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
{criteria.templates.map((template, index) => (
<div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
<i className={`fas ${template.format === 'XLSX' ? 'fa-file-excel text-green-600' : 'fa-file-word text-blue-600'} mr-3 text-lg`}></i>
<div>
<p className="text-sm font-medium text-gray-900">{template.name}</p>
<p className="text-xs text-gray-500">{template.format} format</p>
</div>
<button className="ml-auto bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer !rounded-button whitespace-nowrap">
Download
</button>
</div>
))}
</div>
</div>
</div>
)}
</div>
))}
</div>
</div>
)}
{/* FAQs */}
{activeTab === 2 && (
<div className="bg-white rounded-lg shadow-sm p-6">
<h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
<p className="text-gray-600 mb-6">
Find answers to common questions about using the NAAC DVV system for data entry and document submission.
</p>
<div className="space-y-4">
{faqs.map((faq) => (
<div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
<button
onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 cursor-pointer !rounded-button whitespace-nowrap"
>
<span className="font-medium text-gray-900">{faq.question}</span>
<i className={`fas ${activeFaq === faq.id ? 'fa-chevron-up' : 'fa-chevron-down'} text-gray-500`}></i>
</button>
{activeFaq === faq.id && (
<div className="p-4 bg-white">
<p className="text-gray-700">{faq.answer}</p>
</div>
)}
</div>
))}
</div>
<div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-6">
<h3 className="text-lg font-semibold text-blue-800 mb-4">Still Have Questions?</h3>
<p className="text-gray-700 mb-4">
If you couldn't find the answer to your question, please reach out to our support team using the Contact Support section.
</p>
<button
onClick={() => setActiveTab(4)}
className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer !rounded-button whitespace-nowrap"
>
Contact Support
</button>
</div>
</div>
)}
{/* Video Tutorials */}
{activeTab === 3 && (
<div className="bg-white rounded-lg shadow-sm p-6">
<h2 className="text-2xl font-bold text-gray-900 mb-6">Video Tutorials</h2>
<p className="text-gray-600 mb-6">
Watch step-by-step video guides to help you navigate the NAAC DVV system and complete your submissions effectively.
</p>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{videoTutorials.map((video) => (
<div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
<div className="relative">
<img
src={video.thumbnail}
alt={video.title}
className="w-full h-48 object-cover"
/>
<div className="absolute inset-0 flex items-center justify-center">
<div className="bg-blue-600 bg-opacity-80 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer">
<i className="fas fa-play text-white"></i>
</div>
</div>
<div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
{video.duration}
</div>
</div>
<div className="p-4">
<h3 className="font-medium text-gray-900 mb-2">{video.title}</h3>
<p className="text-gray-600 text-sm">{video.description}</p>
</div>
</div>
))}
</div>
<div className="mt-8 text-center">
<button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer !rounded-button whitespace-nowrap">
View All Tutorials
</button>
</div>
</div>
)}
{/* Contact Support */}
{activeTab === 4 && (
<div className="bg-white rounded-lg shadow-sm p-6">
<h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Support</h2>
<p className="text-gray-600 mb-6">
Need help with something specific? Fill out the form below to get assistance from our support team.
</p>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
<div className="lg:col-span-2">
{isSubmitted ? (
<div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
<div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
<i className="fas fa-check text-green-600 text-xl"></i>
</div>
<h3 className="text-lg font-medium text-green-800 mb-2">Query Submitted Successfully</h3>
<p className="text-green-700">
Thank you for reaching out. Our support team will respond to your query within 24 hours.
</p>
</div>
) : (
<form onSubmit={handleSubmit} className="space-y-6">
<div>
<label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
Issue Category
</label>
<select
id="category"
name="category"
value={formData.category}
onChange={handleFormChange}
className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
required
>
<option value="">Select a category</option>
<option value="login">Login & Authentication</option>
<option value="upload">Document Upload Issues</option>
<option value="data">Data Entry Problems</option>
<option value="criteria">Criteria Specific Questions</option>
<option value="technical">Technical Difficulties</option>
<option value="other">Other</option>
</select>
</div>
<div>
<label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
Subject
</label>
<input
type="text"
id="subject"
name="subject"
value={formData.subject}
onChange={handleFormChange}
placeholder="Brief description of your issue"
className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
required
/>
</div>
<div>
<label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
Message
</label>
<textarea
id="message"
name="message"
value={formData.message}
onChange={handleFormChange}
rows={5}
placeholder="Please provide details about your issue or question"
className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
required
></textarea>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">
Attachments (Optional)
</label>
<div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
<i className="fas fa-cloud-upload-alt text-gray-400 text-2xl mb-2"></i>
<p className="text-sm text-gray-500 mb-1">Drag and drop files here, or click to browse</p>
<p className="text-xs text-gray-400">Maximum file size: 10MB (PDF, DOCX, JPG, PNG)</p>
<input type="file" className="hidden" />
<button type="button" className="mt-2 text-blue-600 text-sm font-medium cursor-pointer !rounded-button whitespace-nowrap">
Browse Files
</button>
</div>
</div>
<div>
<button
type="submit"
className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer !rounded-button whitespace-nowrap"
>
Submit Query
</button>
</div>
</form>
)}
</div>
<div className="lg:col-span-1">
<div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
<h3 className="text-lg font-medium text-gray-900 mb-4">Support Hours</h3>
<div className="space-y-3">
<div className="flex justify-between">
<span className="text-gray-600">Monday - Friday:</span>
<span className="text-gray-900 font-medium">9:00 AM - 6:00 PM</span>
</div>
<div className="flex justify-between">
<span className="text-gray-600">Saturday:</span>
<span className="text-gray-900 font-medium">10:00 AM - 2:00 PM</span>
</div>
<div className="flex justify-between">
<span className="text-gray-600">Sunday:</span>
<span className="text-gray-900 font-medium">Closed</span>
</div>
</div>
<hr className="my-4 border-gray-200" />
<h3 className="text-lg font-medium text-gray-900 mb-4">Alternative Contact</h3>
<div className="space-y-3">
<div className="flex items-start">
<i className="fas fa-envelope text-blue-600 mt-1 mr-3"></i>
<div>
<p className="text-gray-900 font-medium">Email Support</p>
<p className="text-gray-600 text-sm">naac.support@university.edu</p>
</div>
</div>
<div className="flex items-start">
<i className="fas fa-phone-alt text-blue-600 mt-1 mr-3"></i>
<div>
<p className="text-gray-900 font-medium">Phone Support</p>
<p className="text-gray-600 text-sm">+91 123-456-7890</p>
</div>
</div>
</div>
<hr className="my-4 border-gray-200" />
<h3 className="text-lg font-medium text-gray-900 mb-4">Response Time</h3>
<p className="text-gray-600 text-sm">
We aim to respond to all queries within 24 hours during business days. For urgent matters, please contact phone support.
</p>
</div>
</div>
</div>
</div>
)}
</main>
{/* Footer */}
<footer className="bg-gray-800 text-white py-8">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
<div>
<h3 className="text-lg font-semibold mb-4">NAAC DVV System</h3>
<p className="text-gray-300 text-sm">
A comprehensive platform for faculty members to submit and manage data for NAAC accreditation.
</p>
</div>
<div>
<h3 className="text-lg font-semibold mb-4">Quick Links</h3>
<ul className="space-y-2">
<li><a href="#" className="text-gray-300 hover:text-white text-sm">User Manual</a></li>
<li><a href="#" className="text-gray-300 hover:text-white text-sm">Video Tutorials</a></li>
<li><a href="#" className="text-gray-300 hover:text-white text-sm">FAQs</a></li>
<li><a href="#" className="text-gray-300 hover:text-white text-sm">Contact Support</a></li>
</ul>
</div>
<div>
<h3 className="text-lg font-semibold mb-4">Legal</h3>
<ul className="space-y-2">
<li><a href="#" className="text-gray-300 hover:text-white text-sm">Privacy Policy</a></li>
<li><a href="#" className="text-gray-300 hover:text-white text-sm">Terms of Service</a></li>
<li><a href="#" className="text-gray-300 hover:text-white text-sm">Data Security</a></li>
</ul>
</div>
</div>
<div className="mt-8 pt-6 border-t border-gray-700 text-center">
<p className="text-gray-300 text-sm">
© {new Date().getFullYear()} NAAC DVV System. All rights reserved.
</p>
</div>
</div>
</footer>
</div>
</div>

);
};
export default HelpSupport;
