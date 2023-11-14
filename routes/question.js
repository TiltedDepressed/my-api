const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Question = require('../models/question')
const checkAuth = require('../middleware/check-auth')

router.get('/', (req,res,next) => {
Question.find()
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

router.post('/:questionId', checkAuth, (req,res,next) =>{
    const id = req.params.questionId
    Question.find(id)
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

router.post('/create', checkAuth, (req,res,next) => {
    const question = new Question({
        _id: new mongoose.Types.ObjectId(),
        question: req.body.question
    });
    question
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Question created',
            createdQuestion: question
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

router.post('/delete/:questionId', checkAuth, (req,res,next) => {
    const id = req.params.questionId
    Question.findByIdAndRemove(id)
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

router.post('/update/:questionId', checkAuth, (req,res,next)=> {
    const id = req.params.questionId
    Question.findByIdAndUpdate(id, { $set: req.body }, { new: true })
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

