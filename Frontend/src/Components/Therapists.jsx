import React, { useState, useEffect } from 'react';

import '../CSScomponents/Therapists.css';

const Therapists = () => {
  const [therapists, setTherapists] = useState([]);

  // קריאה לשרת כדי לשאוב את נתוני המטפלים
  useEffect(() => {
    fetch("http://localhost:5000/therapists")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setTherapists(data))
      .catch((error) => console.error("שגיאה בקבלת נתוני המטפלים:", error));
  }, []);

  return (
    <div className='main-therapists' id='therapists-section'>
      <h1 className='title-therapists'>המומחים שלנו</h1>
      <section className="section-therapists">
        {therapists.length > 0 ? (
          therapists.map((therapist) => (
            <div className="div-therapist" key={therapist.therapist_id}>
              <img
                src={therapist.imageUrl || `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn7w40OjWQvAaVO3r5jREg974MluPopL4wDKOHjcswSeauaBDtLS-p7fc1gK_yCcluvyE&usqp=CAU`}
                alt={therapist.name}
                className="therapist-image"
              />
              <h3>{therapist.name}</h3>
              <p>התמחות: {therapist.specialization}</p>
            </div>
          ))
        ) : (
          <p>אין כרגע נתונים להצגה.</p>
        )}
      </section>
    </div>
  );
};

export default Therapists;
