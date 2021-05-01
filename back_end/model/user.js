const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/db');

// Users Schemma
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female','others'],
    },
    adhar_no: {
        type: String,
        required: true
    },
    phone_no: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirm:{
        type: String, //confirm doctor login only
        enum: ['0','1'],  
        //required: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
    },
    specialization: {
        type: String
    },
    login_type: {
        type:String,
        required: true,
        default: 'user',
        enum: ['user','doctor','admin'],
    },
    created_at: {
        type: Date,
        default: Date.now,
      },
});

const User = module.exports = mongoose.model('User', UserSchema);

//encrypt password
module.exports.addUser = async function(newUser, callback){
    const salt = await bcrypt.genSaltSync(10)
    
    newUser.password = await bcrypt.hashSync(newUser.password,salt)

    newUser.save(callback)
}
//check admin username
module.exports.getUserByUsername=function(username, callback){
    const query = {username: username}
    User.findOne(query, callback);
}

//check is user exist or not using aadhar
module.exports.getUserByAdhar = function(adhar_no, callback){
    const query = {adhar_no: adhar_no}
    User.findOne(query, callback);
}

//check is user exist or not using phone no
module.exports.getUserByPhone = function(phone_no, callback){
    const query = {phone_no: phone_no}
    User.findOne(query, callback);
}

//Decrypt password or compare password
module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
};

//check is doctor approved by hospital
module.exports.getDoctorLogin = function(phone_no, callback){
    const query = {phone_no: phone_no, confirm:"1"}
    User.findOne(query, callback);
}