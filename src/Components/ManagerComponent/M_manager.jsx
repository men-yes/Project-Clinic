import React ,{ useState , useEffect } from 'react'
import NavManager from '../../Components/NavManager'


const M_manager = () => {

const [DataManager, setDataManager] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/authorized`)
        .then((response) => response.json())
        .then((data) => setDataManager(data))
        .catch((error) => console.error("שגיאה בקבלת נתוני המטופלים:", error));
      }, []);

      console.log(DataManager);

  return (
    <div>
        <NavManager />
        <div className="manager-section" >
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
                {DataManager.map((user, index) => (
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
          </div>
    </div>
  )
}

export default M_manager