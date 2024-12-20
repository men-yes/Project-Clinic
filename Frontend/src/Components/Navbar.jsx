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
  const scrollToSpecialization = () => {
    const SpecializationSection = document.getElementById('specialization-section');
    if (SpecializationSection) {
      SpecializationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const scrollToArticles = () => {
    const ArticlesSection = document.getElementById('articles-section');
    if (ArticlesSection) {
      ArticlesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const scrollToTherapists = () => {
    const TherapistsSection = document.getElementById('therapists-section');
    if (TherapistsSection) {
      TherapistsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const scrollToHeader = () => {
    const TherapistsSection = document.getElementById('home');
    if (TherapistsSection) {
      TherapistsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="navbar">
      <a onClick={scrollToHeader} style={{ cursor: 'pointer' }}>   עמוד ראשי  </a>
      <a onClick={scrollToTherapists} style={{ cursor: 'pointer' }}>  מטפלים מומחים  </a>
      <a onClick={scrollToSpecialization} style={{ cursor: 'pointer' }}>תחומי התמחות</a>
      <a onClick={scrollToArticles} style={{ cursor: 'pointer' }}>מאמרים ומידע</a>
      <a onClick={scrollToContact} style={{ cursor: 'pointer' }}>צור קשר</a>
      <Link to="/Login">כניסת מנהל / מטפל</Link>
      
    </div>
  )
}

export default Navbar;