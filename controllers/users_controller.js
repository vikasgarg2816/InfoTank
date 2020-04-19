const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const mailers = require('../mailers/comments_mailer');
function generateOTP() { 
    var string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
    let OTP = ''; 
    var len = string.length; 
    for (let i = 0; i < 6; i++ ) { 
        OTP += string[Math.floor(Math.random() * len)]; 
    } 
    return OTP; 
} 
  
// let's keep it same as before
module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    });

}


module.exports.update = async function(req, res){
   

    if(req.user.id == req.params.id){

        try{

            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if (err) {console.log('*****Multer Error: ', err)}
                
                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file){

                    if (user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }


                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }


    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}


// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){req.flash('error', err); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){req.flash('error', err); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }

    });
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have logged out!');


    return res.redirect('/');
}

module.exports.renderreset = function(req,res){
    return res.render('resetpass',{
        title: 'reset password'
    });
}
var arr = [];
module.exports.verifydetails = function(req,res){
    const email = req.body.email;
    console.log
    User.findOne({email:email}).then(function(user){
        if(!user){
            req.flash('error','Invalid email entered');
            return res.redirect('/users/reset-password');
        }
        var token = generateOTP();
        arr.push(email);
        arr.push(token);
        console.log(arr);
        // mailers.verifypassword(arr);
        // console.log(token);
    });
    return res.render('verifyotp',{
        title : 'Verify OTP'
    });
}
module.exports.verifyotp = function(req,res){
    if(req.body.otp === arr[1]){
        return res.render('newpassword',{
            email : arr[0],
            title:'New Password'
        });
    }else{
        req.flash('error','You have entered wrong OTP');
        return res.render('verifyotp',{
            title:'Verify OTP'
        });
    }
}
module.exports.changepassword = function(req,res){
    const email = req.body.email;
    User.findOne({email:email}).then(function(user){
        user.password = req.body.password;
        user.save();
    });
    return res.redirect('/users/sign-in');
}
module.exports.addfriend = async function(req,res){
    if(req.user.id == req.params.id){

        try{
            let user = await User.findById(req.params.id);
            let friend = await User.findOne({email : req.body.email});
            user.friends.push(friend);
            user.save();
            return res.redirect('/');
        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }


    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}