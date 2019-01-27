const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match User
            User.findOne({email: email})
                .then(user => {
                    if(!user) {
                        return done(null, false, { message: 'That is not a valid email, please try again'});
                    }

                    // match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch) {
                            return done(null, user);
                        } else {
                            done(null, false, { message: 'Oops wrong password!'})
                        }
                    })
                })
                .catch(err => console.log(err))
        })
    )
};


// used for user session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
