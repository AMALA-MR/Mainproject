const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const Hospital = require('../model/hospital');
const User = require('../model/user')
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
router.all('/register', function (req, res, next) {
    const name = req.body.name;
    let newHospital = new Hospital({
        name: req.body.name,
        city: req.body.city,
        district: req.body.district,
        state: req.body.state,
        pincode: req.body.pincode,
        type: req.body.type,
        password: req.body.password
    });

    Hospital.getUserByName(name, (err, hospital) => {
        if (err) throw err;
        if (hospital) {
            return res.json({ success: false, msg: 'Already have an account' });
        }

        Hospital.addHospital(newHospital, (err, hospital) => {
            if (err) {
                //console.log(err)
                res.json({ success: false, msg: 'Failed to register hospital' });
            } else {
                res.json({ success: true, msg: 'Hospital registered, and send request to admin for approval' });
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
router.get('/approve/:id', (req, res, next) => {
    Hospital.getPendingConfirm(req.params.id, (err, hospital) => {
        if (err) throw err;
        if (!hospital) {
            return res.json({ success: false, msg: 'No pending doctors' })
        } else {
            return res.status(200).json(hospital)
        }
    })
})


// @desc approve doctor by hospital 
// @route put /hospital/approve/:id
router.put('/approve/:id', (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, { $set: req.body }, (error, doctor) => {
        if (!doctor) {
            return res.json({ success: false, msg: 'Not found id' })
        } else {
            return res.json({ success: true, msg: 'Approved' })
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


module.exports = router;