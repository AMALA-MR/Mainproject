const express = require('express');
const path = require('path');
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override')
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')

// Load config
dotenv.config({ path: './config/config.env' })

connectDB();

const app = express();

const users = require('./routes/users');
const hospitals = require('./routes/hospitals')
const doctors = require('./routes/doctors')
const admin = require('./routes/admins')

// CORS Middleware

app.use(cors());

app.use(cors({
  origin:['http://localhost:4200','http://127.0.0.1:4200'],
  credentials:true
}));
 

// Ser Static Floder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Morgan- to see the request in terminal
if(process.env.NODE_ENV==='development'){
  app.use(morgan('dev'))
}

// Passport config
require('./config/passport')(passport);

// Sessions
app.use(
  session({
    secret: 'yoursecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
)


// Passport Middle ware
app.use(passport.initialize());
app.use(passport.session());



app.use('/users', users)
app.use('/hospital',hospitals)
app.use('/doctor',doctors)
app.use('/admin',admin)

// Index Route
app.get('/',(req,res) => {
    res.send('invalid');
});

// Port number
const PORT = process.env.PORT || 3000

//twilio
TWILIO_ACCOUNT_SID=  process.env.TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=  process.env.TWILIO_AUTH_TOKEN
TWILIO_FROM_PHONE=  process.env.TWILIO_FROM_PHONE


// Start server
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
