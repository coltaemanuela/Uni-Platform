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

//________________________________________ MIDDLEWARE _________________________________________________________


router.use( function(req, res, next) {
    if(!req.session.user){
        return res.redirect("/login");
    }
    next();
});

//________________________________________ READ________________________________________________________________
 
router.get('/:id',function(req,res, next){
  	Specialization.findAll({ where:{ facultyId: req.params.id, isDeleted: false}, include:[{model: Faculty}] }).then(specializations => {
  		res.render('facultySpecializations', {specializations: specializations, fid: req.params.id});
  		next();
  	});
});

router.get('/specialization/:id',function(req,res){
   Specialization.findById(req.params.id, { include:[{model: Faculty}] }).then(specialization =>{
   	Subject.findAll({ where: {specializationId: specialization.id } }).then(subjects => {
   		res.render('specializationDetail', { specialization: specialization, subjects: subjects, role: req.user.role});
   	});
   });
});

//________________________________________ EDIT ________________________________________________________________

router.get('/:uid/edit',function(req,res){
   Specialization.findAll({ where: {id:req.params.uid},
      include: [{ model: Faculty}]
    }).then(facultyusers => {      
      Specialization.findAll().then(specialization=> { 
      //res.render('userEdit', {facultyusers:facultyusers, faculties: faculties, specialization: specialization, uid: req.params.uid});   
      res.send('ceva');  
    }); 
  });
});


router.post('/edit', function(req,res){
	console.log(req.body.specialization,req.body.newspecialization, req.body.fid,  req.body.specid );
	var specialization= req.body.specialization;
  var olddescription= req.body.olddescription;
	var sid = req.body.specid;
  var newspecialization = req.body.newspecialization;
  var description = req.body.description;
  var promises = [];
  
  if(req.body.specialization|| req.body.olddescription){
    if (!typpy(specialization, Array)) specialization= [specialization];
    if (!typpy(olddescription, Array)) olddescription= [olddescription];
    if (!typpy(sid, Array)) sid= [sid];

    specialization.forEach(function (cspecialization, index) {            
      var cid = sid;
      var colddescription= olddescription[index];
      promises.push(
        Specialization.findAll({ 
          where:{ id: cid, facultyId:req.body.fid, isDeleted:false }
        }).then(result => { 
            if( result[0]) {            
              return result[0].update({ name:cspecialization, description:colddescription })
            } 
          }));            
    });
  }

  if( newspecialization ) {
    if (!typpy(newspecialization, Array)) newspecialization= [newspecialization];
    if (!typpy(description, Array)) description= [description];
    
    newspecialization.forEach(function (cnewspecialization, index) {
      var cdescription= description[index];
        promises.push(                                
          Specialization.create({
            facultyId: req.body.fid,
            name:cnewspecialization,
            description:cdescription              
          })
        );
    }); 
  }

  return Promise.all(promises).then(c => {
    res.redirect('/faculties' );
  });
  
});

//_______________________________________________ DELETE __________________________________________________________________

router.get('/delete/:id/:fid', function(req,res, next){
  var fid= req.params.fid;
  Specialization.update({ isDeleted:true }, { where:{ id: req.params.id } }).then( specialization => {
    console.log(fid, req.params.id, req.params.fid);
    res.redirect('/specializations/'+ fid ); 
    next();
  });
});

//_______________________________________________________________________________________________________________________

module.exports = router;
