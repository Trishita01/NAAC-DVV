import React, { useState, useEffect } from 'react';
import { SessionContext } from './contextprovider/sessioncontext.jsx';
import { useContext } from 'react';
import * as echarts from 'echarts';
import { Search, Users, Building2, Shield, BarChart3, FileText, Upload, Settings, Edit, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaFileAlt, FaChartLine, FaPaperPlane, FaDownload, FaQuestionCircle, FaCog, FaSignOutAlt, FaArrowLeft, FaArrowRight, FaBell, FaUser } from 'react-icons/fa';

const GPAAnalysis = () => {
  const [currentDate] = useState(new Date('2025-06-25'));
  const [collapsed, setCollapsed] = useState(false);
  const { desiredGrade } = useContext(SessionContext);
  const [gpaData, setGpaData] = useState({
    overall: 0,
    departments: [],
    courses: [],
    trends: []
  });
  const navigate = useNavigate();

  const navItems = [
    { icon: FaTachometerAlt, text: 'Dashboard', path: '/iqac-dashboard' },
    { icon: FaUsers, text: 'User Management', path: '/user-management' },
    { icon: FaFileAlt, text: 'Data Entry Forms', path: '/iiqa' },
    { icon: FaChartLine, text: 'GPA Analysis', path: '/gpa-analysis' },
    { icon: FaQuestionCircle, text: 'Help and Support', path: '/helpsupport' },
    { icon: FaCog, text: 'Configuration', path: '/configuration' },
    { icon: FaSignOutAlt, text: 'Logout', path: '/logout' }
  ];

  useEffect(() => {
    // Initialize GPA Analysis charts
    initializeGpaCharts();
  }, []);

  const initializeGpaCharts = () => {
    // GPA Distribution Chart
    const gpaDistChart = echarts.init(document.getElementById('gpa-dist-chart'));
    const gpaDistOption = {
      title: {
        text: 'GPA Distribution',
        left: 'center'
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: ['0-2.0', '2.1-4.0', '4.1-6.0', '6.1-8.0', '8.1-10.0']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [8, 34, 65, 78, 56],
        type: 'bar'
      }]
    };
    gpaDistChart.setOption(gpaDistOption);

    // Department-wise GPA Chart
    const deptGpaChart = echarts.init(document.getElementById('dept-gpa-chart'));
    const deptGpaOption = {
      title: {
        text: 'Department-wise GPA',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%'
      },
      series: [
        {
          name: 'GPA',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 335, name: 'CSE' },
            { value: 310, name: 'ECE' },
            { value: 234, name: 'MECH' },
            { value: 135, name: 'CIVIL' }
          ]
        }
      ]
    };
    deptGpaChart.setOption(deptGpaOption);

    // Course-wise GPA Trend Chart
    const trendChart = echarts.init(document.getElementById('trend-chart'));
    const trendOption = {
      title: {
        text: 'GPA Trends',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'GPA',
          type: 'line',
          data: [4.5, 4.8, 5.2, 5.5, 5.8, 6.2],
          smooth: true
        }
      ]
    };
    trendChart.setOption(trendOption);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`h-screen bg-gray-900 text-white flex flex-col fixed top-0 left-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          {!collapsed && <span className="font-bold text-xl">NAAC</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="focus:outline-none text-gray-300 hover:text-white">
            {collapsed ? <FaArrowRight /> : <FaArrowLeft />}
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <nav className="mt-4 space-y-1">
            {navItems.map(({ icon: Icon, text, path }) => (
              <div 
                key={text} 
                onClick={() => navigate(path)}
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <Icon />
                {!collapsed && <span className="ml-2">{text}</span>}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="ml-64 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">GPA Analysis Dashboard</h1>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            {collapsed ? <FaArrowRight /> : <FaArrowLeft />}
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Overall GPA</h3>
                <p className="text-2xl font-bold text-green-600">{gpaData.overall.toFixed(2)}</p>
              </div>
              <FaChartLine className="text-2xl text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Highest GPA</h3>
                <p className="text-2xl font-bold text-blue-600">9.85</p>
              </div>
              <FaGraduationCap className="text-2xl text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Lowest GPA</h3>
                <p className="text-2xl font-bold text-yellow-600">4.25</p>
              </div>
              <FaUser className="text-2xl text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Average GPA</h3>
                <p className="text-2xl font-bold text-purple-600">6.85</p>
              </div>
              <FaBook className="text-2xl text-gray-400" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* GPA Distribution Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">GPA Distribution</h3>
            <div id="gpa-dist-chart" style={{ height: '400px' }}></div>
          </div>

          {/* Department-wise GPA Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Department-wise GPA</h3>
            <div id="dept-gpa-chart" style={{ height: '400px' }}></div>
          </div>

          {/* GPA Trends Chart */}
          <div className="col-span-2 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">GPA Trends</h3>
            <div id="trend-chart" style={{ height: '400px' }}></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GPAAnalysis;
