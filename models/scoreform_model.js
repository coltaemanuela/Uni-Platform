var Subject  = require('./subject_model.js');
var User = require('./users_model.js');
//_____________________________________________________Init & Config Sequelize___________________________________________________

var Sequelize = require('sequelize');
var sequelize = require('./sequelize-init');
//_______________________________________________Declare table structure ______________________________________________

 var Score= sequelize.define('score', {
   score: {
    type: Sequelize.INTEGER
  },
  
}, {
  freezeTableName: true 
});

//___________________________________Establish relationships with other tables____________________
Score.belongsTo(Subject);
Score.belongsTo(User);

//____________________________________________________________________________________________

// Score.sync().then(function () { 
//   return Score.create({
//     score: 10,  
//   });
// }).then(c => {
//     console.log("Score Created", c.toJSON());
// }).catch(e => console.error(e));


//_______________________________________________________________________________________________________________________

module.exports = Score;
