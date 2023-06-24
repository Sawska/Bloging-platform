const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const userOperations = require("./MysqlOperations/UserOperations")
const blogOperations = require("./MysqlOperations/BlogOperations")

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended: false}));

const ses = session({
    secret: "secret",
    resave:false,
    saveUninitialized: true,
    cookie: {}
})

if(app.get("env") === 'production') {
    app.set("trust proxy",1)
    ses.cookie.secure = trust;
}

app.use(session(ses));

app.set("view engine","ejs");

app.use(express.static("public"))

app.get("/",(req,res) => {
    if(req.session.username)
    {
        const blogs = blogOperations.selectAllBlogs();
        res.render("main", {blogs})
    } else {
        res.render("register")
    }
})

app.get("/register",(req,res) => {
    const message = ""
    res.render("register",{message});
})

app.get("/login",(req,res) => {
    const message = ""
    res.render("login",{message});
})

app.get("/logout",(req,res) => {
    req.session.destroy();
    res.render("login");
})

app.post("/login",async (req,res) => {
    const username = req.body.username
    const password = req.body.password
    if(!await userOperations.loginUser(username,password)) {
        const message = "Invalid login or password"
        res.render("login",{message})
    }
    req.session.username = username
    req.session.privilage = userOperations.getUserPrivilage(username)[0].privilage
    const blogs = blogOperations.selectAllBlogs();
    res.render("main",{blogs})
})

app.post("/register",async (req,res) => {
    const username = req.body.username
    const password = req.body.password
    const passwordRepeat = req.body.passwordRepeat
    const privilage = "User"
    try {
       const res = await  userOperations.registerUser(username,password,privilage,passwordRepeat)
       if(!res) 
       {
        const message = 'Passwords are not the same'
        res.rendr("register",{message})
       }
        req.session.username = username
        req.session.privilage = privilage
        const blogs = blogOperations.selectAllBlogs();
        res.render("main",{blogs})
    } catch {
        const message = "Username alredy taken"
        res.render("register", {message})
    }
})

app.listen(process.env.PORT,process.env.HOST,() => {
    console.log(`server is running on http://${process.env.HOST}:${pocess.env.PORT}`);
})