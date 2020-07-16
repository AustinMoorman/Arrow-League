const express = require('express');

const app = express();
const PORT = process.env.PORT || 3005;


require('dotenv').config()


//middleware
const cookieParser = require('cookie-parser');
const cors = require('cors')({origin: true,credentials: true});
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const morgan = require('morgan');
app.use(cookieParser());
app.use(cors);
app.use(bodyParser.json());
app.use(errorHandler());
app.use(morgan('dev'));

//routes
const apiRouter = require('./api/api')
app.use('/api',apiRouter);



app.listen(PORT, () => {
    console.log(`Arrow League server is up and running on ${PORT}!`)
})
