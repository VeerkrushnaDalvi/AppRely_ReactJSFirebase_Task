// import logo from './logo.svg';
import Home from "./pages/home"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reset from "./pages/Reset";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login/>}/>
          {/* <Route exact path="/" element={<Login />} /> */}
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    

      {/* <div className="App">
        <Home />
      </div> */}

    </>
  );
}

export default App;
