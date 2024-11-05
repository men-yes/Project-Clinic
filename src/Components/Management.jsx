import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "../CSScomponents/Management.css";
import Footer from "./Footer";
import Header from "./Header";

const Management = () => {
  const [authorizedAccess, setAuthorizedAccess] = useState([]);
  const [therapists, setTherapists] = useState([]);

  // בקשה לקבלת המורשים
  useEffect(() => {
    fetch("http://localhost:5000/api/authorized")
      .then((response) => response.json())
      .then((data) => setAuthorizedAccess(data))
      .catch((error) => console.error("שגיאה בקבלת נתוני המורשים:", error));
  }, []);

  // בקשה לקבלת המטפלים
  useEffect(() => {
    fetch("http://localhost:5000/api/therapists")
      .then((response) => response.json())
      .then((data) => setTherapists(data))
      .catch((error) => console.error("שגיאה בקבלת נתוני המטפלים:", error));
  }, []);

  return (
    <div>
      <Header />
      <Navbar />
      <div>
        <h1 className="title"> שלום </h1>
        <section className="center-button">
        <button className="button">הוסף \ הסר מטפל</button>
        </section>        
        <div className="div-tables">
          <h2>נתוני מורשים</h2>
          <table>
            <thead>
              <tr>
              <th>תפקיד</th>
                <th>שם</th>
              </tr>
            </thead>
            <tbody>
              {authorizedAccess.map((user) => (
                <tr key={user.id}>
                  <td>{user.role_type}</td>
                  <td>{user.name}</td>                 
                </tr>
              ))}
            </tbody>
          </table>

          <h2>נתוני מטפלים</h2>
          <table>
            <thead>
              <tr>
              <th>התמחות</th>
                <th>שם</th>
                
              </tr>
            </thead>
            <tbody>
              {therapists.map((therapist) => (
                <tr key={therapist.id}>
                  <td>{therapist.specialization}</td>
                  <td>{therapist.name}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Management;
