// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
var async = require("async");
// Scrapers
var request = require("request");
var cheerio = require("cheerio");
// Requiring Models
var Comment = require("./models/Comment.js");
var User = require("./models/User.js");
var Articles = require("./models/Articles.js");
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
mongoose.connect("mongodb://localhost/metal-sucks-scraper");
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
    request("http://www.metalsucks.net", function(error, response, html) {
        var $ = cheerio.load(html);
        var scrapedArticle = $(".post-title");

    async.each(scrapedArticle, function(data, callback) {
        var data = new Articles();
        data.save(function(error) {
            if(error) {
                 return callback(error);
            }
            else {
                callback(null);
            }
        });
    }, function(error) {
        if(error) {
            return console.log("Process stopped due to error");
        } 
        else {
             console.log("Scraped data saved successfully");
         }
    });



        // // Grabbing an element and running the function
        // $(".post-title").each(function(i, element) {
        //     var result = {};

        //     result.title = $(this).children("a").text();
        //     result.link = $(this).children("a").attr("href");
        //     // Creating a new entry with Article model
        //     var entry = new Articles(result);
        //     console.log(entry);
        //     entry.save(function(error, doc) {
        //         if (error) {
        //             console.log(error);
        //         }
        //         else {
        //             console.log(doc);
        //             // For Async
        //             if (i === $(".post-title").length - 1) {
        //                 res.send("Scrape from www.metalsucks.net complete!");
        //             }
        //         }
        //     });
        // });
    });
});

// Grabbing ALL the articles
app.get("/articles", function(req, res) {
    Articles.find({}, function(error, doc) {
        if(error) {
            console.log(error);
        }
        else {
            res.json(doc);
        }
    });
});

// Grabbing the articles by ID
app.get("/articles/:id", function(req, res) {
    Articles.findOne({"_id": req.params.id})
    .populate("comment")
    .exec(function(error, doc){
        if(error) {
            console.log(error);
        }
        else {
            res.json(doc);
        }
    });
});

// Creating a new comment
app.post("/articles/:id", function(req, res) {
    var newComment = new Comment(req.body);
        // saving comment to the DB
        newComment.save(function(error, comment) {
            if(error) {
                res.send(error);
            }
            else {
                // =========== TESTING THE COMMENT ===========
                console.log(comment);

                Articles.findById(req.params.id, function(error, article) {
                    if(error) {
                        return console.log(error);
                    }
                    if(!article) {
                        return console.log("Couldnt Find the Article!");
                    }
                    // Will return the created ID
                    console.log(article.note);
                    article.save(function(error, updatedArticle) {
                        if(error) {
                            return console.log(error);
                        }
                            res.json(updatedArticle);
                    })
                });
            }
        }); 
    });


app.listen(3000, function() {
    console.log("If you are seeing this, THIS PORT IS ON 3000");
});