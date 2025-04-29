import React, { createContext, useState, useContext, useEffect } from 'react';

const ViolationContext = createContext();

export const ViolationProvider = ({ children }) => {
  const [violations, setViolations] = useState([]);

  const fetchViolations = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/violations');
      const data = await res.json();
      setViolations(data);
    } catch (err) {
      console.error("Failed to fetch violations", err);
    }
  };

  useEffect(() => {
    fetchViolations();
  }, []);

  return (
    <ViolationContext.Provider value={{ violations, fetchViolations }}>
      {children}
    </ViolationContext.Provider>
  );
};

export const useViolations = () => useContext(ViolationContext);
