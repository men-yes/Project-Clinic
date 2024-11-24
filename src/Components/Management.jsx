import React, { useState, useEffect } from "react";
import "../CSScomponents/Management.css";
import Footer from "./Footer";
import Header from "./Header";

const Management = () => {
  const [managerAccess, setManagerAccess] = useState([]);
  const [contactCustomer, setContactCustomer] = useState([]);
  const [showModal, setShowModal] = useState(false); // מראה או מסתיר את המודל
  const [therapistData, setTherapistData] = useState({
    name: "",
    specialization: "",
    email: "",
    phone_number: "",
  });
  const [therapistsList, setTherapistsList] = useState([]);

  // בקשה לקבלת הלקוחות שפנו אלינו
  useEffect(() => {
    fetch("http://localhost:5000/contact-table")
      .then((response) => response.json())
      .then((data) => setContactCustomer(data))
      .catch((error) => console.error("שגיאה בקבלת נתוני הלקוחות:", error));
  }, []);
  // בקשה לקבלת המטפלים
  useEffect(() => {
    fetch("http://localhost:5000/therapists")
      .then((response) => response.json())
      .then((data) => setTherapistsList(data))
      .catch((error) => console.error("שגיאה בקבלת נתוני המטפלים:", error));
  }, []);
  // בקשה לקבלת המורשים
  useEffect(() => {
    fetch("http://localhost:5000/authorized")
      .then((response) => response.json())
      .then((data) => setManagerAccess(data))
      .catch((error) => console.error("שגיאה בקבלת נתוני המורשים:", error));
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
  const functionDelete = (id, name) => {
    const confirmDelete = window.confirm(
      `האם אתה בטוח שברצונך למחוק את המשתמש ${name}?`
    );
    if (!confirmDelete) return;
    fetch(`http://localhost:5000/therapists/${id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          alert("המטפל נמחק בהצלחה");
          setTherapistsList((prevCurrent) =>
            prevCurrent.filter((patient) => patient.id !== id)
          );
        } else {
          alert("שגיאה במחיקת המטפל");
        }
      })
      .catch((error) => console.error("שגיאה במחיקת המטפל:", error));
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
              customer.id === id ? { ...customer, handled: newChecked ? 1 : 0 } : customer
          )
      );
      })
      .catch((error) => console.error("שגיאה בעדכון הסטטוס:", error));
  };

  return (
    <div>
      <Header />
      <div>
        <h1 className="title">{managerAccess.name} שלום </h1>
        <section className="center-button">
          <button className="button-manager" onClick={() => setShowModal(true)}>
            הוסף מטפל
          </button>
        </section>

        <div className="div-tables">
          <h2> ליצור קשר עם הלקוח </h2>
          <table>
            <thead>
              <tr>
                <th> /</th>
                <th>  בקשה טופלה</th>
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
                  <td><button onClick={() => deleteCustomer(customer.id, customer.name)}> מחק </button></td>
                  <td>
                    <input
                      type="checkbox"
                      checked={customer.handled === 1} // מציג כ'לחוץ' אם handled שווה ל-1
                      onChange={() => handleCheck(customer.id, customer.handled)}
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

          <h2>נתוני מורשים</h2>
          <table>
            <thead>
              <tr>
                <th>אפשרויות</th>
                <th>תפקיד</th>
                <th>טלפון</th>
                <th>אימייל</th>
                <th>שם</th>
                <th>מספר</th>
              </tr>
            </thead>
            <tbody>
              {managerAccess.map((user, index) => (
                <tr key={user.id}>
                  <td>
                    <button className="button-manager">ערוך</button>
                  </td>
                  <td>{user.role_type}</td>
                  <td>{user.phone_number}</td>
                  <td>{user.email}</td>
                  <td>{user.name}</td>
                  <td>{index + 1}</td>
                </tr>
              ))}
            </tbody>
          </table>

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
                    <button
                      className="button-manager"
                      onClick={() => functionDelete(therapist.id, therapist.name)}
                    >
                      הסר
                    </button>
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
      <Footer />
    </div>
  );
};

export default Management;
