import React, { useState } from "react";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
const Criteria6_3_4 = () => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    duration: "",

  });
  const [submittedData, setSubmittedData] = useState([]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    if (
      formData.name &&
      formData.title &&
      formData.duration
    ) {
      setSubmittedData([...submittedData, formData]);
      setFormData({
        name: "",
        title: "",
        duration: "",
      });
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">
              Criteria 6: Governance, Leadership and Management
            </h2>
            <div className="text-sm">
              <span className="text-gray-600">6.3-Faculty Empowerment Strategies</span>
              <i className="fas fa-chevron-down ml-2 text-gray-500"></i>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-center mb-4">
              <div className="text-center">
                <div className="text-lg font-medium text-green-500 bg-[#bee7c7] !w-[1000px] h-[50px] pt-[10px] rounded-lg">
                  Provisional Score: 18.75
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-blue-600 font-medium mb-2">6.3.4 Metric Information</h3>
              <p className="text-sm text-gray-700">
                Average percentage of teachers undergoing online/face-to-face 
Faculty development Programmes (FDP) during the last five years
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-blue-600 font-medium mb-2">Calculation Formula</h3>
              <p className="text-sm text-gray-700">
                Formula = (Total number of teaching staffs attending such programmes/number of full time teachers)
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-blue-600 font-medium mb-2">Required Documents:</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                <li className="mb-1">Minutes of relevant Academic Council/ BOS meetings</li>
                <li>IQAC report summary</li>
                <li>Reports of the Human Resource Development Centres (UGC 
ASC or other relevant centers).</li>
                <li>Upload any additional information</li>
                <li>Details of teachers attending professional development 
programmes during the last five years (Data Template).</li>
              </ul>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-500 mb-4">CBCS / Elective Course System Entry</h2>

          {/* Input Table */}
          <div className="flex justify-center overflow-auto border rounded mb-6">
            <table className="min-w-full border text-sm text-left max-w-full">
              <thead className="bg-gray-100 font-semibold text-gray-950">
                <tr>
                  {[
                    "Name of teacher who attended",
                    "Title of the program",
                  
                    "Duration (from – to) (DD-MM-YYYY)",
                  ].map((heading) => (
                    <th key={heading} className="px-4 py-2 border">
                      {heading}
                    </th>
                  ))}
                  <th className="px-4 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {[
                    "name",
                    "title",
                    "duration",
                  ].map((field) => (
                    <td key={field} className="px-2 py-2 border">
                      <input
                        type="text"
                        value={formData[field]}
                        onChange={(e) => handleChange(field, e.target.value)}
                        className="w-full px-2 py-1 border rounded text-gray-900 border-black"
                        placeholder={field}
                      />
                    </td>
                  ))}
                  <td className="px-2 py-2 border">
                    <button
                      onClick={handleSubmit}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Appended Data Table */}
          <div className="flex justify-center overflow-auto border rounded mb-6">
            <div className="w-full max-w-full">
              <h3 className="text-lg font-semibold mb-2 text-gray-950">Submitted Entries</h3>
              {submittedData.length > 0 ? (
                <table className="min-w-full text-sm border max-w-full border-black">
                  <thead className="bg-gray-950 font-semibold text-gray-950">
                    <tr>
                      <th className="px-4 py-2 border text-gray-750">#</th>
                      {[
                        "date",
                        "title_prof",
                        "title_adm",
                        "num",
                      ].map((heading) => (
                        <th key={heading} className="px-4 py-2 border text-gray-950">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {submittedData.map((entry, i) => (
                      <tr key={i} className="even:bg-gray-50 text-gray-950">
                        <td className="px-2 py-2 border border-black">{i + 1}</td>
                        <td className="px-2 py-2 border border-black">{entry.name}</td>
                        <td className="px-2 py-2 border border-black">{entry.title}</td>
                        <td className="px-2 py-2 border border-black">{entry.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600">No data submitted yet.</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-center overflow-auto border rounded p-4">
            <div className="w-full max-w-4xl">
              <h2 className="text-lg font-semibold mb-2 text-gray-700">
                Calculation Table (Last 5 Years)
              </h2>
              <table className="table-auto border-collapse w-full">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 font-semibold">
                    <th className="border border-[gray] px-4 py-2">YEAR</th>
                    <th className="border border-[gray] px-4 py-2">2020</th>
                    <th className="border border-[gray] px-4 py-2">2021</th>
                    <th className="border border-[gray] px-4 py-2">2022</th>
                    <th className="border border-[gray] px-4 py-2">2023</th>
                    <th className="border border-[gray] px-4 py-2">2024</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-4 py-2 font-medium text-gray-600">
                      Calculated Score
                    </td>
                    <td className="border border-black px-4 py-2 text-center">-</td>
                    <td className="border border-black px-4 py-2 text-center">-</td>
                    <td className="border border-black px-4 py-2 text-center">-</td>
                    <td className="border border-black px-4 py-2 text-center">-</td>
                    <td className="border border-black px-4 py-2 text-center">-</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-end mt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Calculate Score
                </button>
              </div>
              <p className="text-gray-600 mt-2">Total number of years considered: 5</p>
            </div>
          </div>

          <Bottom />
        </div>
      </div>
    </div>
  );
};

export default Criteria6_3_4