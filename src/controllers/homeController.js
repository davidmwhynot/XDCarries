/*

	title: homeController.js
	desc: Controller for the home route
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: TODO
	Created: 11/12/18
	Updated: 11/12/18

*/


/* XXX IMPORTS XXX */
const router = require("express").Router();




/* XXX CONFIG XXX */
require('dotenv').config();




/* XXX ROUTER XXX */
/* GET home page. */
router.get('/', function(req, res) {
  res.render('home/index', { title: 'Home' });
});

/* GET about page. */
router.get('/about', function(req, res) {
  res.render('home/index', { title: 'About' });
});

/* GET contact page. */
router.get('/contact', function(req, res) {
  res.render('home/index', { title: 'Contact' });
});




/* XXX EXPORTS XXX */
module.exports = router;
