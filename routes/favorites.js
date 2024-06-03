const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Request = require('../models/request')
//const User = require('../models/user')
const checkAuth = require('../middleware/check-auth')
const Favorites = require('../models/favorites')


router.post('/',  (req,res,next) => {
Favorites.find()
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
   
    const newFavorites = new Favorites({
        _id: new mongoose.Types.ObjectId(),
        userId: req.body.userId,
        requestId: req.body.requestId,
        name: req.body.name,
        description: req.body.description,
        date: req.body.date,
        status: req.body.status
    })

    newFavorites.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Favorites created',
            createdFavorites: newFavorites
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

router.post("/delete/:favoritesId", checkAuth,(req,res,next)=>{
    const id = req.params.favoritesId
    Favorites.findByIdAndRemove(id)
    .exec()
    .then(result => {
        res.status(200).json({
            message: "favorites deleted"
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})


router.post("/update/:favoritesId", checkAuth, (req,res,next)=>{
    const id = req.params.favoritesId
    Favorites.findByIdAndUpdate(id, { $set: req.body }, { new: true })
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


router.post("/find/fav/:userId", checkAuth, (req,res,next) => {
    const id = req.params.userId
    Favorites.find({userId: id})
    .select("requestId userId _id name description date status")
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