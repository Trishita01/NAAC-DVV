import React, { useState, useEffect, useContext } from "react";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SessionContext } from "../../contextprovider/sessioncontext";

const Criteria3_4_1 = () => {
  const { sessions: availableSessions = [], isLoading: sessionLoading = false, error: sessionError = null } = useContext(SessionContext) || {};
  const navigate = useNavigate();

  const [currentYear, setCurrentYear] = useState('');
  const pastFiveYears = Array.from(
    { length: 5 },
    (_, i) => `${new Date().getFullYear() - i}-${(new Date().getFullYear() - i + 1).toString().slice(-2)}`
  );
  const yearsToShow = availableSessions?.length > 0 ? availableSessions : pastFiveYears;
  const [selectedYear, setSelectedYear] = useState('');

  const [formData, setFormData] = useState({
    title: "",
    name_age: "",
    name_part: "",
    year: "",
    dur: "",
    supportLinks: []
  });

  const [yearData, setYearData] = useState({});
  const [score, setScore] = useState(null);
  const [provisionalScore, setProvisionalScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (availableSessions?.length > 0) {
      const firstYear = availableSessions[0];
      setCurrentYear(firstYear);
      setSelectedYear(firstYear);
    } else if (pastFiveYears.length > 0) {
      const firstYear = pastFiveYears[0];
      setCurrentYear(firstYear);
      setSelectedYear(firstYear);
    }
  }, [availableSessions, pastFiveYears]);

  useEffect(() => {
    if (currentYear) {
      const year = currentYear.split('-')[0];
      setFormData(prev => ({
        ...prev,
        year
      }));
    }
  }, [currentYear]);

    const handleChange = (field, value, index = null) => {
      if (field === 'supportLinks') {
        const updated = [...formData.supportLinks];
        updated[index] = value;
        setFormData(prev => ({ ...prev, supportLinks: updated }));
      } else {
        setFormData(prev => ({ ...prev, [field]: value }));
      }
    };

  const handleSubmit = async () => {
    const session = selectedYear.split("-")[0];

    const title_of_activity = formData.title.trim();
    const collaborating_agency = formData.name_age.trim();
    const participant_name = formData.name_part.trim();
    const year_of_collaboration = formData.year.trim();
    const duration = formData.dur.trim();

    if (
      title_of_activity &&
      collaborating_agency &&
      participant_name &&
      year_of_collaboration &&
      duration
    ) {
      const requestBody = {
        session,
        title_of_activity,
        collaborating_agency,
        participant_name,
        year_of_collaboration,
        duration,
        supportLinks: formData.supportLinks.filter(link => link.trim() !== '')
      };

      try {
        await axios.post("/api/criteria3_4_1/create", requestBody);

        const updatedYearData = {
          ...yearData,
          [year_of_collaboration]: [...(yearData[year_of_collaboration] || []), formData]
        };

        setYearData(updatedYearData);
        setFormData({ title: "", name_age: "", name_part: "", year: "", dur: "", supportLinks: [] });

        const res = await axios.get(`/api/criteria3_4_1/score/${session}`);
        setScore(res.data.score);
      } catch (err) {
        console.error("Submission error:", err);
        alert("Failed to submit data. Please try again.");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const fetchScore = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:3000/api/v1/criteria3/score341");
      setProvisionalScore(res.data);
    } catch (err) {
      setError(err.message || "Failed to fetch score");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScore();
  }, []);

  const goToNextPage = () => navigate("/criteria3.4.2");
  const goToPreviousPage = () => navigate("/criteria3.3.4");

  return (
    <div className="w-[1470px] min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        <div className="flex-1 p-6">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">Criteria 3: Research, Innovations and Extension</h2>
            <div className="text-sm text-gray-600">3.4 - Collaboration</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="mb-4">
              <h3 className="text-blue-600 font-medium mb-2">3.4.1 Metric Information</h3>
              <p className="text-sm text-gray-700">
                The Institution has several collaborations/linkages for Faculty exchange, Student exchange, Internship, Field trip, On-the-job training, research etc during the last five years.
              </p>
            </div>
            <div className="mb-6">
              <h3 className="text-blue-600 font-medium mb-2">Requirements:</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                <li>e-copies of linkage related documents</li>
                <li>Any additional information</li>
                <li>Details of linkages with institutions/industries for internship (Data Template)</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-center mb-4">
              <div className="text-center">
                <span className="font-semibold text-gray-700">Provisional Score:&nbsp;</span>
                {loading ? (
                  <span className="text-gray-500">Loading...</span>
                ) : error ? (
                  <span className="text-red-500">Error: {error}</span>
                ) : provisionalScore ? (
                  <div className="text-center">
                    <div className="text-blue-600 text-lg font-bold">
                      Score: {provisionalScore.data?.score || 'N/A'}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-500">Score not available</span>
                )}
              </div>
            </div>
          </div>

          <div className="border rounded mb-8">
            <div className="flex justify-between items-center bg-blue-100 text-gray-800 px-4 py-2">
              <h2 className="text-xl font-bold">Add Collaborative Programs</h2>
              <div className="flex items-center gap-2">
                <label className="text-gray-700 font-medium">Select Year:</label>
                <select
              className="border px-3 py-1 rounded text-black"
              value={currentYear}
              onChange={(e) => setCurrentYear(e.target.value)}
              disabled={sessionLoading || !availableSessions.length}
            >
              {sessionLoading ? (
                <option>Loading sessions...</option>
              ) : sessionError ? (
                <option>Error loading sessions - using default years</option>
              ) : null}
              {yearsToShow.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
              </div>
            </div>

            <table className="w-full border text-sm border-black">
              <thead className="bg-gray-100 text-gray-950">
                <tr>
                  <th className="border px-2 py-2">Title</th>
                  <th className="border px-2 py-2">Agency</th>
                  <th className="border px-2 py-2">Participant</th>
                  <th className="border px-2 py-2">Year</th>
                  <th className="border px-2 py-2">Duration</th>
                  <th className="border px-2 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      className="w-full border text-gray-950 border-black rounded px-2 py-1"
                      placeholder="Collaboration Title"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      value={formData.name_age}
                      onChange={(e) => handleChange("name_age", e.target.value)}
                      className="w-full border text-gray-950 border-black rounded px-2 py-1"
                      placeholder="Agency Name"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      value={formData.name_part}
                      onChange={(e) => handleChange("name_part", e.target.value)}
                      className="w-full border text-gray-950 border-black rounded px-2 py-1"
                      placeholder="Participant"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      value={currentYear ? currentYear.split('-')[0] : ''}
                      readOnly
                      className="w-full border text-gray-950 border-black rounded px-2 py-1 bg-gray-100"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      value={formData.dur}
                      onChange={(e) => handleChange("dur", e.target.value)}
                      className="w-full border text-gray-950 border-black rounded px-2 py-1"
                      placeholder="Duration"
                    />
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      onClick={() => {
                        const title_of_activity = formData.title.trim();
                        const collaborating_agency = formData.name_age.trim();
                        const participant_name = formData.name_part.trim();
                        const year_of_collaboration = formData.year.trim();
                        const duration = formData.dur.trim();

                        if (
                          title_of_activity &&
                          collaborating_agency &&
                          participant_name &&
                          year_of_collaboration &&
                          duration
                        ) {
                          const newEntry = {
                            title: title_of_activity,
                            name_age: collaborating_agency,
                            name_part: participant_name,
                            year: year_of_collaboration,
                            dur: duration,
                            link: formData.supportLinks[0] || ''
                          };

                          const updatedYearData = {
                            ...yearData,
                            [year_of_collaboration]: [...(yearData[year_of_collaboration] || []), newEntry]
                          };
                          
                          setYearData(updatedYearData);
                          setFormData({
                            title: "",
                            name_age: "",
                            name_part: "",
                            year: "",
                            dur: "",
                            supportLinks: []
                          });
                        } else {
                          alert("Please fill in all fields.");
                        }
                      }}
                    >
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4 px-4 py-3 bg-gray-50 border-t">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supporting Document Links:
              </label>
              <div className="space-y-2">
                {formData.supportLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder={`Supporting document link ${index + 1}`}
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm text-gray-900"
                      value={link}
                      onChange={(e) => handleChange("supportLinks", e.target.value, index)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedLinks = [...formData.supportLinks];
                        updatedLinks.splice(index, 1);
                        setFormData(prev => ({ ...prev, supportLinks: updatedLinks }));
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    supportLinks: [...prev.supportLinks, '']
                  }))}
                  className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Supporting Link
                </button>
              </div>
            </div>
          </div>

          

          {pastFiveYears.map((year) => (
            <div key={year} className="mb-8 border rounded">
              <h3 className="text-lg font-semibold bg-gray-100 text-gray-800 px-4 py-2">Year: {year}</h3>
              {yearData[year] && yearData[year].length > 0 ? (
                <table className="w-full text-sm border">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border text-gray-950 px-4 py-2">#</th>
                      <th className="border text-gray-950 px-4 py-2">Title</th>
                      <th className="border text-gray-950 px-4 py-2">Agency</th>
                      <th className="border text-gray-950 px-4 py-2">Participant</th>
                      <th className="border text-gray-950 px-4 py-2">Year</th>
                      <th className="border text-gray-950 px-4 py-2">Duration</th>
                      <th className="border text-gray-950 px-4 py-2">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearData[year].map((entry, index) => (
                      <tr key={index} className="even:bg-gray-50">
                        <td className="border text-gray-950 px-2 py-1">{index + 1}</td>
                        <td className="border text-gray-950 px-2 py-1">{entry.title}</td>
                        <td className="border text-gray-950 px-2 py-1">{entry.name_age}</td>
                        <td className="border text-gray-950 px-2 py-1">{entry.name_part}</td>
                        <td className="border text-gray-950 px-2 py-1">{entry.year}</td>
                        <td className="border text-gray-950 px-2 py-1">{entry.dur}</td>
                        <td className="border text-gray-950 px-2 py-1">
                          <a href={entry.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600 px-4 py-2">No data submitted for this year.</p>
              )}
            </div>
          ))}

          <div className="mt-auto bg-white border-t border-gray-200 shadow-inner py-4 px-6">
            <Bottom onNext={goToNextPage} onPrevious={goToPreviousPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Criteria3_4_1;