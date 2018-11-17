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
    email: { type: String, unique: true },
    password: String,
    name: String
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
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS");

    next();
});

/*************************************************************************************************************************************
**************************************************************************************************************************************
**************************************************************************************************************************************
* User (sign.services.ts)
**************************************************************************************************************************************
**************************************************************************************************************************************
*************************************************************************************************************************************/



/*
* Create new User
* don't allow repeat users : Check if the user exist -> return true if user was created.
*/
app.post('/api/user', function (req, res) {

    var createdR = false;
    console.log("New call to post(/api/user) :" + req);

    var user = new userModel({
        email: req.body.email,
        password: req.body.password, name: req.body.name
    });
    try {
        user.save(function (err1, user) {
            console.log("hits" + user);
            if (err1)
                res.json({ created: false });
            else
                res.json({ created: true, id: user._id });




        });
    } catch (error) { }




});

// res.json({created:false});
/*
    user.save(function (err, user) {
        if (err) return console.error(err);
      
      });
      */
/*
    userModel.create({
        email: req.body.email,
        password: req.body.password,
        name : req.body.name,
    });
*/


/*
* Check login
*/
app.post('/api/login', function (req, res) {
    console.log("login request , email = -" + req.body.email + "- password= -" + req.body.password);
    userModel.findOne({ 'email': req.body.email }, function (err, data) {

        if (err) {
            res.json({ res: false });
        }

        if (req.body.password == data.password) {
            console.log("yes");
            res.json({ res: true, name: data.name, email: data.email, id: data._id });
        } else {
            console.log("no");
            res.json({ res: false });
        }
        // res.json(data);
    });

});

/*
* Get all user name
*/
app.get('/api/usernames', function (req, res) {

    console.log("usernames requested.")

    userModel.find({}, "name", function (err, data) {

        if (err) {
            res.send(err);
        }
        console.log(data);
        res.json(data);
    });
});

/*
* Get one user by id
*/
app.get('/api/user/:id', function (req, res) {

    console.log("Call to user:id = " + req.params.id);

    userModel.findById(req.params.id, '-password', function (err, data) {

        res.json(data);

    });

});//Get one user by id


/*
* Get one user by email
*/
app.get('/api/userEmail/:email', function (req, res) {

    console.log("Call to user:id = " + req.params.email);

    userModel.findOne({ email: req.params.email }, '-password', function (err, data) {
        console.log(data);
        res.json(data);

    });

});//Get one user by email

/*
*   Delete by id
*/
app.delete("/api/user/:id", function (req, res) {

    console.log(req.params.id);

    userModel.deleteOne({ _id: req.params.id }, function (err, data) {
        if (err) {
            res.send(err);
        }
        res.send(data);
    })

});// Delete by id

/*
* Update user details using id
*/
app.put('/api/updateuser/:id', function (req, res) {

    console.log("Update user request ffor " + req.params.id);

    userModel.findByIdAndUpdate(req.params.id, { $set: req.body },
        function (err, data) {
            if (err) {
                res.send(err);
                console.log(" User update unsucesfull :" + req.params.id);
            }

            res.send(data);

            console.log(" User update sucesfull :" + req.params.id);
        });

});//updateuser by id

/*
*   Update password by id
*
*  get id as parameter and new password in boby as {password:password}
*/
app.put('/api/updatepassword/:id', function (req, res) {

    console.log("Update Password request from " + req.params.id);

    userModel.findByIdAndUpdate(req.params.id, { $set: { password: req.body.password } },
        function (err, data) {
            if (err) {
                res.send(err);
                console.log(" Password update unsucesfull :" + req.params.id);
            }

            res.send(data);

            console.log(" Password update sucesfull :" + req.params.id);
        });

});//updatae passowrd by id

/*************************************************************************************************************************************
**************************************************************************************************************************************
**************************************************************************************************************************************
* Places (places.service.ts)
**************************************************************************************************************************************
**************************************************************************************************************************************
*************************************************************************************************************************************/
//var Schema = mongoose.Schema;

var placesSchema = new Schema({
    name: String,
    description: String,
    photoAddress: String
});
//conver schema to model
var placesModel = mongoose.model("places", placesSchema);



/*
* Get all places
*/

app.get('/api/places', function (req, res) {

    console.log("All places requested.")

    placesModel.find({}, function (err, data) {

        if (err) {
            res.send(err);
        }

        console.log(data);
        res.json(data);
        console.log("All places request sent back.")
    });
});

/*************************************************************************************************************************************
**************************************************************************************************************************************
**************************************************************************************************************************************
* Comments (comments.service.ts)
**************************************************************************************************************************************
**************************************************************************************************************************************
*************************************************************************************************************************************/

var commentsSchema = new Schema({
    commenterName: String,
    commenterId: String,
    placeId: String,
    comment: String
});
//conver schema to model
var commentsModel = mongoose.model("comments", commentsSchema);

/*
* Add new comment
*/

app.post('/api/comment', function (req, res) {
    /* console.log("Title is " + req.body.title);
     console.log("content is " + req.body.content);
 */

    console.log(req.body.placeId);
    commentsModel.create({
        commenterName: req.body.commenterName,
        commenterId: req.body.commenterId,
        placeId: req.body.placeId,
        comment: req.body.comment
    });

    res.send({ created: true });
});

/*
* Get all comments for 1 place
*/

app.get('/api/comments/:placeId', function (req, res) {

    console.log("places = " + req.params.placeId);

    commentsModel.find({ placeId: req.params.placeId }, '-password', function (err, data) {
        console.log(data);
        res.json(data);

    });

});//Get one user by email

/*
*   Delete comment by id
*/
app.delete("/api/comment/:id", function (req, res) {

    console.log("Request to delete a comment, id: " + req.params.id);

    commentsModel.deleteOne({ _id: req.params.id }, function (err, data) {

        if (err) {
            res.send(err);
        }

        res.send(data);

        console.log("Request to delete done.")

    });

});// Delete by id




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