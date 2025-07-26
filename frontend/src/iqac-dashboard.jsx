
import React, { useState, useEffect } from 'react';
import { SessionContext } from './contextprovider/sessioncontext.jsx';
import { useContext } from 'react';
import * as echarts from 'echarts';
import { Search, Users, Building2, Shield, BarChart3, FileText, Upload, Settings, Edit, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaFileAlt, FaChartLine, FaPaperPlane, FaDownload, FaQuestionCircle, FaCog, FaSignOutAlt, FaArrowLeft, FaArrowRight, FaBell, FaUser } from 'react-icons/fa';

const IqacDashboard= () => {
  const [currentDate] = useState(new Date('2025-06-25'));
  const [collapsed, setCollapsed] = useState(false);
  const { desiredGrade } = useContext(SessionContext);

  const navigate = useNavigate();

 const navItems = [
      { icon: FaTachometerAlt , text: 'Dashboard', path: '/iqac-dashboard' },
      { icon: FaUsers , text: 'User Management', path: '/user-management' },
      { icon: FaFileAlt , text: 'Data Entry Forms', path: '/iiqa' },
      { icon: FaChartLine , text: 'GPA Analysis', path: '/gpa-analysis' },
      { icon: FaPaperPlane , text: 'Final Submission', path: '/final-submission' },
      { icon: FaDownload , text: 'Download Report', path: '/download-report' },
      { icon:FaQuestionCircle , text: 'Help and Support', path: '/helpsupport' },
      { icon: FaCog, text: 'Configuration', path: '/configuration' },
      { icon: FaSignOutAlt , text: 'Logout', path: '/logout' }
    ];

  useEffect(() => {
    // GPA Visuals Chart
    const gpaChart = echarts.init(document.getElementById('gpa-chart'));
    const gpaOption = {
      animation: false,
      radar: {
        indicator: [
          { name: 'Criterion 1', max: 100 },
          { name: 'Criterion 2', max: 100 },
          { name: 'Criterion 3', max: 100 },
          { name: 'Criterion 4', max: 100 },
          { name: 'Criterion 5', max: 100 }
        ],
        radius: '65%',
        splitNumber: 4,
        axisName: { color: '#666', fontSize: 12 },
        splitArea: { areaStyle: { color: ['#f8f9fa', '#f1f3f5', '#e9ecef', '#dee2e6'] } }
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: [62, 70, 52, 58, 65],
              name: 'Current Score',
              itemStyle: { color: '#3b82f6' },
              areaStyle: { color: 'rgba(59, 130, 246, 0.2)' },
              lineStyle: { color: '#3b82f6', width: 2 }
            },
            {
              value: [90, 85, 75, 80, 85],
              name: 'Target Score',
              itemStyle: { color: '#9ca3af' },
              areaStyle: { color: 'rgba(156, 163, 175, 0.2)' },
              lineStyle: { color: '#9ca3af', width: 2 }
            }
          ]
        }
      ]
    };
    gpaChart.setOption(gpaOption);

    // Monthly Progress Chart
    const progressChart = echarts.init(document.getElementById('progress-chart'));
    const progressOption = {
      animation: false,
      grid: { left: '3%', right: '4%', bottom: '10%', top: '5%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        axisLine: { lineStyle: { color: '#e5e7eb' } }
      },
      yAxis: {
        type: 'value',
        max: 1000,
        splitLine: { lineStyle: { color: '#e5e7eb' } }
      },
      series: [
        {
          data: [200, 350, 400, 480, 550, 650, 720, 800, 850, 920],
          type: 'line',
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: { color: '#3b82f6' },
          lineStyle: { color: '#3b82f6', width: 3 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.2)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0.01)' }
              ]
            }
          }
        }
      ]
    };
    progressChart.setOption(progressOption);

    const handleResize = () => {
      gpaChart.resize();
      progressChart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      gpaChart.dispose();
      progressChart.dispose();
    };
  }, []);

  const sidebarItems = [
    { icon: BarChart3, label: 'Dashboard', active: false },
    { icon: Users, label: 'User Management', active: true },
    { icon: Building2, label: 'Departments', active: false },
    { icon: FileText, label: 'DVV Criteria', active: false },
    { icon: Upload, label: 'Submissions', active: false },
    { icon: BarChart3, label: 'Reports', active: false },
    { icon: Settings, label: 'Settings', active: false }
  ];

  return (
    <div className="flex min-h-screen w-[1520px] bg-gray-50">
      {/* Sidebar */}
     <div className={`h-screen bg-gray-900 text-white flex flex-col fixed top-0 left-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
              <div className="flex justify-between items-center p-4 border-b border-gray-800">
                 {!collapsed && <span className="font-bold text-xl">NAAC</span>}
                 <button onClick={() => setCollapsed(!collapsed)} className="focus:outline-none text-gray-300 !bg-gray-800 hover:text-white">
                   {collapsed ? <FaArrowRight className=""/> : <FaArrowLeft className=""/>}
                 </button>
               </div> 
         
               <div className="flex-1 overflow-auto">
                 <nav className="mt-4 space-y-1">
                   {navItems.map(({ icon:Icon, text,path }) => (
                     <div key={text} 
                     onClick={() => navigate(path)}
                     className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white">
                       <Icon/>
                       {!collapsed && <span className="ml-2">{text}</span>}
                     </div>
                   ))}
                 </nav>
               </div></div>
         

      {/* Main Content */}
       <div className={`transition-all duration-300 w-[1520px] ${collapsed ? 'ml-18' : 'ml-64'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center h-[50px] w-[350px] shadow border  border-black/10 rounded-2xl">
              <a href="#" className="text-gray-500 hover:text-gray-700 mr-2">
                <i className="fas fa-arrow-left"></i>
              </a>
              <p className="text-2xl font-bold text-gray-800">IQAC Supervisor Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative cursor-pointer">
                <FaBell className=" text-gray-600 text-xl"/>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">1</span>
              </div>
              <div className="cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                  <FaUser className=""/>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mb-6 ">
            <h2 className="text-lg font-medium text-gray-800">Welcome, John Smith</h2>
            <p className="text-sm text-gray-600">Your NAAC accreditation progress is on track, keep up the good work!</p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Projected Grade', value: 'A', color: 'text-blue-600', sub: 'Based on current progress' },
              { label: 'Desired Grade', value: desiredGrade || 'A', color: 'text-amber-500', sub: 'Target accreditation level' },
              { label: 'Criteria Lacking', value: '4', color: 'text-red-500', sub: 'Need immediate attention' },
              { label: 'Next Deadline', value: 'Jun 15', color: 'text-gray-800', sub: '10 days remaining' }
            ].map(({ label, value, color, sub }) => (
              <div key={label} className="bg-white rounded-lg shadow p-5">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{label}</h3>
                <div className="flex items-end">
                  <div className={`text-4xl font-bold ${color}`}>{value}</div>
                  <div className="ml-3 text-xs text-gray-500">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* GPA Visuals */}
            <div className="bg-white rounded-lg shadow p-5">
              <h3 className="text-sm font-medium text-gray-700 mb-4">GPA Visuals</h3>
              <div id="gpa-chart" className="w-full h-64"></div>
              <div className="flex justify-center mt-4 text-xs text-gray-500 space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-sm mr-2"></div>
                  <span>Current Score</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-sm mr-2"></div>
                  <span>Target Score</span>
                </div>
              </div>
            </div>

            {/* Monthly Progress */}
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-700">Monthly Progress</h3>
                <span className="text-xs text-gray-500">Last 30 Days</span>
              </div>
              <div id="progress-chart" className="w-full h-64"></div>
              <div className="flex justify-end mt-2 text-xs">
                <div className="flex items-center text-blue-600">
                  <span>Rows Filled:</span>
                  <span className="ml-2 font-semibold">430</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-5 mb-8">
<h3 className="text-sm font-medium text-gray-700 mb-4">Action Required Section</h3>
{/* High Priority Item */}
<div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r mb-4">
<div className="flex items-start">
<div className="flex-shrink-0 mr-3">
<i className="fas fa-exclamation-circle text-red-500"></i>
</div>
<div className="flex-1">
<div className="font-medium text-red-800">High Priority: Criterion 2.5 missing data</div>
<div className="text-sm text-red-700">Assigned to Dr. Smith</div>
<div className="text-xs text-red-600 mt-1">Due: Jun 12, 2025</div>
</div>
</div>
</div>
{/* Medium Priority Item */}
<div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r mb-4">
<div className="flex items-start">
<div className="flex-shrink-0 mr-3">
<i className="fas fa-exclamation-triangle text-amber-500"></i>
</div>
<div className="flex-1">
<div className="font-medium text-amber-800">Medium Priority: Criterion 3.2 needs review</div>
<div className="text-sm text-amber-700">Assigned to Prof. Williams</div>
<div className="text-xs text-amber-600 mt-1">Due: Jun 20, 2025</div>
</div>
</div>
</div>
{/* Informational Item */}
<div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r mb-4">
<div className="flex items-start">
<div className="flex-shrink-0 mr-3">
<i className="fas fa-info-circle text-blue-500"></i>
</div>
<div className="flex-1">
<div className="font-medium text-blue-800">Informational: Criterion 5.1.2 data updated</div>
<div className="text-sm text-blue-700">Data file awaiting final review</div>
<div className="text-xs text-blue-600 mt-1">Updated: Jun 8, 2025</div>
</div>
</div>
</div>
{/* Completed Item */}
<div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r mb-4">
<div className="flex items-start">
<div className="flex-shrink-0 mr-3">
<i className="fas fa-check-circle text-green-500"></i>
</div>
<div className="flex-1">
<div className="font-medium text-green-800">Completed: Criterion 1.1.1 approved</div>
<div className="text-sm text-green-700">Approved by Principal</div>
<div className="text-xs text-green-600 mt-1">Completed: Jun 5, 2025</div>
</div>
</div>
</div>
{/* Medium Priority Item 2 */}
<div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r">
<div className="flex items-start">
<div className="flex-shrink-0 mr-3">
<i className="fas fa-exclamation-triangle text-amber-500"></i>
</div>
<div className="flex-1">
<div className="font-medium text-amber-800">Medium Priority: Criterion 7.1.2 data inconsistent</div>
<div className="text-sm text-amber-700">Assigned to Dr. Anthony</div>
<div className="text-xs text-amber-600 mt-1">Due: Jun 18, 2025</div>
</div>
</div>
</div>
</div>

<div className="bg-white rounded-lg shadow p-5 mb-8">
<h3 className="text-sm font-medium text-gray-700 mb-4">Feedback Summary</h3>
<div className="space-y-4">
<div className="flex items-center justify-between">
<div className="flex items-center">
<span className="h-3 w-3 rounded-full bg-red-500 mr-3"></span>
<span className="text-gray-700">Criterion 2.5: data reliability</span>
</div>
<span className="text-xs font-medium text-red-600">Needs Attention</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center">
<span className="h-3 w-3 rounded-full bg-amber-500 mr-3"></span>
<span className="text-gray-700">Criterion 4.2: needs clarification</span>
</div>
<span className="text-xs font-medium text-amber-600">In Progress</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center">
<span className="h-3 w-3 rounded-full bg-blue-500 mr-3"></span>
<span className="text-gray-700">Criterion 3.1: requires evidence</span>
</div>
<span className="text-xs font-medium text-blue-600">Under Review</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center">
<span className="h-3 w-3 rounded-full bg-red-500 mr-3"></span>
<span className="text-gray-700">Criterion 6.1: data missing</span>
</div>
<span className="text-xs font-medium text-red-600">Needs Attention</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center">
<span className="h-3 w-3 rounded-full bg-green-500 mr-3"></span>
<span className="text-gray-700">General feedback on data formatting</span>
</div>
<span className="text-xs font-medium text-green-600">Addressed</span>
</div>
</div>
</div>
{/* SSR Download & Submission Panel */}
<div className="bg-white rounded-lg shadow p-5 mb-8">
<h3 className="text-sm font-medium text-gray-700 mb-4">SSR Download & Submission Panel</h3>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<button className="flex items-center justify-center !bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition duration-150 ease-in-out !rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-history mr-2"></i>
View History
</button>
<button className="flex items-center justify-center !bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition duration-150 ease-in-out !rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-cloud-download-alt mr-2"></i>
Review/Download Submission
</button>
<button className="flex items-center justify-center !bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition duration-150 ease-in-out !rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-check-circle mr-2"></i>
Final Grade Submission
</button>
</div>
</div>
{/* Footer */}
<div className="text-center text-xs text-gray-500 mt-8 mb-4">
<div className="flex justify-end items-center">

</div>
</div>
</div>

        </div>
      </div>
    
  );
};

export default IqacDashboard;
