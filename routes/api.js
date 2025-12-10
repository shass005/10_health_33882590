const express = require("express");
const { redirectLogin } = require("./users");
const router = express.Router()
const request = require('request');
const { param } = require("./main");
const db = global.db;

router.get('/', redirectLogin, (req, res, next) => {
    const { search, date, sort } = req.query;

    let sql = "SELECT * FROM appointments WHERE 1=1";
    let params = [];

    if (search) {
        sql += " AND (first_name LIKE ? OR last_name LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
    }

    if (date) {
        sql += " AND date = ?";
        params.push(date);
    }

    if (sort) {
        switch (sort.toLowerCase()) {
            case "date":
                sql += " ORDER BY date ASC, time ASC";
                break;
            case "firstname":
                sql += " ORDER BY first_name ASC";
                break;
            case "lastname":
                sql += " ORDER BY last_name ASC";
                break;
            default:
                break;
        }
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            return next(err);
        }
        res.json(results);
    });
});

module.exports = router;
