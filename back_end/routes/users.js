const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const User = require('../model/user');
const Hospital = require('../model/hospital')
const bcrypt = require('bcryptjs');
const validator = require('aadhaar-validator')


require('dotenv').config();
const secret = process.env.JWT_KEY;
//console.log(secret);

// @desc user home page
// @route get /users
router.get('/', (req, res, next) => {
    res.send('Home');
});

// @desc registration url for normal user
// @route get /users/register
router.all('/register', function(req, res, next) {
    const adhar_no =req.body.adhar_no;
    if(validator.isValidNumber(adhar_no)){
        let newUser = new User({
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            adhar_no: req.body.adhar_no,
            phone_no: req.body.phone_no,
            password: req.body.password,
            login_type: req.body.login_type
        });

        User.getUserByAdhar(adhar_no, (err, user)=> {
            if(err) throw err;
            if(user){
                return res.json({success: false, msg: 'Already have an account'});
            }

        User.addUser(newUser, (err, user) =>{
            if(err){
                console.log(err)
                res.json({success: false, msg:'Failed to register user'});   
            }else {
                const token = jwt.sign(user.toJSON(), process.env.JWT_KEY,{
                    expiresIn: 604800 // one week
                });
                res.json({
                    success: true, token: 'JWT '+token,
                    user:{
                        id: user._id,
                        name: user.name,
                        age: user.age,
                        gender: user.gender,
                        login_type: user.login_type,
                    }
                });
                //res.json({success: true, msg:'User registered'}); 
            }
        });
        });
    }else{
        res.json({success: false, msg:'Invalid Aadhar No'});
    }
});


// @desc login url for normal user 
// @route get /users/authenticate
router.all('/authenticate', (req, res, next) => {
    const phone_no =req.body.phone_no;
    const password = req.body.password;
    const name =req.body.name;
    User.getUserByPhone(phone_no, (err, user)=> {
        if(err) throw err;
        if(!user){
            Hospital.getUserByName(name, (err, hospital)=> {
                if(err) throw err;
                if(!hospital){
                    return res.json({success: false, msg: 'Hospital not found'});
                }
                User.comparePassword(password, hospital.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch){
                        //console.log(user);
                        const token = jwt.sign(hospital.toJSON(), process.env.JWT_KEY, {
                            expiresIn: 604800 // one week
                        });
                        
                        res.json({
                            success: true, token: 'JWT '+token,
                            user:{
                                id: hospital._id,
                                name: hospital.name
                            }
                        });
                    }else{
                        return res.json({success: false, msg: 'Wrong Password'});
                    }
                });
                
            });
        }else{
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
                        phone_no: user.phone_no
                    }
                });
            }else{
                return res.json({success: false, msg: 'Wrong Password'});
            }
        });
        }
    });
});


module.exports = router;