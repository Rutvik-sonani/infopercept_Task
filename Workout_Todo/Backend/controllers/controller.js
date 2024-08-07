//Controller.js -> This is handle db logic and other logics we might need to do in the handle functions so instead what we will do is create a controller file which is going to contain bunch of controller functions.

const Workout = require('../model/model')
const mongoose = require('mongoose')

//get All data
const getAllWorkout = async(req, res)=>{
    const workouts = await Workout.find({}).sort({createdAt: -1})
    res.status(200).json(workouts)
}

//get specific data
const getWorkout = async(req, res)=>{
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such data."})
    }

    const workouts = await Workout.find(id)
    
    if(!workouts){
        return res.status(404).json({error: "No Data"})
    }
    res.status(200).json(workouts)
}

//insert new data
const createWorkout = async (req, res)=>{
    //get all data from req (objects) of that body
    const {title, reps, load} = req.body

    //add doc to db
    try{
        //Workout.create() method is async function that's helps to we can create new doucument, once that created -> the response we get is the new doucmnet that was just created along with the id of that doucment so we are storing that inside this workout constant.
        //also pass create() method inside data objects
        const workout = await Workout.create({title, reps, load})
        res.status(200).json(workout)
    }catch(error){
        res.status(400).json({error : error.message})
    }
}

//delete specific data
const deleteWorkout = async(req, res)=>{
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such data."})
    }

    const workouts = await Workout.findOneAndDelete({_id: id})
    
    if(!workouts){
        return res.status(404).json({error: "No Data"})
    }
    res.status(200).json(workouts)
}

//update a specific data
const updateWorkout = async(req, res)=>{
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such data."})
    }

    const workouts = await Workout.findOneAndUpdate({_id: id},{
        ...req.body
    })
    
    if(!workouts){
        return res.status(404).json({error: "No Data"})
    }
    res.status(200).json(workouts)
}

module.exports = {
    getAllWorkout,
    getWorkout,
    createWorkout,
    deleteWorkout,
    updateWorkout
}