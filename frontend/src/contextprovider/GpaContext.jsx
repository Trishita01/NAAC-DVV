import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

export const GpaContext = createContext();
const createEmptyCriteria = () => {
  const criteriaTitles = [
    'Curricular Aspects',
    'Teaching-Learning and Evaluation',
    'Research, Innovations and Extension',
    'Infrastructure and Learning Resources',
    'Student Support and Progression',
    'Governance, Leadership and Management',
    'Institutional Values and Best Practices'
  ];

  return criteriaTitles.map((title, index) => ({
    id: index + 1,
    title,
    score: 0,
    target: 0,
    status: 'Not Set',
    subcriteria: Array(6).fill().map((_, i) => ({
      code: `${index + 1}.${Math.floor(i/2) + 1}.${(i % 2) + 1}`,
      title: `${title} - Subcriteria ${i + 1}`,
      score: 0,
      target: 0
    }))
  }));
};

export const GpaProvider = ({ children }) => {
  const [gpaData, setGpaData] = useState({
    collegeId: '',
    currentGPA: 0,
    targetGPA: 0,
    grade: 'N/A',
    criteria: createEmptyCriteria(),
    isLoading: true,
    error: null
  });

  const fetchGpaData = useCallback(async () => {
    try {
      setGpaData(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await axios.get('/api/gpa/college-summary');
      
      const apiData = response.data;
      
      setGpaData(prev => ({
        ...prev,
        ...apiData,
        isLoading: false,
        criteria: apiData.criteria || createEmptyCriteria(),
        currentGPA: apiData.currentGPA || 0,
        targetGPA: apiData.targetGPA || 0,
        grade: apiData.grade || 'N/A',
        error: null
      }));
    } catch (error) {
      console.error('Error fetching GPA data:', error);
      setGpaData(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to load GPA data',
        criteria: createEmptyCriteria()
      }));
    }
  }, []);

  useEffect(() => {
    fetchGpaData();
  }, [fetchGpaData]);

  return (
    <GpaContext.Provider value={{ ...gpaData, refetch: fetchGpaData }}>
      {children}
    </GpaContext.Provider>
  );
};

export const useGpa = () => {
  const context = useContext(GpaContext);
  if (!context) {
    throw new Error('useGpa must be used within a GpaProvider');
  }
  return context;
};
