var express = require("express");
var router = express.Router();
var promise = require('bluebird');
var pgp = require('pg-promise')(options);

var connectionString = 'postgres://david:dhull33@localhost:5432/beatthemarket';

var db = pgp(connectionString);

var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
    extended :false
}));

var fetch = require('node-fetch');
var request = require('request');

var options = {
    promiseLib : promise
}

var stockPrice = 0;
var url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="
var url2 = "&interval=1min&apikey="
var apiKey = "3SW8F3VSYVSP0VAZ";


    db.any('SELECT * FROM beatthemarket').then(function(data){
      // res.render(page to render, object to pass to the page)
      res.render('stocks',{
          'stocks' : data
      });
    })
  });

router.post('/stocks',function(req,res){
    function update_stock_price() {
        (function () {
            console.log("Submitted")

            var url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="

            var symbol = req.body.stock_symbol;

            var url2 = "&interval=1min&apikey="

            var apiKey = "3SW8F3VSYVSP0VAZ";

            // Retreives individual stock prices
            var stockPrice;
            console.log(symbol);

            fetch(url + symbol + url2 + apiKey)
                .then(res => res.json())
                .then(json => {
                    // Assigns response to a variable so that we could access multiple data fields from JSON response
                    var stockData = json;
                    var timeSeries15 = stockData["Time Series (1min)"];
                    var currentDateData = Object.keys(timeSeries15)[0];
                    stockPrice = timeSeries15[currentDateData]["4. close"];
                    var timeZone = stockData["Meta Data"]["6. Time Zone"]
                    console.log(stockPrice);
                    console.log(currentDateData + " " + timeZone)

                })
            console.log(stockPrice)
            // currentPrice = 4;

            /*db.none('INSERT INTO stock_purchase(stock_symbol, purchase_price_each) values($1, $2)',[symbol, stockPrice]).then(function(){

              db.any('SELECT * FROM stocks').then(function(data){
                // res.render(page to render, object to pass to the page)
                res.render('stocks', {'stocks' : data});
              })

            })*/
        })();

        function update_stock_price(type, req, res) {
            (function () {
                console.log("Submitted")
                var symbol = req.body.stock_symbol + ":"; // Added : to end in case autocomplete is not used and only stock symbol is used
                symbol = symbol.substr(0, symbol.indexOf(":")); // Keeps symbol only
                var userId = "Testing";
                // Retreives individual stock prices
                console.log(symbol);

                fetch(url + symbol + url2 + apiKey)
                    .then(res => res.json())
                    .then(json => {
                        // Assigns response to a variable so that we could access multiple data fields from JSON response
                        var stockData = json;
                        var timeSeries15 = stockData["Time Series (1min)"];
                        var currentDateData = Object.keys(timeSeries15)[0];
                        var stockPrice = timeSeries15[currentDateData]["4. close"];
                        var timeZone = stockData["Meta Data"]["6. Time Zone"]
                        var currentDate = currentDateData.substring(0, 10);
                        console.log(currentDate);
                        console.log(stockPrice);
                        console.log(currentDateData + " " + timeZone)
                        // .catch(err => console.error(err));

                        // Insert data retrieved from API into database
                        if (type == "post") {
                            db.none('INSERT INTO stock_purchase(user_id, stock_symbol, purchase_price_each, purchase_date) values($1, $2, $3, $4)', [userId, symbol, stockPrice, currentDateData]).then(function () {
                            })
                        }
                    })
            })();
        }


        router.get('/stocks', function (req, res) {
            var type = "get";
            // update_stock_price(type, req, res);
            res.render('stocks');

        })

        router.post('/stocks', function (req, res) {
            var type = "post"
            update_stock_price(type, req, res);
        })
    }

module.exports = router;