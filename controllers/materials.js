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
	Subject.findById(req.params.id, {include:[{ model: Specialization}]}).then(subject => {
		const resObj = subject.materials.map(material => {  
	        return Object.assign({
	            id: material.id,
	            file_name: material.file_name,
	            mimetype:material.mimetype,
	            path: material.path,            
	        });
    	});

		res.render('materials',{ subject:subject, user: req.user, resObj: resObj}); 
		next(); 
	});	
});

//______________________________________________________________ CREATE _____________________________________________
 
router.get('/:id/add',function(req,res, next){
	Subject.findById(req.params.id, {include:[{ model: Specialization}]}).then(subject => {
		res.render('createMaterials',{ subject:subject, user: req.user, sid: req.params.id}); 
		next(); 
	});	
});


router.post('/:id/add', multer({ dest: './uploads/'}).array('newfile', 100), function(req,res,next){
	
//findOne().then(doc => {
//doc.materials.push(newDoc)
//return doc.save();


	var orig= req.files;	
	//orig.map(c => res.json(c) );

	const fileObjects = orig.map(currentFile => ({
	    id: currentFile.filename,
	    file_name: currentFile.originalname,
	    mimetype: currentFile.mimetype,
	    path: currentFile.path
	}));

	Subject.update({ materials: fileObjects },{ where:{ id: req.params.id } }).then( subject =>{
		res.redirect('/faculties');	
		next();		
	});
});



router.get('/:id/:sid/download', function(req,res,next){
	var sid= req.params.sid;
	Subject.findById(req.params.sid).then(subject => {
		material = subject.materials;
		for( var i = 0; i < material.length; i++ ){
			if( material[i].id === req.params.id ){
				var file_name= material[i].file_name;
				res.download('./uploads/' + req.params.id, file_name);
			}
		}
	});
});


//_______________________________________________ DELETE __________________________________________________________________

// router.get('/delete/:id', function(req,res){  
//     Subject.destroy({
//       where: { id: req.params.id}
//     });
//     res.redirect('/courses');
//  });
//_______________________________________________________________________________________________________________________

module.exports = router;
