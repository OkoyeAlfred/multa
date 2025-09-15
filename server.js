require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')
const PORT = process.env.PORT ||  2020
const DB = process.env.DB_URI
const userRouter = require('./router/userRouter')
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/v1', userRouter);

app.use((error,req,res,next)=>{
    if(error){
        return res.status(500).json({
            message:error.message
        })
    };
    next();
});

mongoose.connect(DB).then(()=>{
    console.log('Database connection successfully');
    app.listen(PORT, ()=>{
    console.log(`server is running on PORT: ${PORT}`);
    
    })
    
}).catch((error)=>{
    console.log('Error connecting to database', error.message);
    
})