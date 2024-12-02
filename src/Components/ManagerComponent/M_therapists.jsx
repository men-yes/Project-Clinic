import React from 'react'
import { useState, useEffect } from "react";
import NavManager from '../NavManager';
const M_therapists = () => {

    const [therapistsList, setTherapistsList] = useState([]);
    const [showModal, setShowModal] = useState(false); // מראה או מסתיר את המודל
    const [therapistData, setTherapistData] = useState({
        name: "",
        specialization: "",
        email: "",
        phone_number: "",
      });
    // בקשה לקבלת המטפלים
  useEffect(() => {
    fetch("http://localhost:5000/therapists")
      .then((response) => response.json())
      .then((data) => setTherapistsList(data))
      .catch((error) => console.error("שגיאה בקבלת נתוני המטפלים:", error));
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTherapistData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddTherapist = async () => {
    try {
      const response = await fetch("http://localhost:5000/addTherapist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(therapistData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("נוסף בהצלחה");
        setShowModal(false); // סגירת המודל
      } else {
        alert("הרישום נכשל: " + data.message);
      }
    } catch (error) {
      console.error("שגיאה בשליחת הבקשה:", error);
      alert("הרישום נכשל: שגיאה בשרת");
    }
  };
  return (
    <div>
        <NavManager />
        <section className="center-button">
          <button className="button-manager" onClick={() => setShowModal(true)}>
            הוסף מטפל
          </button>
        </section>

        <div className="therapists-section" id="therapists-section">
            <h2>נתוני מטפלים</h2>
            <table>
              <thead>
                <tr>
                  <th>אפשרויות</th>
                  <th>התמחות</th>
                  <th>טלפון</th>
                  <th>אימייל</th>
                  <th>שם</th>
                  <th>מספר</th>
                </tr>
              </thead>
              <tbody>
                {therapistsList.map((therapist, index) => (
                  <tr key={therapist.id}>
                    <td>
                      {/* <button
                        className="button-manager"
                        onClick={() =>
                          functionDelete(therapist.id, therapist.name)
                        }
                      >
                        הסר
                      </button> */}
                      <button className="button-manager">ערוך</button>
                    </td>
                    <td>{therapist.specialization}</td>
                    <td>{therapist.phone_number}</td>
                    <td>{therapist.email}</td>
                    <td>{therapist.name}</td>
                    <td>{index + 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
           {/* מודל להוספת מטפל */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>הוספת מטפל חדש</h2>
              <label>
                שם המטפל:
                <input
                  type="text"
                  name="name"
                  value={therapistData.name}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                התמחות:
                <input
                  type="text"
                  name="specialization"
                  value={therapistData.specialization}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                אימייל:
                <input
                  type="email"
                  name="email"
                  value={therapistData.email}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                מספר טלפון:
                <input
                  type="text"
                  name="phone_number"
                  value={therapistData.phone_number}
                  onChange={handleInputChange}
                />
              </label>
              <button className="button-manager" onClick={handleAddTherapist}>
                בצע רישום
              </button>
              <button
                className="button-manager"
                onClick={() => setShowModal(false)}
              >
                בטל
              </button>
            </div>
          </div>
        )}
    </div>
  )
}

export default M_therapists