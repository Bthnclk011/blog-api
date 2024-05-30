const methodOverride = require('method-override');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const mongoose = require('mongoose');
const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const Users = require('./models/Users');
require('dotenv').config();

const app = express();
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URL;

main().catch(err => console.log(err));

async function main()
{
  await mongoose.connect(mongoDB);
}

app.use(methodOverride('_method'))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const opts = {}
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

passport.use(new JWTStrategy(opts, async(jwt_payload, done) => 
{
  try
  { 
    const user = Users.findById(jwt_payload.sub);
    if(user)
    {
      return done(null, user)
    }

    else
    {
      return done(null, false)
    }
  }

  catch(err)
  {
    return done(err, false)
  }
      
}));

app.use(passport.initialize());
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
