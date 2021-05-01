const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const validator = require('aadhaar-validator')

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
    if(validator.isValidNumber(adhar_no)){
        let newDoctor = new User({
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            adhar_no: req.body.adhar_no,
            phone_no: req.body.phone_no,
            hospital: req.body.hospital,
            password: req.body.password,
            confirm: '0',
            specialization:req.body.specialization,
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
    }else{
        res.json({success: false, msg:'Invalid Aadhar No'});
    }
});


module.exports = router;