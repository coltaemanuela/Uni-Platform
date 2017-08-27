var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportlocal= require('passport-local');
var passportsession= require('passport-session');

//var User = require('../models/users_model.js');
//var FacultyUser = require('../models/facultyUser_model.js');
//var Faculty = require('../models/faculty_model.js');
//var Specialization = require('../models/specialization_model.js');
var router = express.Router();

//_____________________________________________________________________ READ_____________________________________________
router.use( function(req, res, next) {
    if(!req.session.user){
        return res.redirect("/users/login");
    }
    next();
});


router.get('/',function(req,res){
    console.log(req.user);
res.render('dashboard');
});

//_______________________________________________________________________________________________________________________

module.exports = router;
