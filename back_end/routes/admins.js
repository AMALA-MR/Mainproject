const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const User = require('../model/user');
const Hospital = require('../model/hospital')
const bcrypt = require('bcryptjs');

require('dotenv').config();

// @desc admin home url
// @route get /users
router.get('/', (req, res, next) => {
    res.send('Home');
});


// @desc login url for normal user 
// @route get /users/authenticate
router.all('/authenticate', (req, res, next) => {
    const username =req.body.username;
    const password = req.body.password;
    User.getUserByUsername(username, (err, admin)=> {
        if(err) throw err;
        if(!admin)
            {return res.json({success: false, msg: 'Wrong Password'});}
        User.comparePassword(password, admin.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(admin.toJSON(), process.env.JWT_KEY, {
                    expiresIn: 604800 // one week
                });
                res.json({
                    success: true, token: 'JWT '+token,
                    admin:{
                        id: admin._id,
                        username: admin.username,
                        login_type: admin.login_type
                    }
                });
            }else{
                return res.json({success: false, msg: 'Wrong Password'});
            }
        });
    });
});


// @desc view hospital pending confirmation list 
// @route get /admin/approve
router.get('/approve',(req,res,next)=>{    
    Hospital.find({confirm:'0'},(err, hospital)=> {
        if(err) throw err;
        if(!hospital){
            return res.json({success: false, msg:'No pending Hospital'})
        }else {
            return res.status(200).json(hospital)
        }
    })   
})


// @desc approve hospital by admin 
// @route put /admin/approve/:id
router.put('/approve/:id',(req,res,next)=>{
Hospital.findByIdAndUpdate(req.params.id,{$set: req.body},(error,hospital)=>{
    if (!hospital){
        return res.json({success:false ,msg:'Not found id'})   
    }else{
        return res.json({success:true,msg:'Approved'})
    }
})
})

module.exports = router;