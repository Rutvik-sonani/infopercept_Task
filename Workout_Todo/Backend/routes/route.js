const express = require('express')

//create an instance of the router
const router = express.Router()
// const Workout = require('../model/model')
const {
    createWorkout,
    getAllWorkout,
    getWorkout,
    deleteWorkout,
    updateWorkout
} = require('../controllers/controller')

//get all data => API/TODO/
router.get('/',getAllWorkout)

//get single data on => API/TODO/<pass_userid>
router.get('/:id',getWorkout)

//Insert/POST new data on => API/TODO/
router.post('/', createWorkout)

//Delete a specific data on => API/TODO/<pass_userid>
router.delete('/:id',deleteWorkout)

//Update existing data on => API/TODO/<pass_userid>
router.patch('/:id',updateWorkout)

//we create all diff. router and then we export the router at the end of this file.
module.exports = router