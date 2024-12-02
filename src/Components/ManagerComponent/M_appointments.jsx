import React from 'react'
import { useState, useEffect } from "react";
import NavManager from '../NavManager';

const M_appointments = () => {
const [appoint , setAppoint] = useState([]);

useEffect(() => {
    fetch(`http://localhost:5000/appointments`)
        .then((response) => response.json())
        .then((data) => setAppoint(data))
        .catch((error) => console.error("שגיאה בקבלת נתוני המטופלים:", error));
}, []);

  return (
    <div>
        <NavManager /> 
        <div>
            <h1 className="title">תורים </h1>
        </div>
        <table className="table-style">
        <thead>
          <tr>
            <th>אפשרויות</th>
            <th>מטפל </th>
            <th>אימייל</th>
            <th>טלפון</th>
            <th>שעה </th>
            <th> תאריך</th>
            <th>שם</th>
            <th>מספר</th>
          </tr>
        </thead>
        <tbody>
          {appoint.map((user, index) => (
            <tr key={user.id}>
              <td>
                <button
                  className="button-manager"
                //   onClick={() => openCalendarModal(user.id)}
                >
                  קבע פגישה
                </button>
              </td>
              <td>{user.specialization}</td>
              <td>{user.email}</td>
              <td>{user.phone_number}</td>
              <td>{user.appointment_time}</td>
              <td>{user.appointment_date}</td>
              <td>{user.name}</td>
              <td>{index + 1}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

export default M_appointments