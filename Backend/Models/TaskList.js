var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskListSchema = new Schema(
    {
        //id auto
        name: String,
        userId: String
    }
);

module.exports = mongoose.model('TaskList', TaskListSchema);