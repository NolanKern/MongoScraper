// Require mongoose and the schema component for manipulation
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create Post schema
var PostSchema = new Schema({
  // title is unique so that no duplicates are populated
  title: {
    type: String,
    required: true,
    unique: true
  },
  // link href must be passing a string
  link: {
    type: String,
    required: true
  },
  summary: {
      type: String,
      required: true,
  },
  image: {
      type: String,
      required: true,
  },
  // Saves ID for comment deletion and ref calls the Comment model
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment",
  }]
});

// Create the Post model with the PostSchema
var Post = mongoose.model("Post", PostSchema);

// Export the model
module.exports = Post;