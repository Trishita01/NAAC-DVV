import React, { useState } from "react";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
import { useNavigate } from "react-router-dom";

const Criteria2_4_2 = () => {
  const [yearData, setYearData] = useState({});
  const [currentYear, setCurrentYear] = useState(2023);
  const [formData, setFormData] = useState({
    teacherName: "",
    qualificationYear: "",
    recognisedFor: "",
    yearOfRecognition: "",
    stillServing: "",
    scholarName: "",
    scholarRegYear: "",
    thesisTitle: "",
  });

  const [uploads, setUploads] = useState({
    additionalInfo: null,
    dataTemplate: null,
  });

  const handleFileChange = (field, file) => {
    setUploads({ ...uploads, [field]: file });
  };

  const years = [2020, 2021, 2022, 2023, 2024];
  const navigate = useNavigate();

  const goToNextPage = () => {
    navigate("/criteria2.4.3");
  };
   const goToPreviousPage = () => {
    navigate("/criteria2.4.1");
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    const fields = Object.values(formData);
    if (fields.every((v) => v.trim() !== "")) {
      const updatedYearData = {
        ...yearData,
        [currentYear]: [...(yearData[currentYear] || []), formData],
      };
      setYearData(updatedYearData);
      setFormData({
        teacherName: "",
        qualificationYear: "",
        recognisedFor: "",
        yearOfRecognition: "",
        stillServing: "",
        scholarName: "",
        scholarRegYear: "",
        thesisTitle: "",
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
        <div className="flex-1 p-6 bg-white">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            2.4.2 Number of Ph.Ds registered per eligible teacher during the last five years
          </h2>

          {/* Metric Information Section */}
          <div className="mb-6 p-4 bg-white border border-gray-300 rounded">
            <p className="font-semibold text-blue-900 mb-2 text-lg">2.4.2 Metric Information</p>
            <p className="text-sm text-black mb-2">
              Average percentage of full time teachers with Ph. D. / D.M. / M.Ch. / D.N.B Superspeciality / D.Sc. / D.Litt. during the last five years<br />
              (consider only highest degree for count)
            </p>
            <p className="font-semibold text-blue-900 mt-4 mb-1 text-sm">
              Data Requirement for last five years: (As per Data Template)
            </p>
            <ul className="list-disc ml-6 text-sm text-black">
              <li>Number of full time teachers with PhD./ D.M. / M.Ch. / D.N.B Superspeciality / D.Sc. / D.Litt.</li>
              <li>Total number of full time teachers</li>
            </ul>
          </div>

          {/* Year selector */}
          <div className="mb-4">
            <label className="font-medium text-black mr-2">Select Year:</label>
            <select
              className="border px-3 py-1 rounded text-black"
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Data entry table */}
          <table className="w-full border text-sm mb-6">
            <thead className="bg-gray-200">
              <tr className="text-black font-semibold">
                <th className="border px-2 py-1">Name of full time teacher with Ph.D./D.M/M.Ch./ D.N.B Superspeciality/ D.Sc./D.Litt.</th>
                <th className="border px-2 py-1">Qualification and Year</th>
                <th className="border px-2 py-1">Recognised as Research Guide</th>
                <th className="border px-2 py-1">Year of Recognition</th>
                <th className="border px-2 py-1">Still Serving / Last Year of Service</th>
                <th className="border px-2 py-1">Scholar Name</th>
                <th className="border px-2 py-1">Scholar Reg. Year</th>
                <th className="border px-2 py-1">Thesis Title</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {[
                  "teacherName",
                  "qualificationYear",
                  "recognisedFor",
                  "yearOfRecognition",
                  "stillServing",
                  "scholarName",
                  "scholarRegYear",
                  "thesisTitle",
                ].map((field, i) => (
                  <td key={i} className="border px-2 py-1">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-black"
                      value={formData[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                      placeholder={field}
                    />
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

          {/* Submitted year-wise data */}
          {years.map((year) => (
            <div key={year} className="mb-8 border rounded">
              <h3 className="bg-blue-100 px-4 py-2 font-semibold text-black">
                Year: {year}
              </h3>
              {yearData[year] && yearData[year].length > 0 ? (
                <table className="w-full text-sm border">
                  <thead className="bg-gray-200 text-black font-semibold">
                    <tr>
                      <th className="border px-2 py-1">#</th>
                      <th className="border px-2 py-1">Teacher Name</th>
                      <th className="border px-2 py-1">Qualification & Year</th>
                      <th className="border px-2 py-1">Recognised Guide</th>
                      <th className="border px-2 py-1">Year of Recognition</th>
                      <th className="border px-2 py-1">Still Serving</th>
                      <th className="border px-2 py-1">Scholar Name</th>
                      <th className="border px-2 py-1">Scholar Reg. Year</th>
                      <th className="border px-2 py-1">Thesis Title</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearData[year].map((entry, index) => (
                      <tr key={index} className="even:bg-gray-50 text-black">
                        <td className="border px-2 py-1">{index + 1}</td>
                        <td className="border px-2 py-1">{entry.teacherName}</td>
                        <td className="border px-2 py-1">{entry.qualificationYear}</td>
                        <td className="border px-2 py-1">{entry.recognisedFor}</td>
                        <td className="border px-2 py-1">{entry.yearOfRecognition}</td>
                        <td className="border px-2 py-1">{entry.stillServing}</td>
                        <td className="border px-2 py-1">{entry.scholarName}</td>
                        <td className="border px-2 py-1">{entry.scholarRegYear}</td>
                        <td className="border px-2 py-1">{entry.thesisTitle}</td>
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
            <h3 className="text-lg font-semibold text-blue-900 mb-4">File Description (Upload)</h3>

            <div className="mb-4">
              <label className="block font-medium mb-1">
                Any additional information:
              </label>
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
                List of number of full time teachers with Ph.D./D.M./M.Ch./D.N.B Superspeciality/D.Sc./D.Litt. and number of full time teachers for 5 years (Data Template):
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

          {/* Bottom navigation */}
          <div className="mt-auto bg-white border-t border-gray-200 shadow-inner py-4 px-6">
            <Bottom onNext={goToNextPage} onPrevious={goToPreviousPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Criteria2_4_2;









