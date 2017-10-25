const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const NGOs = require('../models/ngos');
const emailVerfier = require('../util/email_verfi');
const verOtp = require('../models/ver_otp');

// Register
router.post('/register', (req, res, next) => {
    var contype = req.headers['content-type'];
    if (!contype || contype.indexOf('application/json') !== 0)
        return res.sendStatus(400);

    User.getUserByEmail(req.body.email, (err, user) => {
        if (err) return console.log(err);
        if (user) {
            res.json({
                success: false,
                token: 'Email already present'
            });
        } else {
            let newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                phoneNo: req.body.phoneNo,
                city: req.body.city
            });

            User.addUser(newUser, (err, user) => {
                if (err) {
                    console.log(err);
                    res.json({
                        success: false,
                        token: 'Failed to register user'
                    });
                } else {
                    emailVerfier.sendVerificationEmail(user);

                    res.json({
                        success: true,
                        token: 'User registered'
                    });
                }
            });
        }
    });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    var contype = req.headers['content-type'];
    if (!contype || contype.indexOf('application/json') !== 0)
        return res.send(400);

    const email = req.body.email;
    const password = req.body.password;

    User.getUserByEmail(email, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json([{
                success: false,
                msg: 'User not found'
            }]);
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({
                    data: user
                }, config.secret, {
                    expiresIn: 604800 // 1 week
                });

                res.json([{
                    success: true,
                    token: 'bearer ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                }]);
            } else {
                return res.json([{
                    success: false,
                    msg: 'Wrong password'
                }]);
            }
        });
    });
});

// Get User's Profile
router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    res.json([{
        name: req.user.name,
        email: req.user.email,
        city: req.user.city,
        phoneNo: req.user.phoneNo
    }]);
});

// Update User's Email
router.put('/profile/email', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    var contype = req.headers['content-type'];
    if (!contype || contype.indexOf('application/json') !== 0)
        return res.send(400);

    req.user.email = req.body.email;
    req.user.save((err, user, numAffected) => {
        if (err) {
            console.log(err);
            return res.json([{
                success: false,
                msg: 'Internal error. Value not updated.'
            }]);
        } else if (numAffected == 0) {
            console.log(err);
            return res.json([{
                success: false,
                msg: 'Already present'
            }]);
        } else {
            return res.json([{
                success: true,
                msg: 'Sucessfully Updated.'
            }]);
        }
    });
});

// Update User's profile
router.put('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    var contype = req.headers['content-type'];
    if (!contype || contype.indexOf('application/json') !== 0)
        return res.send(400);

    if (req.body.name) req.user.name = req.body.name;
    if (req.body.phoneNo) req.user.phoneNo = req.body.phoneNo;
    if (req.body.city) req.user.city = req.body.city;

    req.user.save((err, user, numAffected) => {
        if (err) {
            console.log(err);
            return res.json([{
                success: false,
                msg: 'Internal error. Value not updated.'
            }]);
        } else if (numAffected == 0) {
            console.log(err);
            return res.json([{
                success: false,
                msg: 'Already present'
            }]);
        } else {
            return res.json([{
                success: true,
                msg: 'Sucessfully Updated.'
            }]);
        }
    });
});

// Verify Email
router.get('/profile/email/verify/:token', (req, res, next) => {
    const token = req.params.token;

    emailVerfier.verifyEmail(token, (err, verToken) => {
        if (err) {
            console.log(err);
            return res.send("Internal Server Error");
            // return res.json({
            //     success: false,
            //     msg: "Internal server Error"
            // });
        } else if (!verToken) {
            return res.send("Invalid link.");
            // return res.json({
            //     success: false,
            //     msg: "Not a valid token"
            // });
        } else if (verToken) {
            return res.send("Validated.");
            // return res.json({
            //     success: true,
            //     msg: "Validated!"
            // });
        }
    });
});

// Get Another User's Profile
router.get('/profile/:id', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    User.getUserById(req.params.id, (err, user) => {

        if (err) {
            if (err.name == 'CastError')
                return res.json([{
                    success: false,
                    msg: 'Invalid Id'
                }]);
            else console, log(err);
        }


        if (!user) {
            return res.json([{
                success: false,
                msg: 'User not found'
            }]);
        }

        res.json([{
            id: user._id,
            name: user.name,
            email: user.email,
            phoneNo: user.phoneNo
        }]);
    });
});

