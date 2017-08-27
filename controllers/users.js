var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportlocal= require('passport-local');
var passportsession= require('passport-session');
var bcrypt = require('bcrypt-nodejs');
 var passwordHash = require('password-hash');
 var randomstring = require("randomstring");
var User = require('../models/users_model.js');
var FacultyUser = require('../models/facultyUser_model.js');
var Faculty = require('../models/faculty_model.js');
var Score = require('../models/scoreform_model.js');
var Subject= require('../models/subject_model.js');
var Specialization = require('../models/specialization_model.js');
var config= require('../config/config.json');
var sg = require('sendgrid')(config.sendgrid.key);
var router = express.Router();

//_____________________________________________________________________ READ_____________________________________________


router.get('/',function(req,res){
  User.findAll().then(users => {
    res.render('users', {  users:users});
  });
});

router.post('/edit', function(req, res){
     var userid= req.body.id; 
     if( req.body.id ){   
         var data = {};
     debugger
         if( req.body.email )           data.email = req.body.email;
         if( req.body.firstname )       data.firstname = req.body.firstname;
         if( req.body.lastName )        data.lastName = req.body.lastName;
         if( req.body.phone )           data.phone = req.body.phone;
         if( req.body.specialization )  data.specialization = req.body.specialization;
         if( req.body.uniYear )         data.uniYear = parseInt(req.body.uniYear);
         if( req.body.activeAccount) { data.activeAccount = true;} else {data.activeAccount = false;}
         if( req.body.specialization )  data.specializationId = req.body.specialization;
         
          User.update( data, { where:{ id: userid } }).then(function() {
            FacultyUser.update({uniYear: data.uniYear, specializationId: data.specializationId},  { where:{ userId: userid } }).then(function() {
              res.redirect('/users/'+ userid);
             }).catch(e => console.error(e));
          });
     }
});

router.get('/register',function(req,res){    
    Faculty.findAll().then(faculty => {
       const resObj = faculty.map(faculty => { return faculty.id });
        const resObj1 = faculty.map(faculty => { return faculty.name });
          Specialization.findAll().then(specs => {                      
                res.render('registration', {fid: resObj,fname: resObj1, specs:specs});
           });    
        
        return Object.assign({
            id: faculty.id,
            name: faculty.name,                   
           });
      });
    });

router.post('/register', function(req, res) {   
  var data = {};
  data.activeAccount= true;
  var x= randomstring.generate();
  debugger
  console.log(x);
 data.password = passwordHash.generate(x);
  if(req.body.faculty) data.faculty= req.body.faculty;
  if( req.body.specialization) data.specialization= req.body.specialization;
  if(req.body.firstname && req.body.lastname) { 
      data.username= req.body.firstname + req.body.lastname;
      data.firstname= req.body.firstname;
      data.lastName=req.body.lastname;
  }
  if(req.body.email) data.email= req.body.email;
  if(req.body.phone) data.phone= req.body.phone;
  if(req.body.role) data.role= req.body.role;
  
  if(req.body.yearOfStudies) data.yearOfStudies= req.body.yearOfStudies;
  if( data.yearOfStudies ==="one") data.uniYear=1;
  if(data.yearOfStudies ==="two")  data.uniYear=2;
  if(data.yearOfStudies ==="three") data.uniYear=3;
  if(data.yearOfStudies ==="four") data.uniYear=4;


    User.create(data).then(c => {
      console.log("User Created ", c.toJSON());

     //console.log(c.id);           
     FacultyUser.create({ facultyId:data.faculty, userId: c.id, specializationId: data.specialization, uniYear: data.uniYear }).then(fu => {   

          var request = sg.emptyRequest();
                request.method = "POST";
                request.path = "/v3/mail/send";
                request.body = {
                    subject: "Confirmare cont activ",
                    from: {
                            email: "uni-platform@univesity.com"
                        },       
                    personalizations: [{
                            to: [{
                                email: req.body.email,
                            }],
                            substitutions: {                              
                              '[name]' : c.firstname,
                              '[username]': c.firstname + c.lastName,
                              '[password]' : x
                            }
                        }],
                    template_id: "256a3bef-df4f-45a6-bb7f-7852bcb1c1ac" //data.template_id
                };
                
                sg.API(request);
               







     res.redirect('/users');

  }).catch(e => console.error(e));
 });
});


router.get('/:uid',function(req,res){
     FacultyUser.findAll({ where: {userId:req.params.uid},
        include: [{ model: User }]
    }).then(facultyusers => {
      //console.log('facultyuser', req.params.uid, facultyusers);
        FacultyUser.findAll({
            include: [{ model: Faculty }]
        }).then(faculties =>{
            Specialization.findAll().then(specialization => {          
                Score.findAll({ where: {userId:req.params.uid},
                    include: [{ model: Subject }]
                }).then(scores => {
                User.findById(req.params.uid).then(users => {  
                    res.render('userDetail', {facultyusers:facultyusers, faculties: faculties, specialization: specialization, scores:scores, users: users, uid: req.params.uid, role: req.user.role });
                   });               
                });
            });
        });
    }); 
});

router.get('/:uid/edit',function(req,res){
     FacultyUser.findOne({where: {userId: req.params.uid}, include: [{ model: User }, {model: Specialization}] }).then(facultyusers => {
        Specialization.findAll().then(specializations=> { 
        debugger
          res.render('userEdit', {facultyusers:facultyusers, specializations: specializations, uid: req.params.uid});
      });
    }); 
});


router.get('/:uid/addscore',function(req,res){
    FacultyUser.findAll({
        where:{userId: req.params.uid}, 
        include:[{model:Specialization}] 
    }).then(fusers =>{
        Subject.findAll({
            where:{ specializationId: fusers[0].specializationId},
            include:[{model:Specialization}]            
        }).then( subjects => {
            Score.findAll({
                where:{ userId: req.params. uid},
                include:[{model: Subject}]
            }).then( scores => {   

            debugger         
                // res.json(fusers);
                //res.json(scores);
               // res.json(subjects);
                res.render('createScoreForm', {scores:scores, fusers:fusers, subjects:subjects, uid: req.params.uid});
            });       
        });
    });
 });

router.post('/addscore',function(req,res){
    var score= req.body.score ? req.body.score : 0;
    var sid= req.body.sid;
      Score.sync().then(function () { 
        var promises = [];
        sid.forEach(function (csubject, index) {            
            var cgrade = score[index];
            promises.push(
                Score.findAll({ 
                    where:{ subjectId: csubject, userId:req.body.uid }
                }).then(result => { 
                    if( result[0]) { 
                        if(isNaN(cgrade)){ cgrade=result[0].score;}
                        result[0].update({ score: parseInt(cgrade) }).then(q => {  res.redirect('/users/'+ req.body.uid ); });
                    } if( !result[0] ) {
                        if(isNaN(cgrade)){ cgrade=0;}
                        Score.create({
                            subjectId: csubject,
                            score:parseInt(cgrade),
                            userId:req.body.uid
                        }).then(c=>{ res.redirect('/users/'+ req.body.uid ); });
                    }
                  }));            
        });
        return Promise.all(promises);
    }).then(ceva => { console.log(ceva); });
});   
      
//_______________________________________________________________________________________________________________________

module.exports = router;
