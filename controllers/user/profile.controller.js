var express = require('express');
var router = express.Router();
var User = require("../../models/user.model")

var removeEmptyField = function(json){
    for(var field in json){
        if(json.field == "") delete json.field
    };
    return json;
}

exports.getUserPage = (req,res,next)=>{
    var idUser = req.session.userData._id;
    
    User.findById(idUser,"-password",(err,userData)=>{
        if(err) return next(err);
        if(!userData) return next(new NotFound());
        userData = removeEmptyField(userData);
        
        res.json(userData);
    });
    
};

exports.postEditProfile = (req,res,next)=>{
    
}