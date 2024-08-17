const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')

const app = express()
// app.use(cors());
app.use(cors({
    origin : "http://localhost:3000",
    // methods: ['GET','PUT','POST'],
    // allowedHeaders: ['Content-Type','Authorization'],
    credentials : true
}))

// Alternatively, handle preflight OPTIONS requests explicitly
// app.options('*', cors({
//     origin: "http://localhost:3000",
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
// }));

app.use(express.json())
app.use(cookieParser())

app.use("/api",router)

const PORT = 8080 || process.env.PORT


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("connnect to DB")
        console.log("Server is running "+PORT)
    })
})
