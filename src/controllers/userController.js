/*

	title: userController.js
	desc: Controller for the user route
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: TODO
	Created: 11/12/18
	Updated: 11/12/18

*/


/* XXX IMPORTS XXX */
const passport = require('passport');
const express = require('express');

const {
	csurf,
	isLoggedIn,
	notLoggedIn
} = require('../middleware');
const {
	User,
	Order
} = require('../services');




/* XXX CONFIG XXX */
const router = express.Router();
router.use(csurf);




/* XXX ROUTES XXX */
/* GET user account. */
router.get('/', isLoggedIn, (req, res) => {
	res.render('user/index', {
		title: req.user.email
	});
});

/* GET user orders. */
router.get('/orders', isLoggedIn, async (req, res) => {
	try {
		const orders = await Order.getOrders(req.user.id);
		res.render('user/orders', {
			title: 'Orders',
			orders: orders
		});
	} catch(err) {
		if (err) {
			res.render('home/index', {
				title: 'Home'
			}); // TODO: handle errors gracefully
		} else {
			res.redirect('/');
		}
	}
});

/* GET user logout. */
router.get('/logout', isLoggedIn, (req, res) => {
	req.logout();
	req.flash('msg_info', 'Logged out successfully.')
	res.redirect('/');
});

/* PROTECT routes from authenticated users. */
router.use('/', notLoggedIn, (req, res, next) => {
	next();
});

/* GET user register. */
router.get('/register', function(req, res, next) {
	let messages = req.flash('msg_danger');
	res.render('user/register', {
		title: 'Register',
		csrfToken: req.csrfToken(),
		messages: messages,
		hasErrors: messages.length > 0
	});
});

/* POST user register. */
router.post(
	'/register',
	passport.authenticate('local.register', {
		failureRedirect: '/user/register',
		failureFlash: true
	}),
	(req, res, next) => {
		if (req.session.oldUrl) {
			let oldUrl = req.session.oldUrl;
			req.session.oldUrl = null;
			res.redirect(oldUrl);
		} else {
			res.redirect('/user/index');
		}
	}
);

/* GET user login. */
router.get('/login', (req, res) => {
	let messages = req.flash('error');
	res.render('user/login', {
		title: 'Login',
		csrfToken: req.csrfToken(),
		messages: messages,
		hasErrors: messages.length > 0
	});
});

/* POST user login. */
router.post(
	'/login',
	passport.authenticate('local.login', {
		failureRedirect: '/user/login',
		failureFlash: true
	}),
	(req, res, next) => {
		if (req.session.oldUrl) {
			let oldUrl = req.session.oldUrl;
			req.session.oldUrl = null;
			res.redirect(oldUrl);
		} else {
			res.redirect('/user/index');
		}
	}
);




/* XXX EXPORTS XXX */
module.exports = router;




/* XXX FUNCTIONS XXX */
