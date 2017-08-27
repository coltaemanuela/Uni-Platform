var User = require('./users_model.js');
var Faculty= require('./faculty_model.js');
var Specialization = require('./specialization_model.js');

var Sequelize = require('sequelize');
var sequelize = require('./sequelize-init');    
//_______________________________________________Declare table structure ____________________________

var FacultyUser = sequelize.define('facultyuser', {
      uniYear:{
      type:Sequelize.INTEGER,      
    },
    },
    {
      freezeTableName: true
    });
       
//___________________________________Establish relationships with other tables____________________
FacultyUser.belongsTo(User);
FacultyUser.belongsTo(Faculty);
FacultyUser.belongsTo(Specialization);    
//____________________________________________Generate first record _______________________________
// FacultyUser.sync().then(function () { 
//   return FacultyUser.create({
//     uniYear:1
// 	// facultyId:1,
// 	// specializationId:1
//   });
// }).then(c => {
//     console.log("FacultyUser Created", c.toJSON());
// }).catch(e => console.error(e));
//____________________________________________________________________________________________________
    
module.exports = FacultyUser;