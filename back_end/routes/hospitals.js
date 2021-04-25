const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const Hospital = require('../model/hospital');
const bcrypt = require('bcryptjs');

require('dotenv').config();
const secret = process.env.JWT_KEY;
//console.log(secret);

// @desc user home page
// @route get /hospital
router.get('/', (req, res, next) => {
    res.send('Home');
});

// @desc registration url for normal user
// @route get /hospital/register
router.all('/register', function(req, res, next) {
    const name =req.body.name;
    let newHospital = new Hospital({
        name: req.body.name,
        city: req.body.city,
        district: req.body.district,
        state: req.body.state,
        pincode: req.body.pincode,
        password: req.body.password
    });

    Hospital.getUserByName(name, (err, hospital)=> {
        if(err) throw err;
        if(hospital){
            return res.json({success: false, msg: 'Already have an account'});
        }

    Hospital.addHospital(newHospital, (err, hospital) =>{
        if(err){
            //console.log(err)
            res.json({success: false, msg:'Failed to register hospital'});   
        }else {
            const token = jwt.sign(hospital.toJSON(), process.env.JWT_KEY,{
                expiresIn: 604800 // one week
            });
            res.json({
                success: true, token: 'JWT '+token,
                user:{
                    id: hospital._id,
                    name: hospital.name
                }
            });
        }
    });
    });
});


// @desc login url for hospital 
// @route get /hospital/authenticate
router.all('/authenticate', (req, res, next) => {
    const name =req.body.name;
    const password = req.body.password;

    Hospital.getUserByName(name, (err, hospital)=> {
        if(err) throw err;
        if(!hospital){
            return res.json({success: false, msg: 'Hospital not found'});
        }

        Hospital.comparePassword(password, hospital.password, (err, isMatch) => {
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
                    name: hospital.name,
                }
            });
        }else{
            return res.json({success: false, msg: 'Wrong Password'});
        }
    });
    });
});

module.exports = router;