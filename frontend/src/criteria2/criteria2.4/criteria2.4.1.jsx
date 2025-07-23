import React, { useState, useEffect, useContext } from "react";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Import your Session Context here
import { SessionContext } from "../../contextprovider/sessioncontext";  // adjust path accordingly

const Criteria2_4_1 = () => {
  const { sessions } = useContext(SessionContext);  // Get sessions from context
  // sessions = ["2024-25", "2023-24", "2022-23", ...]

  const [yearData, setYearData] = useState({});
  const [currentYear, setCurrentYear] = useState(sessions?.[0] || "");
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    yearOfAppointment: "",
    appointmentNature: "",
    department: "",
    experience: "",
    isServing: false,
  });

  const [uploads, setUploads] = useState({
    template: null,
    additionalInfo: null,
    facultyList: null,
  });

  const [provisionalScore, setProvisionalScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const goToNextPage = () => navigate("/criteria2.4.2");
  const goToPreviousPage = () => navigate("/criteria2.3.3");

  useEffect(() => {
    async function fetchScore() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:3000/api/v1/criteria2/score241");
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

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (field, file) => {
    setUploads({ ...uploads, [field]: file });
  };

  const handleSubmit = async () => {
    // Validate inputs first
    if (
      !formData.name ||
      !formData.designation ||
      !formData.yearOfAppointment ||
      !formData.appointmentNature ||
      !formData.department ||
      !formData.experience
    ) {
      alert("Please fill in all fields.");
      return;
    }
  
    const sessionYear = parseInt(currentYear.split("-")[0]);
    const yearOfAppointment = parseInt(formData.yearOfAppointment);
    const experience = parseInt(formData.experience);
  
    if (yearOfAppointment < 1990 || yearOfAppointment > new Date().getFullYear()) {
      alert("Year of Appointment must be between 1990 and current year.");
      return;
    }
  
      try {
      const payload = {
        session: sessionYear,
        name_of_the_full_time_teacher: formData.name,
        designation: formData.designation,
        year_of_appointment: yearOfAppointment,
        nature_of_appointment: formData.appointmentNature,
        name_of_department: formData.department,
        total_number_of_years_of_experience_in_the_same_institution: experience,
        is_the_teacher_still_serving: formData.isServing ? 'Yes' : 'No',
        year: currentYear,
        criteria_code: '2.4.1',
        submitted_at: new Date().toISOString()
      };
      
      console.log('Sending payload:', JSON.stringify(payload, null, 2));
      
      await axios.post("http://localhost:3000/api/v1/criteria2/createResponse222_241_243", payload);
  
      // Update frontend state
      const updatedYearData = {
        ...yearData,
        [currentYear]: [...(yearData[currentYear] || []), formData],
      };
      setYearData(updatedYearData);
  
      // Reset form
      setFormData({
        name: "",
        designation: "",
        yearOfAppointment: "",
        appointmentNature: "",
        department: "",
        experience: "",
        isServing: false,
      });
  
      alert("Data submitted successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           'Unknown error occurred';
        alert(`Submission failed: ${errorMessage}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response from server. Please check your connection and try again.");
      } else {
        console.error('Error message:', error.message);
        alert(`Failed to save data: ${error.message}`);
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
          {/* Metric Info Block */}
          <div className="bg-white border-l-4 border-blue-900 p-4 text-black mb-6 rounded shadow-sm">
            <h3 className="font-semibold text-blue-900 mb-2">2.4.1 Metric Information</h3>
            <p>Average percentage of full time teachers against sanctioned posts during the last five years</p>
            <p className="mt-3 font-medium text-blue-900">
              Data Requirement for last five years (As per Data Template):
            </p>
            <ul className="list-disc list-inside ml-4 text-black mt-1">
              <li>Number of full time teachers</li>
              <li>Number of sanctioned posts</li>
            </ul>
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
      ) : provisionalScore?.data?.score_sub_sub_criteria !== undefined ? (
        <div className="text-center">
          <span className="text-blue-600 text-lg font-bold">
            {typeof provisionalScore.data.score_sub_sub_criteria === 'number'
              ? provisionalScore.data.score_sub_sub_criteria.toFixed(2)
              : provisionalScore.data.score_sub_sub_criteria || 'N/A'}
          </span>
          {provisionalScore.message && (
            <span className="block text-gray-700 text-sm">{provisionalScore.message}</span>
          )}
        </div>
      ) : (
        <span className="text-gray-500">Score not available</span>
      )}
    </div>
  </div>
</div>

          {/* Year selector */}
          <div className="mb-4">
            <label className="font-medium text-gray-800 mr-2">Select Year:</label>
            <select
              className="border px-3 py-1 rounded text-gray-900"
              value={currentYear}
              onChange={(e) => setCurrentYear(e.target.value)}
            >
              {sessions && sessions.length > 0 ? (
                sessions.map((session) => (
                  <option key={session} value={session}>
                    {session}
                  </option>
                ))
              ) : (
                <option value="">No sessions available</option>
              )}
            </select>
          </div>

          {/* Data entry table */}
          <table className="w-full border text-sm mb-6">
            <thead className="bg-blue-100 text-black font-semibold">
              <tr>
                <th className="border px-2 py-1">Full-time Teacher</th>
                <th className="border px-2 py-1">Designation</th>
                <th className="border px-2 py-1">Year of Appointment</th>
                <th className="border px-2 py-1">Appointment Nature</th>
                <th className="border px-2 py-1">Department</th>
                <th className="border px-2 py-1">Years of Experience</th>
                <th className="border px-2 py-1">Still Serving</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white text-black">
                {[
                  "name",
                  "designation",
                  "yearOfAppointment",
                  "appointmentNature",
                  "department",
                  "experience",
                  "isServing",
                ].map((field, i) => (
                  <td key={i} className="border px-2 py-1">
                    {field === "isServing" ? (
                      <input
                        type="checkbox"
                        className="mx-auto block"
                        checked={formData[field]}
                        onChange={(e) => handleChange(field, e.target.checked)}
                      />
                    ) : (
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-1 text-black bg-white"
                        placeholder={field}
                        value={formData[field]}
                        onChange={(e) => handleChange(field, e.target.value)}
                      />
                    )}
                  </td>
                ))}
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

          {/* Yearly submitted data */}
          {sessions?.map((year) => (
            <div key={year} className="mb-8 border rounded overflow-x-auto">
              <h3 className="bg-blue-100 px-4 py-2 font-semibold text-blue-800">Year: {year}</h3>
              {yearData[year] && yearData[year].length > 0 ? (
                <table className="w-full text-sm border text-black">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="border px-2 py-1">#</th>
                      <th className="border px-2 py-1">Name</th>
                      <th className="border px-2 py-1">Designation</th>
                      <th className="border px-2 py-1">Year of Appointment</th>
                      <th className="border px-2 py-1">Appointment Nature</th>
                      <th className="border px-2 py-1">Department</th>
                      <th className="border px-2 py-1">Experience</th>
                      <th className="border px-2 py-1">Still Serving</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearData[year].map((entry, index) => (
                      <tr key={index} className="even:bg-gray-50">
                        <td className="border px-2 py-1">{index + 1}</td>
                        <td className="border px-2 py-1">{entry.name}</td>
                        <td className="border px-2 py-1">{entry.designation}</td>
                        <td className="border px-2 py-1">{entry.yearOfAppointment}</td>
                        <td className="border px-2 py-1">{entry.appointmentNature}</td>
                        <td className="border px-2 py-1">{entry.department}</td>
                        <td className="border px-2 py-1">{entry.experience}</td>
                        <td className="border px-2 py-1">{entry.isServing ? "Yes" : "No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600 px-4 py-2">No data submitted for this year.</p>
              )}
            </div>
          ))}

          {/* File Upload Section */}
          <div className="mt-10 border-t pt-6">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">File Description (Upload)</h3>
            {["template", "additionalInfo", "facultyList"].map((field, i) => (
              <div key={i} className="mb-4">
                <label className="block font-medium mb-1 capitalize">
                  {field === "template"
                    ? "Year wise full time teachers and sanctioned posts for 5 years (Data Template):"
                    : field === "additionalInfo"
                    ? "Any additional information:"
                    : "List of the faculty members authenticated by the Head of HEI:"}
                </label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(field, e.target.files[0])}
                  className="w-full border rounded px-3 py-2"
                />
                {uploads[field] && (
                  <p className="text-sm text-gray-600 mt-1">Selected: {uploads[field].name}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto bg-white border-t border-gray-200 shadow-inner py-4 px-6">
            <Bottom onNext={goToNextPage} onPrevious={goToPreviousPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Criteria2_4_1;
