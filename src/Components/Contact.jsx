import React from 'react'
import '../CSScomponents/Contact.css'
const Contact = () => {
  return (
    <div id="contact-section" className='main-contact'>
        <h1 className='title-contact'>צור קשר</h1>
        <div className='contact-us' >
            <div className='contact-us2'> 
               <form action="">
               <label htmlFor="name">שם:</label>
               <input type="text" id="name" name="name" placeholder="הכנס את שמך" required />

               <label htmlFor="email">אימייל:</label>
               <input type="email" id="email" name="email" placeholder="הכנס את כתובת האימייל שלך" required />

               <label htmlFor="subject">נושא:</label>
               <input type="text" id="subject" name="subject" placeholder="נושא הפנייה" required />

               <label htmlFor="message">הודעה:</label>
               <textarea id="message" name="message" rows="4" placeholder="כתוב את ההודעה שלך כאן" required></textarea>

               <button className='button-contact' type="submit">שלח</button>
               </form>
            </div>
         </div>
    </div>
  )
}

export default Contact;