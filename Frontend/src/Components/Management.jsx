import React, { useState, useEffect } from "react";
import "../CSScomponents/Management.css";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import NavManager from "./NavManager";

const Management = () => {
  // const [managerAccess, setManagerAccess] = useState([]);
  const [contactCustomer, setContactCustomer] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapistId, setSelectedTherapistId] = useState("");
  
  const location = useLocation();
  const ManagerData = location.state?.managerData;
  console.log(location.state);

  useEffect(() => {
    fetch("http://localhost:5000/therapists")
      .then((response) => response.json())
      .then((data) => setTherapists(data))
      .catch((error) => console.error("שגיאה בטעינת רשימת המטפלים:", error));
  }, []);
   
  // בקשה לקבלת הלקוחות שפנו אלינו
  useEffect(() => {
    fetch("http://localhost:5000/contact-table")
      .then((response) => response.json())
      .then((data) => setContactCustomer(data))
      .catch((error) => console.error("שגיאה בקבלת נתוני הלקוחות:", error));
  }, []);

  const confirmAddPatient = () => {
    if (!selectedTherapistId) {
      alert("יש לבחור מטפל לפני שמאשרים");
      return;
    }
    const newPatient = {
      ...selectedCustomer,
      therapistId: selectedTherapistId, // הוספת מזהה המטפל
    };
    fetch("http://localhost:5000/add-patient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPatient), // שליחת פרטי המטופל
    })
      .then((response) => {
        if (!response.ok) throw new Error("שגיאה בהוספת המטופל");
        return response.json();
      })
      .then((newPatient) => {
        alert("מטופל נוסף בהצלחה!");
        setContactCustomer((prev) => [...prev, -newPatient]); // עדכון הרשימה
        setIsModalOpen(false); // סגירת המודל
      })
      .catch((error) => console.error("שגיאה בהוספת המטופל:", error));
  };
  
  const openAddPatientModal = (customer) => {
    setSelectedCustomer(customer); // שמירת פרטי הלקוח שנבחר
    setIsModalOpen(true); // פתיחת המודל
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };
  
  const deleteCustomer = (id, name) => {
    const confirmDelete = window.confirm(
      `האם אתה בטוח שברצונך למחוק את המשתמש ${name}?`
    );
    if (!confirmDelete) return;
    fetch(`http://localhost:5000/contact/${id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          alert("הלקוח נמחק בהצלחה");
          setContactCustomer((prevCurrent) =>
            prevCurrent.filter((patient) => patient.id !== id)
          );
        } else {
          alert("שגיאה במחיקת המטפל");
        }
      })
      .catch((error) => console.error("שגיאה במחיקת המטפל:", error));
  };
  const handleCheck = (id, checked) => {
    console.log(id);
    const newChecked = !checked;
    // שליחה לשרת לעדכון עמודת handled
    fetch(`http://localhost:5000/contact/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ handled: newChecked ? 1 : 0 }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("שגיאה בעדכון הסטטוס");
        return response.json();
      })
      .then((data) => {
        // alert("סטטוס עודכן בהצלחה");
        console.log("סטטוס עודכן בהצלחה:", data);

        setContactCustomer((prevContacts) =>
          prevContacts.map((customer) =>
            customer.id === id
              ? { ...customer, handled: newChecked ? 1 : 0 }
              : customer
          )
        );
      })
      .catch((error) => console.error("שגיאה בעדכון הסטטוס:", error));
  };
console.log(ManagerData);

  return (
    <div>
      {/* <Header /> */}
      <NavManager ManagerData={ManagerData}/>
      <div>
        <h1 className="title"> {ManagerData.name} שלום </h1>
        <div className="div-tables">
          <h2>  לקוחות שיצרו קשר   </h2>
          <table>
            <thead>
              <tr>
                <th> /</th>
                <th> ../</th>
                <th> בקשה טופלה</th>
                <th>סיבת הפנייה</th>
                <th>נושא</th>
                <th>טלפון</th>
                <th>אימייל</th>
                <th>שם</th>
                <th>מספר</th>
              </tr>
            </thead>
            <tbody>
              {contactCustomer.map((customer, index) => (
                <tr key={customer.id}>
                  <td>
                  <button onClick={() => openAddPatientModal(customer)}>הכנס מטופל חדש</button>
                  </td>
                  <td>
                    <button
                      onClick={() => deleteCustomer(customer.id, customer.name)}
                    >                     
                      הפוך ללא מעוניין
                    </button>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={customer.handled === 1} // מציג כ'לחוץ' אם handled שווה ל-1
                      onChange={() =>
                        handleCheck(customer.id, customer.handled)
                      }
                    />
                  </td>
                  <td>{customer.message}</td>
                  <td>{customer.subject}</td>
                  <td>{customer.phone_number}</td>
                  <td>{customer.email}</td>
                  <td>{customer.name}</td>
                  <td>{index + 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
      </div>
{isModalOpen && (
  <div className="add-patient-modal">
    <div className="add-patient-modal-content">
      <h2 className="add-patient-title">הוסף מטופל חדש</h2>
      <div className="add-patient-details">
        <p className="add-patient-detail">
          <strong>שם:</strong> {selectedCustomer?.name}
        </p>
        <p className="add-patient-detail">
          <strong>טלפון:</strong> {selectedCustomer?.phone_number}
        </p>
        <p className="add-patient-detail">
          <strong>אימייל:</strong> {selectedCustomer?.email}
        </p>
      </div>

      {/* בחירת מטפל */}
      <div className="add-patient-therapist-selection">
        <label htmlFor="therapist-select" className="therapist-label">
          בחר מטפל
        </label>
        <select
          id="therapist-select"
          className="therapist-select"
          value={selectedTherapistId}
          onChange={(e) => setSelectedTherapistId(e.target.value)}
        >
          <option value="" disabled>
            בחר מטפל
          </option>
          {therapists.map((therapist) => (
            <option key={therapist.id} value={therapist.id}>
              {therapist.name}
            </option>
          ))}
        </select>
      </div>

      {/* כפתורים */}
      <div className="add-patient-actions">
        <button className="confirm-button" onClick={confirmAddPatient}>
          אשר
        </button>
        <button className="cancel-button" onClick={closeModal}>
          בטל
        </button>
      </div>
    </div>
  </div>
)}

      <Footer />
    </div>
  );
};

export default Management;
