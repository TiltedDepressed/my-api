const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Answer = require('../models/answer')
const Question = require('../models/question')
const checkAuth = require('../middleware/check-auth')

router.get('/', (req,res,next) => {
Answer.find()
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

router.post('/create', checkAuth, (req,res,next) => {
    Question.findById(req.body.questionId).then(question => {
            return answer
            .save()
            .exec()
            .then(result => {
                console.log(result);
                res.status(201).json(result)  
             })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                   error: err
                })
             })
        })
        .catch(err => {
            res.status(500).json({
               message: 'Product not found',
               error: err
            })
         })
    const answer = new Answer({
        _id: new mongoose.Types.ObjectId(),
        answer: req.body.answer,
        points: req.body.points,
        question: req.body.questionId
    })
})

router.post("/:answerId", checkAuth,(req,res,next)=>{
    const id = req.params.answerId
    Answer.findById(id)
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

router.post("/delete/:answerId", checkAuth,(req,res,next)=>{
    const id = req.params.answerId
    Answer.findByIdAndRemove(id)
    .exec()
    .then(result => {
        res.status(200).json({
            message: "question deleted"
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})

router.post("/update/:answerId", checkAuth, (req,res,next)=>{
    const id = req.params.answerId
    Answer.findByIdAndUpdate(id, { $set: req.body }, { new: true })
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