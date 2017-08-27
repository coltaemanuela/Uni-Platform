var Sequelize = require('sequelize');
var sequelize = require('./sequelize-init');
//_______________________________________________Declare table structure ______________________________________________
var Regulations = sequelize.define('regulations', {    
 regulations:{
     type:Sequelize.TEXT,
  },
},{
  freezeTableName: true 
});

//___________________________________Create initial record ____________________________________________________________

// Regulations.sync().then(function () { 
//   return Regulations.create({
//     regulations: 'Regulamentul intern al universitatii'
//   });
// }).then(c => {
//     console.log("Regulations Created", c.toJSON());
// }).catch(e => console.error(e));

//______________________________________________________________________________________________________________________

module.exports = Regulations;
