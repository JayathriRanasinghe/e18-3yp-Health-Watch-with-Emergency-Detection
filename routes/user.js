const { request, response } = require("express");
const express = require("express");
const User = require("../models/user_model");
const config = require("../config");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware");

const router = express.Router();

router.route("/:username").get(middleware.checkToken, (request, response) => {
    User.findOne({username: request.params.username}, (err, result)=>{
        if(err) response.status(500).json({msg:err});
        response.json({
            data: result,
            username: request.params.username,
        });
    });
});
router.route("/login").post((request, response)=>{
    User.findOne({username:request.body.username}, (err, result)=>{
        if(err) response.status(500).json({msg:err});
        if(result===null){
            response.status(403).json("Username is incorrect")
        }
        if(result.password===request.body.password){
            let token = jwt.sign({username:request.body.username}, config.key,{
                expiresIn:"24h", //token is expiring after 24h
            });
            response.json({
                token:token,
                msg: "success",
            });
        }else{
            response.status(403).json("password is incorrect.");
        }
    });
});

router.route("/register").post((request,response) => {
    console.log("inside the register");
    const user = new User({
        username:request.body.username,
        password:request.body.password,
        name:request.body.name
    });
    user
        .save()
        .then(() =>{
            console.log("User registered");
            response.status(200).json("ok");
        })
        .catch((err) => {
            response.status(403).json({msg:err});
        });
    response.json("registered");
});

//in the deleting and updating middleware token checking is used since it is better to authenticate the user before doing any operations

router.route("/update/:username").patch(middleware.checkToken,(request, response)=>{ //sending the username to retrieve data
    User.findOneAndUpdate(
        {username: request.params.username}, //as a parameter
        {$set:{password:request.body.password}}, //once the username is found password is sending in the body
        (err, result) => {
            if(err) return response.status(500).json({msg: err});
            const msg = {
                msg: "password successfully updated!",
                username:request.params.username,
            };
            return response.json(msg);
        }
    );
});

router.route("/delete/:username").patch(middleware.checkToken,(request,response)=>{ 
    User.findOneAndDelete(
        {username: request.params.username}, //as a parameter
        (err, result) => {
            if(err) return response.status(500).json({msg: err});
            const msg = {
                msg: "username deleted",
                username:request.params.username,
            };
            return response.json(msg);
        }
    );
});

module.exports = router;