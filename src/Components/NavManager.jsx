import React from 'react'
import {Link} from 'react-router-dom';
import '../CSScomponents/NavManager.css';
const NavManager = ({ManagerData }) => {
    // if (!ManagerData) {
    //     return <div>טוען נתונים...</div>; // הצגת הודעת טעינה אם אין נתונים
    //   }
    

  return (
    <div className='nav-manager'>
      <Link to="/Management" state={{ ManagerData }}> חזור לדף הראשי  </Link>
      <Link to="/M_manager" state={{ ManagerData }}> נתוני מנהלים </Link>
      <Link to="/M_therapists"  state={{ ManagerData }}> נתוני מטפלים </Link>
      <Link to="/M_customers"  state={{ ManagerData }}  > נתוני לקוחות </Link>
      <Link to="/M_appointments"  state={{ ManagerData }} > נתוני תורים </Link>
      <div className='title-nav-manager'>
            <img src="https://media.istockphoto.com/id/1499007121/vector/cm-letters-logo-monogram-design.jpg?s=612x612&w=0&k=20&c=--lReD5oq0uQtQUgsnrwbYz6eBnmfaCgyDtu1Dj2zlU="
             alt="logo" height={50} style={{borderRadius:"40px"}}/>
        </div>
     
    </div>
  )
}

export default NavManager