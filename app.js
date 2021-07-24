const express = require("express");
const app = express();
const dotEnv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const dbConnection = require('./database/connection');

dotEnv.config({
    path: './.env'
});
app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());
app.use(cookieParser());

dbConnection();

const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));

app.set('view engine', 'hbs');
const PORT = process.env.PORT || 3000;


app.use('/auth', require('./routes/userRoute'));


app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});

// error handler middleware
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send({
        status: 500,
        message: err.message,
        body: {}
    });
});