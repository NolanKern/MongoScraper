// Require mongoose and the schema component for manipulation
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create Comment schema
var CommentSchema = new Schema({
  // title is a required string
  text: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true
  }
});

CommentSchema.pre("remove", function(next){
    var comment = this;
    comment.model('Post').update(
        { comments: {$in: [comment._id]}}, 
        { $pull: { comments: comment._id } }, 
        { multi: true }, 
        next
    );
});

// Create the Post model with the PostSchema
var Comment = mongoose.model("Comment", CommentSchema);

// Export the model
module.exports = Comment;
