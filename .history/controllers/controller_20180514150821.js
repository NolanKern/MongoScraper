// Dependencies necessary for the router.something calls
var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var Post = require("../models/Post.js");
var Comment = require("../models/Comment.js");

// Recursive function for populating the mongo DB with articles (until no more are found)
function articleItt(articles, count, results, cb){
    if(count < articles.length){
        var post = articles[count];
        post.save(function(err, newPost){
            if(err) throw err;
            
            else {
                console.log("Post Added");
                console.log(newPost);
                results.push(newPost);
            }
            // itterates to next article
            return nextInsert(articles, (count+1), results, cb);
        });
    } 
    // if the count >= articles i.e no more articles to itterate through return the results
    else {
        cb(results);
    }
};

function scraper(){
    var promise = new Promise(function(resolve, reject){
        request("https://www.theonion.com/", function(err, resp, html){
            if (err) throw err;
            // there isnt an error therefore it can retrieve articles from the Onion
            else{
                var results = [];
                // load html into Cheerio for manipulation
                var $ = cheerio.load(html);
                // Find article info from HTML      NEED HELP
                var artContent = $("#main").find("")

                //get array of article elements
                var articles = $(artContent).children("article");
                articles.each(function(i, element){
                    // find css 
                    var backgroundImg = $(element).find("").css("background-image");
                    // content of the article from the Onion
                    var newArticle = $(element).find("js_post-item");
                    var content = $(element).find("p");
                    var aTag = $(content).find("h2").find("a");
                    var heading = $(aTag).text();
                    var articleLink = $(aTag).attr("href");
                    var body = content.find("p").text();
                    var post = new Post({
                        "title": heading,
                        "link": articleLink,
                        "summary": body,
                        "image": backgroundImg, 
                    });
                    results.push(post);
                });
                console.log(results);
                resolve(results);
            }
        });
    });
    return promise;
};

router.get('/', function(req, res) {
    db.articles.find({}, function(err, data) {
      if (err) throw err;
      res.render('index', {
        results: data
      });
    });
});

router.get("/scrape", function(req,res){
    scraper().then(function(scraper){
        console.log("Scrape from the onion");
        console.log("-----------------------------------");
        console.log(scraper);
        articleItt(scraper,0,[],function(results){
            res.json(results);
        });
    }).catch(function(err){
        console.log(err);
        res.json({"error" : "Error has occured"});
    });
});

//Id is the mongo ID for the article requested
router.post("/comments/:id", function(req, res){
    // Finds the post with the article ID
    Post.findOne({_id : req.params.id}, function(err, post){
        if(err) throw err;
        else {
            console.log("Sucess");
            var comment = new Comment({
                text : req.body.commentText,
                poster: req.body.commentPoster
            });
            // Makes sure that the comment text meets the requirements for a tweet
            if(comment.poster.length <= 50 && comment.poster.length >= 1 && comment.text.length >= 1 && comment.text.length <= 300){
                comment.save(function(err, newComment){
                    if(err) throw err;
                    else {
                        console.log("Comment meets tweet requirements");
                        post.comments.push(newComment._id);
                        post.save(function(err, savedPost){
                            if(err) throw err;
                            else {
                                console.log("Made it through");
                                // Go back to main page to display articles
                                res.redirect("/");
                            }
                        });
                    }
                });
            }
        }
    });
});
// Given article with specificed comment find that comment and delete it
router.delete("/comment/:id", function(req, res){
    console.log("Here in delete");
    Comment.findOne({_id : req.params.id}, function(err, comment){
        if(err) throw err;
        // Delete found comment
        else {
            console.log("Deleting now");
            comment.remove(function(err){
                if(err) throw err;
                
                else {
                    res.json({"success" : req.params.id});
                }
            });
        }
    });
});

module.exports = router;