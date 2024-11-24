import React, { useState } from 'react';
import "../CSScomponents/Contact.css";
const Contact = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
      event.preventDefault();
      // אובייקט המכיל את נתוני הטופס
      const formData = {
          name: name,
          email: email,
          phone: phone,
          subject: subject,
          message: message
      };
      try {
          const response = await fetch('http://localhost:5000/contact', { 
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
          });
          if (response.ok) {
            alert('ההודעה נשלחה בהצלחה!');
            console.log('ההודעה נשלחה בהצלחה!');
            setName('');
            setEmail('');
            setPhone('');
            setSubject('');
            setMessage('');
          } else {
            alert('שגיאה בשליחת ההודעה');
            console.error('שגיאה בשליחת ההודעה');
          }
      } catch (error) {
        alert('שגיאה בחיבור לשרת');
        console.error('שגיאה בחיבור לשרת:', error);
      }
    };

  return (
    <div id="contact-section" className="main-contact">
      <h1 className="title-contact">צור קשר</h1>
      <div className="contact-us">
        <div className="contact-us2">
          <form action="" onSubmit={handleSubmit}>
            <label htmlFor="name">שם:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="הכנס את שמך"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="email">אימייל:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="הכנס את כתובת האימייל שלך"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="phone">טלפון:</label>
            <input
              type="text"  
              id="phone"
              name="phone"
              placeholder=" הכנס את מספר הטלפון שלך"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <label htmlFor="subject">נושא:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="נושא הפנייה"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <label htmlFor="message">הודעה:</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              placeholder="כתוב את ההודעה שלך כאן"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>

            <button className="button-contact" type="submit">
              שלח
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
