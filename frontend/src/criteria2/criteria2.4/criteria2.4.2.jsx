import React, { useState, useEffect, useContext } from "react";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SessionContext } from "../../contextprovider/sessioncontext";

const Criteria2_4_2 = () => {
  const { sessions } = useContext(SessionContext);
  const [yearData, setYearData] = useState({});
  const [currentYear, setCurrentYear] = useState(sessions[0] || "");
  const [formData, setFormData] = useState({
    teacherName: "",
    qualification: [],
    qualificationYear: "",
    isResearchGuide: "",
    recognitionYear: "",
  });

  const [uploads, setUploads] = useState({
    additionalInfo: null,
    dataTemplate: null,
  });

  const [score, setScore] = useState(null);
  const [loadingScore, setLoadingScore] = useState(true);
  const navigate = useNavigate();

  const qualificationOptions = [
    "Ph.D.",
    "D.M.",
    "M.Ch.",
    "D.N.B Super speciality",
    "D.Sc.",
    "D.Litt."
  ];

  const goToNextPage = () => {
    navigate("/criteria2.4.3");
  };
  const goToPreviousPage = () => {
    navigate("/criteria2.4.1");
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQualificationChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData({ ...formData, qualification: selected });
  };

  const handleSubmit = async () => {
    try {
      // Basic validation
      if (!formData.teacherName || formData.teacherName.trim() === '') {
        throw new Error("Teacher name is required");
      }
      
      if (!formData.qualification || formData.qualification.length === 0) {
        throw new Error("At least one qualification is required");
      }
      
      if (!formData.qualificationYear || isNaN(Number(formData.qualificationYear))) {
        throw new Error("Valid qualification year is required");
      }
      
      if (!formData.isResearchGuide) {
        throw new Error("Please specify if the teacher is a research guide");
      }
      
      // Only validate research guide year if the teacher is a research guide
      if (formData.isResearchGuide.toUpperCase() === "YES" && (!formData.recognitionYear || isNaN(Number(formData.recognitionYear)))) {
        throw new Error("Valid recognition year is required for research guides");
      }

      if (!currentYear || !/^\d{4}-\d{4}$/.test(currentYear)) {
        throw new Error("Invalid session format. Must be in YYYY-YYYY format.");
      }

      const submissionData = {
        session: currentYear,
        number_of_full_time_teachers: 1, // temp static value
        qualification: formData.qualification.join(", "),
        year_of_obtaining_the_qualification: Number(formData.qualificationYear),
        whether_recognised_as_research_guide: formData.isResearchGuide.toUpperCase() === "YES" ? 1 : 0,
        year_of_recognition_as_research_guide: formData.isResearchGuide.toUpperCase() === "YES" 
          ? Number(formData.recognitionYear) 
          : null,
      };

      console.log("Submitting data:", JSON.stringify(submissionData, null, 2));

      await axios.post("http://localhost:3000/api/v1/criteria2/createResponse242", submissionData);

      const updatedYearData = {
        ...yearData,
        [currentYear]: [...(yearData[currentYear] || []), formData],
      };
      setYearData(updatedYearData);

      setFormData({
        teacherName: "",
        qualification: [],
        qualificationYear: "",
        isResearchGuide: "",
        recognitionYear: "",
      });

      await fetchScore();
      alert("Data submitted successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      if (error.response && error.response.data) {
        alert(`Submission failed: ${error.response.data.message || error.message}`);
      } else {
        alert(`Error: ${error.message || "Failed to save data. Please try again."}`);
      }
    }
  };

  const fetchScore = async () => {
    try {
      setLoadingScore(true);
      const response = await axios.get("http://localhost:3000/api/v1/criteria2/score242");
      console.log("Fetched score242:", response.data);

      if (response.data && typeof response.data.score !== "undefined") {
        setScore(response.data.score);
      }
    } catch (err) {
      console.error("Error fetching score242:", err);
    } finally {
      setLoadingScore(false);
    }
  };

  useEffect(() => {
    fetchScore();
  }, []);

  return (
    <div className="w-screen min-h-screen bg-gray-50 overflow-x-hidden text-black">
      <Header />
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        <div className="flex-1 p-6 bg-white">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            2.4.2 Average percentage of full time teachers with Ph.D./D.M./M.Ch./D.N.B Super speciality/D.Sc./D.Litt. during the last five years
          </h2>

          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
            {loadingScore ? (
              <p className="text-gray-600">Loading provisional score...</p>
            ) : score !== null ? (
              <p className="text-lg font-semibold text-green-800">
                Provisional Score (2.4.2): {score} %
              </p>
            ) : (
              <p className="text-gray-600">No score data available.</p>
            )}
          </div>

          <div className="mb-6 p-4 bg-white border border-gray-300 rounded">
            <p className="font-semibold text-blue-900 mb-2 text-lg">2.4.2 Metric Information</p>
            <p className="text-sm text-black mb-2">
              Average percentage of full time teachers with Ph.D./D.M./M.Ch./D.N.B Super speciality/D.Sc./D.Litt. during the last five years (consider only highest degree for count).
            </p>
          </div>

          <div className="mb-4">
            <label className="font-medium text-black mr-2">Select Year:</label>
            <select
              className="border rounded px-3 py-1"
              value={currentYear}
              onChange={(e) => setCurrentYear(e.target.value)}
            >
              {sessions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <table className="w-full border text-sm mb-6">
            <thead className="bg-gray-200">
              <tr className="text-black font-semibold">
                <th className="border px-2 py-1">Name of full time teacher</th>
                <th className="border px-2 py-1">Highest Qualification</th>
                <th className="border px-2 py-1">Year of Qualification</th>
                <th className="border px-2 py-1">Recognised as Research Guide</th>
                <th className="border px-2 py-1">Year of Recognition</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1 text-black"
                    value={formData.teacherName}
                    onChange={(e) => handleChange("teacherName", e.target.value)}
                    placeholder="teacherName"
                  />
                </td>
                <td className="border px-2 py-1">
                  <select
                    multiple
                    className="w-full border rounded px-2 py-1 text-black"
                    value={formData.qualification}
                    onChange={handleQualificationChange}
                  >
                    {qualificationOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1 text-black"
                    value={formData.qualificationYear}
                    onChange={(e) => handleChange("qualificationYear", e.target.value)}
                    placeholder="qualificationYear"
                  />
                </td>
                <td className="border px-2 py-1">
                  <select
                    className="w-full border rounded px-2 py-1 text-black"
                    value={formData.isResearchGuide}
                    onChange={(e) => handleChange("isResearchGuide", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1 text-black"
                    value={formData.recognitionYear}
                    onChange={(e) => handleChange("recognitionYear", e.target.value)}
                    placeholder="recognitionYear"
                  />
                </td>
                <td className="border px-2 py-1 text-center">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    onClick={handleSubmit}
                  >
                    Add
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          {sessions.map((year) => (
            <div key={year} className="mb-8 border rounded">
              <h3 className="bg-blue-100 px-4 py-2 font-semibold text-black">
                Year: {year}
              </h3>
              {yearData[year] && yearData[year].length > 0 ? (
                <table className="w-full text-sm border">
                  <thead className="bg-gray-200 text-black font-semibold">
                    <tr>
                      <th className="border px-2 py-1">#</th>
                      <th className="border px-2 py-1">Teacher Name</th>
                      <th className="border px-2 py-1">Qualification</th>
                      <th className="border px-2 py-1">Year of Qualification</th>
                      <th className="border px-2 py-1">Research Guide</th>
                      <th className="border px-2 py-1">Year of Recognition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearData[year].map((entry, index) => (
                      <tr key={index} className="even:bg-gray-50 text-black">
                        <td className="border px-2 py-1">{index + 1}</td>
                        <td className="border px-2 py-1">{entry.teacherName}</td>
                        <td className="border px-2 py-1">{entry.qualification.join(", ")}</td>
                        <td className="border px-2 py-1">{entry.qualificationYear}</td>
                        <td className="border px-2 py-1">{entry.isResearchGuide}</td>
                        <td className="border px-2 py-1">{entry.recognitionYear}</td>
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

export default Criteria2_4_2;
