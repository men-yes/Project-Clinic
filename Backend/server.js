// server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require('nodemailer');
const cron = require('node-cron');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors()); // לאפשר בקשות מכתובות אחרות
const PORT = 5000;

const EMAIL_PASS = process.env.EMAIL_PASS;


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// יצירת חיבור לדאטהבייס
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root", // שנה לשם המשתמש שלך
  password: "123456", // שנה לסיסמה שלך
  database: "dbclinic", // שם הדאטהבייס שלך
});

// התחברות לדאטהבייס
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database.");
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mm0555567864@gmail.com',
    pass: EMAIL_PASS,
  },
});
const sendEmailReminder = (recipientEmail, appointmentDate) => {

  
  const mailOptions = {
    from: 'mm0555567864@gmail.com',
    to: recipientEmail,
    subject: 'Reminder: Upcoming Appointment',
    text: `You have an appointment scheduled for ${appointmentDate}. Please be on time.`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      
      
      console.log('Email sent: ' + info.response);
    }
  });
};
// משימה מתוזמנת: רץ כל 5 דקות
cron.schedule('0 9 * * *', () => {
  console.log('Running reminder check...');

  // חישוב תאריך מחר
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedDate = tomorrow.toISOString().split('T')[0]; // פורמט yyyy-mm-dd

  // שאילתת SQL
  const query = `
    SELECT 
      a.appointment_id AS id,
      a.appointment_date,
      a.appointment_time,
      a.email_sent,
      p.name AS patient_name,
      p.email AS patient_email,
      t.name AS therapist_name,
      t.specialization AS therapist_specialization
    FROM 
      appointments a
    JOIN 
      patients p ON a.patient_id = p.id
    JOIN 
      therapists2 t ON a.therapist_id = t.id
    WHERE 
      a.appointment_date = ? 
      AND a.email_sent = FALSE;
  `;

  // ביצוע השאילתה
  db.query(query, [formattedDate], (err, results) => {
    if (err) {
      console.error('Error fetching appointments:', err);
      return;
    }
    results.forEach((appointment) => {
      const {
        id,
        patient_name,
        patient_email,
        therapist_name,
        therapist_specialization,
        appointment_date,
        appointment_time,
      } = appointment;
      // שליחת מייל תזכורת
      const emailText = `
        שלום ${patient_name},
        יש לך פגישה עם ${therapist_name} בנושא ${therapist_specialization}.
        תאריך: ${appointment_date}
        שעה: ${appointment_time}
      `;
      sendEmailReminder(patient_email, emailText);
      // עדכון email_sent ל-TRUE
      const updateQuery = `UPDATE appointments SET email_sent = TRUE WHERE appointment_id = ?`;
      db.query(updateQuery, [id], (updateErr) => {
        if (updateErr) {
          console.error('Error updating email_sent status:', updateErr);
          console.log(id);
        }
        console.log(id,2);
      });
    });
  });
});


// בקשה לבדוק אם משתמש מורשה
app.post("/check", (req, res) => {
  const { username, role_type } = req.body;
  // בדיקה בטבלת המורשים
  const queryAuthorized = `SELECT * FROM authorizedAccess WHERE name = ? AND role_type = ?`;
  db.query(queryAuthorized, [username, role_type], (err, results) => {
    console.log(username,role_type);
    if (err) {
      return res.status(500).json({ message: "שגיאה בשרת" });
    }
    if (results.length > 0) {
      const managerData = results[0]; // הגדרת managerData מתוך התוצאה
      console.log(managerData); // הדפסת הנתונים למעקב
      // נמצא בטבלת המורשים
      res.status(200).json({
         message: " כניסתך אושרה"  ,
          role_type: "manager",
          managerData: managerData, // שליחת הנתונים לקליינט
         });
         console.log(managerData); // הדפסת הנתונים למעקב
    } else {
      // בדיקה בטבלת המטפלים אם לא נמצא בטבלת המורשים
      const queryTherapists = `SELECT * FROM therapists2 WHERE name = ? AND role_type = ?`;
      db.query(queryTherapists, [username, role_type], (err, results) => {
        console.log(username,role_type);
        if (err) {
          return res.status(500).json({ message: "שגיאה בשרת" });
        }
        console.log("בהצלחה");
        if (results.length > 0) {
          res.status(200).json({
            message: "כניסתך אושרה כמטפל",
            role_type: "therapist",
            therapistData: results[0],
          });
        } else {
          // לא נמצא באף אחת מהטבלאות
          res.status(401).json({ message: "אינך מורשה להיכנס" });
        }
      });
    }
  });
});

app.post("/add-patient", (req, res) => {
  const { name, email , phone_number, therapistId} = req.body;
  console.log("i am open to server11");
  const query = `INSERT INTO patients (name,  email, phone_number, therapist_id) VALUES (?, ?, ?, ?)`;
  db.query(query, [name, email, phone_number, therapistId], (err, result) => {
    if (err) {
      console.error('שגיאה בהוספת מטופל:', err);
      return res.status(500).json({ message: 'שגיאה בהוספת מטופל' });
    }
    res.status(200).json({ message: 'מטופל נוסף בהצלחה' });
  });
});


