const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Request = require('../models/request')
const User = require('../models/user')
const checkAuth = require('../middleware/check-auth')
const Favorites = require('../models/favorites')

router.post('/',  (req,res,next) => {
Request.find()
.exec()
.then(result => {
    console.log(result)
    res.status(200).json({
        result
    })
})
.catch(err => {
    console.log(err)
    res.status(500).json({
        error: err
    })
})
})

router.post('/create', checkAuth, (req, res, next) => {
   
    const newRequest = new Request({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        date: req.body.date,
        status: req.body.status,
        user : req.body.userId
    })

    newRequest.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Request created',
            createdRequest: newRequest
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

router.post("/find/:userId", checkAuth, (req,res,next) => {
    const id = req.params.userId
    Request.find({user: id})
    .select("_id name description date status user")
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

router.post("/find/id/:requestId", checkAuth,(req,res,next)=>{
    const id = req.params.requestId
    Request.findById(id)
    .select("_id name description date status user")
    .exec()
    .then(result => {
        console.log(result)
        if(result){
            res.status(200).json({
                _id: result._id,
                name: result.name,
                description: result.description,
                date: result.date,
                status: result.status,
                user : result.userId
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

router.post("/delete/:requestId", checkAuth,(req,res,next)=>{
    const id = req.params.requestId
    Request.findByIdAndRemove(id)
    .exec()
    .then(result => {
        res.status(200).json({
            message: "request deleted"
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})

router.post("/update/:requestId", checkAuth, (req,res,next)=>{
    const id = req.params.requestId
    Request.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .exec()
    .then(result => {
        console.log(result)
        res.status(200).json(
            result
            )
        })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})


module.exports = router