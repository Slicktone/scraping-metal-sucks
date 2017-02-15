var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    // referring to the Comment model, only saving one comment ID for now
    comment: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});
// Creating the article model with the schema along with it
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;