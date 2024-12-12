import React from 'react'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // להוספת תצוגת שעות
import interactionPlugin from '@fullcalendar/interaction'; // להוספת אינטראקציות
import { useState , useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // מונע בעיות נגישות


const Calendar = ({ therapistId,  patientId}) => {

  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [hoursModalOpen, setHoursModalOpen] = useState(false);
  const hours = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
  ];

  useEffect(() => {
    fetch(`http://localhost:5000/appointments/${therapistId}`)
      .then((response) => response.json())
      .then((data) => setEvents(data)) // עדכון האירועים עם נתוני הפגישות הקיימות
      .catch((error) => console.error('שגיאה בהבאת הפגישות:', error));
  }, [therapistId]); // תלוי במטפל
  
  console.log(events);
  
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr); // שמירה של התאריך שנבחר
    setHoursModalOpen(true); // פתיחת מודאל השעות
   };

   const closeHoursModal = () => {
    setHoursModalOpen(false);
  };

  const handleAddEvent = (hour) => {
    const newEvent = {
      id: Date.now().toString(),
      therapistId: therapistId,
      patientId:  patientId,
      appointmentDate: `${selectedDate}`,
      appointmentTime: `${hour}`,
      title: 'פגישה עם מטופל', // שם הפגישה שיוצג בלוח
      start: `${selectedDate}T${hour}:00`, // זמן התחלה
      status: 'scheduled', // סטטוס 'מתוזמן'
    };
     // שליחה לשרת על מנת לשמור את הפגישה
  fetch('http://localhost:5000/schedule-appointment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newEvent),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); 
      console.log(events);
      
      setEvents([...events, newEvent]); // עדכון האירועים לאחר הצלחה
      alert('הפגישה נקבעה בהצלחה');
      console.log(data);
      console.log(events);
    })
    .catch((error) => console.error('שגיאה בקביעת הפגישה:', error));
  };
  // const isHourTaken = (hour) => {
  //   const start = `${selectedDate}T${hour}`;
  //   return Array.isArray(events) && events.some(
  //     (event) => new Date(event.start).getTime() === new Date(start).getTime()
  //   );
  // };
  
  const isHourTaken = (hour) => {
    const start = new Date(`${selectedDate}T${hour}:00`); // כולל פורמט מלא של זמן
    return Array.isArray(events) && events.some(
      (event) => {
        const eventDate = new Date(event.appointmentDate + 'T' + event.appointmentTime); 
        return eventDate.getTime() === start.getTime();
      }
    );
  };
  

  const openDeleteModal = (event) => {
    setModalIsOpen(true);
    setEventToDelete(event);
  };

  const closeDeleteModal = () => {
    setModalIsOpen(false);
    setEventToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
       // שליחה לשרת על מנת למחוק את הפגישה
    fetch(`http://localhost:5000/delete-appointment/${eventToDelete.id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventToDelete.id)); // עדכון ברשימת הפגישות
        closeDeleteModal();
        alert('הפגישה נמחקה בהצלחה');
      })
      .catch((error) => console.error('שגיאה בהסרת הפגישה:', error));
    }
  };

  const handleEventClick = (clickInfo) => {
    openDeleteModal(clickInfo.event);
  };

  return (
    <div>
          <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,timeGridDay',
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick} // לחיצה על אירוע
      />

    <Modal
        isOpen={hoursModalOpen}
        onRequestClose={closeHoursModal}
        contentLabel="שעות פנויות ותפוסות"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          },
          content: {
            width: '50%',
            height: '50%',
            margin: 'auto',
            padding: '40px',
            textAlign: 'center',
            zIndex: 1001,
          },
        }}
      >
        <h3>שעות פנויות ב-{selectedDate}</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {hours.map((hour) => (
            <li key={hour}>
              <button
                onClick={() => handleAddEvent(hour)}
                disabled={isHourTaken(hour)}
                style={{
                  backgroundColor: isHourTaken(hour) ? '#ffcccc' : '#ccffcc',
                  cursor: isHourTaken(hour) ? 'not-allowed' : 'pointer',
                  width: '100%',
                  padding: '10px',
                  margin: '5px 0',
                  border: 'none',
                  borderRadius: '5px',
                }}
              >
                {hour} - {isHourTaken(hour) ? 'תפוסה' : 'פנוי'}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={closeHoursModal} style={{ marginTop: '10px' }}>סגור</button>
      </Modal>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="אישור מחיקת פגישה"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // רקע כהה מסביב
            zIndex: 1000, // גורם למודאל להופיע מעל הכל
          },
          content: {
            width: '350px',
            height: '190px',
            border: '5px solid #ccc',
            margin: 'auto',
            padding: '20px',
            textAlign: 'center',
            zIndex: 1001, // גבוה מספיק כדי להופיע מעל לוח השנה
          },
        }}
      >
        <h2>האם אתה בטוח?</h2>
        <p>האם למחוק את הפגישה "{eventToDelete?.title}"?</p>
        <button onClick={handleConfirmDelete} style={{cursor: 'pointer', margin: '25px', padding: '20px 40px', backgroundColor: 'green', color: 'white',borderRadius:'10px'}}>אישור</button>
        <button onClick={closeDeleteModal} style={{cursor: 'pointer', margin: '25px', padding: '20px 40px', backgroundColor: 'red', color: 'white',borderRadius:'10px'}}>ביטול</button>
      </Modal>

    </div>
  )
}

export default Calendar;