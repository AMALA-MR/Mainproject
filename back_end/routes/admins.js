const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const bcrypt = require('bcryptjs');
const User = require('../model/user');
const Hospital = require('../model/hospital')
const Vaccine = require('../model/vaccine')
const Stock = require('../model/stock');

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

// @desc add new vaccine list
// @route post /admin/add/vaccine
router.post('/add/vaccine',(req,res,next)=>{
    let newVaccine = new Vaccine({
        vaccine_name: req.body.vaccine_name
    });
    Vaccine.addVaccine(newVaccine,(err,vaccine) =>{
        if(err){
            res.json({success: false, msg:'Failed adding new vaccine'})
        }else{
            res.json({success: true, msg:'Add new vaccine'})
        }
    })
})

// @desc add stock to hospitals
// @route post /admin/add/vaccine/hospital
router.post('/add/vaccine/hospital',(req,res,next)=>{
    const vaccine= req.body.vaccine;
    const hospital= req.body.hospital;
    const newStock = req.body.new_stock
    Stock.checkHospital(vaccine,hospital,(err,stock)=>{
        if(!stock){
            let newData = new Stock({
                vaccine: req.body.vaccine,
                hospital: req.body.hospital,
                available_stock:req.body.new_stock
            });
            Stock.addStock(newData,(err,stock) =>{
                if(err){
                    res.json({success: false, msg:'Failed adding new stock'})
                }else{
                    res.json({success: true, msg:'Add new stock'})
                }
            })
        }else{
            const available=stock.available_stock
            let total = parseInt(available) + parseInt(newStock)
            Stock.findOneAndUpdate({hospital:hospital,vaccine:vaccine},{available_stock: total},(error,newstock)=>{
            if (error){
                return res.json({success:false ,msg:'Data not found'})   
            }else{
               Stock.findOne({hospital:hospital,vaccine:vaccine},(err,stock)=>{
                    if(stock)
                    return res.json(stock).status(200)
                })
            }
            })
        }
    })
    
})

// @desc update the current stock to hospitals
// @route put /admin/add/vaccine/hospital/:id
router.put('/add/vaccine/hospital/:id',(req,res,next)=>{
    const newStock = req.body.new_stock
    Stock.findById(req.params.id,(err,stock)=>{
        if(!stock){
            return res.json({success:false ,msg:'id not found'})   
        }else{
            let available=stock.available_stock
            let total = parseInt(available) + parseInt(newStock)
            Stock.findByIdAndUpdate(req.params.id,{available_stock: total},(error,newstock)=>{
            if (error){
                return res.json({success:false ,msg:'id not found'})   
            }else{
                Stock.findById(req.params.id,(err,stock)=>{
                    if(stock)
                    return res.json(stock).status(200)
                })
            }
            })
        }
    })
})



// @desc update the current stock to hospitals
// @route put /admin/get/vaccine/stock
router.get('/get/vaccine/stock',(req,res,next)=>{
    //const newStock = req.body.new_stock
    Stock.getStock((err,stock)=>{
        if(!stock){
            return res.json({success:false ,msg:'id not found'})   
        }else{
            return res.json(stock).status(200)
        }
    })
})
module.exports = router;