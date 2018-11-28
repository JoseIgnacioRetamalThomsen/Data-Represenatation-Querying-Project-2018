var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

var userModel = require("../models/user");
var placesModel = require("../Models/Places");
var commentsModel = require("../Models/Comments");



var bcrypt = require('bcrypt-nodejs');


/* test */
router.get('/test', function (req, res, next) {
    res.send('Express RESTful API for TOTO app');
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
* if user is created respond with create true and user id 
*/
router.post('/api/user', function (req, res) {

    //create new user model
    var user = new userModel({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
    });


    //user is unique so will not allow duplicated
    user.save(function (err1, user) {


        if (err1) //err means user extist response false
            res.json({ created: false, msg: "User name in use." });
        else
            res.json({ created: true, id: user._id, msg: "User Created." });

    });


});//create new user

/*
* Create new User
* don't allow repeat users : Check if the user exist -> return true if user was created.
* if user is created respond with create true and user i, generete a token.
*/
router.post('/signup', function (req, res) {

    //check request
    if (!req.body.email || !req.body.password) {

        res.json({ success: false, msg: 'Please pass username and password.' });

    } else {

        //creete new user model
        var newUser = new userModel({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name
        });
        // save the user
        newUser.save(function (err, user) {
            if (err) {

                return res.json({ success: false, msg: 'Username already exists.' });
            }

            //create token
            var token = jwt.sign(user.toJSON(), config.secret);
            res.json({ success: true, token: 'JWT ' + token, id: user._id });

        });
    }

});//create user

/*
* Check login
*/
router.post('/signin', function (req, res) {

    console.log("mk");

    userModel.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.status(401).send({ success: false, msg: 'User not found.' });
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {

                    // if user is found and password is right create a token
                    var token = jwt.sign(user.toJSON(), config.secret);

                    // return the information including token as JSON
                    res.json({ success: true, token: 'JWT ' + token, name: user.name, user: user.email, id: user._id });

                } else {
                    res.status(401).send({ success: false, msg: 'Wrong password.' });
                }
            });
        }
    });

});


/*
* Get all user name
* no authentication, anyone can get all user names
*/
router.get('/usernames', function (req, res) {

    userModel.find({}, "name", function (err, data) {

        if (err) {
            res.send(err);
        }

        //send all user
        res.json(data);

    });

});

/*
* Get one user by id ,anyone can acces this method
*/
router.get('/user/:id', function (req, res) {

    try {
        //get all properties but password
        userModel.findById(req.params.id, '-password', function (err, user) {

            //not found response
            if (!user || err) {
                res.status(404).send({ success: false, msg: 'User not found.' });
            } else {

                res.json(user);
            }
        });
    } catch (Error) {
        res.status(404).send({ success: false, msg: 'User not found.' });
    }

});//Get one user by id


/*
* Get one user by email
*/
router.get('/userEmail/:email', function (req, res) {

    try {
        userModel.findOne({ email: req.params.email }, '-password', function (err, data) {

            if (!data || err)
                res.status(404).send({ success: false, msg: 'User not found.' });
            else
                res.json(data);

        });
    } catch (Error) {
        res.status(404).send({ success: false, msg: 'User not found.' });
    }

});//Get one user by email

/*
*   Delete by id
*/
router.delete("/user/:id", function (req, res) {

    console.log(req.params.id);

    userModel.deleteOne({ _id: req.params.id }, function (err, data) {
        if (err) {
            res.send(err);
        }
        res.send(data);
    })

});// Delete by id



router.delete('/user1/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
    console.log("caLLDFAmnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnS");
    var token = getToken(req.headers);
    if (token) {
        userModel.deleteOne({ _id: req.params.id }, function (err, data) {

            if (err) return next(err);

            res.send(data);
        })
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
});


/*
* Update 
*/
router.put('/updateuser/:id', function (req, res) {

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
*   Update password
*
*  get id as parameter and new password in boby as {password:password}
*/
router.put('/updatepassword/:id', function (req, res) {

    console.log("Update Password request from " + req.params.id);

    var newPass;
    //encrypt password
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return err;
        }
        bcrypt.hash(req.body.password, salt, null, function (err, hash) {
            if (err) {
                throw err;
            }
            newPass = hash;
            //update encrypted password
            userModel.findByIdAndUpdate(req.params.id, { $set: { password: newPass } },
                function (err, data) {
                    if (err) {
                        res.send(err);

                    }

                    res.send(data);


                });

        });

    });

});//updatae passowrd by id

/*************************************************************************************************************************************
**************************************************************************************************************************************
**************************************************************************************************************************************
* Places (places.service.ts)
**************************************************************************************************************************************
**************************************************************************************************************************************
*************************************************************************************************************************************/

/*
* Get all places
*/

router.get('/places', function (req, res) {

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



/*
* Add new comment
*/

router.post('/comment', function (req, res) {

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

router.get('/comments/:placeId', function (req, res) {

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
router.delete("/comment/:id", function (req, res) {

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
router.put('/updatecomment/:id', function (req, res) {

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

router.get('/api/search/:s', function (req, res) {

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

module.exports = router;