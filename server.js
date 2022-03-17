const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
//Edit 2
const connectDB = require('./config/db');
const res = require('express/lib/response');

const hospitals = require ('./routes/hospitals');
const auth = require('./routes/auth');
const appointments = require('./routes/appointments');
//load env var
dotenv.config({path:'./config/config.env'});
//Edit 2
connectDB();

const app = express();
//Body parser
app.use(express.json());
//cookie parser
app.use(cookieParser());

app.use('/api/v1/hospitals', hospitals);
app.use('/api/v1/auth',auth);
app.use('/api/v1/appointments', appointments);
const PORT=process.env.PORT || 5000;
const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));
//Handle unhandled promise rejections
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`);
    //Close server & exit process
    server.close(()=>process.exit(1));
})