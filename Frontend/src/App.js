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
import M_manager from "./Components/ManagerComponent/M_manager";
import M_therapists from "./Components/ManagerComponent/M_therapists";
import M_customers from "./Components/ManagerComponent/M_customers";
import M_appointments from "./Components/ManagerComponent/M_appointments";
function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Home" element={<Home/>}/>
        <Route path="/Login" element={<Login  />} />
        <Route path="/Management" element={<Management/>}/>
        <Route path="/Contact" element={<Contact/>}/>
        <Route path="/Specialization" element={<Specialization/>}/>
        <Route path="/Therapists" element={<Therapists/>}/>
        <Route path="/CurrentTherapist" element={<CurrentTherapist/>}/>
        <Route path="/Calendar" element={<Calendar/>}/>
        <Route path="/M_manager" element={<M_manager/>}/>
        <Route path="/M_therapists" element={<M_therapists/>}/>
        <Route path="/M_customers" element={<M_customers/>}/>
        <Route path="/M_appointments" element={<M_appointments/>}/>
    
      </Routes>
    </Router>
  );
}

export default App;
