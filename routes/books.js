// Create a new router
const express = require("express")
const router = express.Router()
const db = global.db;

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', function (req, res, next) {
    //searching in the database
    const keyword = req.query.keyword;
    let sqlquery = "SELECT * FROM books WHERE name like ?"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, [`%${keyword}%`], (err, result) => {
        if (err) {
            next(err)
        }
        res.render("searchresult.ejs", {availableBooks:result})
        });
    });

router.post('/bookadded', function(req, res, next) {
    const bookName = req.body['book-name'];
    const price = req.body.price;
    const sql = "INSERT INTO books (name, price) VALUES (?, ?)";
    db.query(sql, [bookName, price], (err, result) => {
        if (err) {
            console.error("Error inserting book:", err);
            return next(err);
        }
        res.send(`This book is added to database, name: ${bookName} price: ${price}`);
    });
});

router.get('/list', function(req, res, next) {
        let sqlquery = "SELECT * FROM books"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                next(err)
            }
            res.render("list.ejs", {availableBooks:result})
         });
    });

router.get('/bargainbooks', function(req, res, next) {
        let sqlquery = "SELECT * FROM books WHERE price<20"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                next(err)
            }
            res.render("bargainbooks.ejs", {availableBooks:result})
         });
    });
// Export the router object so index.js can access it
module.exports = router
