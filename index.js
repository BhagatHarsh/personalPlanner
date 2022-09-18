require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');

const app = express();

app.use(express.static("views"));
app.use(express.static("views/scripts"));
app.use(express.static("views/css"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DBURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true); //to avoid errors

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    tasks: [String] //https://mongoosejs.com/docs/schematypes.html#arrays
});

//plugins
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

//postion of the middleware is important
passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


app.get("/", function(req, res) {
    res.render("home");
});


app.get("/Tasks", function(req, res) {
    User.find({ "tasks": { $ne: null } }, function(err, task) {
        if (err) {
            console.log(err);
        } else {
            if (task) {
                console.log(task);
                res.render(__dirname + "/views/Tasks.ejs", { TodoListItems: task.tasks });
                // res.render(__dirname + "/views/Tasks.ejs", { TodoListItems: ['works???'] });
            }
        }
    });
});

app.get("/submit", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("Tasks");
    } else {
        res.redirect("/");
    }
});
app.post("/testPost", () => {
    console.log("Post is Requested");
});

app.post("/submit", function(req, res) {
    const submittedSecret = req.body.tasks;

    //Once the user is authenticated and their session gets saved, their user details are saved to req.user.
    console.log("Task recieved");
    console.log(submittedSecret);

    User.findById(req.user.id, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                foundUser.tasks = submittedSecret;
                foundUser.save(function() {
                    res.redirect("/Tasks");
                });
            }
        }
    });
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

app.post("/register", function(req, res) {

    User.register({ username: req.body.username }, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            console.log(user);
            passport.authenticate("local")(req, res, function() {
                res.redirect("/Tasks");
            });
        }
    });

});

app.post("/login", function(req, res) {
    console.log("post/login called");
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    console.log('User is');
    console.log(user);
    req.login(user, function(err) {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/Tasks");
            });
        }
    });

});

app.listen(3000, function() {
    console.log(`Server started on port 3000`);
});
