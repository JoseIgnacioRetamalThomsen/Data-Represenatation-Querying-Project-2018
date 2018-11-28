var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentsSchema = new Schema({
    commenterName: String,
    commenterId: String,
    placeId: String,
    comment: String
});
//conver schema to model
module.exports= mongoose.model("comments", commentsSchema);