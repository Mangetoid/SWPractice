const mysql = require("mysql");

var connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '112358',
    database:'vacCenter'
});

module.exports = connection;