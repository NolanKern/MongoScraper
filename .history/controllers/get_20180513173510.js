// Logic behind the flow of the relevant controllers
var db = require("../models");
var scrape  = require("../script/scrape");

// Creates an export to handle the request for a headline
module.exports = {
    scrapeHeadlines: function(req,res){
        // scrape the onion
        return scrape()
        .then(function(articles){
            // Insert results into model db for retreval
            return db.headline.create(articles);
        })
        // Checks to see how many (if any) articles can be pulled from the ONION
        .then(function(dbHeadline){
            // Display message if the scraper fails to find any articles for the day
            if(dbHeadline.length === 0){
                res.json({
                    message: "No Onion to eat today :("
                });
            }
            // Otherwise the program will send back how many articles were found to maniplaute them
            else{
                res.json({
                    message: "There were:" + dbHeadline.length + "articles found"
                });
            }
        })
        .catch(function(err){
            res.json({
                message: "ERROR ONION WAS DEVOURED" + err
            });
        });
    }
};