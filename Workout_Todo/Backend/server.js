//This is Entery file of Backend(nodejs + ExpressJS)
//package.json - allow us to keep track of dependencies and also register our own custom scripts
//npm - Node Package manager, that's helps to we can add/install all external lib.

//Lib....
//Express - NodeJS lib. that's helps to we can easily create api,server etc..
//nodemon - continuously listing express server
//dotenv - it is a package that loads envirnment variables from .env file into the process.env objects available to us globally in a nodejs environment
//mongoose - it is a ODM lib. and ODM stands for Object data modeling it basically waps mongoDB with an extra layer that allow us to use methods to read and write documents and it also gives us way to declare models and schema to ensure a more strict data structure.

//package.json changes...
// add... in { scripts : {....., "dev": "nodemon server.js"} }
// "dev": "nodemon server.js"
//so we can easily run nodeJS app using this following command...
// "node run dev"

//Test/check API request using POSTMAN Tool.

//it is hard coding the port number right here in server.js file
//but any const like this in an environment variable
//benifits  of doing this is this when you push your projects to repositories like on github
//the env. variables can remain hidden and they are not visible in the code now that might not be a not deal when it comes to the port number for now but when it comes to more sensitive info like a database connection string,auth secret
//this all thinges are not visible so they are better going in environment variable which will remain hidden.
// so we making a dot env file and it's store all environment variables
//when we push this project in github then .env file is add in .gitignore file so it is not push in github.

//import all lib.
require('dotenv').config()
const express = require('express')
//This file is require that particular router right here that we export with all of diff. router attached to route.js file
const route = require('./routes/route'); //don't put extension
const mongoose = require('mongoose')

//express app
const app = express()

//middleware...
//middleware is a fancy name for any code that execcutes between us getting a request on the server and us sending a resposnse so (req, res)=>{res.json({msg:"welcome to user"});}) this is middleware.

//route handler

//use method to use some middleware and in this we pass a function which is going to fire for every request that comes in 3 arg. -> req,res,next function  which we have to run at the end of this middleware in order to move on to the next piece of middleware

//middleware
//that does is any req comes in -> it looks if it has some body to the req -> so some data that we are sending to the server and if it does then it passes it and attaches it to the req object so that we can access it in the req handler.
app.use(express.json())

app.use((req, res, next)=>{
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/API/TODO',route)

//connect to db
mongoose.connect(process.env.MONGODB_URI).
    then(()=>{
        //listen for requests
        app.listen(process.env.PORT, ()=>{
            console.log('connect to db & server run on port',process.env.PORT)
        })
    }).catch((error)=>{
        console.log(error)
    })

