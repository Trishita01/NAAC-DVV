import React, { useState, useEffect } from "react";
import api from "../../api";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
import { useNavigate } from "react-router-dom";

// Mapping between body options and their numbers (server expects numeric option_selected)
const bodyOptions = {
  "Academic council/BoS of Affiliating university": 1,
  "Setting of question papers for UG/PG programs": 2,
  "Design and Development of Curriculum for Add on/certificate/ Diploma Courses": 3,
  "Assessment /evaluation process of the affiliating University": 4,
};

const Criteria1_1_3 = () => {
  const years = ["2024-25", "2023-24", "2022-23", "2021-22", "2020-21"];

  const [currentYear, setCurrentYear] = useState("2024-25");


  const [yearData, setYearData] = useState({});

  // Legacy radio state (kept to avoid breaking layout if you later re-enable radios)
  const [selectedOption, setSelectedOption] = useState("");

  const [autoSaveTimestamp, setAutoSaveTimestamp] = useState(null);

  // Form state for the input row *including* a free-text Year column the user asked to restore
  const [formData, setFormData] = useState({
    year: "", // free-text year (optional) -- if empty we'll fall back to the dropdown year
    name: "",
    body: "",
  });

  const [submittedData, setSubmittedData] = useState([]);

  // Provisional score fetch state
  const [provisionalScore, setProvisionalScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchScore() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(
          "/criteria1/score113"
        );
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

  /* --------------------------------------------------
   * Controlled inputs
   * ------------------------------------------------*/
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* --------------------------------------------------
   * Submit handler — sends typed year if present else dropdown year
   * ------------------------------------------------*/
  const handleSubmit = async () => {
    const name = formData.name.trim();
    const body = formData.body; // body string matches keys in bodyOptions
    const yearToSend = formData.year.trim() || currentYear; // prefer typed year

    if (!name || !body) {
      alert("Please fill in both Name of Teacher and select a Body.");
      return;
    }

    const option_selected = bodyOptions[body];
    if (!option_selected) {
      alert("Please select a valid body option.");
      return;
    }

    try {
      const response = await api.post(
        "/criteria1/createResponse113",
        {
          year: yearToSend,
          teacher_name: name,
          body_name: body,
          option_selected,
        }
      );

      console.log("Response created:", response.data);

      // Normalized record from API (fallback to request values if not echoed back)
      const resp = response?.data?.data || {};
      const newEntry = {
        year: resp.year || yearToSend,
        name: resp.teacher_name || name,
        body: resp.body_name || body,
        option: option_selected,
      };

      // Update flat submitted list (table just below form)
      setSubmittedData((prev) => [...prev, newEntry]);

      // Update grouped year data (year sections at bottom, like 2_1_1) using the *actual* year we sent
      setYearData((prev) => ({
        ...prev,
        [newEntry.year]: [...(prev[newEntry.year] || []), { name: newEntry.name, body: newEntry.body, option: option_selected }],
      }));

      // Reset form inputs (keep typed year? clearing per prior behaviour; change if desired)
      setFormData({ year: "", name: "", body: "" });
      setSelectedOption("");

      // Refresh provisional score after successful submit
      try {
        const scoreResponse = await api.get(
          "/criteria1/score113"
        );
        console.log("Updated score data:", scoreResponse.data);
        setProvisionalScore({
          score: scoreResponse.data.data,
          message: scoreResponse.data.message,
        });
      } catch (error) {
        console.error("Error fetching updated provisional score:", error);
        setError(error.message || "Failed to fetch updated score");
      }

      alert("Data submitted successfully!");
    } catch (error) {
      console.error("Error submitting:", error);
      if (error.response && error.response.data) {
        alert("Submission failed: " + error.response.data.message);
      } else {
        alert("Submission failed due to network/server error.");
      }
    }
  };

  /* --------------------------------------------------
   * (Legacy) selectedOption handler — kept for API compatibility if needed later
   * ------------------------------------------------*/
  const handleRadioChange = (option) => {
    setSelectedOption(option);
  };

  /* --------------------------------------------------
   * Navigation
   * ------------------------------------------------*/
  const goToNextPage = () => {
    navigate("/criteria1.2.1");
  };

  const goToPreviousPage = () => {
    navigate("/criteria1.1.2");
  };

  return (
    <div className="min-h-screen w-[1520px] bg-gray-50 flex flex-col">
      <Header />
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 p-6">
          {/* Heading */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-gray-800">Criteria 1: Curricular Aspects</h2>
            <div className="text-sm text-gray-600">1.1 - Curricular Planning and Implementation</div>
          </div>

          {/* Provisional Score */}
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
                    <span className="text-blue-600 text-lg font-bold">{provisionalScore.score}</span>
                    <br />
                    <span className="text-gray-700">{provisionalScore.message}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Score not available</span>
                )}
              </div>
            </div>
          </div>

          {/* Metric Information */}
          <div className="bg-white p-6 rounded shadow mb-6">
            <h3 className="text-blue-600 font-semibold mb-2">1.1.3 Metric Information</h3>
            <p className="text-sm text-gray-700 mb-2">
              Teachers of the Institution participate in the following activities:<br />
              1. Academic council/BoS of Affiliating university<br />
              2. Setting of question papers for UG/PG programs<br />
              3. Design and Development of Curriculum<br />
              4. Evaluation process of the affiliating University
            </p>

            <h4 className="text-blue-600 font-medium mb-2">Requirements:</h4>
            <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
              <li>Details of participation of teachers in various bodies/activities provided as a response to the metric</li>
              <li>Any additional information</li>
            </ul>
          </div>

          {/* Year Dropdown */}
          <div className="mb-4">
            <label className="font-medium text-gray-700 mr-2">Select Year:</label>
            <select
              className="border px-3 py-1 rounded text-black"
              value={currentYear}
              onChange={(e) => setCurrentYear(e.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Input Table */}
          <div className="flex justify-center overflow-auto border rounded mb-6">
            <table className="min-w-full border text-sm text-left">
              <thead className="bg-gray-100 font-semibold text-gray-950">
                <tr>
                  <th className="px-4 py-2 border">Year</th>
                  <th className="px-4 py-2 border">Name of Teacher</th>
                  <th className="px-4 py-2 border">Name of the Body</th>
                  <th className="px-4 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-2 border">
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => handleChange("year", e.target.value)}
                      className="w-full px-2 py-1 border rounded text-gray-900"
                      placeholder={currentYear}
                    />
                  </td>
                  <td className="px-2 py-2 border">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full px-2 py-1 border rounded text-gray-900"
                      placeholder="Name of Teacher"
                    />
                  </td>
                  <td className="px-2 py-2 border">
                    <select
                      value={formData.body}
                      onChange={(e) => handleChange("body", e.target.value)}
                      className="w-full px-2 py-1 border rounded text-gray-900"
                    >
                      <option value="">Select Body</option>
                      <option value="Academic council/BoS of Affiliating university">1.Academic council/BoS of Affiliating university</option>
                      <option value="Setting of question papers for UG/PG programs">2.Setting of question papers for UG/PG programs</option>
                      <option value="Design and Development of Curriculum for Add on/certificate/ Diploma Courses">3.Design and Development of Curriculum for Add on/certificate/ Diploma Courses</option>
                      <option value="Assessment /evaluation process of the affiliating University">4.Assessment /evaluation process of the affiliating University</option>
                    </select>
                  </td>
                  <td className="px-2 py-2 border">
                    <button
                      onClick={handleSubmit}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Submitted Entries Table */}
          {submittedData.length > 0 && (
            <div className="overflow-auto border rounded mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-950">Submitted Entries</h3>
              <table className="min-w-full text-sm border text-left">
                <thead className="bg-gray-100 font-semibold text-gray-950">
                  <tr>
                    <th className="px-4 py-2 border">#</th>
                    <th className="px-4 py-2 border">Year</th>
                    <th className="px-4 py-2 border">Name of Teacher</th>
                    <th className="px-4 py-2 border">Name of the Body</th>
                  </tr>
                </thead>
                <tbody>
                  {submittedData.map((entry, i) => (
                    <tr key={i} className="even:bg-gray-50">
                      <td className="px-2 py-2 border border-black text-gray-950">{i + 1}</td>
                      <td className="px-2 py-2 border border-black text-gray-950">{entry.year}</td>
                      <td className="px-2 py-2 border border-black text-gray-950">{entry.name}</td>
                      <td className="px-2 py-2 border border-black text-gray-950">{entry.body}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Radio / Descriptive Section (kept for visual continuity) */}
          <div className="bg-white p-6 rounded shadow mb-6">
            <h3 className="mb-2 text-gray-700">
              Teachers of the Institution participate in following activities related to curriculum development and assessment of the affiliating University and are represented on the following academic bodies during the last five years
            </h3>
            <h3 className="text-blue-600 font-semibold mb-3">Select the Options</h3>
            <p className="text-black">
              1. Academic council/BoS of Affiliating university<br />
              2. Setting of question papers for UG/PG programs<br />
              3. Design and Development of Curriculum for Add on/certificate/ Diploma Courses<br />
              4. Assessment /evaluation process of the affiliating University
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                <li>Upload  Additional information</li>
                <li>Link for Additional information</li>
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

            <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Paste Link for Additional Information</label>
            <input
              type="text"
              placeholder="Enter URL here"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
            />

            {/* Footer Buttons */}
            <div className="mt-auto bg-white border-t border-gray-200 shadow-inner py-4 px-6 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {autoSaveTimestamp ? (
                  <span>
                    <i className="fas fa-save mr-1"></i> Auto-saved at {autoSaveTimestamp}
                  </span>
                ) : (
                  <span>Changes will be auto-saved</span>
                )}
              </div>
              <div className="flex gap-4">{/* reserved for future action buttons */}</div>
            </div>
          </div>

          {/* Year-wise display (like 2_1_1) */}
          {years.map((year) => (
            <div key={year} className="mb-8 border rounded">
              <h3 className="text-lg font-semibold bg-gray-100 text-gray-800 px-4 py-2">Year: {year}</h3>
              {yearData[year] && yearData[year].length > 0 ? (
                <table className="w-full text-sm border border-black">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border border-black px-4 py-2 text-gray-800">#</th>
                      <th className="border border-black px-4 py-2 text-gray-800">Name of Teacher</th>
                      <th className="border border-black px-4 py-2 text-gray-800">Name of the Body</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearData[year].map((entry, index) => (
                      <tr key={index} className="even:bg-gray-50">
                        <td className="border border-black px-2 py-1 text-gray-700">{index + 1}</td>
                        <td className="border border-black px-2 py-1 text-gray-700">{entry.name}</td>
                        <td className="border border-black px-2 py-1 text-gray-700">{entry.body}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600 px-4 py-2">No data submitted for this year.</p>
              )}
            </div>
          ))}

          {/* Page Navigation */}
          <div className="mt-6">
            <Bottom onNext={goToNextPage} onPrevious={goToPreviousPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Criteria1_1_3;
