const express = require('express');
const https = require('https')
const http = require('http')
const fs = require('fs');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
const flash = require('express-flash');
const logger = require('morgan');
const connectDB = require('./config/database');
const mainRoutes = require('./routes/main');
const happyHomeRoutes = require('./routes/HappyHome');
const commentRoutes = require('./routes/comments');
const mapRoutes = require('./routes/maps')
const emailserver = require('./emailserver');

//Use .env file in config folder
require('dotenv').config({ path: './config/.env' });

// Passport config
require('./config/passport')(passport);

//Connect To Database
connectDB();

//Using EJS for views
app.set('view engine', 'ejs');

//Static Folder
app.use(express.static('public'));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger('dev'));

//Use forms for put / delete
app.use(methodOverride('_method'));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use('/', mainRoutes);
app.use('/happyHome', happyHomeRoutes);
app.use('/comment', commentRoutes);
app.use('/maps', mapRoutes);
/*
// setup HTTPS listening...
var cert = fs.readFileSync(__dirname + "/cert.pem");
var key = fs.readFileSync(__dirname + '/key.pem');
var options = {
  key: key,
  cert: cert
}
app.get('/fuck', (req, res) => {
  res.send("now using https...")
})

*/
var options = {}


var server = http.createServer(options, app);

//Server Running
server.listen(process.env.PORT, () => {
  console.log('Server is running, you better catch it!');
});
server.on("error", err => {
  console.log("Server Error: %s", err.message)
})
emailserver.listen(process.env.EMAIL_PORT, (err) => {
  console.log("success")
  console.log(err)
})
console.log(emailserver.options)

emailserver.on("error" ,err=>{
  console.log("Email Server Error %s", err.message)
  console.log("Not using email.")
})