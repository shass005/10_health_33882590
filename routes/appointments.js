const request = require('request')
const express = require("express");
const router = express.Router();
const db = global.db;
const { redirectLogin } = require('./users');
// Holds timeslots for appointments
const allowedTimeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00"
];

// Appointment form
 router.get('/book', (req, res) => {
        res.render("appointmentform.ejs", { timeSlots: allowedTimeSlots });
        });

// Book appointment
router.post('/book', (req, res, next) => {
    const first = req.sanitize(req.body.patient_first);
    const last = req.sanitize(req.body.patient_last);
    const date = req.body.date;
    const time = req.body.time;

    if (!allowedTimeSlots.includes(time)) {
        return res.render("error.ejs", { 
            message: "Invalid time selected.",
            backUrl: "/appointments/book"
        });
    }

    const today = new Date().toISOString().split("T")[0];
    const maxDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0];

    if (date < today || date > maxDate) { //Onlt Allow appointments for the next 5 days
        return res.render("error.ejs", {
            message: "You can only book appointments within the next 5 days.",
            backUrl: "/appointments/book"
        });
    }

    const patientCheckSql = `
        SELECT first_name, last_name 
        FROM patients 
        WHERE first_name = ? AND last_name = ?
    `;

    db.query(patientCheckSql, [first, last], (err, result) => {
        if (err) return next(err);

        if (result.length === 0) {
            return res.redirect('/patient/add');
        }

        const patient = result[0];

        const checkSlotSql = `
            SELECT * FROM appointments
            WHERE date = ? AND time = ?
        `;

        db.query(checkSlotSql, [date, time], (err, slotResult) => {
            if (err) return next(err);

            if (slotResult.length > 0) {
                return res.render("error.ejs", {
                    message: "That time slot is already booked.",
                    backUrl: "/appointments/book"
                });
            }

            const insertSql = `
                INSERT INTO appointments (first_name, last_name, date, time)
                VALUES (?, ?, ?, ?)
            `;

            db.query(insertSql, [first, last, date, time], (err) => {
                if (err) return next(err);

                let apiKey =  '9966cedc4345ac23f8256f138c264013';
                let city = "London";
                let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

                request(url, function (err, response, body) {
                     let forecast = null;

                    if (!err) {
                        try {
                            const data = JSON.parse(body);
                            const target = `${date} ${time}:00`;
                            forecast = data.list.find(entry => entry.dt_txt.startsWith(date));

                            if (!forecast) {
                                forecast = data.list.reduce((closest, entry) => {
                                    return Math.abs(new Date(entry.dt_txt) - new Date(target)) <
                                        Math.abs(new Date(closest.dt_txt) - new Date(target))
                                        ? entry
                                        : closest;
                                });
                            }
                        } catch (e) { }
                    }
                    res.render("booked.ejs", {
                        patient,
                        date,
                        time,
                        weather: forecast
                    });
                });
            });
        });
    });
});  

router.get('/list', redirectLogin, (req, res, next) => {
    const sql = `
        SELECT first_name, last_name, date, time
        FROM appointments
        ORDER BY date ASC, time ASC
    `;

    db.query(sql, (err, result) => {
        if (err) return next(err);
        res.render("appointmentlist.ejs", { appointments: result });
    });
});


module.exports = router;
