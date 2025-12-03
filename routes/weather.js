const express = require("express");
const { redirectLogin } = require("./users");
const router = express.Router()
const request = require('request')
const db = global.db;

router.get('/result', function (req, res, next) {
  let apiKey = '9966cedc4345ac23f8256f138c264013'
  const keyword = req.sanitize(req.query.keyword);
        let city = keyword
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
                     
        request(url, function (err, response, body) {
          if(err){
            next(err)
          } else {
            //res.send(body)
            var weather = JSON.parse(body)
            if (weather!==undefined && weather.main!==undefined){
                res.render("weatherresult.ejs", {weather});
            }
            else{
                res.send("No Data Found");
            }
          } 
        });


})

router.get('/',function(req, res, next){
    const cities = ["London", "Manchester", "Liverpool", "Birmingham", "Leeds", "Essex", "Edinburgh"];
    res.render('weather.ejs', {cities})
});


module.exports = router;
