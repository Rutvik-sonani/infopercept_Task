//that's helps to we can create models and schemas for our data in the database
//mongodb alone is schema-less
const mongoose = require('mongoose')

//it is function var. to create new schema
const Schema = mongoose.Schema

//schema defines the structure of particular document or type of document inside our database
//This all fields are required to insert in doucment, not any fields are you skip it out from this schema
//Schema is enforce to enter particular fields data in database
const WorkoutSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    reps: {
        type: Number,
        required: true
    },
    load: {
        type: Number,
        required: true
    }
},{timestamps: true})

//mongoose.model('model_name',schema_name) => create new model and it is (module) exports using module.exports
module.exports = mongoose.model('workout',WorkoutSchema)

//model does is apply that schema to a particular model then we use the model to interact with a collaction of that name.