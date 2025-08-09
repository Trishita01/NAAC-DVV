import React, { useState } from "react";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { SessionContext } from "../../contextprovider/sessioncontext";
import { useContext } from "react";

const Criteria3_3_4 = () => {
  const [yearData, setYearData] = useState({});
  const [formData, setFormData] = useState({
    names: "",
    org: "",
    name_sch: "",
    year: "",
    num: ""
  });

  const navigate = useNavigate();

  // Update form data and ensure year is set from currentYear
  const handleChange = (field, value) => {
    if (field === 'year') {
      // For year field, ensure we store it as a string in formData
      value = value.toString();
    }
    setFormData({ ...formData, [field]: value });
  };

  // Get the year part from the currentYear session (e.g., "2023-24" -> "2023")
  const getYearFromSession = (session) => {
    if (!session) return "";
    return session.split('-')[0];
  };

  const handleSubmit = async () => {
    const { names, org, name_sch, year, num } = formData;
    
    if (!validateYear(year)) {
      alert("Please enter a valid year between 2000 and " + currentYear);
      return;
    }
    
    if (names && org && name_sch && year && num) {
      const newEntry = {
        names,
        org,
        name_sch,
        year,
        num
      };
      
      const updatedYearData = {
        ...yearData,
        [year]: [...(yearData[year] || []), newEntry],
      };
      
      setYearData(updatedYearData);
      setFormData({
        names: "",
        org: "",
        name_sch: "",
        year: "",
        num: ""
      });
    } else {
      alert("Please fill in all fields.");
    }
  };

  const goToNextPage = () => navigate("/criteria3.4.1");
  const goToPreviousPage = () => navigate("/criteria3.3.3");

  // Current year for validation
  const currentYear = new Date().getFullYear();
  
  // Validate year input
  const validateYear = (year) => {
    if (!year) return false;
    const yearNum = parseInt(year, 10);
    return !isNaN(yearNum) && yearNum >= 2000 && yearNum <= currentYear;
  };
  
  // Clean up session-related code since we're not using it anymore
  const sessionLoading = false;
  const sessionError = null;

  return (
    <div className="w-[1470px] min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        <div className="flex-1 p-6">

          {/* Title */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">Criteria 3: Research, Innovations and Extension</h2>
            <div className="text-sm text-gray-600">3.3 – Extension Activities</div>
          </div>

          {/* Info Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="mb-4">
              <h3 className="text-blue-600 font-medium mb-2">3.3.4 Metric Information</h3>
              <p className="text-sm text-gray-700">
                Number of extension and outreach Programs conducted in collaboration with industry, community and Non-Government Organizations through NSS/NCC/Red Cross/YRC etc., year-wise during the last five years.
              </p>
            </div>
            <div className="mb-6">
              <h3 className="text-blue-600 font-medium mb-2">Requirements:</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                <li>Reports of the event organized</li>
                <li>Any additional information</li>
              </ul>
            </div>
          </div>

          {/* Input Section */}
          <div className="border rounded mb-8">
            <div className="flex justify-between items-center bg-blue-100 text-gray-800 px-4 py-2">
              <h2 className="text-xl font-bold">Add On Programs</h2>
              <div className="flex items-center">
                <label className="mr-2 font-medium">Current Year: {currentYear}</label>
              </div>
            </div>

            <table className="w-full border text-sm border-black">
              <thead className="bg-gray-100 text-gray-950">
                <tr>
                  <th className="border px-2 py-2">Name of the activity</th>
                  <th className="border px-2 py-2">Organising unit/ agency/ collaborating agency</th>
                  <th className="border px-2 py-2">Name of the scheme</th>
                  <th className="border px-2 py-2">Year of activity</th>
                  <th className="border px-2 py-2">Number of students participated</th>
                  <th className="border px-2 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      className="w-full border text-gray-950 border-black rounded px-2 py-1"
                      value={formData.names}
                      onChange={(e) => handleChange("names", e.target.value)}
                      placeholder="Activity Name"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      className="w-full border text-gray-950 border-black rounded px-2 py-1"
                      value={formData.org}
                      onChange={(e) => handleChange("org", e.target.value)}
                      placeholder="Organising Agency"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      className="w-full border text-gray-950 border-black rounded px-2 py-1"
                      value={formData.name_sch}
                      onChange={(e) => handleChange("name_sch", e.target.value)}
                      placeholder="Scheme Name"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="w-full border text-gray-950 border-black rounded px-2 py-1"
                      value={formData.year || ''}
                      onChange={(e) => handleChange("year", parseInt(e.target.value) || '')}
                      placeholder="Enter year (e.g., 2023)"
                      min="2000"
                      max={currentYear}
                      required
                    />
                    {formData.year && !validateYear(formData.year) && (
                      <p className="text-red-500 text-xs mt-1">Please enter a valid year (2000-{currentYear})</p>
                    )}
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="w-full border text-gray-950 border-black rounded px-2 py-1"
                      value={formData.num}
                      onChange={(e) => handleChange("num", e.target.value)}
                      placeholder="No. of Students"
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

          {/* Display Submitted Data */}
          <div className="mb-8 border rounded">
            <h3 className="text-lg font-semibold bg-gray-100 text-gray-800 px-4 py-2">Submitted Data</h3>
            {Object.keys(yearData).length > 0 ? (
              <table className="w-full text-sm border">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border text-gray-950 px-4 py-2">#</th>
                    <th className="border text-gray-950 px-4 py-2">Activity</th>
                    <th className="border text-gray-950 px-4 py-2">Agency</th>
                    <th className="border text-gray-950 px-4 py-2">Scheme</th>
                    <th className="border text-gray-950 px-4 py-2">Year</th>
                    <th className="border text-gray-950 px-4 py-2">Participants</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(yearData).flatMap(([year, entries]) =>
                    entries.map((entry, index) => (
                      <tr key={`${year}-${index}`} className="even:bg-gray-50">
                        <td className="border text-gray-950 px-2 py-1">{index + 1}</td>
                        <td className="border text-gray-950 px-2 py-1">{entry.names}</td>
                        <td className="border text-gray-950 px-2 py-1">{entry.org}</td>
                        <td className="border text-gray-950 px-2 py-1">{entry.name_sch}</td>
                        <td className="border text-gray-950 px-2 py-1">{entry.year}</td>
                        <td className="border text-gray-950 px-2 py-1">{entry.num}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600 px-4 py-2">No data submitted yet.</p>
          )}
          </div>

          {/* Footer Navigation */}
          <div className="mt-auto bg-white border-t border-gray-200 shadow-inner py-4 px-6">
            <Bottom onNext={goToNextPage} onPrevious={goToPreviousPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Criteria3_3_4;
