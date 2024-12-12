import React from "react";
import { useState, useEffect } from "react";
import NavManager from "../NavManager";
const M_therapists = () => {
  const [therapistsList, setTherapistsList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false); // מודאל להוספה
  const [showEditModal, setShowEditModal] = useState(false); // מודאל לעריכה
  const [therapistData, setTherapistData] = useState({
    name: "",
    specialization: "",
    email: "",
    phone_number: "",
  });
  const [editingTherapistId, setEditingTherapistId] = useState(null); // ID של המטפל בעריכה

  // בקשה לקבלת המטפלים
  useEffect(() => {
    fetch("http://localhost:5000/therapists")
      .then((response) => response.json())
      .then((data) => setTherapistsList(data))
      .catch((error) => console.error("שגיאה בקבלת נתוני המטפלים:", error));
  }, []);

  const isFieldEmpty = (field) => !field.trim();
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTherapistData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddTherapist = async () => {
      // ולידציה: בדוק אם כל השדות מלאים
      if (
        !therapistData.name.trim() ||
        !therapistData.specialization.trim() ||
        !therapistData.email.trim() ||
        !therapistData.phone_number.trim()
    ) {
        alert("אנא מלא את כל השדות כדי להוסיף מטפל");
        return; // עצור את הפונקציה אם השדות לא מלאים
    }
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
        setShowAddModal(false); // סגירת המודל
      } else {
        alert("הרישום נכשל: " + data.message);
      }
    } catch (error) {
      console.error("שגיאה בשליחת הבקשה:", error);
      alert("הרישום נכשל: שגיאה בשרת");
    }
  };

  // פתיחת המודל עם פרטי המטפל לעריכה
  const handleEditClick = (therapist) => {
    setTherapistData({
      name: therapist.name,
      specialization: therapist.specialization,
      email: therapist.email,
      phone_number: therapist.phone_number,
    });
    setEditingTherapistId(therapist.id);
    setShowEditModal(true);
  };

  // שמירת עריכות
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/updateTherapist/${editingTherapistId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(therapistData),
        }
      );
      if (response.ok) {
        alert("השינויים נשמרו בהצלחה!");
        setShowEditModal(false); // סגירת המודל
        setTherapistsList((prevList) =>
          prevList.map((therapist) =>
            therapist.id === editingTherapistId
              ? { ...therapist, ...therapistData }
              : therapist
          )
        );
      } else {
        alert("עדכון נכשל");
      }
    } catch (error) {
      console.error("שגיאה בעדכון הנתונים:", error);
      alert("עדכון נכשל: שגיאה בשרת");
    }
  };

  return (
    <div>
      <NavManager />
      <section className="center-button">
        <button className="button-manager" onClick={() => setShowAddModal(true)}>
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
                  <button className="button-manager" onClick={() => handleEditClick(therapist)} >
                    ערוך
                  </button>
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
      {showAddModal && (
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
                style={{
                  borderColor: isFieldEmpty(therapistData.name) ? "red" : "green",
                }}
              />
            </label>
            <label>
              התמחות:
              <input
                type="text"
                name="specialization"
                value={therapistData.specialization}
                onChange={handleInputChange}
                style={{
                    borderColor: isFieldEmpty(therapistData.specialization) ? "red" : "initial",
                }}
              />
            </label>
            <label>
              אימייל:
              <input
                type="email"
                name="email"
                value={therapistData.email}
                onChange={handleInputChange}
                style={{
                    borderColor: isFieldEmpty(therapistData.email) ? "red" : "initial",
                }}
              />
            </label>
            <label>
              מספר טלפון:
              <input
                type="text"
                name="phone_number"
                value={therapistData.phone_number}
                onChange={handleInputChange}
                style={{
                    borderColor: isFieldEmpty(therapistData.phone_number) ? "red" : "initial",
                }}
              />
            </label>
            <button className="button-manager" onClick={handleAddTherapist}>
              בצע רישום
            </button>
            <button
              className="button-manager"
              onClick={() => setShowAddModal(false)}
            >
              בטל
            </button>
          </div>
        </div>
      )}

      {/* מודל לעריכה */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingTherapistId ? "עריכת פרטי מטפל" : "הוספת מטפל חדש"}</h2>
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
            <button className="button-manager" onClick={handleSaveChanges}>
              שמור שינויים
            </button>
            <button className="button-manager" onClick={() => setShowEditModal(false)}>
              בטל
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default M_therapists;