// בקשה לקביעת פגישה
app.post('/schedule-appointment', (req, res) => {
  const { therapistId, patientId, appointmentDate, appointmentTime, status } = req.body;
  const sql = `INSERT INTO appointments (therapist_id, patient_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [therapistId, patientId, appointmentDate, appointmentTime, status], (err, result) => {
    if (err) {
      console.error('Error scheduling appointment:', err);
      res.status(500).json({ error: 'Failed to schedule appointment' });
    } else {
      res.status(201).json({ message: 'Appointment scheduled successfully', appointmentId: result.insertId });
    }
  });
});

app.patch('/contact/:id', (req, res) => {
  const { id } = req.params;
  const { handled } = req.body;
  const query = 'UPDATE ContactForms SET handled = ? WHERE id = ?';
  db.query(query, [handled, id], (error, results) => {
    if (error) {
      console.error("שגיאה בעדכון הסטטוס:", error);
      res.status(500).send("שגיאה בעדכון הסטטוס");
    } else {
      res.status(200).send({ message: "סטטוס עודכן בהצלחה" });
    }
  });
});

app.post('/contact', (req, res) => {
  console.log("i am on this");
  const { name, email ,subject, message, phone} = req.body;
  const sql = "INSERT INTO ContactForms (name, email, subject, message ,phone_number) VALUES (?, ?, ?, ?, ?)";
  console.log("i am on this2");
  db.query(sql, [name, email, subject, message, phone], (err, result) => {
    console.log("i am on this3");
      if (err) {
          console.error('שגיאה בהוספת ההודעה לדאטהבייס:', err);
          res.status(500).json({ message: 'שגיאה בשרת' });
          console.log("i am on this4");
      } else {
          res.status(200).json({ message: 'ההודעה נשלחה בהצלחה' });
      }console.log("i am on this5");
  });
});
app.post('/addTherapist', (req, res) => {
  const { name, specialization, email , phone_number} = req.body;
  console.log("i am open to server");
  const query = `INSERT INTO therapists2 (name, specialization, email, phone_number) VALUES (?, ?, ?, ?)`;
  db.query(query, [name, specialization, email, phone_number], (err, result) => {
    if (err) {
      console.error('שגיאה בהוספת מטפל:', err);
      return res.status(500).json({ message: 'שגיאה בהוספת מטפל' });
    }
    res.status(200).json({ message: 'מטפל נוסף בהצלחה' });
  });
});
app.post("/add-medical-record", async (req, res) => {
  const { patientId, treatment_date, treatmentSummary } = req.body;
  if (!patientId || !treatment_date || !treatmentSummary) {
    return res.status(400).json({ message: "חסרים נתונים בדוח" });
  }
  // קוד SQL להוספת דוח
  const query = `
    INSERT INTO medical_records (patient_id, treatment_date, treatment_summary)VALUES (?, ?, ?)`;
  db.query(query, [patientId, treatment_date, treatmentSummary], (err, result) => {
    if (err) {
      console.error("שגיאה בהוספת דוח חדש:", err);
      return res.status(500).json({ message: "שגיאה בהוספת הדוח למסד הנתונים" });
    }
    res.status(201).json({ message: "הדוח נשמר בהצלחה" });
  });
});

// Route to update a manager
app.put('/updateManager/:id', (req, res) => {
  const { id } = req.params;
  const { name, role_type, phone_number, email } = req.body;

  const query = `
    UPDATE authorizedaccess 
    SET name = ?, role_type = ?, phone_number = ?, email = ? 
    WHERE id = ?`;

  db.query(
    query,
    [name, role_type, phone_number, email, id],
    (err, result) => {
      if (err) {
        console.error('שגיאה בעדכון נתוני המנהל:', err);
        return res.status(500).send('שגיאה בשרת');
      }

      if (result.affectedRows === 0) {
        return res.status(404).send('מנהל לא נמצא');
      }

      res.send('השינויים נשמרו בהצלחה');
    }
  );
});

// עדכון פרטי מטפל
app.put("/updateTherapist/:id", (req, res) => {
  const therapistId = req.params.id;
  const { name, specialization, email, phone_number } = req.body;
  const query = `
    UPDATE therapists2 
    SET name = ?, specialization = ?, email = ?, phone_number = ?
    WHERE id = ? `;
  db.query(query, [name, specialization, email, phone_number, therapistId], (err, result) => {
    if (err) {
      console.error("שגיאה בעדכון פרטי המטפל:", err);
      res.status(500).send("שגיאה בעדכון פרטי המטפל");
    } else if (result.affectedRows === 0) {
      res.status(404).send("מטפל לא נמצא");
    } else {
      res.send("פרטי המטפל עודכנו בהצלחה");
    }
  });
});

// בקשה למחיקת פגישה לפי id
app.delete('/delete-appointment/:id', (req, res) => {
  const appointmentId = req.params.id;

  const sql = `DELETE FROM appointments WHERE appointment_id = ?`;
  db.query(sql, [appointmentId], (err, result) => {
    if (err) {
      console.error('Error deleting appointment:', err);
      res.status(500).json({ error: 'Failed to delete appointment' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Appointment not found' });
    } else {
      res.status(200).json({ message: 'Appointment deleted successfully' });
    }
  });
});


app.delete('/therapists/:id', (req, res) => {
  console.log("id");
  const therapistId = req.params.id;
  console.log(therapistId);
  const deleteQuery = 'DELETE FROM therapists2 WHERE therapist_id = ?';
  db.query(deleteQuery, [therapistId], (err, result) => {
    if (err) {
      console.error('Error deleting therapist:', err);
      res.status(500).json({ error: 'Failed to delete therapist' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Therapist not found' });
    } else {
      res.status(200).json({ message: 'Therapist deleted successfully' });
    }
  });
});
app.delete('/patients/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const deleteQuery = 'DELETE FROM patients WHERE id = ?';
  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Error deleting therapist:', err);
      res.status(500).json({ error: 'Failed to delete therapist' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Therapist not found' });
    } else {
      res.status(200).json({ message: 'Therapist deleted successfully' });
    }
  });
});
app.delete('/contact/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const deleteQuery = 'DELETE FROM contactForms WHERE id = ?';
  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Error deleting therapist:', err);
      res.status(500).json({ error: 'Failed to delete contact' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'customer not found' });
    } else {
      res.status(200).json({ message: 'customer deleted successfully' });
    }
  });
});



// בקשה לקבלת כל הפגישות   
app.get('/appointments', (req, res) => {
  const sql = `SELECT 
  patients.name AS patient_name,
  patients.phone_number,
  patients.email,
  appointments.appointment_date,
  appointments.appointment_time,
  therapists2.name AS therapist_name,
  therapists2.specialization
FROM patients
JOIN appointments ON appointments.patient_id = patients.id
JOIN therapists2 ON appointments.therapist_id = therapists2.id;`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching appointments:', err);
      res.status(500).json({ error: 'Failed to fetch appointments' });
    } else {
      res.status(200).json(results);
    }
  });
});
// בקשה לקבלת כל הפגישות של מטפל מסוים
app.get('/appointments/:therapistId', (req, res) => {
  const therapistId = req.params.therapistId;
  const sql =`SELECT appointment_id, therapist_id, patient_id, appointment_date, appointment_time, status FROM appointments WHERE therapist_id = ? AND status = 'scheduled';`
  db.query(sql, [therapistId], (err, results) => {
    if (err) {
      console.error('Error fetching appointments:', err);
      res.status(500).json({ error: 'Failed to fetch appointments' });
    } else {
      res.status(200).json(results);
    }
  });
});
// מוסיף נתיב בשרת לשליפת תיק רפואי עבור מטופל מסוים לפי מזהה
app.get("/medical-records/:id", (req, res) => {
  const patientId = req.params.id;
  const query = `SELECT * FROM medical_records  WHERE patient_id = ? `;
  db.query(query, [patientId], (error, results) => {
      if (error) {
          console.error("שגיאה בשליפת התיק הרפואי:", error);
          res.status(500).send("שגיאה בשליפת הנתונים");
      } else {
          res.json(results);
      }
  });
});
app.get("/contact-table", (req, res) => {
  const query = `SELECT * FROM contactforms`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "שגיאה בשרת" });
    }
    res.status(200).json(results);
  });
});
app.get("/authorized", (req, res) => {
  const query = `SELECT * FROM authorizedAccess`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "שגיאה בשרת" });
    }
    res.status(200).json(results);
  });
});
// בקשה להחזרת טבלת המטפלים
app.get("/therapists", (req, res) => {
  const query = `SELECT * FROM therapists2`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("שגיאה בקבלת נתוני המטפלים מהדאטהבייס:", err); // הדפסת שגיאה בשרת
      return res.status(500).json({ message: "שגיאה בשרת" });
    }
    res.status(200).json(results);
  });
});

// בקשה להחזרת טבלת המטופלים
app.get("/patients-table", (req, res) => {
console.log("i am here 333");
  const query = `SELECT 
    patients.name,
    patients.phone_number,
    patients.email,
    therapists2.name AS therapist_name,
    therapists2.specialization
    FROM patients
    join therapists2 on therapists2.id = patients.therapist_id`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("שגיאה בקבלת נתוני המטופלים מהדאטהבייס:", err); // הדפסת שגיאה בשרת
      return res.status(500).json({ message: "שגיאה בשרת" });
    }
    res.status(200).json(results);
  });
});

// בקשה להחזרת טבלת המטופלים
app.get("/patients/:id", (req, res) => {
  const id = req.params.id;
  console.log("i am here");
  const query = `SELECT * FROM patients WHERE therapist_id = ${id}`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("שגיאה בקבלת נתוני המטופלים מהדאטהבייס:", err); // הדפסת שגיאה בשרת
      return res.status(500).json({ message: "שגיאה בשרת" });
    }
    res.status(200).json(results);
  });
});

