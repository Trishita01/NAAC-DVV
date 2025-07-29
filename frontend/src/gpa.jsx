import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Award, Target, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import Sidebar from './components/iqac-sidebar';
import { navItems } from './config/navigation';

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
          color === 'text-green-600'
            ? 'bg-green-100'
            : color === 'text-red-600'
            ? 'bg-red-100'
            : 'bg-blue-100'
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
    {trend !== undefined && (
      <div className="mt-4 flex items-center">
        {trend > 0 ? (
          <span className="inline-flex items-center text-green-600">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {Math.abs(trend)}% from last assessment
          </span>
        ) : (
          <span className="inline-flex items-center text-red-600">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            {Math.abs(trend)}% from last assessment
          </span>
        )}
      </div>
    )}
  </div>
);

const SubCriteriaChart = ({ subcriteria }) => {
  const chartData = subcriteria.map((sub) => ({
    name: sub.code,
    score: sub.score,
    target: sub.target,
  }));

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
      <h5 className="text-sm font-semibold text-gray-700 mb-4">Sub-Criteria Performance</h5>
      <div style={{ width: '100%', height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 4]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="score" fill="#3B82F6" name="Current Score" />
            <Bar dataKey="target" fill="#10B981" name="Target Score" opacity={0.6} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CriteriaCard = ({ criteria, expanded, onToggle }) => (
  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white ${
              criteria.score >= 3.0
                ? 'bg-green-500'
                : criteria.score >= 2.5
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
          >
            {criteria.id}
          </div>
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900">{criteria.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{criteria.description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 mb-1">{criteria.score}</div>
          <div className="text-sm text-gray-500">Target: {criteria.target}</div>
        </div>
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
    </div>
    <div className="flex items-center justify-between mb-4">
      <div className="flex-1 mr-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              criteria.score >= criteria.target
                ? 'bg-green-500'
                : criteria.score >= 2.5
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${(criteria.score / 4) * 100}%` }}
          ></div>
        </div>
      </div>
      <div
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          criteria.score >= criteria.target
            ? 'bg-green-100 text-green-800'
            : criteria.score >= 2.5
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {criteria.status}
      </div>
    </div>
    {expanded && (
      <div className="border-t border-gray-200 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {criteria.subcriteria.map((sub, index) => (
            <div key={index} className="bg-white p-3 rounded border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">{sub.code}</span>
                  <p className="text-xs text-gray-500 mt-1">{sub.title}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">{sub.score}</span>
                  <p className="text-xs text-gray-500">/{sub.target}</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className={`h-1 rounded-full ${
                    sub.score >= sub.target
                      ? 'bg-green-500'
                      : sub.score >= 2.5
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${(sub.score / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <SubCriteriaChart subcriteria={criteria.subcriteria} />
      </div>
    )}
  </div>
);

const GPAAnalysis = () => {
  const [expandedCriteria, setExpandedCriteria] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  const [criteriaData, setCriteriaData] = useState([]);
  const [gpaInfo, setGpaInfo] = useState({ currentGPA: 0, targetGPA: 3.0, grade: '', trend: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGPA = async () => {
      try {
        const res = await axios.get('/api/gpa/college-summary');
        setCriteriaData(res.data.criteria);
        setGpaInfo({
          currentGPA: res.data.currentGPA,
          targetGPA: res.data.targetGPA,
          grade: res.data.grade,
          trend: res.data.trend,
        });
      } catch (err) {
        console.error('Error fetching GPA data:', err);
      }
    };
    fetchGPA();
  }, []);

  const toggleCriteria = (id) => {
    setExpandedCriteria((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const radarData = criteriaData?.length ? criteriaData.map((criteria) => ({
    criteria: `C${criteria.id}`,
    current: criteria.score,
    target: criteria.target,
  })) : [];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className={`flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        <Sidebar navItems={navItems} collapsed={collapsed} setCollapsed={setCollapsed} navigate={navigate} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto w-full">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">GPA Analysis Dashboard</h1>
              <p className="text-gray-600">Comprehensive analysis of NAAC criteria performance</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <MetricCard title="Current GPA" value={gpaInfo?.currentGPA?.toFixed?.(2) ?? '0.00'} grade={gpaInfo?.grade ?? ''} trend={gpaInfo?.trend ?? 0} icon={Award} color="text-blue-600" />
              <MetricCard title="Target GPA" value={gpaInfo?.targetGPA?.toFixed?.(2) ?? '0.00'} grade="A Grade" icon={Target} color="text-green-600" />
            </div>
            <div className="space-y-8">
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
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Criteria Summary</h3>
                  <p className="text-gray-600">Detailed performance breakdown for each criterion and sub-criterion</p>
                </div>
                <div className="max-w-6xl mx-auto">
                  <div className="grid grid-cols-1 gap-6">
                    {Array.isArray(criteriaData) && criteriaData.length > 0 ? (
                      criteriaData.map((criteria) => (
                        <CriteriaCard key={criteria.id} criteria={criteria} expanded={expandedCriteria[criteria.id]} onToggle={() => toggleCriteria(criteria.id)} />
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No criteria data available. Loading...
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">View Detailed SSR</button>
                <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">Export Analysis Report</button>
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">Generate Improvement Plan</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GPAAnalysis;
