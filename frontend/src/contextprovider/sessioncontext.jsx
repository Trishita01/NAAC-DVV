import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/v1/iiqa/sessions");
        const sessionData = response.data?.data?.[0];
        if (sessionData?.session_start_year && sessionData?.session_end_year) {
          const { session_start_year, session_end_year } = sessionData;
          const sessionList = [];
          for (let year = session_start_year; year < session_end_year; year++) {
            sessionList.push(`${year}-${(year + 1).toString().slice(-2)}`);
          }
          setSessions(sessionList);
        } else {
          setError("Invalid session data format");
        }
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
        setError("Could not load session years");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <SessionContext.Provider value={{ sessions, isLoading, error }}>
      {children}
    </SessionContext.Provider>
  );
};
