import React, { useState } from "react";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { useNavigate } from "react-router-dom";

const Criteria2_1_2 = () => {
  const navigate = useNavigate();
  const years = ["2024-25", "2023-24", "2022-23", "2021-22", "2020-21"];
  const categories = ["SC", "ST", "OBC", "Divyangjan", "Gen", "Others"];

  const [currentYear, setCurrentYear] = useState("2024-25");
  const [yearData, setYearData] = useState({});
  const [dataRows, setDataRows] = useState({
    "2024-25": [
      {
        seats: { SC: "", ST: "", OBC: "", Divyangjan: "", Gen: "", Others: "" },
        students: { SC: "", ST: "", OBC: "", Divyangjan: "", Gen: "", Others: "" },
      },
    ],
  });

  const handleChange = (year, rowIndex, type, category, value) => {
    const updatedRows = [...(dataRows[year] || [])];
    updatedRows[rowIndex][type][category] = value;
    setDataRows({ ...dataRows, [year]: updatedRows });
  };

  const addRow = () => {
    const updated = [...(dataRows[currentYear] || [])];
    updated.push({
      seats: { SC: "", ST: "", OBC: "", Divyangjan: "", Gen: "", Others: "" },
      students: { SC: "", ST: "", OBC: "", Divyangjan: "", Gen: "", Others: "" },
    });
    setDataRows({ ...dataRows, [currentYear]: updated });
  };

  const handleSubmit = () => {
    setYearData({ ...yearData, [currentYear]: dataRows[currentYear] });
    alert("Data saved successfully!");
  };

  const handleDraft = () => {
    console.log("Draft saved", dataRows[currentYear]);
    alert("Draft saved.");
  };

  return (
    <div className="w-screen min-h-screen bg-white text-black overflow-x-auto">
      <Header />
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <h2 className="text-lg font-semibold mb-4">
            2.1.2 Average percentage of seats filled against seats reserved for various categories (SC, ST, OBC, Divyangjan, etc.) during the last five years
          </h2>

          {/* Metric Info */}
          <div className="bg-white text-black p-4 mb-6">
            <h3 className="text-blue-700 text-lg font-semibold mb-2">2.1.2 Metric Information</h3>
            <p className="mb-4">
              Average percentage of seats filled against seats reserved for various categories (SC, ST, OBC, Divyangjan, etc. as per applicable reservation policy during the last five years (exclusive of supernumerary seats).
            </p>
            <h4 className="text-blue-700 font-semibold mb-2">Data Requirement for last five years: (As per Data Template)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Number of students admitted from the reserved category</li>
              <li>Total number of seats earmarked for reserved category as per GOI or State government rule</li>
            </ul>
          </div>

          {/* Year Selector */}
          <div className="mb-4">
            <label className="font-medium text-gray-700 mr-2">Select Year:</label>
            <select
              className="border px-3 py-1 rounded text-black"
              value={currentYear}
              onChange={(e) => setCurrentYear(e.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Data Entry Table */}
          <table className="w-full border border-black mb-4 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th rowSpan="2" className="border border-black px-2 py-1">Year</th>
                <th colSpan={categories.length} className="border border-black px-2 py-1">
                  Number of seats earmarked for reserved category
                </th>
                <th colSpan={categories.length} className="border border-black px-2 py-1">
                  Number of students admitted from reserved category
                </th>
              </tr>
              <tr className="bg-gray-100">
                {categories.map((cat) => (
                  <th key={`seat-${cat}`} className="border border-black px-2 py-1">{cat}</th>
                ))}
                {categories.map((cat) => (
                  <th key={`student-${cat}`} className="border border-black px-2 py-1">{cat}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(dataRows[currentYear] || []).map((row, index) => (
                <tr key={index} className="even:bg-gray-50">
                  <td className="border border-black px-2 py-1">{currentYear}</td>
                  {categories.map((cat) => (
                    <td key={`seats-${index}-${cat}`} className="border border-black px-1">
                      <input
                        type="number"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={row.seats[cat]}
                        onChange={(e) =>
                          handleChange(currentYear, index, "seats", cat, e.target.value)
                        }
                      />
                    </td>
                  ))}
                  {categories.map((cat) => (
                    <td key={`students-${index}-${cat}`} className="border border-black px-1">
                      <input
                        type="number"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={row.students[cat]}
                        onChange={(e) =>
                          handleChange(currentYear, index, "students", cat, e.target.value)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add Row Button (Black) */}
          <button
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 mb-6"
            onClick={addRow}
          >
            Add Row
          </button>

          {/* Display Submitted Year Data */}
          {years.map((year) => (
            <div key={year} className="border border-gray-400 rounded mb-4">
              <h3 className="bg-gray-200 text-lg font-semibold px-4 py-2">Year: {year}</h3>
              {yearData[year] && yearData[year].length > 0 ? (
                <table className="w-full border border-black text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-black px-2 py-1">#</th>
                      {categories.map((cat) => (
                        <th key={`th-seat-${cat}`} className="border border-black px-2 py-1">{cat} Seats</th>
                      ))}
                      {categories.map((cat) => (
                        <th key={`th-stud-${cat}`} className="border border-black px-2 py-1">{cat} Students</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {yearData[year].map((entry, idx) => (
                      <tr key={idx}>
                        <td className="border border-black px-2 py-1">{idx + 1}</td>
                        {categories.map((cat) => (
                          <td key={`td-seat-${idx}-${cat}`} className="border border-black px-2 py-1">{entry.seats[cat]}</td>
                        ))}
                        {categories.map((cat) => (
                          <td key={`td-stud-${idx}-${cat}`} className="border border-black px-2 py-1">{entry.students[cat]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="px-4 py-2 text-gray-600">No data submitted for this year.</p>
              )}
            </div>
          ))}

          {/* Navigation and Save Buttons (All Blue) */}
          <div className="flex justify-between items-center mt-6 mb-10">
  <button
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    onClick={() => navigate("/criteria2.1.1")}
  >
    ← Previous
  </button>
  <div className="space-x-3">
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      onClick={handleDraft}
    >
      Save draft
    </button>
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      onClick={handleSubmit}
    >
      Submit entry
    </button>
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      onClick={() => navigate("/criteria2.1.3")}
    >
      Next →
    </button>
  </div>
</div>

        </div>
      </div>
    </div>
  );
};

export default Criteria2_1_2;


