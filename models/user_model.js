const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type: String,
        required: true
    }
});

//the first argument should be in the singular form--> collection name: users in this case
module.exports = mongoose.model("User", User); //this is converted into plural and take as the collection name