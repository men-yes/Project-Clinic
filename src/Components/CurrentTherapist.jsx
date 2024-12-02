

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Calendar from "./Calendar";
import "../CSScomponents/CurrentTherapist.css";

const CurrentTherapist = () => {
  const [current, setCurrent] = useState([]);
  const [medicalRecords, setMedicalrecords] = useState([]);
  const [showModal, setShowModal] = useState(false); // מודל לתצוגת תיק רפואי
  const [showReportModal, setShowReportModal] = useState(false); // מודל להזנת דוח חדש
  const [treatment_date, setTreatment_date] = useState("");
  const [treatmentSummary, setTreatmentSummary] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false); // Calendar modal

  const location = useLocation();
  const therapistData = location.state?.therapistData;
  
  console.log(therapistData);
  
  // const navigate = useNavigate();
  useEffect(() => {
    fetch(`http://localhost:5000/patients/${therapistData.id}`)
      .then((response) => response.json())
      .then((data) => setCurrent(data))
      .catch((error) => console.error("שגיאה בקבלת נתוני המטופלים:", error));
  }, []);

  const openCalendarModal = (patientId) => {
    setSelectedPatientId(patientId);
    setShowCalendarModal(true);
  };

  // Function to close the calendar modal
  const closeCalendarModal = () => {
    setShowCalendarModal(false);
  };
  const functionDelete = (id, name) => {
    const confirmDelete = window.confirm(
      `האם אתה בטוח שברצונך למחוק את המשתמש ${name}?`
    );
    if (!confirmDelete) return;
    fetch(`http://localhost:5000/patients/${id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          alert("המטפל נמחק בהצלחה");
          setCurrent((prevCurrent) =>
            prevCurrent.filter((patient) => patient.id !== id)
          );
        } else {
          alert("שגיאה במחיקת המטפל");
        }
      })
      .catch((error) => console.error("שגיאה במחיקת המטפל:", error));
  };

  const functionMedicalRecord = (patientId) => {
    fetch(`http://localhost:5000/medical-records/${patientId}`)
      .then((response) => {
        if (!response.ok) throw new Error("שגיאה בשליפת התיק הרפואי");
        return response.json();
      })
      .then((data) => {
        setMedicalrecords(data);
        setShowModal(true);
      })
      .catch((error) => console.error("שגיאה בשליפת התיק הרפואי:", error));
  };

  const openReportModal = (patientId) => {
    setSelectedPatientId(patientId);
    setShowReportModal(true);
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    setTreatment_date("");
    setTreatmentSummary("");
  };

  const submitReport = () => {
    if (!treatment_date || !treatmentSummary) {
      alert("אנא מלא את כל השדות.");
      return;
    }
    const reportData = {
      patientId: selectedPatientId,
      treatment_date,
      treatmentSummary,
    };
    fetch("http://localhost:5000/add-medical-record", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    })
      .then((response) => {
        if (response.ok) {
          alert("הדוח נשמר בהצלחה");
          closeReportModal();
        } else {
          alert("שגיאה בשמירת הדוח");
        }
      })
      .catch((error) => console.error("שגיאה בשליחת הדוח:", error));
  };

  const closeModal = () => {
    setShowModal(false);
    setMedicalrecords(null);
  };

  return (
    <div>
      
      <section className="section-current-therapist">
        <h1>פרטי המטפל</h1>
        <p>שם: {therapistData.name}</p>
        <p>התמחות: {therapistData.specialization}</p>
      </section>
         <div>
            <h1 className="title-table">מטופלים </h1>
         </div>
      <table className="table-style">
        <thead>
          <tr>
            <th>אפשרויות</th>
            <th>אימייל</th>
            <th>טלפון</th>
            <th> גיל</th>
            <th>שם</th>
            <th>מספר</th>
          </tr>
        </thead>
        <tbody>
          {current.map((user, index) => (
            <tr key={user.id}>
              <td>
                <button
                  className="button-manager"
                  onClick={() => functionDelete(user.id, user.name)}
                >
                  הסר
                </button>
                <button
                  className="button-manager"
                  onClick={() => openReportModal(user.id)}
                >
                  כתוב דו"ח
                </button>
                <button
                  className="button-manager"
                  onClick={() => functionMedicalRecord(user.id)}
                >
                  תיק רפואי
                </button>
                <button
                  className="button-manager"
                  onClick={() => openCalendarModal(user.id)}
                >
                  קבע פגישה
                </button>
              </td>
              <td>{user.email}</td>
              <td>{user.phone_number}</td>
              <td>{user.age}</td>
              <td>{user.name}</td>
              <td>{index + 1}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCalendarModal && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={closeCalendarModal} className="close-button">
              Close
            </button>
            <Calendar
              therapistId={therapistData.id}
              patientId={selectedPatientId}
              closeCalendar={closeCalendarModal}
            />
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={closeModal} className="close-button">
              סגור
            </button>
            <h2>תיק רפואי</h2>
            {medicalRecords && medicalRecords.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>תאריך דוח</th>
                    <th>תאריך טיפול</th>
                    <th>סיכום טיפול</th>
                  </tr>
                </thead>
                <tbody>
                  {medicalRecords.map((record) => (
                    <tr key={record.record_id}>
                      <td>
                        {new Date(record.report_date).toLocaleDateString()}
                      </td>
                      <td>
                        {new Date(record.treatment_date).toLocaleDateString()}
                      </td>
                      <td>{record.treatment_summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>אין עדיין נתונים להצגה</p>
            )}
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>הוסף דוח חדש</h2>
            <label>
              תאריך טיפול:
              <input
                type="date"
                value={treatment_date}
                onChange={(e) => setTreatment_date(e.target.value)}
              />
            </label>
            <label>
              סיכום טיפול:
              <textarea
                value={treatmentSummary}
                onChange={(e) => setTreatmentSummary(e.target.value)}
              ></textarea>
            </label>
            <button onClick={submitReport}>שמור דוח</button>
            <button onClick={closeReportModal}>בטל</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentTherapist;

