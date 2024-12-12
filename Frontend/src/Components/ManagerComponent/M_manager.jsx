import React, { useState, useEffect } from "react";
import NavManager from "../../Components/NavManager";
const M_manager = () => {
  const [listManager, setListManager] = useState([]);
  const [editingManager, setEditingManager] = useState(null); // סטייט לשמור את המנהל שמחפשים לערוך

  useEffect(() => {
    fetch(`http://localhost:5000/authorized`)
      .then((response) => response.json())
      .then((data) => setListManager(data))
      .catch((error) => console.error("שגיאה בקבלת נתוני המטופלים:", error));
  }, []);
  console.log(listManager);

  const handleEditClick = (user) => {
    setEditingManager(user); // עדכון הסטייט עם הנתונים של המנהל הנבחר
  };
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/updateManager/${editingManager.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingManager), // שולח את הנתונים המעודכנים
        }
      );
      if (response.ok) {
        alert("השינויים נשמרו בהצלחה!");
        setListManager((prevList) =>
          prevList.map((manager) =>
            manager.id === editingManager.id
              ? { ...manager, ...editingManager }
              : manager
          )
        );
        setEditingManager(null); // סוגר את המודל
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
      <div className="manager-section">
        <h2> נתוני מנהלים</h2>
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
            {listManager.map((user, index) => (
              <tr key={user.id}>
                <td>
                <button className="button-manager" onClick={() => handleEditClick(user)}>ערוך</button>
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
      </div>
      {editingManager && (
        <div className="modal">
          <div className="modal-content">
            <h2>ערוך פרטי מנהל</h2>
            <label>
              שם:
              <input
                type="text"
                value={editingManager.name}
                onChange={(e) =>
                  setEditingManager({ ...editingManager, name: e.target.value })
                }
              />
            </label>
            <label>
              תפקיד:
              <input
                type="text"
                value={editingManager.role_type}
                onChange={(e) =>
                  setEditingManager({
                    ...editingManager,
                    role_type: e.target.value,
                  })
                }
              />
            </label>
            <label>
              טלפון:
              <input
                type="text"
                value={editingManager.phone_number}
                onChange={(e) =>
                  setEditingManager({
                    ...editingManager,
                    phone_number: e.target.value,
                  })
                }
              />
            </label>
            <label>
              אימייל:
              <input
                type="email"
                value={editingManager.email}
                onChange={(e) =>
                  setEditingManager({
                    ...editingManager,
                    email: e.target.value,
                  })
                }
              />
            </label>
            <button onClick={handleSaveChanges}>שמור שינויים</button>
            <button onClick={() => setEditingManager(null)}>בטל</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default M_manager;
