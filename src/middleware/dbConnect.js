/*

	title: dbConnect.js
	desc: Instantiate db connection
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: TODO
	Created: 11/12/18
	Updated: 11/12/18

*/


/* XXX IMPORTS XXX */
const mongoose = require('mongoose');




/* XXX CONFIG XXX */
require('dotenv').config();

// get application name to look up environment vars
const APPNAME = process.env.APPNAME;

// get db credentials
const CREDS = {
	host: process.env[APPNAME + '_DB_HOST'],
	user: process.env[APPNAME + '_DB_USERNAME'],
	password: process.env[APPNAME + '_DB_PASSWORD'],
	database: process.env[APPNAME + '_DB_DATABASE']
};

// construct db connection uri
const DB_URI = `mongodb://${CREDS.user}:${CREDS.password}@${CREDS.host}/${CREDS.database}`;




/* XXX MAIN XXX */
// init db connection
mongoose.connect(DB_URI, { useNewUrlParser: true });




/* XXX EXPORTS XXX */
module.exports = {
	connection: mongoose.connection
}
