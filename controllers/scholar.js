var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportlocal= require('passport-local');
var passportsession= require('passport-session');
var typpy = require('typpy');

var User = require('../models/users_model.js');
var FacultyUser = require('../models/facultyUser_model.js');
var Faculty = require('../models/faculty_model.js');
var Specialization = require('../models/specialization_model.js');
var Score = require('../models/scoreform_model.js');
var Subject = require('../models/subject_model.js');
var router = express.Router();

//________________________________________ MIDDLEWARE _________________________________________________________


router.use( function(req, res, next) {
    if(!req.session.user){
        return res.redirect("/login");
    }
    next();
});

//________________________________________ READ________________________________________________________________
 
router.get('/',function(req,res, next){
 FacultyUser.findAll({ where: {userId:req.user.id},
        include: [{ model: User }]
    }).then(facultyusers => {
        FacultyUser.findById( req.user.id, {
            include: [{ model: Faculty }]
        }).then(faculties =>{        	
            Specialization.findById( facultyusers[0].specializationId).then(specialization=> {            
                Score.findAll({ where: {userId:req.user.id},
                	include: [{ model: Subject }]
                }).then(scores => {
                User.findById(req.user.id).then(users => {  
                    res.render('scholar', {facultyusers:facultyusers, faculties: faculties, specialization: specialization, scores:scores, users: users, id: req.user.uid, role: req.user.role });
                   });               
                });
            });
        });
    }); 
});


//_______________________________________________________________________________________________________________________

module.exports = router;
