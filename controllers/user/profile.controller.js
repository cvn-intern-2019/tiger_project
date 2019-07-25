var User = require("../../models/user.model");
var crypto = require("crypto");
var moment = require("moment");


module.exports.getProfilePage = (req, res, next) => {
    
    let idUser = req.session._id;
    
    User.findById(idUser, "username email avatar fullname phone gender birthday",(err,userData)=>{
        if(err) return next(err);
        if(!userData) return next(new NotFound);
        
        //convert date to string and display in format DD-MM-YYYY
        userData.birthday_formatted = moment(userData.birthday).format("DD-MM-YYYY");
        res.render("user/profile", {
            title: "View user page",
            userData: userData,
        });
    })

};
