var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportlocal= require('passport-local');
var passportsession= require('passport-session');

var Regulations = require('../models/regulations_model.js');

var User = require('../models/users_model.js');
var router = express.Router();

router.get('/', function (req, res) {    
    Regulations.findById(1).then(reg => {     
      res.render('regulations', {
        regulation:  reg.regulations,
        role: req.user ? req.user.role :'norole'
      });
    });
});


router.get('/edit',  function(req, res) {      
      
  Regulations.findById(1).then(function(r) {
  	if(req.user.role==='admin'){
	    res.render('editRegulations', {
	        id: r.id,
	        user: req.user,
	        regulation:  r.regulations
	    });
	}
  });

});



router.post('/edit', function(req, res) {
    var regulations = req.body.regulations;
    if( regulations ){
      Regulations.update({
        regulations: regulations,                
      },{ where:{ id:1 } }).then(function() {
          res.redirect('/regulations');
      }).catch(e => console.error(e));
    }
    
 });


//_______________________________________________________________________________________________________________________

module.exports = router;