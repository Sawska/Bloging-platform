const mysql = require("mysql");
const dotenv = reqire("dotenv").conf();
const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
})

con.connect((err) => {
    if(err) throw err
})

module.exports = con;
