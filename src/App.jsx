import RoleSelector from "./components/RoleSelector";
import "./App.css";
import React from "react";
import { RoleProvider } from "./components/RoleContext";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="w-full min-h-screen h-auto   ">
      <div className="w-10/12 mx-auto ">
        <RoleProvider>
          <RoleSelector />
          <Dashboard />
        </RoleProvider>
        
      </div>
    </div>
  );
}

export default App;
