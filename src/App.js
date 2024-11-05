import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Management from "./Components/Management";
import Login from "./Components/Login";
import Contact from "./Components/Contact";
function App() {
  // const authenticateUser = (username, password) => {
  //   const users = [
  //     { username: 'adminUser', password: 'adminPass', role: 'admin' },
  //     { username: 'therapistUser', password: 'therapistPass', role: 'therapist' },
  //   ];
  //   const user = users.find(u => u.username === username && u.password === password);
  //   return user ? user.role : null;
  // };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Home" element={<Home/>}/>
        <Route path="/Login" element={<Login  />} />
        <Route path="/Management" element={<Management/>}/>
        <Route path="/Home" element={<Home/>}/>
        <Route path="/Contact" element={<Contact/>}/>
          
          
        
      </Routes>
    </Router>
  );
}

export default App;
