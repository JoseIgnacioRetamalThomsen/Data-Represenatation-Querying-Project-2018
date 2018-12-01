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

        //bad request 
        res.status(400).json({ success: false, msg: 'Please pass username and password.' });

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
                //email exitst
                if (err.code = "11000") {
                    //if email existe we consider as a bad request

                    return res.status(400).send('Email already in use.');


                }
                else //other error
                    return res.status(500).json({ success: false, msg: 'Server error' });

            }

            //create token
            var token = jwt.sign(user.toJSON(), config.secret);
            //created
            res.status(201).json({ success: true, token: 'JWT ' + token, id: user._id });

        });
    }

});//create user

/*
* Check login
*/
router.post('/signin', function (req, res) {

    userModel.findOne({
        email: req.body.email
    }, function (err, user) {

        if (err) {
            return res.status(500).json({ success: false, msg: 'Server error' });
        } else if (!user) {
            res.status(401).send({ success: false, msg: 'User not found.' });
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {

                    // if user is found and password is right create a token
                    var token = jwt.sign(user.toJSON(), config.secret);

                    // return the information including token as JSON
                    res.status(200).json({ success: true, token: 'JWT ' + token, name: user.name, user: user.email, id: user._id });

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
            return res.status(500).json({ success: false, msg: 'Server error' });
        }

        //OK , send all user 
        res.status(200).json(data);

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
            if (!user) {
                res.status(404).send({ success: false, msg: 'User not found.' });
            } else if (err) {

                return res.status(500).json({ success: false, msg: 'Server error' });

            } else {

                res.status(200).json(user);
            }
        });
    } catch (Error) {

        res.res.status(500).json({ success: false, msg: 'Server error' });
    }

});//Get one user by id

/*
* Get one user by email
*/
router.get('/userEmail/:email', function (req, res) {

    try {
        userModel.findOne({ email: req.params.email }, '-password', function (err, data) {

            if (!data)
                res.status(404).send({ success: false, msg: 'User not found.' });
            else if (err)
                res.res.status(500).json({ success: false, msg: 'Server error' });
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
router.delete('/user/:id', passport.authenticate('jwt', { session: false }), function (req, res) {

    var token = getToken(req.headers);

    if (token) {

        userModel.deleteOne({ _id: req.params.id }, function (err, data) {

            if (err) {

                res.res.status(500).json({ success: false, msg: 'Server error' });

            }

            res.status(200).send(data);
        });

    } else {

        return res.status(403).send({ success: false, msg: 'Unauthorized.' });

    }

});


/*
* Update  token requered
*/
router.put('/updateuser/:id', passport.authenticate('jwt', { session: false }), function (req, res) {

    var token = getToken(req.headers);

    if (token) {

        userModel.findByIdAndUpdate(req.params.id, { $set: req.body },
            function (err, data) {
                if (err) {

                    if (err.name = 'CasteError') {
                        res.status(400).send({ success: false, msg: 'Wrong user id.' });
                    } else {
                        res.res.status(500).send({ success: false, msg: 'Server error' });
                    }


                } else {

                    res.status(200).json({ success: true, msg: 'Updated' });

                }
            });

    } else {

        return res.status(403).send({ success: false, msg: 'Unauthorized.' });

    }

});//updateuser by id

/*
*   Update password
*
*  get id as parameter and new password in boby as {password:password}
*/
router.put('/updatepassword/:id', passport.authenticate('jwt', { session: false }), function (req, res) {

    var token = getToken(req.headers);
    if (token) {
        var newPass;
        //encrypt password
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return err;
            }
            bcrypt.hash(req.body.password, salt, null, function (err, hash) {
                if (err) {

                    res.status(400).send({ success: false, msg: 'Wrong password.' });

                }
                newPass = hash;
                //update encrypted password

                userModel.findByIdAndUpdate(req.params.id, { $set: { password: newPass } },
                    function (err, data) {
                        if (err) {

                            if (err.name = 'CasteError') {
                                res.status(400).send({ success: false, msg: 'Wrong password.' });
                            } else {
                                res.res.status(500).send({ success: false, msg: 'Server error' });
                            }

                        }

                        res.status(200).send(data);


                    });

            });

        });
    } else {

        return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }

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

    //setTimeout(function () { //testing 

    placesModel.find({}, function (err, data) {

        if (err) {

            res.res.status(500).send({ success: false, msg: 'Server error' });

        }

        res.status(200).json(data);

    });

    //}, 4000);

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

router.post('/comment', passport.authenticate('jwt', { session: false }), function (req, res) {

    var token = getToken(req.headers);
    if (token) {

        //create new comment
        commentsModel.create({
            commenterName: req.body.commenterName,
            commenterId: req.body.commenterId,
            placeId: req.body.placeId,
            comment: req.body.comment

        }, function (err) {
            //if err send error back
            if (err) {

                res.res.status(500).send({ success: false, msg: 'Server error' });
            }

            //send positive response after create comment in db
            res.status(201).send({ success: true, msg: 'Comment Created.' });

        });//commentsModel.create({
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }



});//app.post('/api/comment'

/*
* Get all comments for 1 place
*/

router.get('/comments/:placeId', function (req, res) {

    //find all commets using id
    commentsModel.find({ placeId: req.params.placeId }, '-password', function (err, data) {

        //not found
        if (!data) {
            res.status(404).send({ success: false, msg: 'Place not found.' });
        } else if (err) { //error

            return res.status(500).json({ success: false, msg: 'Server error' });

        } else {

            res.status(200).json(data);

        }

    });// commentsModel.find({ placeId:

});//Get one user by email

/*
*   Delete comment by id
*/
router.delete("/comment/:id",function (req, res) {

    var token = getToken(req.headers);
   
    if (token) {

        //delete comment using id
        commentsModel.deleteOne({ _id: req.params.id }, function (err, data) {


            //not found
            if (!data) {
                res.status(404).send({ success: false, msg: 'Place not found.' });
            } else if (err) { //error

                return res.status(500).json({ success: false, msg: 'Server error' });

            } else {

                res.status(200).send(data);

            }

        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
});// Delete by id

/*
*   Update comment by id
*
*  get id as parameter and new password in boby as {password:password}
*/
router.put('/updatecomment/:id', passport.authenticate('jwt', { session: false }), function (req, res) {

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