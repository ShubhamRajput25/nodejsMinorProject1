var mysql = require('mysql')
var pool = mysql.createPool({
    host:'localhost',
    port:3306,
    user:'root',
    database:'employeedb',
    password:'1234',
    multipleStatements:true
})
module.exports = pool