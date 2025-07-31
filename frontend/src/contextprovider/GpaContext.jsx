import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

export const GpaContext = createContext();

export const GpaProvider = ({ children }) => {
  const [gpaData, setGpaData] = useState({
    collegeId: '',
    currentGPA: 0,
    targetGPA: 0,
    grade: 'N/A',
    criteria: [],
    isLoading: true,
    error: null,
  });

  const fetchGpaData = useCallback(async () => {
    try {
      setGpaData(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await axios.get('http://localhost:3000/api/v1/scores/getCollegeSummary');

      const apiData = response.data;

      // If data is missing, fall back to default
      const criteria = (apiData.criteria || []).map((crit, index) => ({
        id: crit.id ?? index + 1,
        title: crit.title?.trim() ?? `Criteria ${index + 1}`,
        score: crit.score ?? 0,
        target: crit.target ?? 0,
        status: crit.status ?? 'Not Set',
        averageGrade: crit.averageGrade ?? 0,
        subcriteria: (crit.subcriteria || []).map((sub, subIndex) => ({
          code: sub.code ?? `${crit.id ?? index + 1}.0${subIndex + 1}`,
          title: sub.title ?? `Subcriteria ${subIndex + 1}`,
          score: sub.score ?? 0,
          target: sub.target ?? 0,
          grade: sub.grade ?? 0,
          targetPercentage: sub.targetPercentage ?? 0
        }))
      }));

      setGpaData({
        collegeId: apiData.collegeId ?? '',
        currentGPA: apiData.currentGPA ?? 0,
        targetGPA: apiData.targetGPA ?? 0,
        grade: apiData.grade ?? 'N/A',
        criteria,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching GPA data:', error);
      setGpaData(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch GPA data'
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
