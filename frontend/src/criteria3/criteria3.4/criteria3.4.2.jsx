import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../../contextprovider/sessioncontext";

const Criteria3_4_2 = () => {
  const { sessions, isLoading: sessionLoading, error: sessionError } = useContext(SessionContext);

  const [availableSessions, setAvailableSessions] = useState([]);
  const [currentYear, setCurrentYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pastFiveYears = Array.from(
    { length: 5 },
    (_, i) => `${2024 - i}-${(2024 - i + 1).toString().slice(-2)}`
  );

  const [selectedYear, setSelectedYear] = useState(pastFiveYears[0]);
  const [yearData, setYearData] = useState({});
  const [yearScores, setYearScores] = useState(
    pastFiveYears.reduce((acc, year) => ({ ...acc, [year]: 0 }), {})
  );
  const [yearCount, setYearCount] = useState(5);
  const [averageScore, setAverageScore] = useState(null);
  const [provisionalScore, setProvisionalScore] = useState(null);

  const [formData, setFormData] = useState({
    year: "",
    awards: "",
    awardingBody: "",
    link: "",
  });

  const navigate = useNavigate();

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    const allFilled = Object.values(formData).every((val) => val.trim() !== "");
    if (!allFilled) {
      alert("Please fill in all fields.");
      return;
    }

    const requestBody = {
      session: selectedYear.split("-")[0],
      year: formData.year,
      awards_received: formData.awards,
      awarding_body: formData.awardingBody,
      link: formData.link,
    };

    try {
      const response = await axios.post("/api/criteria3_4_2/create", requestBody);
      console.log("Submitted:", response.data);
      alert("Data submitted successfully!");
      fetchScore();

      setYearData((prev) => {
        const updated = { ...prev };
        if (!updated[selectedYear]) updated[selectedYear] = [];
        updated[selectedYear].push(formData);
        return updated;
      });

      setFormData({ year: "", awards: "", awardingBody: "", link: "" });
    } catch (err) {
      console.error("Error submitting:", err);
      if (err.response && err.response.data) {
        alert("Submission failed: " + err.response.data.message);
      } else {
        alert("Submission failed due to network/server error.");
      }
    }
  };

  const fetchScore = async () => {
    console.log("Fetching score...");
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/criteria3_4_2/score");
      setProvisionalScore(response.data);
      console.log("Provisional Score:", response.data);
    } catch (err) {
      console.error("Error fetching provisional score:", err);
      setError(err.message || "Failed to fetch score");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScore();
  }, []);

  const goToNextPage = () => navigate("/criteria3.4.3");
  const goToPreviousPage = () => navigate("/criteria3.4.1");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-black">
              Criteria 3 - Research, Innovations and Extension
            </h2>
            <span className="text-sm text-black">
              3.4 – Extension Activities & Recognition
            </span>
          </div>

          {/* Provisional Score */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-center mb-4">
              <div className="text-center">
                <span className="font-semibold text-gray-700">Provisional Score: </span>
                {loading ? (
                  <span className="text-gray-500">Loading...</span>
                ) : error ? (
                  <span className="text-red-500">Error: {error}</span>
                ) : (
                  <span className="text-gray-500">{provisionalScore ?? "Score not available"}</span>
                )}
              </div>
            </div>
          </div>

          {/* Metric Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-blue-600 font-medium mb-2">3.4.2 Metric Information</h3>
            <p className="text-gray-700">
              Number of awards and recognitions received for extension activities from government/recognised bodies during the last five years.
            </p>
            <h3 className="text-blue-600 font-medium mt-4 mb-2">Supportive Documents:</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Award letters</li>
              <li>Any additional relevant information</li>
            </ul>
          </div>

          {/* Year Selector */}
          <div className="flex justify-end mb-4">
            <label className="mr-2 font-medium text-black">Select Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border px-3 py-1 rounded text-black"
            >
              {pastFiveYears.map((yr) => (
                <option key={yr} value={yr} className="text-black">{yr}</option>
              ))}
            </select>
          </div>

          {/* Entry Form */}
          <div className="overflow-auto border rounded mb-6">
            <table className="min-w-full border text-black text-sm">
              <thead className="bg-gray-100 font-semibold">
                <tr>
                  <th className="border px-2">Year</th>
                  <th className="border px-2">Awards / Recognitions</th>
                  <th className="border px-2">Awarding Body</th>
                  <th className="border px-2">Report Link</th>
                  <th className="border px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {Object.keys(formData).map((key) => (
                    <td key={key} className="border px-2">
                      <input
                        value={formData[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="w-full border px-2 py-1 text-black"
                      />
                    </td>
                  ))}
                  <td className="border px-2">
                    <button
                      onClick={handleSubmit}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Year-Wise Data Display */}
          {pastFiveYears.map((yr) => (
            <div key={yr} className="mb-6 border rounded">
              <h3 className="text-lg font-semibold bg-gray-100 px-4 py-2 text-black">Year: {yr}</h3>
              {yearData[yr]?.length ? (
                <table className="min-w-full border text-black text-sm">
                  <thead className="bg-gray-100 font-semibold">
                    <tr>
                      <th className="border px-2 py-1 text-center">#</th>
                      {Object.keys(formData).map((key) => (
                        <th key={key} className="border px-2 py-1 text-center capitalize">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {yearData[yr].map((entry, idx) => (
                      <tr key={idx} className="even:bg-gray-50">
                        <td className="border px-2 py-1 text-center">{idx + 1}</td>
                        {Object.values(entry).map((val, i) => (
                          <td key={i} className="border px-2 py-1">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-black px-4 py-2">No data submitted for this year.</p>
              )}
            </div>
          ))}

          {/* Calculation Table */}
          <div className="overflow-auto border rounded p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2 text-black">Calculation Table (Last 5 Years)</h2>
            <table className="table-auto border-collapse w-full text-black">
              <thead>
                <tr className="bg-gray-100 font-semibold">
                  <th className="border px-4 py-2">Year</th>
                  {pastFiveYears.map((yr) => (
                    <th key={yr} className="border px-4 py-2">{yr}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2 font-medium text-black">Calculated Score</td>
                  {pastFiveYears.map((yr) => (
                    <td key={yr} className="border px-4 py-2 text-center">
                      <input
                        type="number"
                        value={yearScores[yr]}
                        onChange={(e) =>
                          setYearScores({ ...yearScores, [yr]: parseFloat(e.target.value) || 0 })
                        }
                        className="w-20 rounded border px-1 text-center text-black"
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            <div className="flex items-center gap-2 mt-4">
              <label className="text-sm font-medium text-black">Enter number of years for average:</label>
              <input
                type="number"
                value={yearCount}
                min={1}
                max={5}
                onChange={(e) => setYearCount(parseInt(e.target.value) || 1)}
                className="w-20 border px-2 py-1 rounded text-center text-black"
              />
              <button
                onClick={() => {
                  const vals = Object.values(yearScores).slice(0, yearCount);
                  const sum = vals.reduce((acc, v) => acc + v, 0);
                  setAverageScore((sum / yearCount).toFixed(2));
                }}
                className="ml-4 bg-blue-600 px-4 py-2 text-white rounded hover:bg-green-700"
              >
                Calculate Average
              </button>
            </div>
            {averageScore !== null && (
              <div className="mt-4 text-blue-700 font-semibold">
                Average Score for last {yearCount} year(s): {averageScore}%
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="bg-white border-t border-gray-200 shadow-inner py-4 px-6">
            <Bottom onPrevious={goToPreviousPage} onNext={goToNextPage} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Criteria3_4_2;