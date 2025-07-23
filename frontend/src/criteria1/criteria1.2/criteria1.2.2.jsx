import React, { useState, useEffect } from "react";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Criteria1_2_2 = () => {
  const currentYear = new Date().getFullYear();

  const pastFiveYears = Array.from({ length: 5 }, (_, i) => `${2024 - i}-${(2024 - i + 1).toString().slice(-2)}`);
  const [selectedYear, setSelectedYear] = useState(pastFiveYears[0]);
  const [yearData, setYearData] = useState({});

  // States for provisional score
  const [provisionalScore, setProvisionalScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    names: "",
    code: "",
    yearofoffering: "",
    times: "",
    duration: "",
    students: "",
    totalstudents: "",
    supportLinks: [""],
  });

  const navigate = useNavigate();

  // Fetch provisional score from backend
  const fetchScore = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:3000/api/v1/criteria1/score122");
      setProvisionalScore({
        score: response.data.data,
        message: response.data.message,
      });
    } catch (error) {
      setError(error.message || "Failed to fetch provisional score");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScore();
  }, []);

  const handleCalculateScore = () => {
    fetchScore();
  };
  const years = ["2024-25", "2023-24", "2022-23", "2021-22", "2020-21"];

  const handleChange = (field, value, index = null) => {
    if (field === "supportLinks") {
      const updatedLinks = [...formData.supportLinks];
      updatedLinks[index] = value;
      setFormData({ ...formData, supportLinks: updatedLinks });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSubmit = async () => {
    const { names, code, yearofoffering, times, duration, students, totalstudents } = formData;
    if (names && code && yearofoffering && times && duration && students && totalstudents) {
      try {
        const entryWithYear = { ...formData, year: selectedYear };
        const response = await axios.post("http://localhost:3000/api/v1/criteria1/createResponse122", entryWithYear);
        console.log("Response created:", response.data);
        const updatedYearData = {
          ...yearData,
          [selectedYear]: [...(yearData[selectedYear] || []), entryWithYear],
        };
        setYearData(updatedYearData);
        alert("Data submitted successfully!");
        fetchScore();
      } catch (error) {
        console.error("Error submitting:", error);
        alert("Submission failed. Please try again.");
      }

      setFormData({
        names: "",
        code: "",
        yearofoffering: "",
        times: "",
        duration: "",
        students: "",
        totalstudents: "",
        supportLinks: [""],
      });
    } else {
      alert("Please fill in all fields.");
    }
  };

  const goToNextPage = () => {
    navigate("/criteria1.2.3");
  };

  const goToPreviousPage = () => {
    navigate("/criteria1.2.1");
  };

  return (
    <div className="w-[1520px] min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">Criteria 1: Curricular Aspects</h2>
            <div className="text-sm">
              <span className="text-gray-600">1.2-Academic Flexibility</span>
              <i className="fas fa-chevron-down ml-2 text-gray-500"></i>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {/* Provisional Score Banner */}
            <div className="flex justify-center mb-4">
              <div className="text-center">
                <div className="text-lg font-medium text-green-500 bg-[#bee7c7] !w-[1000px] h-[50px] pt-[10px] rounded-lg">
                  {loading ? (
                    <span className="text-gray-500">Loading...</span>
                  ) : error ? (
                    <span className="text-red-500">Error: {error}</span>
                  ) : provisionalScore ? (
                    <>Provisional Score: {provisionalScore.score}</>
                  ) : (
                    "Score not available"
                  )}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-blue-600 font-medium mb-2">1.2.2 Metric Information</h3>
              <p className="text-sm text-gray-700">
                Number of Add on /Certificate programs offered during the last five years
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-blue-600 font-medium mb-2">Requirements:</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                <li>Brochure or any other document relating to Add on /Certificate programs</li>
                <li>List of Add on /Certificate programs</li>
              </ul>
            </div>
          </div>

          <div className="border rounded mb-8">
            <div className="flex justify-between items-center bg-blue-100 text-gray-800 px-4 py-2">
              <h2 className="text-xl font-bold">Add On Programs</h2>
              <div className="size-7 mb-1">
                <label className="text-gray-700 font-medium mr-2 -ml-[950px]">Select Year:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="border border-gray-300 px-3 py-1 rounded text-gray-950 mb-[200px] "
                >
                  {pastFiveYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <table className="w-full border text-sm border-black">
              <thead className="bg-gray-100 text-gray-950">
                <tr>
                  <th className="border px-2 py-2">Program Name</th>
                  <th className="border px-2 py-2">Program Code</th>
                  <th className="border px-2 py-2">Year of Offering</th>
                  <th className="border px-2 py-2">Times Offered</th>
                  <th className="border px-2 py-2">Duration</th>
                  <th className="border px-2 py-2">Students Enrolled</th>
                  <th className="border px-2 py-2">Students Completed</th>
                  <th className="border px-2 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {["names", "code", "yearofoffering", "times", "duration", "students", "totalstudents"].map((key) => (
                    <td key={key} className="border px-2 py-1">
                      <input
                        type={key === "students" || key === "totalstudents" ? "number" : "text"}
                        className="w-full border text-gray-950 border-black rounded px-2 py-1"
                        placeholder={key.replace(/([A-Z])/g, " $1")}
                        value={formData[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                      />
                    </td>
                  ))}
                  <td className="border px-2 py-1 text-center">
                    <button
                      className="!bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      onClick={handleSubmit}
                    >
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
             Links to relevant documents
            </label>
            <div className="flex flex-col gap-2">
              {formData.supportLinks.map((link, index) => (
                <input
                  key={index}
                  type="url"
                  placeholder={`Enter support link ${index + 1}`}
                  className="px-3 py-1 border border-gray-300 rounded text-gray-950"
                  value={link}
                  onChange={(e) => handleChange("supportLinks", e.target.value, index)}
                />
              ))}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, supportLinks: [...formData.supportLinks, ""] })}
                className="mt-2 px-3 py-1 !bg-blue-600 text-white rounded hover:bg-blue-700 w-fit"
              >
                + Add Another Link
              </button>
            </div>
          </div>

          {years.map((year) => (
            <div key={year} className="mb-8 border rounded">
              <h3 className="text-lg font-semibold bg-gray-100 text-gray-800 px-4 py-2">Year: {year}</h3>
              {yearData[year] && yearData[year].length > 0 ? (
                <table className="w-full text-sm border">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border text-gray-950 px-4 py-2">#</th>
                      <th className="border text-gray-950 px-4 py-2">Program Name</th>
                      <th className="border text-gray-950 px-4 py-2">Code</th>
                      <th className="border text-gray-950 px-4 py-2">Year</th>
                      <th className="border text-gray-950 px-4 py-2">Times</th>
                      <th className="border text-gray-950 px-4 py-2">Duration</th>
                      <th className="border text-gray-950 px-4 py-2">Students Enrolled</th>
                      <th className="border text-gray-950 px-4 py-2">Students Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearData[year].map((entry, index) => (
                      <tr key={index} className="even:bg-gray-50">
                        <td className="border text-gray-950 px-2 py-1">{index + 1}</td>
                        <td className="border text-gray-950 px-2 py-1">{entry.names}</td>
                        <td className="border text-gray-950 px-2 py-1">{entry.code}</td>
                        <td className="border text-gray-950 px-2 py-1">{entry.yearofoffering}</td>
                        <td className="border text-gray-950 px-2 py-1">{entry.times}</td>
                        <td className="border text-gray-950 px-2 py-1">{entry.duration}</td>
                        <td className="border text-gray-950 px-2 py-1">{entry.students}</td>
                        <td className="border text-gray-950 px-2 py-1">{entry.totalstudents}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600 px-4 py-2">No data submitted for this year.</p>
              )}
            </div>
          ))}

          <div className="flex justify-end mt-4 mb-6">
            <button className="px-4 py-2 !bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleCalculateScore}>
              Calculate Score
            </button>
          </div>

          <div className="mt-auto bg-white border-t border-gray-200 shadow-inner py-4 px-6">
            <Bottom onNext={goToNextPage} onPrevious={goToPreviousPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Criteria1_2_2;
