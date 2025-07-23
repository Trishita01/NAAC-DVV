import React, { useState, useEffect, useContext } from "react";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SessionContext } from "../../contextprovider/sessioncontext"; 

const Criteria2_6_3 = () => {
  const { sessions } = useContext(SessionContext);
  const [yearData, setYearData] = useState({});
  const [currentYear, setCurrentYear] = useState(sessions[0] || "");
  const [formData, setFormData] = useState({
    programCode: "",
    programName: "",
    studentsAppeared: "",
    studentsPassed: "",
  });

  const [fileDescriptions, setFileDescriptions] = useState({
    dataTemplate: null,
    additionalInfo: null,
    annualReportLink: "",
  });

  const [score, setScore] = useState(null);
  const [loadingScore, setLoadingScore] = useState(true);

  const navigate = useNavigate();

  const goToNextPage = () => {
    navigate("/criteria2.7.1");
  };

  const goToPreviousPage = () => {
    navigate("/criteria2.6.2");
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    const fields = Object.values(formData);
    if (fields.every((v) => v.trim() !== "")) {
      try {
        const sessionYear = parseInt(currentYear.split("-")[0], 10);

        const submissionData = {
          ...formData,
          year: currentYear,
          session: sessionYear,
          studentsAppeared: Number(formData.studentsAppeared),
          studentsPassed: Number(formData.studentsPassed),
        };

        console.log("Submitting data:", submissionData);

        await axios.post("http://localhost:3000/api/v1/createResponse263", submissionData);

        const updatedYearData = {
          ...yearData,
          [currentYear]: [...(yearData[currentYear] || []), formData],
        };
        setYearData(updatedYearData);
        setFormData({
          programCode: "",
          programName: "",
          studentsAppeared: "",
          studentsPassed: "",
        });

        // ✅ Fetch updated score
        await fetchScore();

        alert("Data submitted successfully!");
      } catch (error) {
        console.error("Error submitting data:", error);
        alert("Failed to submit data. Please try again.");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleFileChange = (field, file) => {
    setFileDescriptions({ ...fileDescriptions, [field]: file });
  };

  const fetchScore = async () => {
    try {
      setLoadingScore(true);
      const response = await axios.get("http://localhost:3000/api/v1/criteria2/score263");
      console.log("Fetched score263:", response.data);

      if (response.data && typeof response.data.score !== "undefined") {
        setScore(response.data.score);
      }
    } catch (err) {
      console.error("Error fetching score263:", err);
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
        <div className="flex-1 p-6">
          {/* Metric Info Box */}
          <div className="bg-white border rounded p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              2.6.3 Metric Information
            </h2>
            <p className="text-black">
              Average pass percentage of Students during last five years
            </p>
            <h3 className="text-blue-800 font-semibold mt-4">
              Data Requirement (As per Data Template)
            </h3>
            <ul className="list-disc pl-6 text-black mt-2 space-y-1">
              <li>Programme code</li>
              <li>Name of the Programme</li>
              <li>Number of Students appeared</li>
              <li>Number of Students passed</li>
              <li>Pass percentage</li>
            </ul>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            2.6.3 Average pass percentage of Students during last five years
          </h2>

          {/* ✅ Score Display */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
            {loadingScore ? (
              <p className="text-gray-600">Loading provisional score...</p>
            ) : score !== null ? (
              <p className="text-lg font-semibold text-green-800">
                Provisional Score (2.6.3): {score} %
              </p>
            ) : (
              <p className="text-gray-600">No score data available.</p>
            )}
          </div>

          <div className="mb-4">
            <label className="font-medium text-black mr-2">Select Year:</label>
            <select
              className="border px-3 py-1 rounded text-black"
              value={currentYear}
              onChange={(e) => setCurrentYear(e.target.value)}
            >
              {sessions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <table className="w-full border text-sm mb-6">
            <thead className="bg-gray-200">
              <tr className="text-black font-semibold">
                <th className="border px-2 py-1">Program Code</th>
                <th className="border px-2 py-1">Program Name</th>
                <th className="border px-2 py-1">No. appeared</th>
                <th className="border px-2 py-1">No. passed</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1 text-black"
                    value={formData.programCode}
                    onChange={(e) => handleChange("programCode", e.target.value)}
                    placeholder="Program Code"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1 text-black"
                    value={formData.programName}
                    onChange={(e) => handleChange("programName", e.target.value)}
                    placeholder="Program Name"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1 text-black"
                    value={formData.studentsAppeared}
                    onChange={(e) => handleChange("studentsAppeared", e.target.value)}
                    placeholder="Number Appeared"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1 text-black"
                    value={formData.studentsPassed}
                    onChange={(e) => handleChange("studentsPassed", e.target.value)}
                    placeholder="Number Passed"
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
                      <th className="border px-2 py-1">Program Code</th>
                      <th className="border px-2 py-1">Program Name</th>
                      <th className="border px-2 py-1">Appeared</th>
                      <th className="border px-2 py-1">Passed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearData[year].map((entry, index) => (
                      <tr key={index} className="even:bg-gray-50 text-black">
                        <td className="border px-2 py-1">{index + 1}</td>
                        <td className="border px-2 py-1">{entry.programCode}</td>
                        <td className="border px-2 py-1">{entry.programName}</td>
                        <td className="border px-2 py-1">{entry.studentsAppeared}</td>
                        <td className="border px-2 py-1">{entry.studentsPassed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600 px-4 py-2">No data submitted for this year.</p>
              )}
            </div>
          ))}

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">File Description (Upload)</h3>
            <div className="mb-3">
              <label className="block mb-1 text-black">Data Template (Program & Students List)</label>
              <input
                type="file"
                className="border px-3 py-1 rounded w-full text-black"
                onChange={(e) => handleFileChange("dataTemplate", e.target.files[0])}
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 text-black">Any Additional Information</label>
              <input
                type="file"
                className="border px-3 py-1 rounded w-full text-black"
                onChange={(e) => handleFileChange("additionalInfo", e.target.files[0])}
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 text-black">Annual Report Link</label>
              <input
                type="text"
                placeholder="Paste Link Here"
                value={fileDescriptions.annualReportLink}
                onChange={(e) => handleFileChange("annualReportLink", e.target.value)}
                className="border px-3 py-1 rounded w-full text-black"
              />
            </div>
          </div>

          <div className="mt-auto bg-white border-t border-gray-200 shadow-inner py-4 px-6">
            <Bottom onNext={goToNextPage} onPrevious={goToPreviousPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Criteria2_6_3;
