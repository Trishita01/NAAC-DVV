import React, { useState, useEffect } from "react";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Criteria2_3_3 = () => {
  const [formData, setFormData] = useState({
    mentors: "",
    mentees: "",
  });

  const [ratio, setRatio] = useState(null);
  const [uploads, setUploads] = useState({
    yearwiseData: null,
    circulars: null,
    ratioDoc: null,
  });

  const [provisionalScore, setProvisionalScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const goToNextPage = () => navigate("/criteria2.4.1");
  const goToPreviousPage = () => navigate("/criteria2.3.2");

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (field, file) => {
    setUploads({ ...uploads, [field]: file });
  };

  // ✅ Fetch provisional score on mount
  useEffect(() => {
    async function fetchScore() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:3000/api/v1/criteria2/score233");
        console.log("Fetched score data:", response.data);
        setProvisionalScore({
          score: response.data.data,
          message: response.data.message,
        });
      } catch (error) {
        console.error("Error fetching provisional score:", error);
        setError(error.message || "Failed to fetch provisional score");
      } finally {
        setLoading(false);
      }
    }
    fetchScore();
  }, []);

  const handleSubmit = async () => {
    const { mentors, mentees } = formData;
    if (!mentors || !mentees || isNaN(mentors) || isNaN(mentees)) {
      alert("Please enter valid numbers for both mentors and mentees.");
      return;
    }
    const ratioString = `${mentors} : ${mentees}`;
    setRatio(ratioString);

    // ✅ Prepare form data for API
    const dataToSend = {
      mentors: parseInt(mentors),
      mentees: parseInt(mentees),
      ratio: ratioString,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/criteria2/createResponse241",
        dataToSend
      );

      console.log("Response created:", response.data);
      alert("Data submitted successfully!");
      setFormData({ mentors: "", mentees: "" });
    } catch (error) {
      console.error("Error submitting:", error);
      if (error.response && error.response.data) {
        alert("Submission failed: " + error.response.data.message);
      } else {
        alert("Submission failed due to network/server error.");
      }
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gray-50 overflow-x-hidden text-black">
      <Header />
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            2.3.3.1 Mentor to Student Ratio
          </h2>

          {/* Provisional Score Display */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-center mb-4">
              <div className="text-center">
                <span className="font-semibold text-gray-700">Provisional Score:&nbsp;</span>
                {loading ? (
                  <span className="text-gray-500">Loading...</span>
                ) : error ? (
                  <span className="text-red-500">Error: {error}</span>
                ) : provisionalScore?.score ? (
                  <div className="text-center">
                    <span className="text-blue-600 text-lg font-bold">
                      {provisionalScore.score.score_sub_sub_criteria.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-500">Score not available</span>
                )}
              </div>
            </div>
          </div>

          {/* Metric Info Section */}
          <div className="bg-white text-black p-4 mb-6">
            <h3 className="text-blue-700 text-lg font-semibold mb-2">
              2.3.3 Metric Information
            </h3>
            <p className="mb-4">
              Ratio of mentor to students for academic and other related issues (Data for the latest completed academic year)
            </p>
            <h4 className="text-blue-700 font-semibold mb-2">Data Requirement:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Number of mentors</li>
              <li>Number of students assigned to each Mentor</li>
            </ul>
          </div>

          {/* Input Table */}
          <table className="w-full border text-sm mb-6">
            <thead className="bg-blue-100 font-semibold">
              <tr>
                <th className="border px-2 py-1">No. of Mentors</th>
                <th className="border px-2 py-1">No. of Mentees</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1 text-black"
                    placeholder="mentors"
                    value={formData.mentors}
                    onChange={(e) => handleChange("mentors", e.target.value)}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1 text-black"
                    placeholder="mentees"
                    value={formData.mentees}
                    onChange={(e) => handleChange("mentees", e.target.value)}
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

          {/* Ratio Display */}
          {ratio && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-300 rounded">
              <h3 className="text-lg font-semibold text-blue-800">Current Ratio:</h3>
              <p className="text-xl font-bold text-gray-800">{ratio}</p>
            </div>
          )}

          {/* File Upload Section */}
          <div className="mt-10 border-t pt-6">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">
              File Description (Upload)
            </h3>

            <div className="mb-4">
              <label className="block font-medium mb-1">
                Upload year wise, number of students enrolled and full time teachers on roll:
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange("yearwiseData", e.target.files[0])}
                className="w-full border rounded px-3 py-2"
              />
              {uploads.yearwiseData && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {uploads.yearwiseData.name}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">
                Circulars pertaining to assigning mentors to mentees:
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange("circulars", e.target.files[0])}
                className="w-full border rounded px-3 py-2"
              />
              {uploads.circulars && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {uploads.circulars.name}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">
                Mentor/Mentee ratio supporting document:
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange("ratioDoc", e.target.files[0])}
                className="w-full border rounded px-3 py-2"
              />
              {uploads.ratioDoc && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {uploads.ratioDoc.name}
                </p>
              )}
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="mt-auto bg-white border-t border-gray-200 shadow-inner py-4 px-6">
            <Bottom onNext={goToNextPage} onPrevious={goToPreviousPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Criteria2_3_3;
