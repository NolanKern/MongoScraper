// Headline Controller
// ============================
// Gathers models for manipulating the headline to add functionality
var db = require("../models");

// export for adding functionality to the headline model
module.exports = {
    // Gather headlines from the ONION, sort by date and return to user
    findAll: function(req,res){
        db.headline
        .find(req.query)
        .sort({date:-1})
        .then(function(dbHeadline){
            res.json(dbHeadline);
        });
    },
    // Updates specified Healine
    update: function(req,res){
        db.healine.findOneAndUpdate({ _id: req.params.id}, { $set: req.body}, {new: true})
        .then(function(dbHeadline){
            res.json(dbHeadline);
        })
    },
    // Allows the deletion of specified Headline
    delete: function(req,res){
        db.headline.remove({ _id: req.params.id })
        .then(function(dbHeadline){
            res.json(dbHeadline);
        });
    }

}