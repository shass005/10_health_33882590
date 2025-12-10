// Create a new router
const express = require("express")
const { check, validationResult } = require('express-validator');
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10
const db = global.db;

//redirect login
const redirectLogin = (req, res, next)=>{
    if (!req.session.userId){
        req.session.returnTo = req.originalUrl; //Store current page before redirect
        return res.redirect('/users/login')
    } else {
        next ();
    }
}

// registration route
router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})


router.post('/registered', 
[   
    check('password') // Check password
    .isLength({ min: 8, max: 20 }) //Must be bewtween 8-20 characters
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?~`_+\-])[A-Za-z\d!@#$%^&*(),.?~`_+\-]{8,20}$/), //Must have at least one upper, lower case letters, one number and a special character
    check('email').isEmail(), //Check email is in proper email format
    check('username').isLength({min:5, max:20}) 
], 
(req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('register.ejs', { errors: errors.array() });
    }

    const plainPassword = req.body.password;
    const firstName = req.sanitize(req.body.first);
    const lastName = req.sanitize(req.body.last);
    const email = req.sanitize(req.body.email);
    const username = req.sanitize(req.body.username);
    // Hash Password
    bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
        if (err) return next(err);

        const sql = `
            INSERT INTO staff (first_name, last_name, email, username, password)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(sql, [firstName, lastName, email, username, hashedPassword], (err) => {
            if (err) return next(err);

            res.send(`Welcome ${firstName} ${lastName}. You are registered <a href="/">Back to Home</a>!`); //Validation message displayed to user
        });
    });
});

// login route   
router.get('/login', function (req, res, next) {
    res.render('login.ejs')
})
router.post('/loggedin',
[
    check('username').notEmpty(), // Ensure username and password are not empty
    check('password').notEmpty()
],
(req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.render("login");

    const username = req.sanitize(req.body.username);
    const plainPassword = req.sanitize(req.body.password);

    const sql = "SELECT * FROM staff WHERE username = ?";
    db.query(sql, [username], (err, result) => {
        if (err) return next(err);

        if (result.length === 0) {
            logAudit(username, false);
            return res.send("Incorrect username");
        }

        const user = result[0];

        bcrypt.compare(plainPassword, user.password, (err, match) => {
            if (err) return next(err);

            if (!match) {
                logAudit(username, false);
                return res.send("Invalid username or password");
            }

            req.session.userId = user.username;
            logAudit(username, true);

            const redirectUrl = req.session.returnTo || '/';  
            delete req.session.returnTo;  // Optional cleanup
            return res.redirect(redirectUrl);

        });
    });
});
// Inserts login attempts into the the sql audit table
function logAudit(username, success) {
    const sql = "INSERT INTO audit (username, success) VALUES (?, ?)";
    db.query(sql, [username, success], (err, result) => {
        if (err) {
            console.error("Error logging audit:", err);
        }
    });
}
// audit route
router.get('/audit', redirectLogin, function(req, res, next) {
        let sqlquery = "SELECT username, success, time FROM audit;"
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                next(err)
            }
            res.render("audit.ejs", {auditlist:result})
         });
    });

// Export the router object so index.js can access it
module.exports = {
    router: router,
    redirectLogin: redirectLogin
};