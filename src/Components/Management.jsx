import React, { useState, useEffect } from "react";
import "../CSScomponents/Management.css";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import NavManager from "./NavManager";

const Management = () => {
  // const [managerAccess, setManagerAccess] = useState([]);
  const [contactCustomer, setContactCustomer] = useState([]);
  
 
  
  const location = useLocation();
  const ManagerData = location.state?.managerData;
  console.log(location.state);

  // בקשה לקבלת הלקוחות שפנו אלינו
  useEffect(() => {
    fetch("http://localhost:5000/contact-table")
      .then((response) => response.json())
      .then((data) => setContactCustomer(data))
      .catch((error) => console.error("שגיאה בקבלת נתוני הלקוחות:", error));
  }, []);
  
  // בקשה לקבלת המורשים
  // useEffect(() => {
  //   fetch("http://localhost:5000/authorized")
  //     .then((response) => response.json())
  //     .then((data) => setManagerAccess(data))
  //     .catch((error) => console.error("שגיאה בקבלת נתוני המורשים:", error));
  // }, []);

  
 
  // const functionDelete = (id, name) => {
  //   const confirmDelete = window.confirm(
  //     `האם אתה בטוח שברצונך למחוק את המשתמש ${name}?`
  //   );
  //   if (!confirmDelete) return;
  //   fetch(`http://localhost:5000/therapists/${id}`, { method: "DELETE" })
  //     .then((response) => {
  //       if (response.ok) {
  //         alert("המטפל נמחק בהצלחה");
  //         setTherapistsList((prevCurrent) =>
  //           prevCurrent.filter((patient) => patient.id !== id)
  //         );
  //       } else {
  //         alert("שגיאה במחיקת המטפל");
  //       }
  //     })
  //     .catch((error) => console.error("שגיאה במחיקת המטפל:", error));
  // };
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
                    <button
                      onClick={() => deleteCustomer(customer.id, customer.name)}
                    >                     
                      מחק
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
      <Footer />
    </div>
  );
};

export default Management;
