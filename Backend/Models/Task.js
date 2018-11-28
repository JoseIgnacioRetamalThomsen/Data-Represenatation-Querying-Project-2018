var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Task = new Schema(
    {
        //id auto
        taskListNameId : String,
        taskTitle: String,
        taskBody: String,
        isCompleted: Boolean
    }
);

module.exports = mongoose.model('Task', Task);