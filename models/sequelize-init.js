var Sequelize = require('sequelize');
var config= require('../config/config.json');

var sequelize = new Sequelize( config.database.name, config.database.username, config.database.password,
    {
        host: config.database.host,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
       }
    }
);

module.exports = sequelize;


