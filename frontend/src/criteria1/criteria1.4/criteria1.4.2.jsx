import React, { useState } from "react";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
import { useNavigate } from "react-router-dom";
import Criteria2_1_1 from "../../criteria2/criteria2.1/criteria2.1.1";
const Criteria1_4_2 = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [rows, setRows] = useState([]);
  const [nextId, setNextId] = useState(1);

  const handleRadioChange = (option) => {
    setSelectedOption(option);
  };

  const addRow = () => {
    setRows([...rows, { id: nextId, name: "" }]);
    setNextId(nextId + 1);
  };

  const handleRowNameChange = (id, name) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, name } : row)));
  };
  const navigate = useNavigate();
  const goToNextPage = () => {
    navigate('/criteria2.1.1'); 
  };

  const goToPreviousPage = () => {
    navigate('/criteria1.4.1'); 
  };
  return (
    <div className="min-h-screen w-[1520px] bg-gray-50 flex flex-col">
      <Header />
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 flex flex-col p-2 mt-[20px]">
          {/* Page Title and Score */}
           
          <div className="flex justify-between items-center mb-3 ">
            <h2 className="text-xl font-medium text-gray-800">
              Criteria 1: Curricular Aspects
            </h2>
            <div className="text-sm">
              <span className="text-gray-600">1.4-Feedback System</span>
              <i className="fas fa-chevron-down ml-2 text-gray-500"></i>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-center mb-4">
              <div className="text-center">
                
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-blue-600 font-medium mb-2">1.4.2 Metric Information</h3>
              <p className="text-sm text-gray-700">
                Feedback process of the Institution may be classified as follows: <br/>
Options: <br/>
A. Feedback collected, analysed and action taken and feedback <br/>
available on website 
B. Feedback collected, analysed and action has been taken  <br/>
C. Feedback collected and analysed <br/>
D. Feedback collected <br/>
E.  Feedback not collected
              </p>
            </div>

            

            <div className="mb-6">
              <h3 className="text-blue-600 font-medium mb-2">Requirements:</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                <li className="mb-1">Upload Stakeholders feedback report, Action taken report of the institute 
on it as stated in the minutes of the Governing Council, Syndicate, 
Board of Management </li>
               
               
              </ul>
            </div>
          </div>


          {/* Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 mb-2">Department</label>
              <select className="w-full border text-gray-950 border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select department</option>
                <option value="computer-science">Computer Science</option>
                <option value="mathematics">Mathematics</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Faculty ID</label>
              <input
                type="text"
                placeholder="Enter faculty ID"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-950"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 w-[100px]">Faculty Name</label>
              <input
                type="text"
                placeholder="Enter faculty name"
                className=" text-gray-950 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Radio Buttons */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-blue-600 font-medium mb-4">
              Select the Options ( Feedback process of the Institution
  )  
            </h3>
            <div className="space-y-3">
              {[
                "Feedback collected, analysed and action taken and feedback available on website ",
                "Feedback collected, analysed and action has been taken",
                "Feedback collected and analysed",
                "Feedback collected",
                "Feedback not collected"
              ].map((label, index) => {
                const optionKey = `option${index + 1}`;
                return (
                  <div key={optionKey} className="flex items-center">
                    <input
                      type="radio"
                      id={optionKey}
                      name="participation"
                      className="mr-3 h-4 w-4 text-blue-600"
                      checked={selectedOption === optionKey}
                      onChange={() => handleRadioChange(optionKey)}
                    />
                    <label htmlFor={optionKey} className="text-sm text-gray-800">{label}</label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-md mb-6">
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>URL for the feedback report 
</li>
              <li>Upload Stakeholders feedback report, Action taken report of the institute 
on it as stated in the minutes of the Governing Council, Syndicate, 
Board of Management </li>
<li>Any additional information (Upload) </li>
            </ul>
          </div>

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

          <div className="mt-6">
            <Bottom onNext={goToNextPage} onPrevious={goToPreviousPage} />
          </div>
          
          
        </div>
      </div>
    </div>
  );
};

export default Criteria1_4_2;
