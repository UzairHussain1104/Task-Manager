import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./navbar";
import TaskView from "./taskView";
import Login from "./login";
import Dashboard from "./dashboard"
import CreateTask from "./createTask"

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:id" element={<TaskView />} />
        <Route path = "/dashboard/createTask" element={<CreateTask/>} />
      </Routes>
    </Router>
  );
}

export default App;
