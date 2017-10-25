'use strict';
const nodemailer = require('nodemailer');
const verToken = require('../models/ver_token');
const jwt = require('jsonwebtoken');
const config = require('../config/database');


let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: 'noReplyDonateApp@gmail.com',
        clientId: '553697024488-lqjts3l70oi2674e34h6qt1u14vg012o.apps.googleusercontent.com',
        clientSecret: 'tPlHq4vnxdjyW42u3IRpiLmB',
        refreshToken: '1/VKtZi-04Gn7820Gy3tilcytBoiFNT1evWbEhJFxE_5Y',
        accessToken: 'ya29.GlvgBG6R0qPpSApb-TIaOeDS7B3wTWUzbblA0YwiiW1DzyeroBdWr_dkEMoU6zvUCyjM0GGsMZ2vcJ81dK7hGpP407ZrStrtlLvvtpCeE1W382RKQQiaDnmrtiQS',
        expires: 1484314697598
    }
});

module.exports.sendVerificationEmail = function (toUser) {
    // setup email data with unicode symbols
    const email = toUser.email;

    const token = jwt.sign({
        data: toUser
    }, config.secret, {
        expiresIn: 604800 // 1 week
    });

    const ghtml = '<a href="http://localhost:3000/users/profile/email/verify/' + token + '">http://localhost:3000/users/profile/email/verify/' + token + '</a>';

    let mailOptions = {
        from: '"Donate App" <no-reply@donate.com>', // sender address
        to: toUser.email, // list of receivers
        subject: 'Hello World ✔', // Subject line
        text: 'Hello World !!!', // plain text body
        html: ghtml // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);

        let newVerToken = new verToken({
            userId: toUser._id,
            token: token
        });

        verToken.addToken(newVerToken, (err, newVerToken) => {
            if (err) {
                return console.log(err);
            }
        });

    });
};

module.exports.verifyEmail = function (token, callback) {
    verToken.verifyToken(token, callback);
};


module.exports.sendAvaliableDonerEmail = function (email, fromUser) {
    // setup email data with unicode symbols
    //const email = toUser.email;

    // const token = jwt.sign({
    //     data: toUser
    // }, config.secret, {
    //     expiresIn: 604800 // 1 week
    // });

    const ghtml = '<p>Hello from Donate App, you have a new doner. From Doner: ' + fromUser + '</p>';

    let mailOptions = {
        from: '"Donate App" <no-reply@donate.com>', // sender address
        to: email, // list of receivers
        subject: 'Contact From Donate App', // Subject line
        text: 'Hello from Donate App, you have a new doner.', // plain text body
        html: ghtml // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);

        // let newVerToken = new verToken({
        //     userId: toUser._id,
        //     token: token
        // });

        // verToken.addToken(newVerToken, (err, newVerToken) => {
        //     if(err) {
        //         return console.log(err);
        //     }
        // });

    });
};

module.exports.sendOTPEmail = function (toUserEmail, otp, callback) {

    const ghtml = '<p>Hello from Donate App. OTP: ' + otp + '</p>';

    let mailOptions = {
        from: '"Donate App" <no-reply@donate.com>', // sender address
        to: toUserEmail, // list of receivers
        subject: 'Contact From Donate App', // Subject line
        text: 'Hello from Donate App, you have a new doner.', // plain text body
        html: ghtml // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, callback);
};