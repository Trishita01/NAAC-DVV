import React, { useState } from "react";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { useNavigate } from "react-router-dom";
import Bottom from "../../components/bottom";

const Criteria2_2_2 = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState("");
  const [teachers, setTeachers] = useState("");
  const [ratio, setRatio] = useState(null);
  const [file, setFile] = useState(null);

  const handleCalculate = () => {
    const s = parseInt(students, 10);
    const t = parseInt(teachers, 10);

    if (!s || !t || isNaN(s) || isNaN(t)) {
      alert("Please enter valid numbers.");
      return;
    }

    setRatio(`${s} : ${t}`);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

   const goToNextPage = () => {
    navigate("/criteria2.3.1");
  };

  const goToPreviousPage = () => {
    navigate("/criteria2.2.1");
  };

  return (
    <div className="w-screen min-h-screen bg-white overflow-x-hidden text-black">
      <Header />
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        <div className="flex-1 p-6 space-y-8">
          <h2 className="text-2xl font-bold text-blue-900">
            2.2.2 Student - Full-time Teacher Ratio
          </h2>

          {/* Metric Info */}
          <div className="bg-white text-black p-4 border border-blue-200 rounded shadow">
            <h3 className="text-blue-700 text-lg font-semibold mb-2">
              2.2.2 Metric Information
            </h3>
            <p className="mb-4">
              Student-Full time teacher ratio (Data for the latest completed academic year)
            </p>
            <h4 className="text-blue-700 font-semibold mb-2">
              Data Requirement: (As per Data Template)
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Total number of Students enrolled in the Institution</li>
              <li>Total number of full time teachers in the Institution</li>
            </ul>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Total Students Enrolled:</label>
              <input
                type="number"
                value={students}
                onChange={(e) => setStudents(e.target.value)}
                className="w-full border border-blue-500 px-3 py-2 rounded"
                placeholder="Enter number of students"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Total Full-time Teachers:</label>
              <input
                type="number"
                value={teachers}
                onChange={(e) => setTeachers(e.target.value)}
                className="w-full border border-blue-500 px-3 py-2 rounded"
                placeholder="Enter number of teachers"
              />
            </div>
          </div>

          {/* Ratio Result */}
          <button
            onClick={handleCalculate}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Calculate Ratio
          </button>

          {ratio && (
            <div className="bg-blue-100 text-blue-900 p-4 rounded shadow w-fit">
              <p className="font-semibold">Calculated Ratio:</p>
              <p className="text-lg font-bold">{ratio}</p>
            </div>
          )}

          {/* File Upload */}
          <div>
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              File Description (Upload)
            </h3>
            <label className="block font-medium mb-1">
              Any Additional Information:
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={handleFileChange}
              className="border border-blue-500 rounded px-3 py-2 w-full"
            />
            {file && (
              <p className="text-sm text-gray-700 mt-1">
                Selected file:{" "}
                <span className="font-medium">
                  {file.name}
                </span>
              </p>
            )}
          </div>

          {/* Footer */}
          <p className="text-xs italic mt-6 text-gray-600">
            * Ratio is calculated based on latest completed academic year.
          </p>

          {/* Navigation */}
           <div className="mt-auto bg-white border-t border-gray-200 shadow-inner py-4 px-6">
            <Bottom onNext={goToNextPage} onPrevious={goToPreviousPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Criteria2_2_2;





