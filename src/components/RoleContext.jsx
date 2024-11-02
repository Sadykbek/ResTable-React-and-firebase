import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState('viewer'); // Установите роль по умолчанию

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
