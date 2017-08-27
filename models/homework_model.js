
var Subject   = require('./subject_model.js');
var User      = require('./users_model.js'); 


//_____________________________________________________Init & Config Sequelize___________________________________________________

var Sequelize = require('sequelize');
var sequelize = require('./sequelize-init');
//_______________________________________________Declare table structure ______________________________________________

 var Homework = sequelize.define('homework', {
   name: {
    type: Sequelize.STRING,
  },
  description:{
    type: Sequelize.TEXT,
  },
  materials: {
    type: Sequelize.TEXT, 
    get () {
            const val = this.getDataValue("materials");
            if (!val) {
                return [];
            }
            return JSON.parse(val);
        },
    set (d) {
      this.setDataValue("materials", JSON.stringify(d));
    }
  },
  is_submitted:{
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  
}, {
  freezeTableName: true 
});

//___________________________________Establish relationships with other tables____________________

Homework.belongsTo(Subject);

Homework.belongsTo(User, { as: "assignee" });
Homework.belongsTo(User, { as: "professor" });
//____________________________________________________________________________________________

// Homework.sync().then(function () { 
//   return Homework.create({
//     name: 'Proiect retele Calculatoare',
//     description: ' Referatul trebuie sa cuprinda:introducere, descrierea protocolului TCP sau UDP si un exemplu practic',
//   });
// }).then(c => {
//     console.log("Homework Created", c.toJSON());
// }).catch(e => console.error(e));


//_______________________________________________________________________________________________________________________

module.exports = Homework;
