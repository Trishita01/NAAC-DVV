import React, { useState , useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';
import { Award, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { SessionContext } from './contextprovider/sessioncontext';
import { FaBell } from 'react-icons/fa';
import Sidebar from './components/iqac-sidebar';
import UserDropdown from './components/UserDropdown';
import { useAuth } from './auth/authProvider';
import { navItems } from './config/navigation';
import {useGpa} from './contextprovider/GpaContext';
import RadarGraphSection from './Radar';
import { FaArrowLeft, FaChartLine, FaBullseye, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Header = () => {
  const { user } = useAuth();
  
  return (
    <div className="p-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center h-[50px] w-[350px] shadow border border-black/10 rounded-2xl">
          <a href="#" className="text-gray-500 hover:text-gray-700 mr-2">
            <i className="fas fa-arrow-left"></i>
          </a>
          <p className="text-2xl font-bold text-gray-800">GPA Analysis</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* <div className="relative cursor-pointer group">
            <FaBell className="text-gray-600 text-xl transform transition-transform duration-200 group-hover:scale-110"/>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">1</span>
          </div> */}
          <UserDropdown user={user} className="ml-2" />
        </div>
      </div>
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
      <div
        className={`p-3 rounded-lg ${
          color === 'text-green-600' ? 'bg-green-100' : color === 'text-red-600' ? 'bg-red-100' : 'bg-blue-100'
        }`}
      >
        <Icon
          className={`h-6 w-6 ${
            color === 'text-green-600'
              ? 'text-green-600'
              : color === 'text-red-600'
              ? 'text-red-600'
              : 'text-blue-600'
          }`}
        />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center">
        {trend > 0 ? (
          <span className="inline-flex items-center text-green-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {Math.abs(trend)}% from last assessment
          </span>
        ) : (
          <span className="inline-flex items-center text-red-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            {Math.abs(trend)}% from last assessment
          </span>
        )}
      </div>
    )}
  </div>
);

const CriteriaCard = ({ criteria, expanded, onToggle }) => {
  const progress = (criteria.score / criteria.target) * 100;
  const progressColor = progress >= 100 ? 'bg-green-500' : progress >= 80 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{criteria.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{criteria.description}</p>
          </div>
          <div className="flex items-center">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              criteria.status === 'Above Target' ? 'bg-green-100 text-green-800' :
              criteria.status === 'Below Target' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {criteria.status}
            </span>
            <button
              onClick={onToggle}
              className="ml-4 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{criteria.score.toFixed(1)} / {criteria.target}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${progressColor}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="border-t border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {criteria.subcriteria.map((sub, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{sub.code} - {sub.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Score: {sub.score} / {sub.target}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    sub.score >= sub.target ? 'bg-green-100 text-green-800' :
                    sub.score >= 2.5 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {sub.score >= sub.target ? 'Met' : 'Not Met'}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        sub.score >= sub.target ? 'bg-green-500' :
                        sub.score >= 2.5 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(sub.score / sub.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};







const GPAAnalysis = () => {
  const {
    collegeId,
    currentGPA,
    targetGPA,
    grade,
    criteria,
    isLoading,
    error,
    refetch
  } = useGpa();
  

  const [expandedCriteria, setExpandedCriteria] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
    const { desiredGrade } = useContext(SessionContext);

  const toggleCriteria = (id) => {
    setExpandedCriteria(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const radarData = criteria?.map((c) => ({
    criteria: `C${c.id}`,
    current: c.score,
    target: c.target
  })) || [];

  if (isLoading) return <div className="p-8">Loading GPA data...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        <Sidebar 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          navigate={navigate} 
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto w-full">
            {/* Title */}
            <div className="mb-4">
              <h4 className="text-lg font-bold text-gray-900 mb-1">GPA Analysis Dashboard</h4>
              <p className="text-sm text-gray-600">Comprehensive analysis of NAAC criteria performance</p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <MetricCard
                title="Current GPA"
                value={currentGPA?.toFixed(2)}
                grade={grade || "Grade"}
                trend={5.2}
                icon={Award}
                color="text-blue-600"
              />
              <MetricCard
                title="Target GPA"
                value={targetGPA?.toFixed(2)}
                grade={desiredGrade || "Grade"}
                icon={Target}
                color="text-green-600"
              />
            </div>

            {/* Overview Radar Chart */}
            <RadarGraphSection />
            {/* <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Criteria Overview</h3>
                <p className="text-gray-600">Visual representation of NAAC criteria performance</p>
              </div>
              <div className="flex justify-center">
                <div style={{ width: '600px', height: '400px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="criteria" tick={{ fontSize: 14 }} />
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
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div> */}

            {/* Criteria Breakdown */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Criteria Summary</h3>
                <p className="text-gray-600">Detailed performance for each criterion and sub-criterion</p>
              </div>

              <div className="space-y-6">
                {criteria?.map(c => (
                  <div key={c.id} className="border rounded-lg shadow-sm">
                    <div
                      className="flex justify-between items-center bg-gray-100 px-4 py-3 cursor-pointer"
                      onClick={() => toggleCriteria(c.id)}
                    >
                      <div>
                        <h4 className="text-lg font-semibold">{c.title}</h4>
                        <p className="text-sm text-gray-500">{c.status}</p>
                      </div>
                      <div className="text-sm text-gray-700">
                        Score: {c.score} | Target: {c.target}
                      </div>
                    </div>

                    {expandedCriteria[c.id] && (
                      <div className="p-4">
                        <ul className="space-y-2">
                          {c.subcriteria?.map((sub) => (
                            <li key={sub.code} className="flex justify-between border-b pb-2">
                              <div>
                                <p className="font-medium">{sub.code} - {sub.title}</p>
                                <p className="text-sm text-gray-500">Score: {sub.score} | Grade: {sub.grade}</p>
                              </div>
                              <div className="text-sm text-gray-600">
                                Target: {sub.targetPercentage}%
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GPAAnalysis;
