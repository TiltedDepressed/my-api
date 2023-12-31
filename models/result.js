const mongoose = require('mongoose');

const resultSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    totalPoints: { type: String, required: true},
});

module.exports = mongoose.model('Result', resultSchema);