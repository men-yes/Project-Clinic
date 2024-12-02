import React from 'react'
import { useState, useEffect } from "react";
import NavManager from '../NavManager';
const M_customers = () => {
const [current, setCurrent] = useState([]);
useEffect(() => {
        fetch('http://localhost:5000/patients')
            .then((response) => response.json())
            .then((data) => setCurrent(data))
            .catch((error) => console.error("שגיאה בקבלת נתוני המטופלים:", error));
    }, []);
  return (
    <div>
          <NavManager />
        <div>
          <h1 className="div-title">רשימת מטופלים </h1>
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
                //   onClick={() => functionDelete(user.id, user.name)}
                >
                  הסר
                </button>
               
                <button
                  className="button-manager"
                //   onClick={() => openCalendarModal(user.id)}
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
    </div>
  )
}

export default M_customers