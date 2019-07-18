var express = require('express');


exports.getProfilePage = (req,res)=>{
    //get ID from Session

    //get return value from DB

    res.render('profile',{
        username: 'huynhlehieunam',
        email: 'huynhlehieunam@gmail.com',
        password: '*****************',
        birthday: '12/04/1997',
        phone: '0123456789',
        avatar_link: '/img/user-avatar.png'
    });
}


exports.getProfileUpdatePage = (req,res)=>{
    res.render('profile_update');
}