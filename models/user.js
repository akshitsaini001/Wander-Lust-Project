const mongoose = require('mongoose');
const passportLocalMomgoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
});

userSchema.plugin(passportLocalMomgoose);  //This add password(hashed) and username automatically to model.
module.exports = mongoose.model("User" , userSchema);