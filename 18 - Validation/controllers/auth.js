const User = require('../models/user');
const crypto = require('crypto');
const API = require('../../keys');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {
    validationResult
} = require('express-validator');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: API.sendGrid
    }
}));

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User
        .findOne({
            email: email
        })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email');
                return res.redirect('/login');
            }

            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid password');
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                });
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        req.flash('logout', 'You have been logged out');
        res.redirect('/');
    });

};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res
            .status(422) // error status code
            .render('auth/signup', {
                path: '/signup',
                pageTitle: 'Signup',
                errorMessage: errors.array()[0].msg
            });
    }

    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: {
                    items: []
                }
            });
            return user.save();
        })
        .then(result => {
            res.redirect('/login');
            return transporter.sendMail({
                to: email,
                from: 'shop@nodecomplete.com',
                subject: 'Signup Successful',
                html: '<h1>You have successfully signed up to NodeComplete</h1>'
            });
        })
        .catch(err => console.log(err));
};


exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);

        res.redirect('/');
    });

};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Password Reset',
        errorMessage: message
    });
};

exports.postReset = (req, res, next) => {

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');

        User
            .findOne({
                email: req.body.email
            })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email found.');
                    return res.redirect('/reset');
                }

                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                return transporter.sendMail({
                    to: req.body.email,
                    from: 'shop@nodecomplete.com',
                    subject: 'Password Reset',
                    html: `<h1>Password Reset</h1>
                                <p>You requested a password reset</p>
                                <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
                                <small>This link will expire in 1 hour time</small>`
                });
            })
            .catch(err => console.log(err));
    });

};

exports.getNewPassword = (req, res, next) => {

    const token = req.params.token;
    User
        .findOne({
            resetToken: token,
            resetTokenExpiration: {
                $gt: Date.now()
            }
        })
        .then(user => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch();


};

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User
        .findOne({
            resetToken: passwordToken,
            resetTokenExpiration: {
                $gt: Date.now()
            },
            _id: userId
        })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = null;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
            return transporter.sendMail({
                to: resetUser.email,
                from: 'shop@nodecomplete.com',
                subject: 'Password Reset Confirmation',
                html: `<h1>Password Reset Confirmation</h1>
                            <p>You have now reset your password.</p>
                            <p>Click <a href="http://localhost:3000/login">here</a> to login!</p>
                            `
            });
        })
        .catch(err => console.log(err));
};