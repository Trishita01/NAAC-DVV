
import axios from 'axios';

import React, { useState } from "react";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
import { useNavigate } from "react-router-dom";

const Criteria1_1_3 = () => {
   const years = ["2024-25", "2023-24", "2022-23", "2021-22", "2020-21"];
    const [currentYear, setCurrentYear] = useState("2024-25");
    const [yearData, setYearData] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [formData, setFormData] = useState({
    year: "",
    name: "",
    body: "",
  });
  const [submittedData, setSubmittedData] = useState([]);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

 const handleSubmit = async () => {
  if (formData.year && formData.name && formData.body && selectedOption) {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/criteria1/createResponse113', {
        year: formData.year,
        teacher_name: formData.name,
        body_name: formData.body,
        option_selected: selectedOption.slice(-1) // extracts '1','2' etc
      });

      console.log("Response created:", response.data);

      // Update table with returned DB entry to show confirmed data
      setSubmittedData([...submittedData, response.data.data]);

      // Reset form
      setFormData({
        year: "",
        name: "",
        body: "",
      });
      setSelectedOption("");

      alert("Data submitted successfully!");

    } catch (error) {
      console.error("Error submitting:", error);
      if (error.response && error.response.data) {
        alert("Submission failed: " + error.response.data.message);
      } else {
        alert("Submission failed due to network/server error.");
      }
    }
  } else {
    alert("Please fill in all fields and select an option.");
  }
};


  const handleRadioChange = (option) => {
    setSelectedOption(option);
  };

  const goToNextPage = () => {
    navigate("/criteria1.2.1");
  };

  const goToPreviousPage = () => {
    navigate("/criteria1.1.2");
  };

  return (
    <div className="min-h-screen w-[1520px] bg-gray-50 flex flex-col">
      <Header />
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-gray-800">Criteria 1: Curricular Aspects</h2>
            <div className="text-sm text-gray-600">
              1.1 - Curricular Planning and Implementation
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow mb-6">
            <h3 className="text-blue-600 font-semibold mb-2">1.1.3 Metric Information</h3>
            <p className="text-sm text-gray-700">
              Teachers of the Institution participate in the following activities:<br />
              1. Academic council/BoS of Affiliating university<br />
              2. Setting of question papers for UG/PG programs<br />
              3. Design and Development of Curriculum<br />
              4. Evaluation process of the affiliating University
            </p>

              <h4 className="text-blue-600 font-medium mb-2">Requirements:</h4>
            <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
              <li>Details of participation of teachers in various bodies/activities
provided as a response to the metric
 
 </li>
 <li>Any additional information</li>
             
              
            </ul>
          </div>


          {/* Input Table */}
          <div className="flex justify-center overflow-auto border rounded mb-6">
            <table className="min-w-full border text-sm text-left">
              <thead className="bg-gray-100 font-semibold text-gray-950">
                <tr>
                  <th className="px-4 py-2 border">Year</th>
                  <th className="px-4 py-2 border">Name of Teacher</th>
                  <th className="px-4 py-2 border">Name of the Body</th>
                  <th className="px-4 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-2 border">
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => handleChange("year", e.target.value)}
                      className="w-full px-2 py-1 border rounded text-gray-900"
                      placeholder="Year"
                    />
                  </td>
                  <td className="px-2 py-2 border">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full px-2 py-1 border rounded text-gray-900"
                      placeholder="Name of Teacher"
                    />
                  </td>
                  <td className="px-2 py-2 border">
                    <input
                      type="text"
                      value={formData.body}
                      onChange={(e) => handleChange("body", e.target.value)}
                      className="w-full px-2 py-1 border rounded text-gray-900"
                      placeholder="Name of the Body"
                    />
                  </td>
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

          
          {/* Submitted Entries Table */}
          {submittedData.length > 0 && (
            <div className="overflow-auto border rounded mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-950">Submitted Entries</h3>
              <table className="min-w-full text-sm border text-left">
                <thead className="bg-gray-100 font-semibold text-gray-950">
                  <tr>
                    <th className="px-4 py-2 border">#</th>
                    <th className="px-4 py-2 border">Year</th>
                    <th className="px-4 py-2 border">Name of Teacher</th>
                    <th className="px-4 py-2 border">Name of the Body</th>
                  </tr>
                </thead>
                <tbody>
                  {submittedData.map((entry, i) => (
                    <tr key={i} className="even:bg-gray-50">
                      <td className="px-2 py-2 border border-black text-gray-950">{i + 1}</td>
                      <td className="px-2 py-2 border border-black text-gray-950 ">{entry.year}</td>
                      <td className="px-2 py-2 border border-black text-gray-950">{entry.name}</td>
                      <td className="px-2 py-2 border border-black text-gray-950">{entry.body}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Radio Buttons */}
          <div className="bg-white p-6 rounded shadow mb-6">
            <h3 className="  mb-2 text-gray-700">Teachers of the Institution participate in following activities related to
curriculum development and assessment of the affiliating University
and/are represented on the following academic bodies during the last
five years<br/>
</h3>
            <h3 className="text-blue-600 font-semibold mb-3">Select the Options</h3>
            {[
            " 1. Academic council/BoS of Affiliating university",
              "2. Setting of question papers for UG/PG programs",
              "Design and Development of Curriculum for Add on/certificate/ Diploma Courses",
              "4. Assessment /evaluation process of the affiliating University",
            ].map((label, index) => {
              const optionKey = `option${index + 1}`;
              return (
                <div key={optionKey} className="flex items-center mb-2">
                  <input
                    type="radio"
                    id={optionKey}
                    name="participation"
                    className="mr-2"
                    checked={selectedOption === optionKey}
                    onChange={() => handleRadioChange(optionKey)}
                  />
                  <label htmlFor={optionKey} className="text-sm text-gray-800">
                    {label}
                  </label>
                </div>
              );
            })}
          </div>

          {/* File Upload Section */}
          <div className="bg-white p-6 rounded shadow mb-6">
            <ul className="list-disc text-sm text-gray-700 mb-4 pl-5">
              <li>Upload scanned letters from affiliating university</li>
              <li>Details of participation of teachers</li>
              <li>Any additional information</li>
            </ul>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Documents</label>
            <div className="flex items-center mb-4">
              <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                <i className="fas fa-upload mr-2"></i>Choose Files
                <input type="file" className="hidden" multiple />
              </label>
              <span className="ml-3 text-gray-600">No file chosen</span>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">Paste Link for Additional Information</label>
            <input
              type="text"
              placeholder="Enter URL here"
              className="w-full px-4 py-2 border rounded text-gray-900"
            />
          </div>

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

          <div className="mt-6">
            <Bottom onNext={goToNextPage} onPrevious={goToPreviousPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Criteria1_1_3;
