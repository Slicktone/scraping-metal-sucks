var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

var User = mongoose.model("User", UserSchema);

module.exports = User;