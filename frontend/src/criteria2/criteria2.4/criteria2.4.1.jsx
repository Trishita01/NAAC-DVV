import React, { useState } from "react";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
import { useNavigate } from "react-router-dom";

const Criteria2_4_1 = () => {
  const [yearData, setYearData] = useState({});
  const [currentYear, setCurrentYear] = useState(2023);
  const [formData, setFormData] = useState({
    name: "",
    pan: "",
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

  const navigate = useNavigate();
  const goToNextPage = () => {
    navigate("/criteria2.4.2");
  };

  const goToPreviousPage = () => {
    navigate("/criteria2.3.3");
  };
  const years = [2020, 2021, 2022, 2023, 2024];

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (field, file) => {
    setUploads({ ...uploads, [field]: file });
  };

  const handleSubmit = () => {
    const values = { ...formData };
    if (Object.values(values).every((v) => v !== "" && v !== null)) {
      const updatedYearData = {
        ...yearData,
        [currentYear]: [...(yearData[currentYear] || []), formData],
      };
      setYearData(updatedYearData);
      setFormData({
        name: "",
        pan: "",
        designation: "",
        yearOfAppointment: "",
        appointmentNature: "",
        department: "",
        experience: "",
        isServing: false,
      });
    } else {
      alert("Please fill in all fields.");
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

          {/* Year selector */}
          <div className="mb-4">
            <label className="font-medium text-gray-800 mr-2">Select Year:</label>
            <select
              className="border px-3 py-1 rounded text-gray-900"
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Data entry table */}
          <table className="w-full border text-sm mb-6">
            <thead className="bg-blue-100 text-black font-semibold">
              <tr>
                <th className="border px-2 py-1">Full-time Teacher</th>
                <th className="border px-2 py-1">PAN</th>
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
                {["name", "pan", "designation", "yearOfAppointment", "appointmentNature", "department", "experience", "isServing"].map((field, i) => (
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
          {years.map((year) => (
            <div key={year} className="mb-8 border rounded overflow-x-auto">
              <h3 className="bg-blue-100 px-4 py-2 font-semibold text-blue-800">
                Year: {year}
              </h3>
              {yearData[year] && yearData[year].length > 0 ? (
                <table className="w-full text-sm border text-black">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="border px-2 py-1">#</th>
                      <th className="border px-2 py-1">Name</th>
                      <th className="border px-2 py-1">PAN</th>
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
                        <td className="border px-2 py-1">{entry.pan}</td>
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
            <h3 className="text-xl font-semibold text-blue-900 mb-4">
              File Description (Upload)
            </h3>

            <div className="mb-4">
              <label className="block font-medium mb-1">
                Year wise full time teachers and sanctioned posts for 5 years (Data Template):
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange("template", e.target.files[0])}
                className="w-full border rounded px-3 py-2"
              />
              {uploads.template && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {uploads.template.name}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">
                Any additional information:
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange("additionalInfo", e.target.files[0])}
                className="w-full border rounded px-3 py-2"
              />
              {uploads.additionalInfo && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {uploads.additionalInfo.name}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">
                List of the faculty members authenticated by the Head of HEI:
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange("facultyList", e.target.files[0])}
                className="w-full border rounded px-3 py-2"
              />
              {uploads.facultyList && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {uploads.facultyList.name}
                </p>
              )}
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

export default Criteria2_4_1;