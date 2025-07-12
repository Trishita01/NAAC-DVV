import React, { useState } from "react";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
import { useNavigate } from "react-router-dom";

const Criteria2_3_3 = () => {
  const [data, setData] = useState({});
  const [currentYear, setCurrentYear] = useState(2023);
  const [formData, setFormData] = useState({
    mentors: "",
    mentees: "",
  });

  const [uploads, setUploads] = useState({
    yearwiseData: null,
    circulars: null,
    ratioDoc: null,
  });

  const navigate = useNavigate();

  const goToNextPage = () => {
    navigate("/criteria2.4.1");
  };

  const goToPreviousPage = () => {
    navigate("/criteria2.3.2");
  };
  const years = [2020, 2021, 2022, 2023, 2024];

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (field, file) => {
    setUploads({ ...uploads, [field]: file });
  };

  const handleSubmit = () => {
    const { mentors, mentees } = formData;
    if (!mentors || !mentees || isNaN(mentors) || isNaN(mentees)) {
      alert("Please enter valid numbers for both mentors and mentees.");
      return;
    }

    const ratio = `${mentors} : ${mentees}`;
    const updatedData = {
      ...data,
      [currentYear]: { mentors, mentees, ratio },
    };

    setData(updatedData);
    setFormData({ mentors: "", mentees: "" });
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

          {/* Year Selector */}
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

          {/* Display Year-wise Data */}
          {years.map((year) => (
            <div key={year} className="mb-6 border rounded overflow-x-auto">
              <h3 className="bg-blue-100 px-4 py-2 font-semibold text-blue-800">
                Year: {year}
              </h3>
              {data[year] ? (
                <table className="w-full text-sm border">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="border px-2 py-1">No. of Mentors</th>
                      <th className="border px-2 py-1">No. of Mentees</th>
                      <th className="border px-2 py-1">Ratio (Mentor : Mentee)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="even:bg-gray-50">
                      <td className="border px-2 py-1">{data[year].mentors}</td>
                      <td className="border px-2 py-1">{data[year].mentees}</td>
                      <td className="border px-2 py-1">{data[year].ratio}</td>
                    </tr>
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



