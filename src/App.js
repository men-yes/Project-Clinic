import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Management from "./Components/Management";
import Login from "./Components/Login";
import Contact from "./Components/Contact";
import Specialization from "./Components/Specialization";
import Therapists from "./Components/Therapists";
import CurrentTherapist from "./Components/CurrentTherapist";
import Calendar from "./Components/Calendar";
function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Home" element={<Home/>}/>
        <Route path="/Login" element={<Login  />} />
        <Route path="/Management" element={<Management/>}/>
        <Route path="/Home" element={<Home/>}/>
        <Route path="/Contact" element={<Contact/>}/>
        <Route path="/Specialization" element={<Specialization/>}/>
        <Route path="/Therapists" element={<Therapists/>}/>
        <Route path="/CurrentTherapist" element={<CurrentTherapist/>}/>
        <Route path="/Calendar" element={<Calendar/>}/>
        
          
        
      </Routes>
    </Router>
  );
}

export default App;
