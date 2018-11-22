/*

	title: index.js
	desc: Index for custom middleware
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: TODO
	Created: 11/12/18
	Updated: 11/12/18

*/


/* XXX IMPORTS XXX */
const csurf = require('csurf');

const passportConfig = require('./passport');
const dbConnect = require('./dbConnect');
const isLoggedIn = require('./isLoggedIn');
const notLoggedIn = require('./notLoggedIn');




/* XXX EXPORTS XXX */
module.exports = {
	passportConfig,
	dbConnect,
	isLoggedIn,
	notLoggedIn,
	csurf: csurf()
}
