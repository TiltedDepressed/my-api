const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:  {type: String, required: true},
    description: {type: String, required: true},
    date: {type: String, required: true},
    status: {type: String,required:true, default:"1"},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

module.exports = mongoose.model('Request', requestSchema);