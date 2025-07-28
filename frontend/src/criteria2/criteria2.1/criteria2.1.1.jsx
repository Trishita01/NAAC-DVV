import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
import { SessionContext } from "../../contextprovider/sessioncontext";

const Criteria2_1_1 = () => {
  const { sessions: availableSessions, isLoading: isLoadingSessions, error: sessionError } = useContext(SessionContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editKey, setEditKey] = useState(null)
  const [currentYear, setCurrentYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [yearData, setYearData] = useState({});
  const [provisionalScore, setProvisionalScore] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    slNo: '',
    name: "",
    code: "",
    seats: 0,
    totalstudents: 0,
    year: "",
    supportLinks: [],
  });
  const [editFormData, setEditFormData] = useState(null);

  const navigate = useNavigate();

  // Fetch data when currentYear changes
  useEffect(() => {
    const fetchData = async () => {
      if (!currentYear) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Only pass the first part of the year to the API
        const yearToSend = currentYear.split("-")[0];
        const [response, scoreResponse] = await Promise.all([
          axios.get(`http://localhost:3000/api/v1/criteria2/getResponse/2.1.1`, { params: { session: yearToSend } }),
          axios.get(`http://localhost:3000/api/v1/criteria2/score211/`)
        ]);
        
        const data = response.data?.data || [];
  
        setYearData(prev => ({
          ...prev,
          [currentYear]: data.map(item => ({
            slNo: item.sl_no,
            year: currentYear,
            name: item.programme_name,
            code: item.programme_code,
            seats: item.no_of_seats,
            totalstudents: item.no_of_students,
            session: item.session
          })),
        }));
        
        if (scoreResponse.data) {
          setProvisionalScore(scoreResponse.data);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data. Please try again.");
        setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [currentYear]);
  
  
  

  // Set default current year when sessions load
  useEffect(() => {
    if (availableSessions && availableSessions.length > 0) {
      const firstYear = availableSessions[0].split("-")[0];
      setCurrentYear(firstYear);
      setFormData(prev => ({ ...prev, year: availableSessions[0] }));
    }
  }, [availableSessions]);

  // Fetch score when currentYear changes
  useEffect(() => {
    if (!currentYear) return;

    const fetchScore = async () => {
      setLoading(true);
      setError(null);
      try {
        const yearToSend = currentYear.split("-")[0];
        const response = await axios.get(
          `http://localhost:3000/api/v1/criteria2/score211/`
        );
        setProvisionalScore(response.data);
      } catch (error) {
        console.error("Error fetching score:", error);
        setError("Failed to load score");
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, [currentYear]);

  // Handle year change
  const handleYearChange = (e) => {
    const selectedYear = e.target.value;
    setCurrentYear(selectedYear);
    setFormData(prev => ({ ...prev, year: selectedYear }));
    setEditFormData(null);
  };

  const handleEdit = (entry) => {
    setEditFormData({
      slNo: entry.slNo,
      name: entry.name,
      code: entry.code,
      seats: entry.seats,
      totalstudents: entry.totalstudents,
      year: entry.year,
      supportLinks: []
    });
  };

  const handleChange = (field, value, index = null) => {
    if (editFormData) {
      if (field === "supportLinks") {
        const updatedLinks = [...(editFormData.supportLinks || [])];
        updatedLinks[index] = value;
        setEditFormData(prev => ({ ...prev, supportLinks: updatedLinks }));
      } else {
        setEditFormData(prev => ({ ...prev, [field]: value }));
      }
    } else {
      if (field === "supportLinks") {
        const updatedLinks = [...(formData.supportLinks || [])];
        updatedLinks[index] = value;
        setFormData(prev => ({ ...prev, supportLinks: updatedLinks }));
      } else {
        setFormData(prev => ({ ...prev, [field]: value }));
      }
    }
  };

  const handleSubmit = async (isUpdate = false) => {
    if (submitting) return;
    
    const programme_name = formData.name.trim();
    const programme_code = formData.code.trim();
    const no_of_seats = Number(formData.seats);
    const no_of_students = Number(formData.totalstudents);
    const yearInput = formData.year.trim();
    const yearToSend = yearInput.split("-")[0]; // Only take the first part of the year (e.g., "2023" from "2023-24")
    const session = parseInt(yearToSend);
    const currentYear = new Date().getFullYear();

    // Validation
    if (!programme_name || !programme_code || !no_of_seats || !no_of_students || !yearInput) {
      setError("Please fill in all required fields.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    if (no_of_seats <= 0 || no_of_students < 0) {
      setError("Seats and student counts must be positive numbers.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (no_of_seats < no_of_students) {
      setError("Number of seats cannot be less than number of students.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (session < 1990 || session > currentYear) {
      setError("Year must be between 1990 and current year.");
      setTimeout(() => setError(null), 3000);
      return;
    }
  
    const ratio = (no_of_students / no_of_seats) * 100;
    setSubmitting(true);
    setError(null);
  
    try {
      const payload = {
        ...(editFormData ? { sl_no: editFormData.slNo } : {}),
        session: parseInt(yearToSend),
        year: parseInt(yearToSend),
        programme_name,
        programme_code,
        no_of_seats,
        no_of_students,
      };
  
      const endpoint = editFormData ? 
        "http://localhost:3000/api/v1/criteria2/updateResponse211" : 
        "http://localhost:3000/api/v1/criteria2/createResponse211";

      const response = await axios[editFormData ? 'put' : 'post'](
        endpoint,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );
  
      const resp = response?.data?.data || {};
      const newEntry = {
        slNo: resp.sl_no || editFormData?.slNo,
        year: yearInput,
        name: resp.programme_name || programme_name,
        code: resp.programme_code || programme_code,
        seats: resp.no_of_seats || no_of_seats,
        totalstudents: resp.no_of_students || no_of_students,
      };
  
      // Update local state
      setYearData(prev => {
        const existingEntries = prev[newEntry.year] || [];
        const existingIndex = existingEntries.findIndex(
          entry => entry.code === newEntry.code
        );
  
        const updatedEntries = [...existingEntries];
        if (existingIndex !== -1) {
          updatedEntries[existingIndex] = newEntry;
        } else {
          updatedEntries.push(newEntry);
        }
        
        return { ...prev, [newEntry.year]: updatedEntries };
      });
  
      // Reset form
      setFormData({
        name: "",
        code: "",
        seats: 0,
        totalstudents: 0,
        year: yearInput, // Keep the same year for the next entry
        supportLinks: [],
      });
      
      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (error) {
      console.error("Submission error:", error);
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      "Failed to save data. Please try again.";
      setError(errorMsg);
      setTimeout(() => setError(null), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const goToNextPage = () => navigate("/criteria2.1.2");
  const goToPreviousPage = () => navigate("/criteria2.1.1");

  return (
    <div className="w-screen min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">
              Criteria 2: Teaching-Learning and Evaluation
            </h2>
            <div className="text-sm text-gray-600">
              2.1-Student Enrolment and Profile
            </div>
          </div>

          {/* <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="mb-4">
              <h3 className="text-blue-600 font-medium mb-2">2.1.1 Metric Information</h3>
              <p className="text-sm text-gray-700">
                Average enrolment Percentage (Average of last five years)
              </p>
            </div>
            <div className="mb-6">
              <h3 className="text-blue-600 font-medium mb-2">Required Documents:</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                <li>Any additional information</li>
                <li>Institutional data in prescribed format</li>
              </ul>
            </div>
          </div> */}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year:</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
              value={currentYear}
              onChange={handleYearChange}
              disabled={isLoadingSessions}
            >
              {isLoadingSessions ? (
                <option>Loading sessions...</option>
              ) : availableSessions.length > 0 ? (
                availableSessions.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))
              ) : (
                <option>No sessions available</option>
              )}
            </select>
          </div>

          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
            {loading ? (
              <p className="text-gray-600">Loading provisional score...</p>
            ) : provisionalScore?.score_sub_sub_criteria !== undefined ? (
              <p className="text-lg font-semibold text-green-800">
                Provisional Score (2.1.1): {typeof provisionalScore.score_sub_sub_criteria === 'number'
                  ? provisionalScore.score_sub_sub_criteria.toFixed(2)
                  : provisionalScore.score_sub_sub_criteria} %
              </p>
            ) : (
              <p className="text-gray-600">No score data available.</p>
            )}
          </div>

          {/* Input Form */}
          <div className="border rounded mb-8">
            <h2 className="text-xl font-bold bg-blue-100 text-gray-800 px-4 py-2">
              Average Enrolment Percentage -
            </h2>
            <table className="w-full border text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-4 py-2 text-gray-800">Programme Name</th>
                  <th className="border px-4 py-2 text-gray-800">Programme Code</th>
                  <th className="border px-4 py-2 text-gray-800">Seats Sanctioned</th>
                  <th className="border px-4 py-2 text-gray-800">Students Admitted</th>
                  <th className="border px-4 py-2 text-gray-800">Year (Entry)</th>
                  <th className="border px-4 py-2 text-gray-800">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-gray-600"
                      placeholder="Program Name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-gray-600"
                      placeholder="Program Code"
                      value={formData.code}
                      onChange={(e) => handleChange('code', e.target.value)}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="w-full border rounded px-2 py-1 text-gray-600"
                      placeholder="Seats Sanctioned"
                      value={formData.seats}
                      onChange={(e) => handleChange('seats', Number(e.target.value))}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="w-full border rounded px-2 py-1 text-gray-600"
                      placeholder="Students Admitted"
                      value={formData.totalstudents}
                      onChange={(e) => handleChange('totalstudents', Number(e.target.value))}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <select
                      className="w-full border rounded px-2 py-1 text-black"
                      value={formData.year}
                      onChange={(e) => handleChange('year', e.target.value)}
                    >
                      {isLoadingSessions ? (
                        <option>Loading sessions...</option>
                      ) : availableSessions.length > 0 ? (
                        availableSessions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))
                      ) : (
                        <option>No sessions available</option>
                      )}
                    </select>
                  </td>
                  <td className="border px-2 py-1">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className={`px-3 py-1 rounded text-white ${
                        submitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                     {submitting ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update' : 'Save')}

                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Support Links */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Link to relevant documents
            </label>
            <div className="flex flex-col gap-2">
              {(formData.supportLinks || []).map((link, index) => (
                <input
                  key={index}
                  type="url"
                  placeholder={`Enter support link ${index + 1}`}
                  className="px-3 py-1 border border-gray-300 rounded text-gray-950"
                  value={link}
                  onChange={(e) => handleChange('supportLinks', e.target.value, index)}
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, supportLinks: [...formData.supportLinks, ''] })
                }
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 w-fit"
              >
                + Add Another Link
              </button>
            </div>
          </div>

          {/* Display Data for All Years */}
          {availableSessions.map((year) => (
            <div key={year} className="mb-8 border rounded">
              <h3 className="text-lg font-semibold bg-gray-100 !text-gray-800 px-4 py-2">
                Year: {year}
              </h3>
              {yearData[year] && yearData[year].length > 0 ? (
                <table className="w-full text-sm border border-black">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border border-black px-4 py-2 text-gray-800">#</th>
                      <th className="border border-black px-4 py-2 text-gray-800">Program Name</th>
                      <th className="border border-black px-4 py-2 text-gray-800">Program Code</th>
                      <th className="border border-black px-4 py-2 text-gray-800">Seats Sanctioned</th>
                      <th className="border border-black px-4 py-2 text-gray-800">Students Admitted</th>
                      <th className="border border-black px-4 py-2 text-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearData[year].map((entry, index) => (
                      <tr key={entry.code + year}>
                        <td className="border border-black text-black px-4 py-2 text-center">{index + 1}</td>
                        <td className="border border-black text-black px-4 py-2">{entry.name}</td>
                        <td className="border border-black text-black px-4 py-2">{entry.code}</td>
                        <td className="border border-black text-black px-4 py-2 text-center">{entry.seats}</td>
                        <td className="border border-black text-black px-4 py-2 text-center">{entry.totalstudents}</td>
                        <td className="border border-black text-black px-4 py-2 text-center">
                        <button
  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
  onClick={() => {
    setFormData({
      name: entry.name,
      code: entry.code,
      seats: entry.seats,
      totalstudents: entry.totalstudents,
      year: entry.year,
      supportLinks: [], // you can prefill if you store them
    });
    setEditKey({ code: entry.code, year: entry.year });
    setIsEditMode(true);
  }}
>
  Edit
</button>
{isEditMode && (
  <div className="mt-2">
    <button
      type="button"
      onClick={() => {
        setFormData({
          name: "",
          code: "",
          seats: 0,
          totalstudents: 0,
          year: currentYear,
          supportLinks: [],
        });
        setEditKey(null);
        setIsEditMode(false);
      }}
      className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
    >
      Cancel Edit
    </button>
  </div>
)}


                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="px-4 py-2 text-gray-500">No data submitted for this year.</p>
              )}
            </div>
          ))}

          {/* Status Messages */}
          {error && (
            <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg max-w-md">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          {success && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg max-w-md">
              <div className="flex items-center">
                <span className="mr-2">✓</span>
                <span>Data saved successfully!</span>
              </div>
            </div>
          )}
          
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
                  <span>Loading data...</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-auto bg-white border-t border-gray-200 shadow-inner py-4 px-6">
            <Bottom onNext={goToNextPage} onPrevious={goToPreviousPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Criteria2_1_1;
