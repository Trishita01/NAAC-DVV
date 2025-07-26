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

  const [currentYear, setCurrentYear] = useState("");
  const [yearData, setYearData] = useState({});
  const [provisionalScore, setProvisionalScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    seats: 0,
    totalstudents: 0,
    year: "",
    supportLinks: [],
  });

  const navigate = useNavigate();

  // Set default current year when sessions load
  useEffect(() => {
    if (availableSessions && availableSessions.length > 0) {
      setCurrentYear(availableSessions[0]);
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
        const response = await axios.get(
          `http://localhost:3000/api/v1/criteria2/score211`
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
  };

  const handleChange = (field, value, index = null) => {
    if (field === "supportLinks") {
      const updatedLinks = [...(formData.supportLinks || [])];
      updatedLinks[index] = value;
      setFormData(prev => ({ ...prev, supportLinks: updatedLinks }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    const programme_name = formData.name.trim();
    const programme_code = formData.code.trim();
    const no_of_seats = Number(formData.seats);
    const no_of_students = Number(formData.totalstudents);
    const yearInput = formData.year.trim();
    const yearToSend = yearInput;
    const session = parseInt(currentYear.split("-")[0]);

    if (!programme_name || !programme_code || !no_of_seats || !no_of_students || !yearInput) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    const ratio = (no_of_students / no_of_seats) * 100;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/criteria2/createResponse211",
        {
          year: parseInt(yearToSend),
          programme_name: programme_name,
          programme_code: programme_code,
          no_of_seats: no_of_seats,
          no_of_students: no_of_students,
          supportLinks: formData.supportLinks.filter((link) => link.trim() !== ""),
          ratio: ratio,
          session: session
        }
      );

      const resp = response?.data?.data || {};
      const newEntry = {
        year: currentYear,
        name: resp.name || programme_name,
        code: resp.code || programme_code,
        seats: resp.seats || no_of_seats,
        totalstudents: resp.totalstudents || no_of_students,
      };

      setYearData((prev) => ({
        ...prev,
        [newEntry.year]: [...(prev[newEntry.year] || []), newEntry],
      }));

      setFormData({
        name: "",
        code: "",
        seats: 0,
        totalstudents: 0,
        year: currentYear,
        supportLinks: [],
      });

      alert(`Data submitted successfully! Ratio calculated: ${ratio.toFixed(2)}%`);
    } catch (error) {
      console.error("Error submitting:", error);
      if (error.response && error.response.data) {
        alert("Submission failed: " + error.response.data.message);
      } else {
        alert("Submission failed due to network/server error.");
      }
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

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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
          </div>

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
              <thead className="bg-gray-100">
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
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-gray-600"
                      placeholder="Program Code"
                      value={formData.code}
                      onChange={(e) => handleChange("code", e.target.value)}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="w-full border rounded px-2 py-1 text-gray-600"
                      placeholder="Seats Sanctioned"
                      value={formData.seats}
                      onChange={(e) => handleChange("seats", Number(e.target.value))}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="w-full border rounded px-2 py-1 text-gray-600"
                      placeholder="Students Admitted"
                      value={formData.totalstudents}
                      onChange={(e) => handleChange("totalstudents", Number(e.target.value))}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-gray-600"
                      placeholder="Year"
                      value={formData.year}
                      onChange={(e) => handleChange("year", e.target.value)}
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
                  onChange={(e) => handleChange("supportLinks", e.target.value, index)}
                />
              ))}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, supportLinks: [...formData.supportLinks, ""] })}
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 w-fit"
              >
                + Add Another Link
              </button>
            </div>
          </div>

          {/* Display Data for All Years */}
          {availableSessions.map((year) => (
            <div key={year} className="mb-8 border rounded">
              <h3 className="text-lg font-semibold bg-gray-100 text-gray-800 px-4 py-2">
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
                    </tr>
                  </thead>
                  <tbody>
                    {yearData[year].map((entry, index) => (
                      <tr key={index} className="even:bg-gray-50">
                        <td className="border border-black px-2 py-1 text-gray-700">{index + 1}</td>
                        <td className="border border-black px-2 py-1 text-gray-700">{entry.name}</td>
                        <td className="border border-black px-2 py-1 text-gray-700">{entry.code}</td>
                        <td className="border border-black px-2 py-1 text-gray-700">{entry.seats}</td>
                        <td className="border border-black px-2 py-1 text-gray-700">{entry.totalstudents}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600 px-4 py-2">No data submitted for this year.</p>
              )}
            </div>
          ))}

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
