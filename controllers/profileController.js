var express = require('express');
var app = require('../app');
var User = require('../models/user.model');
var fileUpload = require("express-fileupload");

const USER_AVATAR_UPLOAD_PATH = "/public/images/avatars/";
exports.getProfilePage = (req,res,next)=>{
    //get Id from request's session
    let id = "5d332b13d5eda51450a11c2f";
    //search for user and handling error
    User.findById(id,"email username phone password birthday avatar_link",(err,userData)=>{
        if(err){
            var error = new Error("ID not found");
            next(error);
        };
        res.render('profile',{
            title: "View your profile",
            userData: userData
        });
    });

}

exports.getProfileEditPage = (req,res,next)=>{
    //get Id from request's session
    let id = "5d332b13d5eda51450a11c2f";
    //search for user and handling error
    User.findById(id,"email username phone password birthday avatar_link",(err,userData)=>{
        if(err){
            let error = new Error(err.toString());
            next(error);
        };
        res.render('profile_edit',{
            title: "Edit your profile",
            userData: userData
        });
    });

}

exports.postProfileEdit = (req,res,next)=>{

    if(req.files.avatar){
        let new_avatar = req.files.avatar;

        avatar_path = USER_AVATAR_UPLOAD_PATH+new_avatar.name;

        new_avatar.mv(avatar_path,(err)=>{
            next(err.toString());
        });
    };
}
