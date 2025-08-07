import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../../contextprovider/sessioncontext";

const Criteria6_5_3 = () => {
  const navigate = useNavigate();
  const { sessions, isLoading: sessionLoading, error: sessionError } = useContext(SessionContext);
const [currentYear, setCurrentYear] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [rows, setRows] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [yearOfImplementation, setYearOfImplementation] = useState("");
  const [session, setSession] = useState("2023");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [provisionalScore, setProvisionalScore] = useState(null);

  const handleRadioChange = (option) => {
    setSelectedOption(option);
  };

  const addRow = () => {
    setRows([...rows, { id: nextId, name: "" }]);
    setNextId(nextId + 1);
  };

  const handleRowNameChange = (id, name) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, name } : row)));
  };

  const handleSubmit = async () => {
    try {
      const implimentationValue = {
        option1: 4, // All of the above
        option2: 3, // Any 3 of the above
        option3: 2, // Any 2 of the above
        option4: 1, // Any 1 of the above
        option5: 0  // None of the above
      }[selectedOption] ?? 0;

      const requestBody = {
        session,
        implimentation: implimentationValue,
        area_of_e_governance: [
          "Regular meeting of Internal Quality Assurance Cell (IQAC); Feedback collected, analysed and used for improvements",
          "Collaborative quality intitiatives with other institution(s) and Accounts",
          "Participation in NIRF",
          "any other quality audit recognized by state, national or international agencies (ISO Certification, NBA)",
        ],
        year_of_implementation: yearOfImplementation,
      };

      const response = await axios.post("http://localhost:3000/api/v1/criteria6/createResponse623", requestBody);
      console.log("Submission successful:", response.data);
      alert("Data submitted successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Submission failed!");
    }
  };

  useEffect(() => {
    if (sessions && sessions.length > 0) {
      const firstYear = sessions[0].split("-")[0];
      setSession(firstYear);
      setCurrentYear(firstYear);
    }
  }, [sessions]);

  const fetchScore = async () => {
    console.log("Fetching score...");
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:3000/api/v1/criteria6/score653");
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
      <Header />
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 flex flex-col p-2 mt-[20px]">
          {/* Page Title and Score */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-medium text-gray-800">
              Criteria 6: Governance, Leadership and Management
            </h2>
            <div className="text-sm">
              <span className="text-gray-600">6.5-Internal Quality Assurance System</span>
              <i className="fas fa-chevron-down ml-2 text-gray-500"></i>
            </div>
          </div>

          {/* Provisional Score Section */}
          <div className="flex justify-center mb-4">
            <div className="text-center">
              <span className="font-semibold text-gray-700">Provisional Score:&nbsp;</span>
              {loading ? (
                <span className="text-gray-500">Loading...</span>
              ) : error ? (
                <span className="text-red-500">Error: {error}</span>
              ) : provisionalScore ? (
                <div className="text-blue-600 text-lg font-bold">
                  Score: {provisionalScore.data?.score || "N/A"}
                </div>
              ) : (
                <span className="text-gray-500">Score not available</span>
              )}
            </div>
          </div>

          {/* Information Box */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-blue-600 font-medium mb-2">6.5.3 Metric Information</h3>
            <p className="text-sm text-gray-700">
            Quality assurance initiatives of the institution include: <br />
              1.Regular meeting of Internal Quality Assurance Cell (IQAC); Feedback collected, analysed and used for improvements <br />
              2. Collaborative quality intitiatives with other institution(s) <br />
              3. Participation in NIRF <br />
              4. any other quality audit recognized by state, national or international agencies (ISO Certification, NBA)
            </p>
            <h3 className="text-blue-600 font-medium mt-6 mb-2">Data Requirements:</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              <li>AQARs prepared/ submitted</li>
              <li>Collaborative quality initiatives with other institution(s)</li>
              <li>Participation in NIRF</li>
              <li>Any other quality audit recognized by state, national or international agencies (ISO Certification, NBA)</li>
            </ul>
          </div>

          {/* Radio Buttons */}
          <div className="!bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-blue-600 font-medium mb-4">
              Select the Options <br />
              1. Regular meeting of Internal Quality Assurance Cell (IQAC); Feedback collected, analysed and used for improvements <br />
              2. Collaborative quality intitiatives with other institution(s) <br />
              3.Participation in NIRF <br />
              4.any other quality audit recognized by state, national or international agencies (ISO Certification, NBA)
            </h3>
            <div className="space-y-3">
              {[
                "All of the above",
                "Any 3 of the above",
                "Any 2 of the above",
                "Any 1 of the above",
                "None of the above",
              ].map((label, index) => {
                const optionKey = `option${index + 1}`;
                return (
                  <div key={optionKey} className="flex items-center">
                    <input
                      type="radio"
                      id={optionKey}
                      name="participation"
                      className="mr-3 h-4 w-4 text-blue-600"
                      checked={selectedOption === optionKey}
                      onChange={() => handleRadioChange(optionKey)}
                    />
                    <label htmlFor={optionKey} className="text-sm text-gray-800">
                      {label}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                <li>Paste web link of Annual reports of Institution</li>
                <li>Upload e-copies of the accreditations and certifications</li>
                <li>Upload any additional information</li>
                <li>
                Upload details of Quality assurance initiatives of the institution(Data Template) (Data Template)
                </li>
              </ul>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Documents</label>
            <div className="flex items-center mb-4">
              <label className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer">
                <i className="fas fa-upload mr-2"></i> Choose Files
                <input type="file" className="hidden" multiple />
              </label>
              <span className="ml-3 text-gray-600">No file chosen</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mr-10">
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Submit
            </button>
            <Bottom />
            <button
              onClick={() => navigate("/criteria1.2.1")}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Criteria6_5_3;