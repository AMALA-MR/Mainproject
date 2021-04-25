const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const User = require('../model/user');
const bcrypt = require('bcryptjs');

require('dotenv').config();
const secret = process.env.JWT_KEY;
//console.log(secret);

// @desc user home page
// @route get /doctor
router.get('/', (req, res, next) => {
    res.send('Home');
});

// @desc registration url for normal user
// @route get /doctor/register
router.all('/register', function(req, res, next) {
    const adhar_no =req.body.adhar_no;
    let newDoctor = new User({
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        adhar_no: req.body.adhar_no,
        phone_no: req.body.phone_no,
        hospital: req.body.hospital,
        password: req.body.password,
        confirm: req.body.confirm,
        login_type: req.body.login_type
    });

    User.getUserByAdhar(adhar_no, (err, user)=> {
        if(err) throw err;
        if(user){
            return res.json({success: false, msg: 'Already have an account'});
        }

    User.addUser(newDoctor, (err, user) =>{
        if(err){
            //console.log(err)
            res.json({success: false, msg:'Failed to register user'});   
        }else {
            res.json({success: true, msg:'Doctor registered, and send request to hospital for approval'}); 
        }
    });
    });
});

// @desc login url for normal user 
// @route get /users/authenticate
router.all('/authenticate', (req, res, next) => {
    const phone_no =req.body.phone_no;
    const password = req.body.password;

    User.getUserByPhone(phone_no, (err, user)=> {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'User not found'});
        }
    User.getDoctorLogin(phone_no, (err, user)=> {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'Not approved by hospital'});
        }

    User.comparePassword(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
            //console.log(user);
            const token = jwt.sign(user.toJSON(), process.env.JWT_KEY, {
                expiresIn: 604800 // one week
            });
            
            res.json({
                success: true, token: 'JWT '+token,
                user:{
                    id: user._id,
                    name: user.name,
                    login_type: user.login_type
                }
            });
        }else{
            return res.json({success: false, msg: 'Wrong Password'});
        }
    });
    });
    });
});


module.exports = router;