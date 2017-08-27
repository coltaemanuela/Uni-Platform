var Specialization= require('./specialization_model.js');
//_____________________________________________________Init & Config Sequelize___________________________________________________

var Sequelize = require('sequelize');
var sequelize = require('./sequelize-init');
//_______________________________________________Declare table structure ______________________________________________

 var Subject = sequelize.define('subjects', {
   name: {
    type: Sequelize.STRING,
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
  credit:{
    type:Sequelize.INTEGER
  },
  description:{
     type: Sequelize.TEXT,
  },
  exam:{
    type:Sequelize.BOOLEAN
  },
  project:{
    type:Sequelize.BOOLEAN
  },
  test:{
    type:Sequelize.BOOLEAN
  },
  presentation:{
    type:Sequelize.BOOLEAN
  },
  
}, {
  freezeTableName: true 
});

//___________________________________Establish relationships with other tables____________________

Subject.belongsTo(Specialization);
//____________________________________________________________________________________________

// Subject.sync().then(function () { 
//   return Subject.create({
//     name: 'Programare Oricentata pe Obiecte',
//     exam:true,
//     project:false,
//     test:false,
//     presentation:false,
//     credit:5,
//     description: 'desc',
//   });
// }).then(c => {
//     console.log("Subject Created", c.toJSON());
// }).catch(e => console.error(e));


//_______________________________________________________________________________________________________________________

module.exports = Subject;
