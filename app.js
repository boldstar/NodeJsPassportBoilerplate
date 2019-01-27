const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


const app = express();

// passport config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended: false }));

//express session middleware
app.use(session({
    secret: 'mylittlesecret',
    resave: true,
    saveUninitialized: true,
}));

//passport authentication
app.use(passport.initialize());
app.use(passport.session());

//connect flash messages middleware
app.use(flash());

//global variables
app.use((req, res, next) => {
    //set .locals to flash message
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/*', require('./routes/error'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));