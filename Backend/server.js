var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');


//lab 6 conect to mongo db
var mongoose = require("mongoose");

var mongoDB = "mongodb://admin:admin1@ds251223.mlab.com:51223/galwaycitytour"

mongoose.connect(mongoDB, { promiseLibrary: require('bluebird') });

//hot todata Schema

var Schema = mongoose.Schema;



//Here we are configuring express to use body-parser as middle-ware. 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;


 var jwt = require('jsonwebtoken');
// load up the user model







/********************** ---------------------------------------------------
*/
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,,AUTHORIZATION");
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
//user schema
var userSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: String
});

userSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

userSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};
var userModel = mongoose.model("users", userSchema);

var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

var secret = 'meansecure'; // get db config file
var passport = require('passport');

module.exports = function (passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = secret;
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        userModel.findOne({ id: jwt_payload.id }, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
}(passport);


app.use(passport.initialize());





//user mdodel using schame


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
app.post('/api/signup', function (req, res) {
    console.log("xall");
    if (!req.body.email || !req.body.password) {
        res.json({ created: false, msg: 'Please pass username and password.' });
    } else {
        var newUser = new userModel({
            email: req.body.email,
            password: req.body.password, 
            name: req.body.name
        });
        // save the user
        newUser.save(function (err,user) {
            if (err) {
                console.log(err);
                return res.json({ created: false, msg: 'Username already exists.' });
            }

            //create token
            var token = jwt.sign(user.toJSON(), secret);
            res.json({ created: true, token: 'JWT ' + token, id: user._id });
        });
    }
});


/*
* Check login
*/
app.post('/api/login', function (req, res) {

    console.log("Login request , email = -" + req.body.email + "- password= -" + req.body.password);

    //get user data using emal
    userModel.findOne({ 'email': req.body.email }, function (err, data) {

        //check for error , if error respond false
        if (err) {
            res.json({ res: false });
        }

        //if data null means wrong email so response false
        if (data == null) {

            console.log("Login succesfull,wrong email ");

            res.json({ res: false });

        } else {

            //check passsword
            if (req.body.password == data.password) {

                console.log("Login succesfull");


                res.json({ res: true, name: data.name, email: data.email, id: data._id });

            } else {

                console.log("Login succesfull,wrong password ");

                res.json({ res: false });

            }//if (req.body.password == data.password) 

        }// if (data == null)

    });

});//check login

app.post('/signin', function(req, res) {

    console.log("mk");

    userModel.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err) throw err;
  
      if (!user) {
        res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user.toJSON(), secret);
            // return the information including token as JSON
            res.json({success: true, token: 'JWT ' + token,name: user.name, user: user.email, user: user._id });
          } else {
            res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
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

getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

app.delete('/api/user1/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
    console.log("caLLDFAmnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnS");
    var token = getToken(req.headers);
    if (token) {
        userModel.deleteOne({ _id: req.params.id }, function (err, data) {
           
            if (err) return next(err);
            
            res.send(data);
        })
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });


/*
* Update comment using id
*/
app.put('/api/updateuser/:id', function (req, res) {

    console.log("Update user request ffor " + req.params.id);

    userModel.findByIdAndUpdate(req.params.id, { $set: req.body },
        function (err, data) {
            if (err) {
                res.send(err);
                console.log(" User update unsuccessful :" + req.params.id);
            }

            res.send(data);

            console.log(" User update successful :" + req.params.id);
        });

});//updateuser by id

/*
*   Update comment by id
*
*  get id as parameter and new password in boby as {password:password}
*/
app.put('/api/updatepassword/:id', function (req, res) {

    console.log("Update Password request from " + req.params.id);

    userModel.findByIdAndUpdate(req.params.id, { $set: { password: req.body.password } },
        function (err, data) {
            if (err) {
                res.send(err);
                console.log(" Password update unsuccessful :" + req.params.id);
            }

            res.send(data);

            console.log(" Password update successful :" + req.params.id);
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

    setTimeout(function () {

        placesModel.find({}, function (err, data) {

            if (err) {
                res.send(err);
            }


            res.json(data);
            console.log("All places request sent back.")

        });
    }, 4000);



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

    console.log("new to comment for : " + req.body.placeId);

    //create new comment
    commentsModel.create({
        commenterName: req.body.commenterName,
        commenterId: req.body.commenterId,
        placeId: req.body.placeId,
        comment: req.body.comment

    }, function (err) {
        //if err send error back
        if (err) {
            res.send(err);
        }

        //send positive response after create comment in db
        res.send({ created: true });

    });//commentsModel.create({



});//app.post('/api/comment'

/*
* Get all comments for 1 place
*/

app.get('/api/comments/:placeId', function (req, res) {

    console.log("Comments requested for = " + req.params.placeId);

    //find all commets using id
    commentsModel.find({ placeId: req.params.placeId }, '-password', function (err, data) {

        //if err send error back
        if (err) {
            res.send(err);
        }

        //send data back
        res.json(data);

        console.log("Comments requested done = " + req.params.placeId);

    });// commentsModel.find({ placeId:

});//Get one user by email

/*
*   Delete comment by id
*/
app.delete("/api/comment/:id", function (req, res) {

    console.log("Request to delete a comment, id: " + req.params.id);

    //delete comment using id
    commentsModel.deleteOne({ _id: req.params.id }, function (err, data) {

        //if err send error back
        if (err) {
            res.send(err);
        }

        //commet was deleted, send response
        res.send(data);

        console.log("Request to delete done.")

    });

});// Delete by id

/*
*   Update comment by id
*
*  get id as parameter and new password in boby as {password:password}
*/
app.put('/api/updatecomment/:id', function (req, res) {

    console.log("Update comment request from " + req.params.id);

    commentsModel.findByIdAndUpdate(req.params.id, { $set: { comment: req.body.comment } },

        function (err, data) {
            //check for error
            if (err) {
                res.send(err);
                console.log(" Comment update unsuccessful :" + req.params.id);
            }

            //respond back if update successful
            res.send(data);

            console.log(" Comment update sucessfull :" + req.params.id);
        });

});//updatae passowrd by id

/*************************************************************************************************************************************
**************************************************************************************************************************************
**************************************************************************************************************************************
* Search (search.service.ts)
**************************************************************************************************************************************
**************************************************************************************************************************************
*************************************************************************************************************************************/

app.get('/api/search/:s', function (req, res) {

    console.log("Search for  = " + req.params.s);
    var str = "/" + req.params.s + "/";
    //user
    /*
    userModel.find({ name:  req.params.s}, "", function (err, data) {

        if (err) {
            res.send(err);
        }
        console.log(data);
        res.json(data);
    });*/
    userModel.find().where('name like Banessa').exec(function (err, data) {

        if (err) {
            res.send(err);
        }
        console.log(data);
        res.json(data);
    });

});//Get one user by email


/********************** ---------------------------------------------------
*/
var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

});