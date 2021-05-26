const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const bcrypt = require('bcryptjs');
const validator = require('aadhaar-validator')
const User = require('../model/user');
const Hospital = require('../model/hospital')
const Vaccine = require('../model/vaccine')
const Booking = require('../model/booking')
const Stock = require('../model/stock')
const Schedule = require('../model/schedule')

require('dotenv').config();
const secret = process.env.JWT_KEY;
//console.log(secret);

// @desc user home page
// @route get /users
router.get('/', (req, res, next) => {
    res.send('Home');
});

// @desc registration url for normal user
// @route post /users/register
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
    const phone_no =req.body.username;
    const password = req.body.password;
    const name =req.body.username;
    const adhar_no = req.body.adhar_no;
    User.getUserByPhone(phone_no, (err, user)=> {
        if(err) throw err;
        if(!user){
            Hospital.getUserByName(name, (err, hospital)=> {
                if(err) throw err;
                if(!hospital){
                    return res.json({success: false, msg: 'Account not found'});
                }
                User.comparePassword(password, hospital.password, (err, isMatch) => {
                    if(err) throw err;
                    if(hospital.confirm=='0'){
                        res.json({success: false, msg:'Hospital registered, and send request to Admin for approval'});
                    }else{
                        if(isMatch){
                            const token = jwt.sign(hospital.toJSON(), process.env.JWT_KEY, {
                                expiresIn: 604800 // one week
                            });
                            
                            res.json({
                                success: true, token: 'JWT '+token,
                                user:{
                                    id: hospital._id,
                                    name: hospital.name,
                                    login_type: "hospital"
                                }
                            });
                        }else{
                            return res.json({success: false, msg: 'Wrong Password'});
                        }
                    }
                });
                
            });
        }else{
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(user.confirm=='0'){
                res.json({success: false, msg:'Doctor registered, and send request to hospital for approval'});
            }else{
                if(isMatch){
                    const token = jwt.sign(user.toJSON(), process.env.JWT_KEY, {
                        expiresIn: 604800 // one week
                    });
                    res.json({
                        success: true, token: 'JWT '+token,
                        user:{
                            id: user._id,
                            name: user.name,
                            phone_no: user.phone_no,
                            login_type: user.login_type,
                            adhar_no : user.adhar_no
                        }
                    });
                }else{
                    return res.json({success: false, msg: 'Wrong Password'});
                }
            }
        });
        }
    });
});


// @desc vaccine list
// @route get /users/vaccine/list
router.get('/vaccine/list', (req, res, next) => {
    Vaccine.find((err, vaccine) => {
        if (err) throw err;
        if (!vaccine) {
            return res.json({ success: false, msg: 'their is no vaccine' })
        } else {
            return res.status(200).json(vaccine)
        }
    })
})

// @desc book vaccination date and slot
// @route post /users/bookings
router.post('/bookings', function(req, res, next) {
    let newBook = new Booking({
        user: req.body.user,
        schedule: req.body.schedule,
        status:'book'
    });

    Booking.addBook(newBook, (err, user) =>{
        if(err){
            console.log(err)
            return res.json({success: false, msg:'Failed to booking'});   
        }else {
            return res.json({success: true, msg:'Booking suceess'}); 
        }
    });
});

// @desc view schedules for a users using pincode or district
// @route get /users/view/schedule/:id {id is pincode or district}
//router.get('/view/schedule/:id',(req,res,next)=>{
  //  Hospital.find({$or: [{pincode:req.params.id}, {district:req.params.id }]},(err,hospitl)=>{
   //     if(hospitl==''){
     //       return res.json({success: false, msg:'No schedules'})
       // }else{
         //   return res.json(hospitl.name)
        //}
    //})
//})

router.get('/view/schedule/:id',(req,res,next)=>{
    Schedule.aggregate([{
        $unwind:"$hospitals"

        },
        {
        $lookup:{
            from: "hospital",
            localField: "hospital",
            foreignField: "_id",
            as:"hospitalsss",
        }
    }],(err,hospitl)=>{
        //console.log(hospitl)
        if(hospitl==''){
            return res.json({success: false, msg:'No schedules'})
        }else{
            return res.json(hospitl)
        }
    
})})

// @desc book vaccination date and slot
// @route get /users/stock/:id
router.get('/stock/:id', function(req, res, next) {
    Stock.findOne({hospital: req.params.id},(err,stock)=>{
        if(stock){
            if(parseInt(stock.available_stock)<=100){
                res.json({stock:stock.available_stock})
            }
        }
    })
})
module.exports = router;