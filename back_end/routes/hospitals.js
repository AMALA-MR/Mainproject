const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const bcrypt = require('bcryptjs');
const Hospital = require('../model/hospital');
const User = require('../model/user')
const Schedule = require('../model/schedule')
const Stock =require('../model/stock')

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
        type: req.body.type,
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
            res.json({success: true, msg:'Hospital registered, and send request to admin for approval'});
            //const token = jwt.sign(hospital.toJSON(), process.env.JWT_KEY,{
            //    expiresIn: 604800 // one week
            //});
            //res.json({
            //    success: true, token: 'JWT '+token,
            //    user:{
            //        id: hospital._id,
            //        name: hospital.name,
            //        login_type:"hospital"
            //    }
            //});
        }
    });
    });
});


// @desc view doctor pending confirmation list 
// @route get /hospital/approve
router.get('/approve/:id',(req,res,next)=>{    
        Hospital.getPendingConfirm(req.params.id,(err, hospital)=> {
            if(err) throw err;
            if(!hospital){
                return res.json({success: false, msg:'No pending doctors'})
            }else {
                return res.status(200).json(hospital)
            }
        })   
    })


// @desc approve doctor by hospital 
// @route put /hospital/approve/:id
router.put('/approve/:id',(req,res,next)=>{
    User.findByIdAndUpdate(req.params.id,{$set: req.body},(error,doctor)=>{
        if (!doctor){
            return res.json({success:false ,msg:'Not found id'})   
        }else{
            return res.json({success:true,msg:'Approved'})
        }
    })
})


// @desc vaccine list
// @route get /hospital/vaccine/list/:id
router.get('/vaccine/list/:id', (req, res, next) => {
    Stock.getStockVaccine(req.params.id,(err, vaccine) => {
        if (err) throw err;
        if (!vaccine) {
            return res.json({ success: false, msg: 'their is no vaccine' })
        } else {
            return res.status(200).json(vaccine)
        }
    })
})

// @desc approved hospital list
// @route get /hospital/list
router.get('/list', (req, res, next) => {
    Hospital.getHospital((err, hospital) => {
        // console.log(hospital)
        if (err) throw err;
        if (!hospital) {
            return res.json({ success: false, msg: 'No hosptials' })
        } else {
            return res.status(200).json(hospital)
        }
    })
})


// @desc add schedule vaccinations
// @route post /hospital/add/schedule
router.post('/add/schedule',(req,res,next)=>{
    const vaccine= req.body.vaccine;
    const hospital= req.body.hospital;
    const allocated_amount = req.body.allocated_amount
    const date = req.body.date;
    const slot=req.body.slot;

    let newSchedule = new Schedule({
        hospital: req.body.hospital,
        vaccine:req.body.vaccine,
        allocated_amount: req.body.allocated_amount,
        date: req.body.date,
        slot: req.body.slot
    });
    Schedule.findOne({vaccine:vaccine, hospital:hospital,date:date,slot:slot},(err,schedules)=>{
        if(schedules){
            res.json({success: false, msg:'* Record already found'})
        }else{
            Stock.checkHospital(vaccine,hospital,(err,stock)=>{
                if(!stock){
                    res.json({success: false, msg:'* Record not found'})
                }else{
                    const temp=stock.temp_stock
                    if (parseInt(temp)<parseInt(allocated_amount))
                    {
                        res.json({success: false, msg:'* Only '+temp+' stock is avaliable'})
                    }else{
                        let temp_stock = parseInt(temp) - parseInt(allocated_amount)
                        Stock.findOneAndUpdate({hospital:hospital,vaccine:vaccine},{temp_stock:temp_stock},(error,newstock)=>{
                            if (error){
                                return res.json({success:false ,msg:'* Data not found'})   
                            }else{
                                Schedule.addSchedule(newSchedule,(err,data) =>{
                                    if(err){
                                        res.json({success: false, msg:'* Failed adding new schedule'})
                                    }else{
                                        return res.json({success: true, data}).status(200)
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    })
    //res.json({success: true, msg:'new shedule created'})
})


// @desc view schedule vaccinations
// @route get /hospital/view/schedule/:id
router.get('/view/schedule/:id',(req,res,next)=>{
    Schedule.viewSchedule(req.params.id,(err, schedules) => {
        if (err) throw err;
        if (!schedules) {
            return res.json({ success: false, msg: 'No Schedules Found' })
        } else {
            return res.status(200).json(schedules)
        }
    })
})
module.exports = router;