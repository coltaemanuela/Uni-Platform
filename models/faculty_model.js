//_____________________________________________________Init & Config Sequelize___________________________________________________

var Sequelize = require('sequelize');
var sequelize = require('./sequelize-init');
//_______________________________________________Declare table structure ______________________________________________

 var Faculty = sequelize.define('faculty', {
   name: {
    type: Sequelize.STRING,
  },
  
  description:{
     type: Sequelize.TEXT,
  },
  
  isDeleted:{
   type: Sequelize. BOOLEAN,
   defaultValue: false
  },
  
}, {
  freezeTableName: true
});



//________________________________________INSERT FIRST RECORD ____________________________________

// Faculty.sync().then(function () { 
//   return Faculty.create({
//     name: 'Stiinte',  
//     description:'Our ambition at the University of Southampton is to change the world. This is a grand statement, but it is an achievable one with the support of the more than 200,000 hardworking people who make up the students, staff'
//   });
// }).then(c => {
//     console.log("Faculty Created", c.toJSON());
// }).catch(e => console.error(e));



//_______________________________________________________________________________________________

module.exports = Faculty;
