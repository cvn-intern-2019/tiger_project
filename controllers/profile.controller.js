var express = require('express');
var router = express.Router();
var User = require('../models/user.model');

exports.UPLOAD_PATH = "/public/uploads";
var hidePassword = password => {
    return password.replace(/./g,'*');
};

exports.getProfilePage = (req,res,next)=>{
    
    let idUser = "5d363e391c773324acb081f1";

    User.findById(idUser,"username phone name email password birthday",(err,userData)=>{
        if(err){
            let error = new Error("ID of user not found.");
            next(error);
        }
        
        userData.password = hidePassword(userData.password);
        
        res.render('profile',{
            title: "View your profile",
            userData: userData
        });
    })


    
}
exports.getEditProfilePage = (req,res,next)=>{
    let idUser = "5d363e391c773324acb081f1";

    User.findById(idUser,"username phone name email password birthday",(err,userData)=>{
        if(err){
            let error = new Error("ID of user not found.");
            next(error);
        }
        
        userData.password = hidePassword(userData.password);
        
        res.render('profile_edit',{
            title: "Edit your profile",
            userData: userData
        });
    })
}
exports.postEditProfile = (req,res,next)=>{
    
}
