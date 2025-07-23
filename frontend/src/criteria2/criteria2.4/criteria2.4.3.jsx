import React, { useState, useEffect } from "react";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Criteria2_4_3 = () => {
  const [yearData, setYearData] = useState({});
  const [currentYear, setCurrentYear] = useState(2023);

  const [uploads, setUploads] = useState({
    additionalInfo: null,
    dataTemplate: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const goToNextPage = () => navigate("/criteria2.5.1");
  const goToPreviousPage = () => navigate("/criteria2.4.2");

  const years = [2020, 2021, 2022, 2023, 2024];

  // Fetch data saved in 2.4.1 for selected year
  useEffect(() => {
    async function fetchYearData() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/criteria2/createResponse241243222233`);
        if (response.data && response.data.data) {
          setYearData(prev => ({ ...prev, [currentYear]: response.data.data }));
        } else {
          setYearData(prev => ({ ...prev, [currentYear]: [] }));
        }
      } catch (err) {
        setError("Failed to fetch data for the selected year.");
        setYearData(prev => ({ ...prev, [currentYear]: [] }));
      } finally {
        setLoading(false);
      }
    }
    fetchYearData();
  }, [currentYear]);

  const handleFileChange = (field, file) => {
    setUploads({ ...uploads, [field]: file });
  };

  return (
    <div className="w-screen min-h-screen bg-gray-50 overflow-x-hidden text-black">
      <Header />
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            2.4.3 Average teaching experience of full-time teachers in the same institution
          </h2>

          {/* Metric Info */}
          <div className="bg-white p-4 rounded shadow mb-6 text-sm leading-relaxed">
            <p className="text-blue-900 font-semibold mb-2">2.4.3 Metric Information</p>
            <p className="text-black mb-1">
              Average teaching experience of full time teachers in the same institution
              (Data for the latest completed academic year in number of years)
            </p>
            <p className="text-blue-900 font-semibold mb-1">
              Data Requirement for last five years (As per Data Template)
            </p>
            <ul className="list-disc ml-6 text-black">
              <li>
                Name and Number of full time teachers with years of teaching experiences
              </li>
            </ul>
          </div>

          {/* Year Selector */}
          <div className="mb-4">
            <label className="font-medium text-gray-800 mr-2">Select Year:</label>
            <select
              className="border px-3 py-1 rounded text-gray-900"
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Info Message */}
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-900 p-3 rounded mb-6 text-sm">
            Data is fetched from <strong>2.4.1</strong> and is readonly here.
          </div>

          {/* Data table loaded from 2.4.1 */}
          {loading ? (
            <p>Loading data...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : yearData[currentYear] && yearData[currentYear].length > 0 ? (
            <div className="mb-8 border rounded overflow-x-auto">
              <h3 className="bg-blue-100 px-4 py-2 font-semibold text-blue-800">
                Year: {currentYear}
              </h3>
              <table className="w-full text-sm border">
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
                  {yearData[currentYear].map((entry, idx) => (
                    <tr key={idx} className="even:bg-gray-50">
                      <td className="border px-2 py-1">{idx + 1}</td>
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
            </div>
          ) : (
            <p className="text-gray-600 px-4 py-2">No data submitted for this year.</p>
          )}

          {/* File Upload Section */}
          <div className="mt-10 border-t pt-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              File Description (Upload)
            </h3>
            <div className="mb-4">
              <label className="block font-medium mb-1">Any additional information:</label>
              <input
                type="file"
                className="w-full border px-3 py-2 rounded"
                onChange={(e) => handleFileChange("additionalInfo", e.target.files[0])}
              />
              {uploads.additionalInfo && (
                <p className="text-sm text-black mt-1">
                  Selected: {uploads.additionalInfo.name}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">
                List of Teachers including their PAN, designation, dept and experience
                details (Data Template):
              </label>
              <input
                type="file"
                className="w-full border px-3 py-2 rounded"
                onChange={(e) => handleFileChange("dataTemplate", e.target.files[0])}
              />
              {uploads.dataTemplate && (
                <p className="text-sm text-black mt-1">
                  Selected: {uploads.dataTemplate.name}
                </p>
              )}
            </div>
          </div>

          <p className="text-xs italic text-gray-600 mt-6">
            * Also to be used for verification of teacher data for metric 2.2.2 & 2.3.3
          </p>

          <div className="mt-auto bg-white border-t border-gray-200 shadow-inner py-4 px-6">
            <Bottom onNext={goToNextPage} onPrevious={goToPreviousPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Criteria2_4_3;
