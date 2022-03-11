const config = require('./lib/config');
const express = require('express');
const logger = require('morgan');
const session = require('express-session');
const store = require('connect-loki');
const app = express();
app.disable('x-powered-by');
const LokiStore = store(session);
const indexRouter = require('./components/search/indexAPI.js');
const searchRouter = require('./components/search/searchAPI.js');
const usersRouter = require('./components/users/usersAPI.js');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(logger('common'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const setSecure = () => {
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1)
    return true;
  } else {
    return false;
  }
}

app.use(session({
  cookie: {
    httpOnly: true,
    path: '/',
    secure: setSecure(),
  },
  name: 'coredb-session-id',
  resave: true,
  saveUninitialized: true,
  secret: config.SECRET,
  store: new LokiStore({}),
}));

app.use((req, res, next) => {
  // res.locals.signedIn = req.session.signedIn;
  // res.locals.adminLoggedIn = req.session.adminLoggedIn;
  res.locals.address = req.session.address;
  res.locals.zipcode = req.session.zipcode;
  res.locals.radius = req.session.radius;
  res.locals.eligibilityMsg = req.session.eligibilityMsg;
  res.locals.claimMsg = req.session.claimMsg; 
  res.locals.firstname = req.session.firstname;
  res.locals.lastname = req.session.lastname;
  res.locals.email = req.session.email;
  res.locals.username = req.session.username;
  next();
});

app.use('/', indexRouter);
app.use('/search', searchRouter);
app.use('/users', usersRouter);

app.use((err, req, res, _next) => {
  console.log('Server Error Handler: ', err);
  res.status(404).send(err.message);
});

module.exports = app;