// GET All NGOs
router.get('/ngos', (req, res, next) => {
    NGOs.getNGOs((err, ngos) => {
        if (err) {
            console.log(err);
            return res.json([{
                success: false,
                msg: "Internal error."
            }]);
        } else if (!ngos) {
            return res.json([{
                success: false,
                msg: "Empty Collection"
            }]);
        } else {
            res.json(ngos);
        }

    });
});

// Add a new NGO
router.post('/ngos', (req, res, next) => {
    var contype = req.headers['content-type'];
    if (!contype || contype.indexOf('application/json') !== 0)
        return res.send(400);

    let newNGO = new NGOs({
        name: req.body.name,
        amount: req.body.amount,
        address: req.body.address
    });

    newNGO.save((err, user) => {
        if (err) {
            res.json([{
                success: false,
                msg: 'Failed to register user'
            }]);
        } else {
            res.json([{
                success: true,
                msg: 'User registered'
            }]);
        }
    });
});


// POST a forgot password request
router.post('/forgot/:email', (req, res, next) => {
    User.getUserByEmail(req.params.email, (err, user) => {
        if (err) {
            return res.json([{
                success: false,
                msg: 'Internal error'
            }]);
        } else {
            if (user) {
                let otp = Math.floor(Math.random() * 1000000);

                let newVerOtp = new verOtp({
                    email: user.email,
                    otp: otp
                });

                verOtp.addVerOtp(newVerOtp, (err, verOtp) => {
                    if (err) {
                        console.log(err);
                        return res.json([{
                            success: false,
                            msg: 'Internal error'
                        }]);

                    }
                });

                // user.resetOtp = {
                //     value: otp,
                //     createdAt: new Date()
                // };
                // user.save((err, user) => {
                //     if (err)
                //         return res.json([{
                //             success: false,
                //             msg: 'Internal error'
                //         }]);
                // });

                emailVerfier.sendOTPEmail(user.email, otp, (err, info) => {
                    if (err) {
                        console.log(err);
                        return res.json([{
                            success: false,
                            msg: 'Internal error'
                        }]);

                    } else {
                        console.log('Message sent: %s', info.messageId);
                        return res.json([{
                            success: true,
                            msg: 'OTP sent to registered email'
                        }]);
                    }
                });

            } else {
                return res.json([{
                    success: false,
                    msg: 'User not found'
                }]);
            }
        }
    });
});

// Check OTP and get token
router.post('/checkOtp', (req, res, next) => {
    var contype = req.headers['content-type'];
    if (!contype || contype.indexOf('application/json') !== 0) {
        return res.send(400);
    }

    console.log(req.body.email);
    verOtp.getByEmail(req.body.email, (err, verOtp) => {
        if (err) {
            return res.json([{
                success: false,
                msg: 'Internal Error'
            }]);
        } else {
            if (verOtp) {
                console.log(req.body.otp);
                console.log(verOtp);
                if (req.body.otp == verOtp.otp) {
                    User.getUserByEmail(verOtp.email, (err, user) => {
                        if (err) {
                            return res.json([{
                                success: false,
                                msg: 'Internal Error'
                            }]);
                        } else {
                            if (user) {
                                let token = jwt.sign({
                                    data: user
                                }, config.secret, {
                                    expiresIn: 60 * 10
                                });
    
                                return res.json([{
                                    success: true,
                                    token: 'bearer ' + token
                                }]);
                            } else {
                                return res.json([{
                                    success: false,
                                    msg: 'User not found'
                                }]);
                            }
                        } 
                    });
                } else {
                    return res.json([{
                        success: false,
                        msg: 'Otp mismatch'
                    }]);
                }
            } else {
                return res.json([{
                    success: false,
                    msg: 'Otp expired'
                }]);
            }
        }
    });
});

router.put('/profile/password', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    var contype = req.headers['content-type'];
    if (!contype || contype.indexOf('application/json') !== 0) {
        return res.send(400);
    }

    let user = req.user;
    user.password = req.body.password;
    User.addUser(user, (err, user) => {
        if (err) {
            console.log(err);
            return res.json([{
                success: false,
                msg: 'Internal Error'
            }]);
        } else {
            return res.json([{
                success: true,
                msg: 'Sucessfully Changed'
            }]);
        }
    });
});

module.exports = router;