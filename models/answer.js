const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    answer:  {type: String, required: true},
    points: {type: Number, required: true},
    question: {type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true}
});

module.exports = mongoose.model('Answer', answerSchema);