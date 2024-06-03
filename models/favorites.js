const mongoose = require('mongoose');

const favoritesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    requestId:{type: mongoose.Schema.Types.ObjectId, ref: "Request", required: true},
    name:  {type: String, required: true},
    description: {type: String, required: true},
    date: {type: String, required: true},
    status: {type: String,required:true, default:"1"},
    
});

module.exports = mongoose.model('Favorites', favoritesSchema);