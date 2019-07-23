var express = require('express');
var router = express.Router();
var User = require('../models/user.model');

module.exports.UPLOAD_PATH = "/public/uploads";
var hidePassword = password => {
    return password.replace(/./g,'*');
};

module.exports.getProfilePage = (req,res,next)=>{
    //In lack of session. I use mock id.
    let idUser = "5d36ca0ff9b66201c867c855";

    User.findById(idUser,"username phone email password birthday",(err,userData)=>{
        if(err){
            return next(err);
        }
        if(!userData){
            return next(new NotFound("Id not found"));
        }
        
        userData.password = hidePassword(userData.password);
        
        res.render('profile',{
            title: "View your profile",
            userData: userData
        });
    }) 
}

