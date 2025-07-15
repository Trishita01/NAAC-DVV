import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const [expandedCriteria, setExpandedCriteria] = useState(null);
  const [expandedSubCriteria, setExpandedSubCriteria] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleCriteria = (criteriaId) => {
    setExpandedCriteria((prev) => (prev === criteriaId ? null : criteriaId));
    setExpandedSubCriteria(null);
  };

  const toggleSubCriteria = (subId) => {
    setExpandedSubCriteria((prev) => (prev === subId ? null : subId));
  };

  const fullCriteriaList = [
    {
      id: "1",
      title: "Criteria 1: Curricular Aspects",
      subCriteria: [
        {
          id: "1.1",
          name: "1.1 Curriculum Design and Review",
          subItems: ["1.1.1", "1.1.2", "1.1.3"],
        },
        {
          id: "1.2",
          name: "1.2 Academic Flexibility",
          subItems: ["1.2.1", "1.2.2", "1.2.3"],
        },
        {
          id: "1.3",
          name: "1.3 Curriculum Enrichment",
          subItems: ["1.3.1", "1.3.2", "1.3.3"],
        },
        {
          id: "1.4",
          name: "1.4 Feedback System",
          subItems: ["1.4.1", "1.4.2"],
        },
      ],
    },
    {
      id: "2",
      title: "Criteria 2: Teaching-Learning and Evaluation",
      subCriteria: [
        {
          id: "2.1",
          name: "2.1 Student Enrollment",
          subItems: ["2.1.1", "2.1.2"],
        },
        {
          id: "2.2",
          name: "2.2 Catering to Student Diversity",
          subItems: ["2.2.1", "2.2.2"],
        },
        {
          id: "2.3",
          name: "2.3. Teaching- Learning Process (50)",
          subItems: ["2.3.1", "2.3.2","2.3.3"],
        },
      ],
    },
    {
      id: "3",
      title: "Criteria 3: Research, Innovations and Extension",
      subCriteria: [
        {
          id: "3.1",
          name: "3.1 Promotion of Research",
          subItems: ["3.1.1", "3.1.2","3.1.3"],
        },
        {
          id: "3.2",
          name: " 3.2- Research Publication and Awards",
          subItems: ["3.2.1", "3.2.2"],
        },
      ],
    },
    {
      id: "4",
      title: "Criteria 4: Infrastructure and Learning Resources",
      subCriteria: [
        {
          id: "4.1",
          name: "4.1 Physical Facilities",
          subItems: ["4.1.1", "4.1.2","4.1.3","4.1.4"],
        },
        {
          id: "4.2",
          name: "4.2 Library as a learning Resource",
          subItems: ["4.2.1", "4.2.2","4.2.3","4.2.4"],
        },
        {
          id: "4.3",
          name: "4.3 IT Infrastructure",
          subItems: ["4.3.1", "4.3.2","4.3.3"],
        },
        {
          id: "4.4",
          name: "4.4 Maintenance of Campus Infrastructure",
          subItems: ["4.4.1", "4.4.2"],
        },

      ],
    },
    {
      id: "5",
      title: "Criteria 5: Student Support and Progression",
      subCriteria: [
        {
          id: "5.1",
          name: "5.1 Student Support",
          subItems: ["5.1.1", "5.1.2", "5.1.3", "5.1.4", "5.1.5"],
        },
        {
          id: "5.2",
          name: "5.2 Student Progression",
          subItems: ["5.2.1", "5.2.2", "5.2.3"],
        },
        {
          id: "5.3",
          name: "5.3 Student Participation and Activities",
          subItems: ["5.3.1", "5.3.2", "5.3.3"],
        },
        {
          id: "5.4",
          name: "5.4 Alumni Engagement",
          subItems: ["5.4.1", "5.4.2"],
        },
      ],
    },
    {
      id: "6",
      title: "Criteria 6: Governance, Leadership and Management",
      subCriteria: [
        {
          id: "6.1",
          name: "6.1 Institutional Vision and Leadership",
          subItems: ["6.1.1", "6.1.2"],
        },
      ],
    },
    {
      id: "7",
      title: "Criteria 7: Institutional Values and Best Practices",
      subCriteria: [
        {
          id: "7.1",
          name: "7.1 Environment Consciousness",
          subItems: ["7.1.1", "7.1.2"],
        },
      ],
    },
  ];

  return (
    <div
      className={`${
        collapsed ? "w-12" : "w-64"
      } !bg-[white] border-r min-h-[calc(100vh-104px)] transition-all duration-300`}
    >
      <div className="flex justify-between items-center p-2 border-b">
        <span className="text-sm font-medium text-gray-700">
          {!collapsed && "Criteria"}
        </span>
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="bg-white hover:text-white"
        >
          <FontAwesomeIcon icon={collapsed ? faAngleRight : faAngleLeft} />
        </button>
      </div>

      {!collapsed && (
        <div className="border-t">
          {fullCriteriaList.map((criteria) => (
            <div className="relative border-t" key={criteria.id}>
              <button
  className="w-full text-left p-4 pr-10 text-sm font-medium text-blue-700 !bg-white cursor-pointer"
  onClick={() => toggleCriteria(criteria.id)}
>
  {criteria.title}
</button>
              {expandedCriteria === criteria.id && (
                <div className="pl-6 border-l ml-4 mt-2">
                  {criteria.subCriteria.map((sub) => (
                    <div key={sub.id}>
                      <div
                        className="py-2 px-4 text-sm text-blue-700 bg-blue-50 font-medium cursor-pointer"
                        onClick={() => toggleSubCriteria(sub.id)}
                      >
                        {sub.name}
                      </div>

                      {expandedSubCriteria === sub.id && (
                        <div className="pl-6 border-l ml-4">
                          {sub.subItems.map((item) => (
                            <div
                              key={item}
                              onClick={() => navigate(`/criteria${item}`)}
                              className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
