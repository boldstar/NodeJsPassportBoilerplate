const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();
//Login Page
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));


// handle registration form
router.post('/register', (req, res) => {
    const { name, email, password, confirmation} = req.body;
    let errors = [];

    //Check required fields
    if(!name || !email || !password || !confirmation) {
        errors.push({ msg: 'Please fill in all fields'});
    }

    //Password confirmation check
    if(password != confirmation) {
        errors.push({ msg: 'Passwords do not match' });

    }

    //Password length check
    if(password.length < 6) {
        errors.push({ msg: 'Password should be atleast 6 characters'});
    }


    if(errors.length > 0) {
        //if errors object length is greater than 0 send object with variables
        res.render('register', {
            errors,
            name,
            email,
            password,
            confirmation
        })
    } else {
        // else validation passed
        User.findOne({ email: email})
            .then(user => {
                if(user) {
                    // User exists so re rendere register form
                    errors.push({ msg: 'Email is already registered'});
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        confirmation
                    })
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    
                    //hash password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            //  set password to hash
                            newUser.password = hash;

                            //save the user to database
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err))
                    }))
                }
            })
            .catch(err => console.log(err));
    }
})

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

//Logout handler
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You have logged out');
    res.redirect('/users/login');
})

router.get('/*', (req, res) => res.render('error'));

module.exports = router;