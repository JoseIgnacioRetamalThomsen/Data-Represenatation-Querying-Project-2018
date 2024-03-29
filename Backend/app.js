var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var config = require('./config/database');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');



//setup app
var api = require('./routes/api');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/', express.static(path.join(__dirname, 'dist')));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization,authentication");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS");
  next();
});


app.use(passport.initialize());
app.use('/api', api);

//conect to database
mongoose.Promise = require('bluebird');
mongoose.connect(config.database, { promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));


/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
*/

//use of /
app.use("/", express.static(path.join(__dirname, "angular")));

//re route empty to index
app.get('/',function(req, res){
res.sendFile(path.join(__dirname, "angular", "index.html"));
});
/*
//route home to index
app.get('/home',function(req, res){
  res.sendFile(path.join(__dirname, "angular", "index.html"));
  });
*/
  //route any to index
  app.get('/*',function(req, res){
    res.sendFile(path.join(__dirname, "angular", "index.html"));
    })

module.exports = app;