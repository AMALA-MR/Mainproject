const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const bcrypt = require('bcryptjs');
const validator = require('aadhaar-validator')
const random =require('random-number');
const User = require('../model/user');
const Hospital = require('../model/hospital')
const Vaccine = require('../model/vaccine')
const Booking = require('../model/booking')
const Stock = require('../model/stock')
const Schedule = require('../model/schedule')
const Vaccination =require('../model/vaccination')
const VerifyUser = require('../model/verifyuser')
var otpGenerator = require('otp-generator')

const send_message = function (to, message){
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM_PHONE
    const client = require('twilio')(accountSid, authToken);
    console.log(to,message)
    client.messages.create({
         body: message,
         from: from,
         to: to
       })
      .then(message => console.log(message))
      .catch(error => console.log(error))
      //console.log('hiiii',message)

}
var gen = random.generator({
    min:  1000,
    max:  9999, 
    integer: true
  })

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
            login_type: req.body.login_type,
            secret_code:gen()
        });

        User.getUserByAdhar(adhar_no, (err, user)=> {
            if(err) throw err;
            if(user){
                return res.json({success: false, msg: 'Already have an account'});
            }

        User.addUser(newUser, (err, user) =>{
            if(err){
                console.log(err)
                return res.json({success: false, msg:'Failed to register user'});   
            }else {
                let newVerify = new VerifyUser({
                    user: newUser._id,
                    otp:otpGenerator.generate(6, {alphabets:false, upperCase: false, specialChars: false })
                });
                VerifyUser.createVerify(newVerify,(err, user) =>{
                    if(err){
                        console.log(err)
                        return res.json({success: false, msg:'Failed to register user'});   
                    }else{
                        let msgg='Your OTP is '+newVerify.otp
                        send_message(req.body.phone_no,msgg)
                        return res.json({success: true, request_id:newVerify._id,otp:newVerify.otp});
                    }
                })
                //return res.json({success: true, msg:'Verify otp'}); 
                //const token = jwt.sign(user.toJSON(), process.env.JWT_KEY,{
                 //   expiresIn: 604800 // one week
                //});
                //res.json({
                 //   success: true, token: 'JWT '+token,
                   // user:{
                     //   id: user._id,
                       // name: user.name,
                     //   age: user.age,
                      //  gender: user.gender,
                       // login_type: user.login_type,
                   // }
                //});
                //res.json({success: true, msg:'User registered'}); 
            }
        });
        });
    }else{
        return res.json({success: false, msg:'Invalid Aadhar No'});
    }
});

//@desc verify otp
//@route post /users/verify/:id
router.post('/verify/:id', (req, res, next) => {
    VerifyUser.findById(req.params.id,(err, otppp) => {
        //if (err) throw err;
        if (!otppp) {
            return res.json({ success: false, msg: "otp not found" })
        } else {
            if(req.body.otp==otppp.otp){
                User.findByIdAndUpdate(otppp.user,{confirm:'1'},(err,confirmed)=>{
                    if(err){
                        return res.json({success: false, msg:'something wrong'});
                    }else{
                        otppp.delete()
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
                        return res.json({success: true, msg:'otp successfully verified'});
                    }
                })
            }else{
                return res.json({success: false, msg:'invalid otp'});
            }
        }
    })
})

// @desc login url for normal user 
// @route get /users/authenticate
router.all('/authenticate', (req, res, next) => {
    const phone_no =req.body.username;
    const password = req.body.password;
    const name =req.body.username;
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

                res.json({success: false, msg:'OTP Not verified'});
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
                            age: user.age,
                            login_type: user.login_type,
                            adhar_no : user.adhar_no,
                            secret_code:user.secret_code
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
    const schedule_id=req.body.schedule;
    let newBook = new Booking({
        user: req.body.user,
        schedule: req.body.schedule,
        status:'booked'
    });
    Vaccination.findOne({user:req.body.user},(err,van)=>{
        if(van){
            Schedule.findById(req.body.schedule,(err,dt)=>{
                let date2=dt.date
                if(date2<van.second_dose_date){
                    let datt= new Date()
                    let dtt=datt.getDate(van.second_dose_date)+'/'+(parseInt(datt.getUTCMonth(van.second_dose_date))+parseInt(1))+'/'+datt.getFullYear(van.second_dose_date)
                    let msg= 'your 2 dose date '+ dtt+'. select schedule after that date'
                    res.json({success: false, msg:msg})
                }else{
                    Booking.addBook(newBook, (err, user) =>{
                        if(err){
                            console.log(err)
                            return res.json({success: false, msg:'Failed to booking'});   
                        }else {
                            Schedule.findById(schedule_id,(err,sh)=>{
                                if(!sh){
                                    res.json({success: false, msg:'* Schedule not found'})
                                }else{
                                    const temp=sh.allocated_amount
                                    if(temp=='0'){
                                        res.json({success: false, msg:'* Slot full'})
                                    }else{
                                        let temp_stock = parseInt(temp) - 1
                                        Schedule.findByIdAndUpdate(schedule_id,{allocated_amount:temp_stock},(err,newamount)=>{
                                            if (err){
                                                return res.json({success:false ,msg:'* Something happened'})   
                                            }else{
                                                return res.json({success: true, msg:'Booking suceess'}); 
                                            }
                                        })
                                    }
                                }
                            })
                            //return res.json({success: true, msg:'Booking suceess'}); 
                        }
                    });
                }
            })
            //let second_dose=hi
            //return res.json({success: false, msg:van.status})
        }else{
            Booking.addBook(newBook, (err, user) =>{
                if(err){
                    console.log(err)
                    return res.json({success: false, msg:'Failed to booking'});   
                }else {
                    Schedule.findById(schedule_id,(err,sh)=>{
                        if(!sh){
                            res.json({success: false, msg:'* Schedule not found'})
                        }else{
                            const temp=sh.allocated_amount
                            if(temp=='0'){
                                res.json({success: false, msg:'* Slot full'})
                            }else{
                                let temp_stock = parseInt(temp) - 1
                                Schedule.findByIdAndUpdate(schedule_id,{allocated_amount:temp_stock},(err,newamount)=>{
                                    if (err){
                                        return res.json({success:false ,msg:'* Something happened'})   
                                    }else{
                                        return res.json({success: true, msg:'Booking suceess'}); 
                                    }
                                })
                            }
                        }
                    })
                    //return res.json({success: true, msg:'Booking suceess'}); 
                }
            });
        }
    })
});


//@desc get booked list
router.get('/book/list/:id', (req, res, next) => {
    Booking.findBooking(req.params.id,(err, userbooking)=>{
        if(userbooking){
            return res.json(userbooking)
        }else{
            return res.find({success:false, msg:"Booking not found!"})
        }
    })
})

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
        Schedule.findSchedule(req.params.id,(err,hospitl)=>{
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

// @desc send comment to hospital
// @route post /users/feedback
router.post('/feedback/:id', function(req, res, next) {
    Booking.findLastBooking({hospital: req.params.id},(err,stock)=>{
        if(stock){
            if(parseInt(stock.available_stock)<=100){
                res.json({stock:stock.available_stock})
            }
        }
    })
})
module.exports = router;