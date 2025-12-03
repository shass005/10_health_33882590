const express = require("express");
const { redirectLogin } = require("./users");
const router = express.Router()
const request = require('request');
const { param } = require("./main");
const db = global.db;


router.get('/books', function (req, res, next) {
    let search = req.query.search;
    let minPrice = req.query.minprice;
    let maxPrice = req.query.max_price;
    let sort = req.query.sort;

    // Query database to get all the books
    let sqlquery = "SELECT * FROM books WHERE 1=1";
    let params = [];

    if(search){
        sqlquery += " AND name LIKE ?";
        params.push(`%${search}%`);
    }
    if(minPrice && maxPrice){
        sqlquery += " AND price BETWEEN ? AND ?";
        params.push(minPrice, maxPrice)
    }
    if (sort){
        switch(sort.toLowerCase()){
            case "name":
                sqlquery += " ORDER BY name ASC";
                break;
            case "price":
                sqlquery += " ORDER BY price DESC";  
                break;
            default:
                break;
        }
    }
    // Execute the sql query
    db.query(sqlquery, params, (err, result) => {
        // Return results as a JSON object
        if (err) {
            res.json(err)
            next(err)
        }
        else {
            res.json(result)
        }
    })
})

module.exports = router;