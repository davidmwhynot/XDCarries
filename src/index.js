/*

	title: index.js
	desc: Express application configuration
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: TODO
	Created: 11/12/18
	Updated: 11/12/18

*/


/* XXX IMPORTS XXX */
// vendor
const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');
const debug = require('debug')('TODO:server');

const express = require('express');
const validator = require('express-validator');
const bodyParser = require('body-parser');
const flash = require('connect-flash');

const session = require('express-session');
const store = require('connect-mongo')(session);
const passport = require('passport');

const favicon = require('serve-favicon');
const exphbs = require('express-handlebars');
const hbs = require('handlebars');

// custom middleware
const {
	passportConfig,
	dbConnect,
	message
} = require('./middleware');

// controllers
const {
	homeController,
	userController,
	shopController
} = require('./controllers');




/* XXX CONFIG XXX */
// handlebars views config
require('handlebars-helpers')(
	['comparison'],
	{
		handlebars: hbs
	}
);




/* XXX INIT XXX */
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');




/* XXX MIDDLEWARE XXX */
// morgan
app.use(logger('dev'));

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// view engine setup
app.engine('hbs', exphbs({
	defaultLayout: 'layout',
	layoutsDir: path.join(__dirname, 'views', '_layouts'),
	partialsDir: path.join(__dirname, 'views', '_partials'),
	extname: '.hbs'
}));

// bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// validator
app.use(validator());

// sessions
app.use(session({
	secret: 'secret',
	resave: false,
	store: new store({
		mongooseConnection: dbConnect.connection
	}),
	cookie: {
		maxAge: 180 * 60 * 1000
	},
	saveUninitialized: false
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

// flash messages
app.use(flash());

// set static folder
app.use(express.static(path.join(__dirname, '..', 'dist', 'pub')));




/* XXX GLOBALS XXX */
app.use((req, res, next) => {
	if(req.isAuthenticated()) {
		res.locals.username = req.user.email;
		res.locals.auth = true;
	} else {
		res.locals.auth = false;
	}

	res.locals.msgs_primary = req.flash('msg_primary');
	res.locals.msgs_secondary = req.flash('msg_secondary');
	res.locals.msgs_success = req.flash('msg_success');
	res.locals.msgs_info = req.flash('msg_info');
	res.locals.msgs_warning = req.flash('msg_warning');
	res.locals.msgs_danger = req.flash('msg_danger');
	req.flash('error').forEach((i) => {
		res.locals.msgs_danger.push(i);
	});

	res.locals.session = req.session;
	debug('============================================');
	debug('---------------- res.locals ----------------');
	debug(res.locals);
	debug('----------------- req.user -----------------');
	debug(req.user);
	debug('---------------- req.session ---------------');
	debug(req.session);
	debug('----------------- req.body -----------------');
	debug(req.body);
	debug('============================================');
	next();
});




/* XXX CONTROLLERS XXX */
app.use('/', homeController);
app.use('/user', userController);
app.use('/shop', shopController);




/* XXX ERRORS XXX */
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




/* XXX EXPORTS XXX */
module.exports = app;




/* XXX FUNCTIONS XXX */
