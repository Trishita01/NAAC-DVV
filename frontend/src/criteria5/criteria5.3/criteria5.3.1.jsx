import React, { useState } from "react";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";
import { useEffect } from "react";
import { SessionContext } from "../../contextprovider/sessioncontext";

const Criteria5_3_1 = () => {
 const pastFiveYears = Array.from({ length: 5 }, (_, i) => `${2024 - i}-${(2024 - i + 1).toString().slice(-2)}`);
   const [selectedYear, setSelectedYear] = useState(pastFiveYears[0]);
   const [yearData, setYearData] = useState({});
   const [provisionalScore, setProvisionalScore] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [currentYear, setCurrentYear] = useState(pastFiveYears[0]);
   const { sessions: availableSessions } = useContext(SessionContext);
   useEffect(() => {
     if (availableSessions && availableSessions.length > 0) {
       setCurrentYear(availableSessions[0]);
       setSelectedYear(availableSessions[0]);
     }
   }, [availableSessions]);

  const [formData, setFormData] = useState({
    year: "",
    name: "",
    team: "",
    uni: "",
    sports: "",
    studentname: "",
    
    supportLinks: [""],
  });
  const [submittedData, setSubmittedData] = useState([]);

  const navigate = useNavigate();

  const fetchScore = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:3000/api/v1/criteria5/score511");
      setProvisionalScore(response.data);
    } catch (error) {
      console.error("Error fetching score:", error);
      setError(error.message || "Failed to fetch score");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScore();
  }, []);


  const handleChange = (field, value, index = null) => {
  if (field === "supportLinks") {
    const updatedLinks = [...formData.supportLinks];
    updatedLinks[index] = value;
    setFormData({ ...formData, supportLinks: updatedLinks });
  } else {
    setFormData({ ...formData, [field]: value });
  }
};
const handleSubmit = async (e) => {
  e?.preventDefault();
  
  const {
    year: award_name,
    name: student_name,
    team: team_or_individual,
    uni: level,
    sports: activity_type
  } = formData;

  const year = currentYear;
  const session = year.split("-")[0];

  if (!award_name || !student_name || !team_or_individual || !level || !activity_type) {
    alert("Please fill in all required fields (Award Name, Student Name, Team/Individual, Level, and Activity Type).");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/criteria5/createResponse531",
      {
        session: parseInt(session, 10),
        year,
        award_name,
        team_or_individual,
        level,
        activity_type,
        student_name
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      }
    );

    // Update local state with the new entry
    const newEntry = {
      year,
      studentname: student_name_contact,
      programme: program_graduated_from,
      employer: employer_details,
      paypackage: pay_package_inr
    };

    setSubmittedData(prev => [...prev, newEntry]);
    
    // Update yearData
    setYearData(prev => ({
      ...prev,
      [year]: [...(prev[year] || []), newEntry]
    }));
    
    // Reset form
    setFormData({
      studentname: "",
      programme: "",
      employer: "",
      paypackage: "",
      supportLinks: [""],
    });

    // Refresh the score
    fetchScore();
    alert("Data submitted successfully!");
  } catch (error) {
    console.error("Error submitting:", error);
    alert(error.response?.data?.message || error.message || "Submission failed due to server error");
  }
};

  const goToNextPage = () => {
    navigate("/criteria5.3.2");
  };

  const goToPreviousPage = () => {
    navigate("/criteria5.2.3");
  };

  return (
    <div className="min-h-screen w-[1520px] bg-gray-50 flex flex-col">
      <Header />
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">
              Criteria 5: Student Support and Progression
            </h2>
            <div className="text-sm">
              <span className="text-gray-600">5.3-Student Participation and Activities</span>
              <i className="fas fa-chevron-down ml-2 text-gray-500"></i>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {/* <div className="flex justify-center mb-4">
              <div className="text-center">
                <div className="text-lg font-medium text-green-500 bg-[#bee7c7] !w-[1000px] h-[50px] pt-[10px] rounded-lg">
                  Provisional Score: 18.75
                </div>
              </div>
            </div> */}

            <div className="mb-6">
              <h3 className="text-blue-600 font-medium mb-2">5.3.1 Metric Information</h3>
              <p className="text-sm text-gray-700">
                Number of awards/medals for outstanding performance in sports/cultural activities at university/state/national / international level (award for a team event should be counted as one)
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-blue-600 font-medium mb-2">Requirements:</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                <li className="mb-1">e-copies of award letters and certificates</li>
                <li>Number of awards/medals for outstanding performance in
sports/cultural activities at university/state/national/international
level</li>
<li>Any additional information</li>
              </ul>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-500 mb-4">Number of awards/medals for outstanding performance in sports/cultural activities at university/state/national / international level</h2>

          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
              {loading ? (
                <p className="text-gray-600">Loading provisional score...</p>
              ) : provisionalScore?.data ? (
                <div>
                  <p className="text-lg font-semibold text-green-800">
                    Provisional Score (5.1.1): {provisionalScore.data.score}
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">No score data available.</p>
              )}
            </div>


          {/* Year Dropdown */}
          <div className="mb-4">
            <label className="font-medium text-gray-700 mr-2">Select Year:</label>
            <select
              className="border px-3 py-1 rounded text-black"
              value={currentYear}
              onChange={(e) => setCurrentYear(e.target.value)}
            >
              {availableSessions && availableSessions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Input Table */}
          <div className="flex justify-center overflow-auto border rounded mb-6">
            <table className="min-w-full border text-sm text-left max-w-full">
              <thead className="bg-gray-100 font-semibold text-gray-950">
                <tr>
                  {[
                    "Year",
                    "Name of the award",
                    "Team/Individual",
                    "University/State/National/ International ",
                    "Sports/ Cultural ",
                    "Name of the student",
                   
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
                    "year",
                    "name",
                    "team",
                    "uni",
                    "sports",
                    "name",
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
                      className="px-3 py-1 !bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Dynamic Support Links Input */}
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


          {/* Submitted Data Table */}
          <div className="flex justify-center overflow-auto border rounded mb-6">
            <div className="w-full max-w-full">
              <h3 className="text-lg font-semibold mb-2 text-gray-950">Submitted Entries</h3>
              {submittedData.length > 0 ? (
                <table className="min-w-full text-sm border max-w-full border-black">
                  <thead className="bg-white font-semibold text-gray-950">
                    <tr>
                      <th className="px-4 py-2 border text-gray-750">#</th>
                      <th className="px-4 py-2 border text-gray-950">Year</th>
                      {[
                        "Year",
                        "Name of the award",
                        "Team/Individual",
                        "University/State/National/ International ",
                        "Sports/ Cultural ",
                        "Name of the student",
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
                        <td className="px-2 py-2 border border-black">{entry.year}</td>
                        <td className="px-2 py-2 border border-black">{entry.name}</td>
                        <td className="px-2 py-2 border border-black">{entry.team}</td>
                        <td className="px-2 py-2 border border-black">{entry.uni}</td>
                        <td className="px-2 py-2 border border-black">{entry.sports}</td>
                        <td className="px-2 py-2 border border-black">{entry.name}</td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600">No data submitted yet.</p>
              )}
            </div>
          </div>

          {/* Calculation Table */}
          <div className="mt-8 flex justify-center overflow-auto border rounded p-4">
            <div className="w-full max-w-4xl">
              <h2 className="text-lg font-semibold mb-2 text-gray-700">Calculation Table (Last 5 Years)</h2>
              <table className="table-auto border-collapse w-full">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 font-semibold">
                    <th className="border border-[gray] px-4 py-2">YEAR</th>
                    {pastFiveYears.map((year) => (
                      <th key={year} className="border border-[gray] px-4 py-2">
                        {year}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-4 py-2 font-medium text-gray-600">
                      Calculated Score
                    </td>
                    {pastFiveYears.map((year) => (
                      <td key={year} className="border border-black px-4 py-2 text-center">
                        -
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-end mt-4">
                <button className="px-4 py-2 !bg-blue-600 text-white rounded hover:bg-blue-700">
                  Calculate Score
                </button>
              </div>
              <p className="text-gray-600 mt-2">Total number of years considered: 5</p>
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

export default Criteria5_3_1;
