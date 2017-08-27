//var Faculty = require('./faculty_model.js');
//_____________________________________________________Init & Config Sequelize___________________________________________________

var Sequelize = require('sequelize');
var sequelize = require('./sequelize-init');
//_______________________________________________Declare table structure ______________________________________________

var User = sequelize.define('user', {
   username: {
    type: Sequelize.STRING,
  },
  firstname: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
},
  email: {
    type: Sequelize.STRING
  },
  phone: {
    type: Sequelize.STRING
  },
  role: {
    type: Sequelize.ENUM("student","professor","admin"),
    defaultValue: 'student' //usually, new users are not admins
  },
  activeAccount:{
    type:Sequelize.BOOLEAN,
     defaultValue: true 
  },
  yearOfStudies:{
    type:Sequelize.STRING
  },
  
}, {
  freezeTableName: true,
  charset: "utf8mb4"
});


//___________________________________Establish relationships with other tables____________________


//____________________________________________________________________________________________

// User.sync().then(function () { 
//   return User.create({
//     username: 'username',
//     firstname: 'Firstname',
//     lastName: 'Lastname',
//     password: 'parola',
//     email: 'firstname@gmail.com',
//     phone: '0770111222',
//     role: 'ordinary',// 'admin' , 
//     activeAccount:true,
//     yearOfStudies: 1,    
//   });
// }).then(c => {
//     console.log("User Created", c.toJSON());
// }).catch(e => console.error(e));


//_______________________________________________________________________________________________________________________

module.exports = User;
