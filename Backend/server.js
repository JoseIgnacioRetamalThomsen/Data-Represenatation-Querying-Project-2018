var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');


//lab 6 conect to mongo db
var mongoose = require("mongoose");

var mongoDB = "mongodb://admin:admin1@ds251223.mlab.com:51223/galwaycitytour"

mongoose.connect(mongoDB);

//hot todata Schema

var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: String,
    password: String
});
//conver schema to model
var userModel = mongoose.model("users", userSchema);




//Here we are configuring express to use body-parser as middle-ware. 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/********************** ---------------------------------------------------
*/
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


/*
* Create new User
*/
app.post('/api/user', function (req, res){

    console.log("called");
   var user = new userModel({email: req.body.email,
    password: req.body.password});

    user.save(function (err, user) {
        if (err) return console.error(err);
      
      });

    userModel.create({
        email: req.body.email,
        password: req.body.password
    });

    res.json({res:true});
});

/*
* Check login
*/
app.post('/api/login', function (req, res){
    console.log("login request , email = -"+ req.body.email+"- password= -"+req.body.password);
    userModel.findOne({ 'email': req.body.email }, function (err, data) {
        
        if (err){
            res.json({res:false});
        }
        
        if( req.body.password == data.password)
        {
        console.log("yes");
        res.json({res:true});
        }else{
            console.log("no");
            res.json({res:false});
        }
       // res.json(data);
    });

});
/*
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/posts', function (req, res) {

    PostModel.find(function (err, data) {
        if (err)
            res.send(err);

        res.json(data);
    });
    //http://localhost:8081/api/posts
    // res.status(200).json({ posts: posts })

});




app.post('/api/posts', function (req, res) {
    console.log("Title is " + req.body.title);
    console.log("content is " + req.body.content);


    PostModel.create({
        title: req.body.title,
        content: req.body.content
    })

});

//read just one file
app.get('/getposts/:title', function (req, res) {
    console.log("Get " + req.params.title + " Post");
    PostModel.findOne({ 'title': req.params.title }, function (err, data) {
        if (err)
            return handleError(err);

        console.log(data);
        res.json(data);
    });
});

//read by id
app.get('/getpostsid/:id', function (req, res) {
    var id = req.params.id;
    console.log(id);
    PostModel.findById(id, function (err, data) {
        if (err)
            return handleError(err);
        console.log(data);
        res.json(data);
    });
});

*/
/********************** ---------------------------------------------------
*/
var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

});