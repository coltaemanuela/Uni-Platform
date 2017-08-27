var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportlocal= require('passport-local');
var passportsession= require('passport-session');

var User = require('../models/users_model.js');
var FacultyUser = require('../models/facultyUser_model.js');
var Faculty = require('../models/faculty_model.js');
var Specialization = require('../models/specialization_model.js');
var Subject = require('../models/subject_model.js');
var router = express.Router();
//___________________________________________________________ MIDDLEWARE____________________________________________


router.use( function(req, res, next) {
    if(!req.session.user){
        return res.redirect("/login");
    }
    next();
});

//______________________________________________________________ READ_____________________________________________
 
router.get('/',function(req,res){
    
    if(req.user.role !=='student' ){ 
        Subject.findAll().then(subjects => {      
            res.render('coursesList', { subjects:subjects, user: req.user});
        });        
    } else {
        FacultyUser.findAll({where:{userId: req.user.id}, include:[{ model: Specialization }] }).then(fus => { 
            Subject.findAll({ where: { specializationId: fus[0].specializationId} }).then(subjects=>{                 
                res.render('mycourses', { subjects:subjects, user: req.user, fus: fus, subjects: subjects});    
            });                
        });
    }
});

router.get('/:id/view',function(req,res){
    Subject.findById(req.params.id, {include:[{model: Specialization}]}).then(function(subject) {
        
        id= subject.id;
        name= subject.name;
        description= subject.description;       
        exam=subject.exam;
        project=subject.project;
        test=subject.test;
        presentation= subject.presentation;
        credit= subject.credit;
        specialization= subject.specialization.name;
        })
        .then(function() {
            res.render('courses',{
                id: id, 
                name: name,        
                description:description,
                exam:exam,
                project:project,
                presentation:presentation,
                test:test,
                credit:credit,
                specialization:specialization
                
            });       
        });
});        

//_______________________________ CREATE _________________________________________________________________________    

router.get('/add',function(req,res){
    Specialization.findAll({ where:{ isDeleted:false } }).then(specializations => {                              
        res.render('createCourse', { specializations:specializations});
    }); 
});


router.post('/add', function(req, res){
  var data = {};
     
        if( req.body.checkbox1 )   {data.exam = true;} else {data.exam= false;}
        if( req.body.checkbox2 )   {data.project = true;} else {data.project= false;}
        if( req.body.checkbox3 )   {data.test = true; } else {data.test= false;}
        if( req.body.checkbox4 )   {data.presentation = true; } else {data.presentation= false;}
        if( req.body.name )            data.name = req.body.name;
        if( req.body.description )     data.description = req.body.description;
        if( req.body.credit )          data.credit = req.body.credit;
        if( req.body.specialization ) data.specializationId = req.body.specialization;
       
    Subject.create(data).then(c => {      
        res.redirect('/courses');
    }).catch(e => console.error(e));
});


//_______________________________ UPDATE _________________________________________________________________________

router.get('/:id/edit',function(req,res){
    Subject.findById(req.params.id).then(subject => {
        res.render('courseEdit', {subject:subject, id: req.params.id});
    });
});
 

router.post('/edit', function(req, res){
 if( req.body.id ){   
         var data = {};
     
        if( req.body.name )            data.name = req.body.name;
        if( req.body.description )     data.description = req.body.description;
        if( req.body.credit )          data.credit = req.body.credit; 
       if( req.body.checkbox1 )   {data.exam = true;} else {data.exam= false;}
        if( req.body.checkbox2 )   {data.project = true;} else {data.project= false;}
        if( req.body.checkbox3 )   {data.test = true; } else {data.test= false;}
        if( req.body.checkbox4 )   {data.presentation = true; } else {data.presentation= false;}
         
        Subject.update( data, { where:{ id: req.body.id} }).then(function() {
            res.redirect('/courses');
        }).catch(e => console.error(e));
     }
});


//_______________________________________________ DELETE __________________________________________________________________

router.get('/delete/:id', function(req,res){  
    Subject.destroy({
      where: { id: req.params.id}
    });
    res.redirect('/courses');
 });
//_______________________________________________________________________________________________________________________

module.exports = router;
