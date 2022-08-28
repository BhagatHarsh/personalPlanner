const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { verify } = require('crypto');

//Set up default mongoose connection
const mongoDB = process.env.DBURL;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

//Get the default connection
const db = mongoose.connection;

db.on('connected', function() {
    console.log('database is connected successfully');
});
db.on('disconnected', function() {
    console.log('database is disconnected successfully');
})
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const Schema = mongoose.Schema;

const userData = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
});

const userdata = mongoose.model('user', userData);

function addUser(username, password) {
    let flag = 0;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            // returns hash
            let userdataObj = {
                username: username,
                password: hash,
                salt: salt
            }
            console.log('Adding User');
            const addNewUser = new userdata(userdataObj);
            addNewUser.save((err) => {
                console.dir(err);
                if (err) {
                    flag = 1;
                    return;
                }
                console.log('New user added with username ' + username);
            });
        });
    });
    if (flag) {
        return false;
    } else {
        return true;
    }
}

function verifyUser(username, password2) {

    var Data = userdata.findOne({ 'username': username });
    let flag = true;
    Data.exec(function(err, data) {
        if (err) throw err;
        if (data == null) {
            flag = false;
        }
        if (flag) {
            flag = false;
            bcrypt.compare(password2, data.password, function(err, result) {
                if (result) {
                    console.log('%s user logged in', username);
                    flag = true;
                }
            });
        }

    });
    return flag;
}

module.exports = {
    add: addUser,
    verify: verify
}
// Compile model from schema
// const SomeModel = mongoose.model('plannerData', userData);




// Create an instance of model SomeModel
// const awesome_instance = new SomeModel({ userName: 'deku', passWord: 'parva' });

// Save the new model instance, passing a callback
// awesome_instance.save((err) => {
//     if (err) return Error(err);
//     // saved!
// });

// Access model field values using dot notation
// console.log(awesome_instance.userName); //should log 'also_awesome'