
import React, { useState } from "react";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
import { useNavigate } from "react-router-dom";

const Criteria3_1_2 = () => {
  const pastFiveYears = Array.from({ length: 5 }, (_, i) => `${2024 - i}-${(2024 - i + 1).toString().slice(-2)}`);
  const [selectedYear, setSelectedYear] = useState(pastFiveYears[0]);

  const [yearData, setYearData] = useState({});
  const [formData, setFormData] = useState({
    proj: "",
    name: "",
    princ: "",
    dept: "",
    amt: "",
    duration: "",
    agency: "",
    type: "",
    supportLinks: [""],
  });

  const [yearScores, setYearScores] = useState(
    pastFiveYears.reduce((acc, year) => ({ ...acc, [year]: 0 }), {})
  );
  const [yearCount, setYearCount] = useState(5);
  const [averageScore, setAverageScore] = useState(null);

  const navigate = useNavigate();
  const years = pastFiveYears;

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
    const { proj, name, princ, dept, amt, duration, agency, type } = formData;

    if (proj && name && princ && dept && amt && duration && agency && type) {
      const updatedForm = { ...formData, year: selectedYear };

      const updatedYearData = {
        ...yearData,
        [selectedYear]: [...(yearData[selectedYear] || []), updatedForm],
      };

      setYearData(updatedYearData);
      setFormData({
        proj: "",
        name: "",
        princ: "",
        year: "",
        amt: "",
        duration: "",
        agency: "",
        type: "",
        supportLinks: [""],
      });
    } else {
      alert("Please fill in all fields.");
    }
  };

  const goToNextPage = () => navigate("/criteria3.1.2");
  const goToPreviousPage = () => navigate("/criteria4.4.2");

  const totalPrograms = years.reduce((acc, year) => acc + (yearData[year]?.length || 0), 0);
  const averagePrograms = (totalPrograms / years.length).toFixed(2);

  return (
    <div className="w-[1690px] min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">
              Criteria 3- Research, Innovations and Extension
            </h2>
            <div className="text-sm text-gray-600">3.2- Resource Mobilization for Research</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-center mb-4">
              <div className="text-center">
                <div className="text-lg font-medium text-green-500 bg-[#bee7c7] !w-[1000px] h-[50px] pt-[10px] rounded-lg">
                  Provisional Score: 18.75
                </div>
              </div>
              </div></div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-blue-600 font-medium mb-2">3.1.2*** Metric Information</h3>
            <p className="text-sm text-gray-700">
             3.1.2.1: Number of departments having Research projects funded by government and non-government agencies during the last five years

            </p>
            <h3 className="text-blue-600 font-medium mt-4 mb-2">Requirements:</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              <li>List of research projects and funding details(Data Template)</li>
<li>Any additional information</li>
<li>Supporting document from Funding Agency</li>
<li>Paste link to funding agency website</li>
            </ul>


            
          </div>

          <div className="border rounded mb-8">
            <div className="flex justify-between items-center bg-blue-100 text-gray-800 px-4 py-2">
              <h2 className="text-xl font-bold">
                Grants received from Government and non-governmental agencies for
                research projects / endowments in the institution during the last five
                years (INR in Lakhs)
              </h2>
              <div>
                <label className="mr-2 font-medium">Select Year:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="border px-3 py-1 rounded text-gray-950"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <table className="w-full border text-sm">
              <thead className="bg-gray-100 text-gray-950">
                <tr>
                  <th className="border px-2 py-2">Name of the Project/ Endowments, Chairs</th>
                  <th className="border px-2 py-2">Name of the Principal Investigator/Co-Investigator</th>
                  <th className="border px-2 py-2">Department of Principal Investigator</th>
                  <th className="border px-2 py-2">Year of Award</th>
                  <th className="border px-2 py-2">Amount Sanctioned</th>
                  <th className="border px-2 py-2">Duration of the project</th>
                  <th className="border px-2 py-2">Name of the Funding Agency </th>
                  <th className="border px-2 py-2"> Type  (Government/non-Government)</th>
                  <th className="border px-2 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {["proj", "name", "dept", "year", "amt", "duration", "agency", "type"].map((key) => (
                    <td key={key} className="border px-2 py-1">
                      <input
                        className="w-full border text-gray-950 border-black rounded px-2 py-1"
                        placeholder={key.replace(/([A-Z])/g, " $1")}
                        value={formData[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                      />
                    </td>
                  ))}
                  <td className="border px-2 py-1 text-center">
                    <button
                      className="!bg-blue-600 text-white px-3 py-1 rounded hover:!bg-blue-700"
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
              Links to relevant documents:
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
                className="mt-2 px-3 py-1 !bg-blue-600 text-white rounded hover:!bg-blue-700 w-fit"
              >
                + Add Another Link
              </button>
            </div>
          </div>

          {years.map((year) => (
            <div key={year} className="mb-8 border rounded">
              <h3 className="text-lg font-semibold bg-gray-100 text-gray-800 px-4 py-2">Year: {year}</h3>
              {yearData[year]?.length > 0 ? (
                <table className="w-full text-sm border">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border text-gray-900 px-2 py-1">#</th>
                      <th className="border text-gray-900 px-2 py-1">proj</th>
                      <th className="border text-gray-900 px-2 py-1">name</th>
                      <th className="border text-gray-900 px-2 py-1">princ</th>
                      <th className="border text-gray-900 px-2 py-1">dept</th>
                      <th className="border text-gray-900 px-2 py-1">amt</th>
                      <th className="border text-gray-900 px-2 py-1">duration</th>
                      <th className="border text-gray-900 px-2 py-1">agency</th>
                      <th className="border text-gray-900 px-2 py-1">type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearData[year].map((entry, idx) => (
                      <tr key={idx} className="even:bg-gray-50">
                        <td className="border text-gray-900 border-black px-2 py-1">{idx + 1}</td>
                        <td className="border text-gray-900 border-black px-2 py-1">{entry.proj}</td>
                        <td className="border text-gray-900 border-black px-2 py-1">{entry.name}</td>
                        <td className="border text-gray-900 border-black px-2 py-1">{entry.princ}</td>
                        <td className="border text-gray-900 border-black px-2 py-1">{entry.dept}</td>
                        <td className="border text-gray-900 border-black px-2 py-1">{entry.amt}</td>
                        <td className="border text-gray-900 border-black px-2 py-1">{entry.duration}</td>
                        <td className="border text-gray-900 border-black px-2 py-1">{entry.agency}</td>
                        <td className="border text-gray-900 border-black px-2 py-1">{entry.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600 p-4">No data available for {year}.</p>
              )}
            </div>
          ))}

          <div className="overflow-auto border rounded p-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              Calculation Table (Last 5 Years)
            </h2>
            <table className="table-auto border-collapse w-full">
              <thead>
                <tr className="bg-gray-100 text-gray-600 font-semibold">
                  <th className="border px-4 py-2">Year</th>
                  {Object.keys(yearScores).map((year) => (
                    <th key={year} className="border px-4 py-2">{year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2 font-medium text-gray-600">Calculated Score</td>
                  {Object.keys(yearScores).map((year) => (
                    <td key={year} className="border px-4 py-2 text-center">
                      <input
                        type="number"
                        value={yearScores[year]}
                        onChange={(e) =>
                          setYearScores({ ...yearScores, [year]: parseFloat(e.target.value) || 0 })
                        }
                        className="w-20 text-center border px-1 rounded text-gray-950"
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            <div className="flex items-center gap-2 mt-4">
              <label className="text-sm font-medium text-gray-700">
                Enter number of years for average:
              </label>
              <input
                type="number"
                value={yearCount}
                min={1}
                max={5}
                onChange={(e) => setYearCount(parseInt(e.target.value) || 1)}
                className="w-20 border px-2 py-1 rounded text-center text-gray-950"
              />
              <button
                className="ml-4 px-4 py-2 !bg-blue-600 text-white rounded hover:!bg-green-700"
                onClick={() => {
                  const values = Object.values(yearScores).slice(0, yearCount);
                  const sum = values.reduce((acc, val) => acc + val, 0);
                  setAverageScore((sum / yearCount).toFixed(2));
                }}
              >
                Calculate Average
              </button>
            </div>
            {averageScore !== null && (
              <div className="mt-4 text-blue-700 font-semibold">
                Average Score for last {yearCount} year(s): {averageScore}%
              </div>
            )}
          </div>

          <div className="mt-auto bg-white border-t border-gray-200 shadow-inner py-4 px-6">
            <Bottom onNext={goToNextPage} onPrevious={goToPreviousPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Criteria3_1_2;


