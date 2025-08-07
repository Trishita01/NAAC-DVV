import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../../contextprovider/sessioncontext";
import LandingNavbar from "../../components/landing-navbar";

const Criteria6_2_3 = () => {
  const navigate = useNavigate();
  const { sessions: availableSessions, isLoading: isLoadingSessions, error: sessionError } = useContext(SessionContext);
  
  const [currentYear, setCurrentYear] = useState("");
  const [governanceData, setGovernanceData] = useState([
    { area: "Administration", year: "" },
    { area: "Finance and Accounts", year: "" },
    { area: "Student Admission and Support", year: "" },
    { area: "Examination", year: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [provisionalScore, setProvisionalScore] = useState(null);

  // Set default year when sessions are loaded
  useEffect(() => {
    if (availableSessions && availableSessions.length > 0) {
      setCurrentYear(availableSessions[0]);
    }
  }, [availableSessions]);

  const handleYearChange = (index, value) => {
    const updatedData = [...governanceData];
    updatedData[index].year = value;
    setGovernanceData(updatedData);
  };

  const handleSubmit = async () => {
    try {
      // Filter out items with empty years
      const filledData = governanceData.filter(item => item.year.trim() !== '');
      
      if (filledData.length === 0) {
        alert("Please enter at least one year of implementation");
        return;
      }
      
      // Calculate implementation count based on number of areas with years
      const implementationCount = filledData.length > 4 ? 4 : filledData.length; // Cap at 4
      
      // Send each filled item as a separate request
      const requests = filledData.map(item => {
        const requestBody = {
          session: parseInt(currentYear, 10), // Convert session to number
          implimentation: implementationCount, // Send the total count of implementations
          area_of_e_governance: item.area,
          year_of_implementation: item.year.trim() // Pass only the year value
        };
        console.log("Request body:", requestBody);
        
        console.log("Sending request for:", requestBody);
        
        return axios.post(
          "http://localhost:3000/api/v1/criteria6/createResponse623", 
          requestBody,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
          }
        );
      });
      
      // Wait for all requests to complete
      await Promise.all(requests);
      
      const successMessage = `Successfully submitted data for ${filledData.length} area(s)`;
      console.log(successMessage);
      alert(successMessage);
      
      // Reset form
      setGovernanceData(governanceData.map(item => ({ ...item, year: '' })));
      
    } catch (error) {
      console.error("Submission failed:", error);
      let errorMessage = "Submission failed!";
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error status:", error.response.status);
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        console.error("No response received:", error.request);
        errorMessage = "No response from server. Please check your connection.";
      } else {
        console.error('Error:', error.message);
      }
      alert(errorMessage);
    }
  };

  const fetchScore = async () => {
    console.log("Fetching score...");
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:3000/api/v1/criteria6/score623");
      console.log("API Response:", response);
      setProvisionalScore(response.data);
    } catch (error) {
      console.error("Error fetching provisional score:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error status:", error.response.status);
      }
      setError(error.message || "Failed to fetch score");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScore();
  }, []);

  return (
    <div className="min-h-screen w-screen bg-gray-50 flex flex-col">
      <LandingNavbar />
      <div className="flex mt-6 flex-1">
        <Sidebar />
        <div className="flex-1 mt-6 flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-gray-800">Criteria 6: Governance, Leadership and Management</h2>
            <div className="text-sm text-gray-600">6.2 - Strategy Development and Deployment</div>
          </div>

          {/* Session Selection Dropdown */}
          <div className="mb-4">
            <label className="font-medium text-gray-700 mr-2">Select Session:</label>
            <select
              className="border px-3 py-1 rounded text-black"
              value={currentYear}
              onChange={(e) => setCurrentYear(e.target.value)}
              disabled={isLoadingSessions}
            >
              {isLoadingSessions ? (
                <option>Loading sessions...</option>
              ) : availableSessions ? (
                availableSessions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))
              ) : (
                <option>No sessions available</option>
              )}
            </select>
            {sessionError && <p className="text-red-500 text-sm mt-1">{sessionError}</p>}
          </div>

          {/* Provisional Score Section */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
            {loading ? (
              <p className="text-gray-600">Loading provisional score...</p>
            ) : provisionalScore?.data ? (
              <div>
                <p className="text-lg font-semibold text-green-800">
                  Provisional Score (6.2.3): {provisionalScore.data.score}
                </p>
              </div>
            ) : (
              <p className="text-gray-600">No score data available.</p>
            )}
          </div>

          {/* Data Entry Table */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-blue-600 font-medium mb-4">E-Governance Implementation Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">Area of Governance</th>
                    <th className="py-2 px-4 border-b text-left">Year of Implementation</th>
                  </tr>
                </thead>
                <tbody>
                  {governanceData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 text-black px-4 border-b">{item.area}</td>
                      <td className="py-3 text-black px-4 border-b">
                        <input
                          type="text"
                          className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter year"
                          value={item.year}
                          onChange={(e) => handleYearChange(index, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-blue-600 font-medium mb-4">Supporting Documents</h3>
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                <li>ERP (Enterprise Resource Planning) Document</li>
                <li>Screen shots of user interfaces</li>
                <li>Any other relevant document</li>
              </ul>
            </div>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOCX, or JPG (MAX. 10MB)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" multiple />
              </label>
            </div>
          </div>
        </div>
      </div>
      <Bottom />
    </div>
  );
};

export default Criteria6_2_3;