//===============Modules=============================
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var multer = require('multer');
var session = require('express-session');
var passport = require('passport');
 var passwordHash = require('password-hash');
var LocalStrategy = require('passport-local').Strategy;
var passportlocal= require('passport-local');
var User = require('./models/users_model.js');
var Regulations = require('./models/regulations_model.js');

passport.use(new LocalStrategy({
    passReqToCallback: true
}, function(req, username, password, done) {
    User.findOne({ where: { username: username } }).then(function(user) {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
     // if (password !== user.password) {
      if(  passwordHash.verify(password, user.password) ===false ){
        return done(null, false, { message: 'Incorrect password.' });
      }
      req.session.user = user.toJSON();
      done(null, req.session.user);
    }).catch(err => {
      console.error(err);
      done(err);
    });
  }
));


var specializations = require('./controllers/specializations.js');
var users           = require('./controllers/users.js');
var courses         = require('./controllers/courses.js');
var dashboard       = require('./controllers/admin/dashboard.js');
var regulations     = require('./controllers/regulations');
var faculties       = require('./controllers/faculties');
var regulations     = require('./controllers/regulations.js');
var scholar         = require('./controllers/scholar.js');
var materials       = require('./controllers/materials.js');
var homework        = require('./controllers/homework.js');


var router= express.Router();
var app   = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret:"ceva",
  resave: false, //true,
  saveUninitialized:true,
  cookie:{},
  duration: 15 * 60 * 1000,
  activeDuration: 45 * 60 * 1000
}));

passport.serializeUser(function(user, done) {
   done(null, user.id);
});

passport.deserializeUser(function(id, done) {
 User.findOne({ where: { id: id  } }).then(function(user) {
    done(null, user);
    console.log(id);
  }).catch(e => done(e));
});
// Passport init
app.use(passport.initialize());
app.use(passport.session());


//-------------------------------- View engine setup------------------------------------------------------------------------------

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use("/resources",express.static(__dirname + "/resources"));


var isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/login');
};

var isAdminLoggedIn = function(req, res, next) {
	if ( req.isAuthenticated() && req.user.role === 'admin' ) return next();
	res.redirect('/login');
};

var isProLoggedIn = function(req, res, next) {
  if ( req.isAuthenticated() && req.user.role === 'professor' ) return next();
  res.redirect('/login');
};


app.use('/specializations', isLoggedIn, specializations);
app.use('/users',isLoggedIn, users); 
app.use('/courses',isLoggedIn, courses);
app.use('/scholar',isLoggedIn, scholar);
app.use('/dashboard', isAdminLoggedIn, dashboard);
app.use('/faculties',isLoggedIn, faculties);
app.use('/regulations',regulations);
app.use('/materials', materials);
app.use('/homework', homework);

app.get("/session", (req, res) => {
    res.json(req.session);
});

app.get('/login', function (req, res) {
  if (req.isAuthenticated()) res.redirect('/courses');;
  res.render('authentication');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/courses',
  failureRedirect: '/'
}));

app.get('/logout', function (req, res){
  req.session.destroy(function() {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
 });


//------------------------------------------------Routes---------------------------------------------------------------------------
 app.get('/', function (req, res) {
  if (req.user) {
   if ( req.isAuthenticated() && req.user.role == 'admin' ) {
        console.log(req.user);
        return res.redirect("/dashboard");    
      }
    }    
    res.render('index');  
 });

//------------------------------------Server---------------------------------------------------------------------------------

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
