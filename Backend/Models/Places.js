var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var placesSchema = new Schema({
    name: String,
    description: String,
    photoAddress: String
});

module.exports = mongoose.model("places", placesSchema);