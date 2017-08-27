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
var Subject = require('../models/subject_model.js');
var router = express.Router();
//___________________________________________________________ MIDDLEWARE____________________________________________



router.use( function(req, res, next) {
    if(!req.session.user){
        return res.redirect("/login");
    }
    next();
});

//________________________________________ READ________________________________________________________________
 
router.get('/',function(req,res){
    Faculty.findAll({ where:{isDeleted: false }}).then(faculties => {                           
    res.render('faculties', { faculties:faculties, user: req.user});
   }); 
});

router.get('/:id/view',function(req,res){
    Faculty.findById(req.params.id).then(function(faculty) {  
    	Specialization.findAll({where: { facultyId: faculty.id, isDeleted:false} }).then(specializations => {
    		console.log(specializations);
    	 res.render('facultyDetail',{ faculty: faculty, specializations: specializations, role: req.user.role });	
    	});         
    });
});        

//_______________________________ CREATE _______________________________________________________________________    

router.get('/add',function(req,res){
    res.render('createFaculty');             
});


router.post('/add', function(req, res){    
	console.log(req.body.specialization);
	var spec= req.body.specialization;
    if (!typpy(spec, Array)) spec= [spec];
  	var data = {};
        if( req.body.name ) data.name = req.body.name;
        if( req.body.description ) data.description = req.body.description;
 
    Faculty.create(data).then(faculty => {
				      
	        spec.forEach(function (cspecialization) {	
               
	            Specialization.create({
	                facultyId: faculty.id,
	                name:cspecialization, 
                    description: ' '		               
	            });            
	        });       
		
    }).then(ceva => { res.redirect('/faculties'); });    
});

//_______________________________ UPDATE _________________________________________________________________________

router.get('/:id/edit',function(req,res, next){
    Faculty.findById(req.params.id).then(faculty => {
        res.render('facultyEdit', {faculty:faculty, id: req.params.id});
        next();
    });
});


router.post('/edit', function(req, res, next){
 if( req.body.id ){   
    var data = {};     
    if( req.body.name )  data.name = req.body.name;
    if( req.body.description ) data.description = req.body.description;    
    Faculty.update( data, { where:{ id: req.body.id} }).then(function() {
        res.redirect('/faculties');
        next();
    }).catch(e => console.error(e));
 }
});

//_______________________________________________ DELETE __________________________________________________________________

router.get('/delete/:id', function(req,res, next){
	Faculty.update({ isDeleted:true }, { where:{ id: req.params.id } }).then( faculty => {
        Specialization.update({ isDeleted:true }, { where:{ facultyId: req.params.id } }).then(specialization=>{ 
            res.redirect('/faculties'); 
            next();
        });		
	});
});
//_______________________________________________________________________________________________________________________

module.exports = router;
