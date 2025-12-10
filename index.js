require('dotenv').config();
// Import express and ejs
const expressSanitizer = require('express-sanitizer');
var express = require ('express')
var ejs = require('ejs')
var mysql = require('mysql2')
var session = require('express-session')
const path = require('path')

// Create the express application object
const app = express()
const port = 8000

//Database Connection
const db = mysql.createPool({
    host: process.env.HEALTH_HOST,
    user: process.env.HEALTH_USER,
    password: process.env.HEALTH_PASSWORD,
    database: process.env.HEALTH_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

global.db = db;
// Session
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')
// Set up the body parser 
app.use(express.urlencoded({ extended: true }))
app.use(expressSanitizer());
// Set up public folder (for css and static js)
app.use(express.static(path.join(__dirname, 'public')))

// Define our application-specific data
app.locals.clinicData = {clinicName: "Bertie's Clinic"}


// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)
// Load the route handlers for /patients
const patientRoutes = require("./routes/patient")
app.use('/patient', patientRoutes)
// Load the route handlers for /appointments
const appointmentsRoutes = require("./routes/appointments")
app.use('/appointments', appointmentsRoutes)
// Load the route handlers for /users
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes.router)
// Load the route handlers for /api
const apiRoutes = require('./routes/api')
app.use('/api', apiRoutes)

// Start the web app listening
app.listen(port, () => console.log(`Clinic appointment app is listening on port ${port}!`))