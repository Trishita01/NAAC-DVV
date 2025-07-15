import React, { useState } from "react";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
import { useNavigate } from "react-router-dom";

const Criteria2_1_1 = () => {
  const years = ["2024-25", "2023-24", "2022-23", "2021-22", "2020-21"];
  const [currentYear, setCurrentYear] = useState("2024-25");
  const [yearData, setYearData] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    seats: 0,
    totalstudents: 0,

     supportLinks: [""],
  });

  const navigate = useNavigate();

  const handleChange = (field, value, index = null) => {
  if (field === "supportLinks") {
    const updatedLinks = [...formData.supportLinks];
    updatedLinks[index] = value;
    setFormData({ ...formData, supportLinks: updatedLinks });
  } else {
    setFormData({ ...formData, [field]: value });
  }
};

  const handleSubmit = () => {
    const { name, code, seats, totalstudents } = formData;
    if (name && code && seats && totalstudents) {
      const updatedYearData = {
        ...yearData,
        [currentYear]: [...(yearData[currentYear] || []), formData],
      };
      setYearData(updatedYearData);
      setFormData({ name: "", code: "", seats: 0, totalstudents: 0, supportLinks: [""],});

      const ratio = (totalstudents / seats) * 100;
      alert(`Data saved! Ratio calculated: ${ratio.toFixed(2)}%`);
    } else {
      alert("Please fill in all fields.");
    }
  };

  const goToNextPage = () => {
    navigate("/criteria2.1.2");
  };

  const goToPreviousPage = () => {
    navigate("/criteria2.1.1");
  };

  return (
    <div className="w-screen min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        <div className="flex-1 p-6">
          {/* Heading */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">
              Criteria 2: Teaching-Learning and Evaluation
            </h2>
            <div className="text-sm text-gray-600">
              2.1-Student Enrolment and Profile
            </div>
          </div>

          {/* Info Block */}
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

          {/* Input Form */}
          <div className="border rounded mb-8">
            <h2 className="text-xl font-bold bg-blue-100 text-gray-800 px-4 py-2">
              Average Enrolment Percentage - {currentYear}
            </h2>
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-gray-800">Programme Name</th>
                  <th className="border px-4 py-2 text-gray-800">Programme Code</th>
                  <th className="border px-4 py-2 text-gray-800">Seats Sanctioned</th>
                  <th className="border px-4 py-2 text-gray-800">Students Admitted</th>
                  <th className="border px-4 py-2 text-gray-800">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-gray-600 placeholder-gray-400"
                      placeholder="Program Name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-gray-600 placeholder-gray-400"
                      placeholder="Program Code"
                      value={formData.code}
                      onChange={(e) => handleChange("code", e.target.value)}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="w-full border rounded px-2 py-1 text-gray-600 placeholder-gray-400"
                      placeholder="Seats Sanctioned"
                      value={formData.seats}
                      onChange={(e) => handleChange("seats", Number(e.target.value))}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      className="w-full border rounded px-2 py-1 text-gray-600 placeholder-gray-400"
                      placeholder="Students Admitted"
                      value={formData.totalstudents}
                      onChange={(e) => handleChange("totalstudents", Number(e.target.value))}
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

          <div className="mb-6">
  <label className="block text-gray-700 font-medium mb-2">
   Link to relevant documents
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

          {/* Display Data for All Years */}
          {years.map((year) => (
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

