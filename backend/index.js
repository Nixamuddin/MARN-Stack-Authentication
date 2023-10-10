import express from 'express';
import mongoose from 'mongoose';
import router from './routes/Routes.js';
import dotenv from 'dotenv';
import cors from 'cors'
import bodyParser from 'body-parser';
const app = express();
dotenv.config();
app.use(cors())
mongoose.connect("mongodb://0.0.0.0/User",{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db=mongoose.connection;
db.on('error',console.error.bind(console, "error while connecting to database") );
db.once("open",()=>console.log("open connection"))
app.use(bodyParser.json());
app.use('/api/auth',router)
const port=process.env.PORT ||8080;
app.listen(port,()=>{console.log(`listening on port  ${port}`)});
