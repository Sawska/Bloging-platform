
const con = require("./conections");
const bcrypt =  require("bcrypt");
async function registerUser(username,password,privilages,passwordRepeat) {
    if(!passwordsEqual(password,passwordRepeat)) return false
    password = await hashPassword(password)
    return new Promise((resolve,reject) => {
        con.query(`INSERT ITNO Users (username,password,privilages) VALUES('${username}','${password}','${privilages}')`,(err,res) => {
          if(err) reject(err)
          else resolve(true)
        })
    })
}
function passwordsEqual(passowrd,passwordRepeat) {
    return passowrd == passwordRepeat
}

function hashPassword(password) {
    return new Promise((resolve,reject) => {
        bcrypt.genSalt(10,(err,salt) => {
            bcrypt.hash(password,salt,(err,res) => {
                if(err) reject(err)
                else resolve(res)
            })
        })    
    })
}

async function  loginUser(username,password) {
    if(! await checkIfUsernameIsValid(username)) return false
    const hashedPassword = await getHashedPassword(username)[0].password
    return new Promise((resolve,reject) => {
        bcrypt.compare(password,hashedPassword,(err,res) => {
            if(err) reject(err)
            resolve(res)
        })   
    })
}

async function checkIfUsernameIsValid(username) {
    const res = getSameUsername(username)
    if(res[0].length !== 1) return false
    return true 
}

function getSameUsername(username) {
    return new Promise((resolve,reject) => {
        con.query(`SELECT username FROM Users WHERE username = '${username}'`,(err,res) => {
            if(err) reject(err)
            else resolve(res)
        })
    })
}

function getHashedPassword(username) {
    return new Promise((resolve,reject) => {
        con.query(`SELECT password FROM Users WHERE username = '${username}'`,(err,res) => {
            if(err) reject(err)
            else resolve(res);
        })
    })
}

function getUserPrivilage(username) {
    return new Promise((resolve,reject) => {
        con.query(`SELECT privilages FROM Users WHERE username = '${username}'`,(err,res) => {
            if(err) reject(err)
            else resolve(res)
        })
    })
}

module.exports = {
    registerUser,
    loginUser,
    getUserPrivilage
}