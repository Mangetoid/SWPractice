const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss=require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
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

const swaggerOption={
    swaggerDefinition:{
        openapi: '3.0.0',
        info:{
            title: 'Library API',
            version: '1.0.0',
            description: 'A simple Express VacQ API'
        },
        servers: [
            {
                url: 'http://localhost:5000/api/v1'
            }
        ],
    },
    apis:['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOption);
app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocs));

//Body parser
app.use(express.json());
//cookie parser
app.use(cookieParser());
//Sanitize data
app.use(mongoSanitize());
//Set security headers
app.use(helmet());
//Prevent XSS attacks
app.use(xss());
//Prevent http param pollutions
app.use(hpp());
//Enable CORS
app.use(cors());


// Rate Limiting
const limiter = rateLimit({
    windowsMs:10*60*1000,//10 mins
    max: 100
});

app.use(limiter);
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