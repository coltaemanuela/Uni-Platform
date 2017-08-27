var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportlocal= require('passport-local');
var passportsession= require('passport-session');
var multer = require('multer');
var upload = multer();
var fs = require("fs");
var lien= require("lien");
var path= require("path");
var User = require('../models/users_model.js');
var FacultyUser = require('../models/facultyUser_model.js');
var Faculty = require('../models/faculty_model.js');
var Specialization = require('../models/specialization_model.js');
var Subject = require('../models/subject_model.js');
var Homework = require('../models/homework_model.js');
var router = express.Router();

//___________________________________________________________ MIDDLEWARE____________________________________________


router.use( function(req, res, next) {
    if(!req.session.user){
        return res.redirect("/login");
    }
    next();
});

//______________________________________________________________ READ_____________________________________________
 
router.get('/:id',function(req,res, next){

	if(req.user.role==='admin'|| req.user.role==='professor' ){
		Homework.findAll({  where:{ subjectId: req.params.id },
		  include: [
		    { model: User, as: 'assignee' },
		    { model: User, as: 'professor'}
		  ]
		}).then(homework =>{			

				debugger
			if( !homework[0] || !homework[0].assigneeId ){ 

				debugger
				Subject.findById( req.params.id ).then( subject => {
					res.render('assignHomework', { subject: subject, userid:req.user.id });
				});

				
			} else { 
				debugger

				//display a table with student name, status or  documents uploaded (if isSubmitted ===true)  is_submitted: is_submitted ? true: false
				res.render('professorHomework', {hws: homework, user: req.user});
			}
			
		});
	}

	if(req.user.role ==='student'){
		Homework.findAll({ where:{ assigneeId: req.user.id, subjectId: req.params.id}, include: [{model: Subject}] }).then(homework =>{
			res.render('studentHomework', { homework: homework, u: req.user} );
		});		
	}		
});

//______________________________________________________________ CREATE _____________________________________________


router.post('/add',function(req,res, next){

	Subject.findById(req.body.id).then(subj => {
		FacultyUser.findAll({ where:{ specializationId: subj.specializationId } }).then(students => {			
			Homework.sync().then(function () {		      
		        students.forEach(function (cstudent) {	    		            
		            Homework.create({
		                professorId: req.body.professor_id,
		                name: req.body.name,
		                description: req.body.description,
		                subjectId: req.body.id,
		                assigneeId: cstudent.userId		               
		            });            
		        });		        
			});
			res.redirect('/courses/' + req.body.id + '/view');
		});		
	});
});




 router.post('/:id/submit', multer({ dest: './uploads/'}).array('newfile', 100), function(req,res,next){
	var orig= req.files;	
	const fileObjects = orig.map(currentFile => ({
	    id: currentFile.filename,
	    file_name: currentFile.originalname,
	    mimetype: currentFile.mimetype,
	    path: currentFile.path
	}));

	Homework.update({ materials: fileObjects, is_submitted: true },{ where:{ id: req.params.id } }).then( homework =>{
		res.redirect('/courses');	
		next();		
	});
 });




router.get('/:hid/:mid/download', function(req,res,next){
	Homework.findById(req.params.hid).then(homework => {
		material = homework.materials;
		for( var i = 0; i < material.length; i++ ){
			if( material[i].id === req.params.mid ){
				var file_name= material[i].file_name;
				res.download('./uploads/' + req.params.mid, file_name);
			}
		}
		//res.sendFile( req.params.id, {root: './uploads/'}); //works well
	});
});


//_______________________________________________________________________________________________________________________

module.exports = router;
