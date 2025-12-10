// Create a new router
const express = require("express");
const { redirectLogin } = require("./users");
const router = express.Router()

// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
});

// About page route
router.get('/about',function(req, res, next){
    res.render('about.ejs')
});

//Logout route
router.get('/logout', redirectLogin, (req,res)=>{
    req.session.destroy(err=>{
        if(err){
            return res.redirect('./')
        }
        res.send('you are now logged out. <a href ='+'./'+'>Home</a>')
    })
})

// Export the router object so index.js can access it
module.exports = router