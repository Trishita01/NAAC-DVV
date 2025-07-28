import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Target, Award, AlertCircle, CheckCircle, BookOpen, Users, Building, Lightbulb, Heart, Briefcase, Globe } from 'lucide-react';
import { FaUser } from 'react-icons/fa';
import { FaTachometerAlt, FaUsers, FaFileAlt, FaChartLine, FaPaperPlane, FaDownload, FaQuestionCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">NAAC DVV System</h1>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-sm text-gray-500 mr-4">
                Academic Year: 2023-24
              </span>
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="flex items-center max-w-xs rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="user-menu-button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaUser className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">Admin</span>
                  </button>
                </div>

                {showUserMenu && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Your Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Settings</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" onClick={() => navigate('/login')}>
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { icon: FaTachometerAlt, text: 'Dashboard', path: '/iqac-dashboard' },
    { icon: FaUsers, text: 'User Management', path: '/user-management' },
    { icon: FaFileAlt, text: 'Data Entry Forms', path: '/iiqa' },
    { icon: FaChartLine, text: 'GPA Analysis', path: '/gpa-analysis' },
    { icon: FaPaperPlane, text: 'Final Submission', path: '/final-submission' },
    { icon: FaDownload, text: 'Download Report', path: '/download-report' },
    { icon: FaQuestionCircle, text: 'Help and Support', path: '/helpsupport' },
    { icon: FaCog, text: 'Configuration', path: '/configuration' },
    { icon: FaSignOutAlt, text: 'Logout', path: '/logout' },
  ];

  return (
    <div className={`bg-gray-900 text-white min-h-screen ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 fixed top-0 left-0 z-10`}>
      <div className="p-4 flex items-center justify-between h-16 border-b border-gray-800">
        {!collapsed && <h1 className="text-xl font-bold text-white">NAAC</h1>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800 focus:outline-none"
        >
          {collapsed ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>
      
      <nav className="mt-4">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <div 
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
                isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              {!collapsed && <span className="ml-3 text-sm font-medium">{item.text}</span>}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

const MetricCard = ({ title, value, grade, trend, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <p className={`text-sm ${color} mt-1`}>{grade}</p>
      </div>
      <div className={`p-3 rounded-lg ${color === 'text-green-600' ? 'bg-green-100' : color === 'text-red-600' ? 'bg-red-100' : 'bg-blue-100'}`}>
        <Icon className={`h-6 w-6 ${color === 'text-green-600' ? 'text-green-600' : color === 'text-red-600' ? 'text-red-600' : 'text-blue-600'}`} />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center">
        {trend > 0 ? (
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {Math.abs(trend)}% from last assessment
        </span>
      </div>
    )}
  </div>
);

const CriteriaCard = ({ criteria, onClick, isActive }) => {
  const icons = {
    1: BookOpen,
    2: Users,
    3: Building,
    4: Lightbulb,
    5: Heart,
    6: Briefcase,
    7: Globe
  };
  
  const Icon = icons[criteria.id] || BookOpen;
  
  return (
    <div 
      className={`w-screen p-4 rounded-lg border cursor-pointer transition-all ${
        isActive 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={() => onClick(criteria)}
    >
      <div className="flex w-screen items-center justify-between mb-3">
        <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
        <span className={`text-sm font-medium px-2 py-1 rounded ${
          criteria.score >= 3.0 ? 'bg-green-100 text-green-800' : 
          criteria.score >= 2.5 ? 'bg-yellow-100 text-yellow-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {criteria.score}
        </span>
      </div>
      <h3 className="font-medium text-gray-900 mb-1">{criteria.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{criteria.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Target: {criteria.target}</span>
        <span className={`font-medium ${criteria.score >= criteria.target ? 'text-green-600' : 'text-red-600'}`}>
          {criteria.score >= criteria.target ? '✓ Met' : '✗ Below'}
        </span>
      </div>
    </div>
  );
};

const SubcriteriaChart = ({ subcriteria }) => {
  const data = subcriteria.map(sub => ({
    name: sub.name.split(' ').slice(-2).join(' '),
    score: sub.score,
    target: sub.target || 3.0
  }));

  return (
    <div className="bg-white w-screen p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Subcriteria Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 4]} />
          <Tooltip />
          <Bar dataKey="score" fill="#3B82F6" />
          <Bar dataKey="target" fill="#E5E7EB" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const TrendChart = ({ data }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">GPA Trend Analysis</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis domain={[0, 4]} />
        <Tooltip />
        <Line type="monotone" dataKey="gpa" stroke="#3B82F6" strokeWidth={2} />
        <Line type="monotone" dataKey="target" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const RadarChartComponent = ({ data }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Criteria Overview</h3>
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="criteria" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis domain={[0, 4]} />
        <Radar name="Current" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
        <Radar name="Target" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  </div>
);

const GPAAnalysis = () => {
  const [selectedCriteria, setSelectedCriteria] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);

  const criteriaData = [
    {
      id: 1,
      title: "Curricular Aspects",
      description: "Curriculum design and academic flexibility",
      score: 3.2,
      target: 3.0,
      status: "Above Target",
      subcriteria: [
        { name: "1.1 Curriculum Design", score: 3.5, target: 3.0 },
        { name: "1.2 Academic Flexibility", score: 3.1, target: 3.0 },
        { name: "1.3 Curriculum Enrichment", score: 3.0, target: 3.0 },
        { name: "1.4 Feedback System", score: 3.2, target: 3.0 }
      ]
    },
    {
      id: 2,
      title: "Teaching-Learning Process",
      description: "Teaching methodology and student engagement",
      score: 2.3,
      target: 3.0,
      status: "Below Target",
      subcriteria: [
        { name: "2.1 Student Enrollment", score: 2.8, target: 3.0 },
        { name: "2.2 Student Diversity", score: 2.1, target: 3.0 },
        { name: "2.3 Teaching Methods", score: 2.0, target: 3.0 },
        { name: "2.4 Teacher Profile", score: 2.3, target: 3.0 }
      ]
    },
    {
      id: 3,
      title: "Research & Development",
      description: "Research initiatives and innovation",
      score: 2.8,
      target: 3.0,
      status: "Near Target",
      subcriteria: [
        { name: "3.1 Research Publications", score: 3.1, target: 3.0 },
        { name: "3.2 Research Funding", score: 2.5, target: 3.0 },
        { name: "3.3 Innovation Ecosystem", score: 2.7, target: 3.0 },
        { name: "3.4 Research Facilities", score: 2.9, target: 3.0 }
      ]
    },
    {
      id: 4,
      title: "Infrastructure & Resources",
      description: "Physical and digital infrastructure",
      score: 3.5,
      target: 3.0,
      status: "Excellent",
      subcriteria: [
        { name: "4.1 Physical Facilities", score: 3.8, target: 3.0 },
        { name: "4.2 Library Resources", score: 3.4, target: 3.0 },
        { name: "4.3 IT Infrastructure", score: 3.6, target: 3.0 },
        { name: "4.4 Budget Allocation", score: 3.2, target: 3.0 }
      ]
    },
    {
      id: 5,
      title: "Student Support",
      description: "Student welfare and support services",
      score: 2.9,
      target: 3.0,
      status: "Near Target",
      subcriteria: [
        { name: "5.1 Student Mentoring", score: 3.0, target: 3.0 },
        { name: "5.2 Career Guidance", score: 2.8, target: 3.0 },
        { name: "5.3 Student Activities", score: 2.9, target: 3.0 },
        { name: "5.4 Alumni Network", score: 2.9, target: 3.0 }
      ]
    },
    {
      id: 6,
      title: "Governance & Leadership",
      description: "Administrative efficiency and leadership",
      score: 3.1,
      target: 3.0,
      status: "Above Target",
      subcriteria: [
        { name: "6.1 Institutional Vision", score: 3.3, target: 3.0 },
        { name: "6.2 Leadership Strategy", score: 3.0, target: 3.0 },
        { name: "6.3 Faculty Empowerment", score: 3.1, target: 3.0 },
        { name: "6.4 Financial Management", score: 3.0, target: 3.0 }
      ]
    },
    {
      id: 7,
      title: "Institutional Values",
      description: "Best practices and institutional values",
      score: 3.0,
      target: 3.0,
      status: "Target Met",
      subcriteria: [
        { name: "7.1 Institutional Values", score: 3.1, target: 3.0 },
        { name: "7.2 Best Practices", score: 2.9, target: 3.0 },
        { name: "7.3 Institutional Distinctiveness", score: 3.0, target: 3.0 }
      ]
    }
  ];

  const trendData = [
    { month: 'Jan', gpa: 2.5, target: 3.0 },
    { month: 'Feb', gpa: 2.6, target: 3.0 },
    { month: 'Mar', gpa: 2.7, target: 3.0 },
    { month: 'Apr', gpa: 2.75, target: 3.0 },
    { month: 'May', gpa: 2.8, target: 3.0 },
    { month: 'Jun', gpa: 2.84, target: 3.0 }
  ];

  const radarData = criteriaData.map(criteria => ({
    criteria: `C${criteria.id}`,
    current: criteria.score,
    target: criteria.target
  }));

  const currentGPA = criteriaData.reduce((sum, criteria) => sum + criteria.score, 0) / criteriaData.length;
  const targetGPA = 3.0;

  useEffect(() => {
    if (criteriaData.length > 0) {
      setSelectedCriteria(criteriaData[0]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={collapsed} />
      <div className={`transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        <Header />
        <main className="p-6">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GPA Analysis</h1>
              <p className="text-sm text-gray-500 mt-1">Track and analyze your NAAC GPA performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                >
                  <option value="overview">Overview</option>
                  <option value="criteria">Criteria Analysis</option>
                  <option value="trends">Trend Analysis</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Current GPA</p>
                  <div className="flex items-baseline mt-1">
                    <span className="text-2xl font-bold text-gray-900">{currentGPA.toFixed(2)}</span>
                    <span className="ml-2 text-sm font-medium text-green-600">+0.15↑</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Award className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Target GPA</p>
                  <div className="flex items-baseline mt-1">
                    <span className="text-2xl font-bold text-gray-900">{targetGPA.toFixed(2)}</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-green-100 text-green-600">
                  <Target className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Criteria Met</p>
                  <div className="flex items-baseline mt-1">
                    <span className="text-2xl font-bold text-gray-900">7/10</span>
                    <span className="ml-2 text-sm font-medium text-green-600">+2↑</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <CheckCircle className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completion</p>
                  <div className="flex items-baseline mt-1">
                    <span className="text-2xl font-bold text-gray-900">78%</span>
                    <span className="ml-2 text-sm font-medium text-green-600">+5%↑</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <MetricCard
              title="Current GPA"
              value={currentGPA.toFixed(2)}
              grade="B+ Grade"
              trend={5.2}
              icon={Award}
              color="text-blue-600"
            />
            <MetricCard
              title="Target GPA"
              value={targetGPA.toFixed(2)}
              grade="A Grade"
              icon={Target}
              color="text-green-600"
            />
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-5">
              <h3 className="text-sm font-medium text-gray-700 mb-4">GPA Overview</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2">GPA Distribution</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="criteria" tick={{ fontSize: 12 }} />
                        <PolarRadiusAxis domain={[0, 4]} />
                        <Radar 
                          name="Current" 
                          dataKey="current" 
                          stroke="#3B82F6" 
                          fill="#3B82F6" 
                          fillOpacity={0.3} 
                          strokeWidth={2} 
                        />
                        <Radar 
                          name="Target" 
                          dataKey="target" 
                          stroke="#10B981" 
                          fill="#10B981" 
                          fillOpacity={0.1} 
                          strokeWidth={2} 
                        />
                        <Tooltip />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-medium text-gray-500">GPA Trend</h4>
                    <span className="text-xs text-gray-500">Last 6 Months</span>
                  </div>
                  <div className="h-64">
                    <TrendChart data={trendData} />
                  </div>
                  <div className="flex justify-end mt-2 text-xs">
                    <div className="flex items-center text-blue-600">
                      <span>Target GPA:</span>
                      <span className="ml-2 font-semibold">{targetGPA.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Criteria Performance</h3>
                  <span className="text-xs text-gray-500">Click on a card for details</span>
                </div>
                <div className="overflow-x-auto pb-2">
                  <div className="flex space-x-4">
                    {criteriaData.map(criteria => (
                      <div key={criteria.id} className="w-64 flex-shrink-0">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white ${
                                criteria.score >= 3.0 ? 'bg-green-500' : 
                                criteria.score >= 2.5 ? 'bg-yellow-500' : 
                                'bg-red-500'
                              }`}>
                                {criteria.id}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{criteria.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{criteria.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 mb-1">{criteria.score}</div>
                            <div className="text-sm text-gray-500">Target: {criteria.target}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex-1 mr-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  criteria.score >= criteria.target ? 'bg-green-500' : 
                                  criteria.score >= 2.5 ? 'bg-yellow-500' : 
                                  'bg-red-500'
                                }`}
                                style={{ width: `${(criteria.score / 4) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            criteria.score >= criteria.target ? 'bg-green-100 text-green-800' : 
                            criteria.score >= 2.5 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {criteria.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {activeTab === 'criteria' && (
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <div className="flex space-x-4 pb-2">
                    {criteriaData.map(criteria => (
                      <div key={criteria.id} className="w-72 flex-shrink-0">
                        <CriteriaCard
                          criteria={criteria}
                          onClick={setSelectedCriteria}
                          isActive={selectedCriteria?.id === criteria.id}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {selectedCriteria && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SubcriteriaChart subcriteria={selectedCriteria.subcriteria} />
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {selectedCriteria.title} - Detailed Analysis
                      </h3>
                      <div className="space-y-4">
                        {selectedCriteria.subcriteria.map((sub, index) => (
                          <div key={index} className="border-b border-gray-200 pb-3">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium text-gray-900">{sub.name}</h4>
                              <span className={`px-2 py-1 text-sm rounded ${
                                sub.score >= sub.target ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {sub.score}
                              </span>
                            </div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  sub.score >= sub.target ? 'bg-green-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${(sub.score / 4) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Items */}
            <div className="bg-white rounded-lg shadow p-5">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Action Items</h3>
              <div className="space-y-3">
                {[
                  { 
                    id: 1, 
                    title: 'Criterion 2.3 needs attention', 
                    description: 'Score is below target (2.3/3.0)',
                    priority: 'high',
                    dueDate: '2025-07-15',
                    assignedTo: 'Dr. Smith'
                  },
                  { 
                    id: 2, 
                    title: 'Criterion 3.1 data pending', 
                    description: 'Research publications data incomplete',
                    priority: 'medium',
                    dueDate: '2025-07-20',
                    assignedTo: 'Research Dept.'
                  },
                  { 
                    id: 3, 
                    title: 'Criterion 1.2 review', 
                    description: 'Curriculum changes need approval',
                    priority: 'medium',
                    dueDate: '2025-07-10',
                    assignedTo: 'Academic Council'
                  },
                ].map((item) => (
                  <div 
                    key={item.id} 
                    className={`border-l-4 ${
                      item.priority === 'high' ? 'border-red-500 bg-red-50' :
                      item.priority === 'medium' ? 'border-amber-500 bg-amber-50' :
                      'border-blue-500 bg-blue-50'
                    } p-4 rounded-r`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        {item.priority === 'high' ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : item.priority === 'medium' ? (
                          <AlertCircle className="h-5 w-5 text-amber-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                        <div className="mt-2 flex items-center text-xs">
                          <span className="text-gray-500">Assigned to: {item.assignedTo}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-gray-500">Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                View Detailed SSR
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Export Analysis Report
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Generate Improvement Plan
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GPAAnalysis;