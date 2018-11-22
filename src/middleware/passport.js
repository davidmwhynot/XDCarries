/*

	title: passport.js
	desc: Passport configuration middleware
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: TODO
	Created: 11/12/18
	Updated: 11/12/18

*/


/* XXX IMPORTS XXX */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const {
	User
} = require('../services');



/* XXX MAIN XXX */
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

passport.use('local.register', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, User.register));

passport.use('local.login', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, User.login));
