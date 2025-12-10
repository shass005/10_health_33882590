const express = require("express");
const router = express.Router();
const db = global.db;
const { redirectLogin } = require('./users');

// Search form
router.get('/find', redirectLogin, (req, res) => {
    res.render("find.ejs");
});

// Search results
router.get('/search-result', function (req, res, next) {
    const keyword = req.sanitize(req.query.keyword);

    // Join patients + appointments on first and last name
    const sqlquery = `
        SELECT 
            p.id,
            p.first_name,
            p.last_name,
            p.dob,
            a.date AS appointment_date,
            a.time AS appointment_time
        FROM patients p
        LEFT JOIN appointments a
            ON p.first_name = a.first_name
            AND p.last_name = a.last_name
        WHERE p.last_name LIKE ?
        ORDER BY p.last_name, p.first_name, a.date, a.time;
    `;

    db.query(sqlquery, [`%${keyword}%`], (err, result) => {
        if (err) return next(err);

        res.render("patientresult.ejs", { patients: result });
    });
});



// Add patient form
router.get('/add', redirectLogin,(req, res) => {
    res.render("addpatient.ejs");
});

// Insert into database
router.post('/patientadded', (req, res, next) => {
    const firstName = req.sanitize(req.body.first_name);
    const lastName = req.sanitize(req.body.last_name);
    const dob = req.body.dob;

    const sql = "INSERT INTO patients (first_name, last_name, dob) VALUES (?, ?, ?)";
    db.query(sql, [firstName, lastName, dob], (err) => {
         if (err) {
            next(err)
        }
        res.send(`Patient added: Name: ${firstName} Surname: ${lastName} DOB: ${dob} <br> <a href="/">Back to Home</a> `);
    });
});

// Patient list
router.get('/list', redirectLogin, (req, res, next) => {
    let sqlquery = "SELECT * FROM patients";

    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("patientlist.ejs", { availablePatients: result });
    });
});

module.exports = router;
