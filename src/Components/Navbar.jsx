import React from 'react'
import {Link} from 'react-router-dom';
import '../CSScomponents/Navbar.css';
const Navbar = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <div className="navbar">
         <Link to="/Login">כניסת מנהל / מטפל</Link>
         {/* <Link to="/Management">כניסת מנהל \ מטפל</Link> */}
         {/* <Link to="/Contact">צור קשר</Link> */}
         <a onClick={scrollToContact} style={{ cursor: 'pointer' }}>צור קשר</a>
         <Link to="/Specialization">תחומי התמחות</Link>
         <Link to="/Experts">מטפלים מומחים</Link>
         <Link to="/Home">עמוד הבית</Link>
      </div>
    </div>
  )
}

export default Navbar