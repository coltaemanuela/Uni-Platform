var Faculty = require('./faculty_model.js');
//_____________________________________________________Init & Config Sequelize___________________________________________________

var Sequelize = require('sequelize');
var sequelize = require('./sequelize-init');
//_______________________________________________Declare table structure ______________________________________________

 var Specialization = sequelize.define('specialization', {
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

//___________________________________Establish relationships with other tables____________________

Specialization.belongsTo(Faculty);
//____________________________________________________________________________________________

// Specialization.sync().then(function () { 
//   return Specialization.create({
//     name: 'Informatica',  
//   });
// }).then(c => {
//     console.log("Specialization Created", c.toJSON());
// }).catch(e => console.error(e));


//_______________________________________________________________________________________________________________________

module.exports = Specialization;
