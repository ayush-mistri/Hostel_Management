const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaveSchema = new Schema({
    student:{
        type:Schema.Types.ObjectId,
        ref:'student'
    },
    leaving_date:{
        type:Date,
        required:true
    },
    return_date:{
        type:Date,
    },
    request_date:{
        type:Date,
        default:Date.now
    }
})

module.exports = Leave = mongoose.model('messoff', LeaveSchema);