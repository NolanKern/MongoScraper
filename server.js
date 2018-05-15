//  Dependencies
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var routes = require("./routes")

// Make Promise avaliable
moongoose.Promise = Promise;

// initialize express
var app = express();

// set up ports for port and mongo
var PORT = process.env.PORT || 9001;
var mongo_connection = process.env.MONGODB_URI || "mongodb://localhost/news_scaper";

// Set up functionality for app
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type : "application/vnd.api+json"}));

// Set the usage of Handlebars
app.engine("handlebars", exphbs({defaultLayout : "main"}));
app.set("view engine", "handlebars");

// Declare routing logic to be handled by the rotes folder logic
app.use(routes);

// Connect to Mongo DB
moongoose.connect(MONGODB_URI);

// Listen at port
app.listen(PORT, function(){
    console.log("Listening at Port: "+ PORT);
})