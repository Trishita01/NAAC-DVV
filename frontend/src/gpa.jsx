import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, TrendingDown, Target, Award, AlertCircle, CheckCircle, BookOpen, Users, Building, Lightbulb, Heart, Briefcase, Globe } from 'lucide-react';

const Header = () => (
  <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">NAAC DVV System</h1>
      <div className="flex items-center space-x-6 text-sm text-gray-600">
        <span>Academic Year: 2023-24</span>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Admin</span>
      </div>
    </div>
  </div>
);



const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { icon: 'tachometer-alt', text: 'Dashboard', path: '/iqac-dashboard' },
    { icon: 'users', text: 'User Management', path: '/user-management' },
    { icon: 'file-alt', text: 'Data Entry Forms', path: '/criteria1.1.1' },
    { icon: 'chart-line', text: 'GPA Analysis', path: '/gpa-analysis' },
    { icon: 'paper-plane', text: 'Final Submission', path: '/final-submission' },
    { icon: 'download', text: 'Download Report', path: '/download-report' },
    { icon: 'question-circle', text: 'Help and Support', path: '/helpsupport' },
    { icon: 'cog', text: 'Configuration', path: '/configuration' },
    { icon: 'sign-out-alt', text: 'Logout', path: '/logout' },
  ];

  return (
    <div className={`bg-slate-800 text-white min-h-screen ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
      <div className="p-4 flex justify-between items-center">
        {!collapsed && <h1 className="text-2xl font-bold text-white">NAAC</h1>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-white p-2 hover:bg-slate-700 rounded-md"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="mt-8">
        {navItems.map((item, index) => (
          <div 
            key={index}
            onClick={() => navigate(item.path)}
            className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
              location.pathname === item.path ? 'bg-slate-700' : 'hover:bg-slate-700'
            }`}
          >
            <i className={`fas fa-${item.icon} w-6 text-center`}></i>
            {!collapsed && <span className="ml-3">{item.text}</span>}
          </div>
        ))}
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
    <div className="w-screen min-h-screen bg-gray-50">
      <Header />
     
      
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">GPA Analysis Dashboard</h1>
            <p className="text-gray-600">Comprehensive analysis of NAAC criteria performance</p>
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

          {/* Tab Navigation */}
          <div className="mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('criteria')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'criteria'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Criteria Analysis
              </button>
              <button
                onClick={() => setActiveTab('trends')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'trends'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Trend Analysis
              </button>
            </nav>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Criteria Overview Chart */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Criteria Overview</h3>
                  <p className="text-gray-600">Visual representation of all NAAC criteria performance</p>
                </div>
                <div className="flex justify-center">
                  <div style={{ width: '600px', height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="criteria" tick={{ fontSize: 14 }} />
                        <PolarRadiusAxis domain={[0, 4]} />
                        <Radar name="Current" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} strokeWidth={2} />
                        <Radar name="Target" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={2} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Criteria Summary */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Criteria Summary</h3>
                  <p className="text-gray-600">Detailed performance breakdown for each criterion</p>
                </div>
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 gap-6">
                    {criteriaData.map(criteria => (
                      <div key={criteria.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
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
          )}

          {activeTab === 'criteria' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {criteriaData.map(criteria => (
                  <CriteriaCard
                    key={criteria.id}
                    criteria={criteria}
                    onClick={setSelectedCriteria}
                    isActive={selectedCriteria?.id === criteria.id}
                  />
                ))}
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

          {activeTab === 'trends' && (
            <div className="space-y-6">
              <TrendChart data={trendData} />
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Infrastructure & Resources performing excellently</li>
                      <li>• Curricular Aspects above target</li>
                      <li>• Governance & Leadership meeting expectations</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Areas for Improvement</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Teaching-Learning Process needs attention</li>
                      <li>• Research & Development below target</li>
                      <li>• Student Support services require enhancement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              View Detailed SSR
            </button>
            <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              Export Analysis Report
            </button>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Generate Improvement Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPAAnalysis;