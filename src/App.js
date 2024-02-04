
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reset from "./pages/Reset";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      {/* App.js 
        It contains all routes of the application
      */}
      <Router>

        <Routes>

          <Route exact path="/" element={<Login />} />                          {/* root page (login page)*/}

          <Route exact path="/register" element={<Register />} />                         {/* root parallel page (registeration page)*/}

          <Route exact path="/reset" element={<Reset />} />                       {/* root parallel page (reset page)*/}

          <Route exact path="/dashboard" element={<Dashboard />} />                         {/* Main page Dasboard page contains todo application (registeration page)*/}

        </Routes>

      </Router>


    </>
  );
}

export default App;
