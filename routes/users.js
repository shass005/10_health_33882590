// Create a new router
const express = require("express")
const { check, validationResult } = require('express-validator');
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10

const redirectLogin = (req, res, next)=>{
    if (!req.session.userId){
        res.redirect('/users/login')
    } else {
        next ();
    }
}

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', [check('password').isLength({min:8,max:20}),check('email').isEmail(),check('user').isLength({min:5, max:20})], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        res.render('./register')
    }
    const plainPassword = req.body.password
    const firstName = req.sanitize(req.body.first);
    const lastName = req.sanitize(req.body.last);
    const email = req.sanitize(req.body.email);
    const username = req.sanitize(req.body.user);
    
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword){
        //Store hashed password in database
        if (err){
            return next(err)
        }
    // saving data in database
      const sql = "INSERT INTO users (first_name, last_name, email, username, password) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, [firstName, lastName, email, username, hashedPassword], (err, result) => {
            if (err) {
                console.error("Error inserting book:", err);
                return next(err);
            }
            result = `Hello  ${firstName}$ ${lastName}$. You are now registered!  We will send an email to you at ${email}$`
            result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
            res.send(result)

        });
    });
});
router.get('/list', redirectLogin, function(req, res, next) {
        let sqlquery = "SELECT first_name, last_name, email, username FROM users"; // query database to get all the users
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                next(err)
            }
            res.render("userlist.ejs", {availableUsers:result})
         });
    });
    
router.get('/login', function (req, res, next) {
    res.render('login.ejs')
})
router.post('/loggedin', [check('password').notEmpty().withMessage('Username is required'), check('user').notEmpty().withMessage('Password is required')],function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        res.render('./register')
    }
    else{
        const plainPassword = req.body.password;
        const username = req.body.user;

        const sql = "SELECT * FROM users WHERE username = ?";
        db.query(sql, [username], (err, result) => {
            if (err) {
                console.error("Error querying the database:", err);
                return next(err);  // Handle database errors
            }
            if (result.length === 0) {
                logAudit(username, false);
                return res.send("Incorrect Username");
            }
            const hashedPassword = result[0].password;
            
            // Compare the password supplied with the password in the database
            bcrypt.compare(plainPassword, hashedPassword, function(err, match) {
                if (err) {
                    console.error("Error comparing passwords:", err);
                    return next(err);
                }
                if (match) {
                    const user = result[0]; 
                    req.session.userId = username;
                    logAudit(username, true);
                    res.send(`Welcome ${user.first_name} ${user.last_name}, you are now logged in!`);
                } else {
                    logAudit(username, false)
                    res.send("Invalid username or password!");
                }
            });
        });
}
});

function logAudit(username, success) {
    const sql = "INSERT INTO audit (username, success) VALUES (?, ?)";
    db.query(sql, [username, success], (err, result) => {
        if (err) {
            console.error("Error logging audit:", err);
        }
    });
}

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
