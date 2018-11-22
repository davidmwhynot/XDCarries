/*

	title: server.js
	desc: Entry point for node server application
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: TODO
	Created: 11/12/18
	Updated: 11/12/18

*/


/* XXX IMPORTS XXX */
// vendor
const http = require('http');
const debug = require('debug')('TODO:server');

// local
const app = require('./src');




/* XXX CONFIG XXX */
require('dotenv').config();

// get application name to look up environment vars
const APPNAME = process.env.APPNAME;

// get port from environment and store in express
const PORT = normalizePort(process.env[APPNAME + '_PORT'] || '3000');
app.set('port', PORT);

// set the environment type ('dev' or 'prod')
app.set('env', process.env[APPNAME + '_AREA']);




/* XXX MAIN XXX */
// create HTTP server
const server = http.createServer(app);

server.listen(PORT); // Listen on provided port, on all network interfaces.
server.on('error', onError); // register error handler
server.on('listening', onListening); // register event handler




/* XXX FUNCTIONS XXX */
// Normalize a port into a number, string, or false.
function normalizePort(val) {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

// Event listener for HTTP server 'error' event.
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof PORT === 'string' ?
		'Pipe ' + PORT :
		'Port ' + PORT;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

// Event listener for HTTP server 'listening' event.
function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string' ?
		'pipe ' + addr :
		'port ' + addr.port;
	debug('Listening on ' + bind);
}
