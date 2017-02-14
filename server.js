// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
// Scrapers
var request = require("request");
var cheerio = require("cheerio");
// Requiring Models
var Comment = require("./models/Comment.js");
var User = require("./models/User.js");
// Bluebird promise
var Promise = require("bluebird");

mongoose.Promise = Promise;


// Initialize!
var app = express();

// Morgan and Body Parser
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

// Making Public a static directory
app.use(express.static("public"));

// Database configuration
mongoose.connect("mongodb://news-scraper");
var db = mongoose.connection;

// Error Handling
db.on("error", function(error) {
    console.log("Mongoose Error on ", error);
});
// Success Message
db.once("open", function() {
    console.log("Connection to Mongoose Successful!");
});

// Routes

// Index Route
app.get("/", function(req, res) {
    res.send(index.html);
});

// GET request to SCRAPE
app.get("/scrape", function(req, res) {
    request("http://www.blank.com/", function(error, response, html) {
        var $ = cherrio.load(html);
        // Grabbing an element and running the function
        $("").each(function(i, element) {
            var result = {};

            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");

            var entry = new Comment
        })
    })
})

