const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Result = require('../models/result')
const User = require('../models/user')
const checkAuth = require('../middleware/check-auth')

router.post("/create", checkAuth, (req,res,next) => {
    const id = req.body.user
    User.findById(id).then(user=> {
        return result
        .save()
        .then(doc => {
            console.log(doc);
            res.status(201).json(doc)  
         })
        .catch(err => {
            console.log(err);
            res.status(500).json({
               error: err
            })
         })

    }).catch(err => {
        console.log(err)
        res.status(500).json({
           message: 'Question not found',
           error: err
        })
     })
     const result = new Result({
        _id: new mongoose.Types.ObjectId(),
        user: req.body.user,
        totalPoints: req.body.totalPoints
     })

})


router.post('/find/:userId', checkAuth, (req,res,next) => {
const id = req.params.userId
Result.find({user: id})
.select("_id user totalPoints")
.exec()
.then(result => {
    console.log(result)
    if(result){
        res.status(200).json({
            result
        })
    } else{
        res.status(404).json({
            message: 'No valid entry found for provided ID'
        })
    }
})
.catch(err => {
    console.log(err)
    res.status(500).json({eror:err})
})


})


module.exports = router