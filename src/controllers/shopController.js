/*

	title: shopController.js
	desc: Controller for the shop route
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: TODO
	Created: 11/12/18
	Updated: 11/21/18

*/


/* XXX IMPORTS XXX */
const router = require('express').Router();
const csurf = require('csurf');
const debug = require('debug')('TODO:server');

const Cart = require('../models/CartModel');

const {
	User,
	Product,
	Order
} = require('../services');




/* XXX CONFIG XXX */
const csurfProtection = csurf();
router.use(csurfProtection);

require('dotenv').config();
const APPNAME = process.env.APPNAME;

const STRIPE_PUBLIC = process.env[APPNAME + '_STRIPE_PUBLIC'];
const STRIPE_SECRET = process.env[APPNAME + '_STRIPE_SECRET'];
const stripe = require('stripe')(STRIPE_SECRET);




/* XXX ROUTES XXX */
/* GET shop page. */
router.get('/', async (req, res) => {
	try {
		const products = await Product.getProducts();
		res.render('shop/index', {
			title: 'Shop',
			products: products
		});
	} catch(err) {
		res.render('shop/index', {
			title: 'Shop',
			error: error
		});
	}
});

/* GET checkout. */
router.get('/checkout', (req, res) => {
	if(req.session.cart) {
		let cart = new Cart(req.session.cart);
		res.render('shop/checkout', {
			title: 'Checkout',
			csrfToken: req.csrfToken(),
			pubKey: STRIPE_PUBLIC,
			total: cart.totalPrice
		});
	} else {
		res.redirect('/shop/cart');
	}
});

/* POST checkout. */
router.post('/checkout', async (req, res) => {
	if(req.session.cart) {
		let cart = new Cart(req.session.cart);
		if(req.isAuthenticated()) {
			let cusName = '';
			let cusAddress = {};
			if(req.body['shipping-address-same-as-billing'] === 'on') {
				cusName = `${req.body['billing-first-name']} ${req.body['billing-last-name']}`;
				cusAddress.line1 = req.body['billing-address-1'];
				cusAddress.line2 = req.body['billing-address-2'];
				cusAddress.city = req.body['billing-city'];
				cusAddress.country = req.body['billing-country'];
				cusAddress.state = req.body['billing-state'];
				cusAddress.postal_code = req.body['billing-zip'];
			} else {
				// TODO: must persist billing AND shipping address to database
				cusName = `${req.body['shipping-first-name']} ${req.body['shipping-last-name']}`;
				cusAddress.line1 = req.body['shipping-address-1'];
				cusAddress.line2 = req.body['shipping-address-2'];
				cusAddress.city = req.body['shipping-city'];
				cusAddress.country = req.body['shipping-country'];
				cusAddress.state = req.body['shipping-state'];
				cusAddress.postal_code = req.body['shipping-zip'];
			}
			// TODO: instead of always creating a new user, check if the currently logged in user has any purchases in the past and if so we can use the database to get their customer.id for stripe
			try {
				const customer = await stripe.customers.create({
					description: 'Customer for nodecart_t',
					email: req.user.email,
					source: req.body.stripeToken,
					shipping: {
						address: cusAddress,
						name: cusName
					}
				});

				const charge = await stripe.charges.create({
					amount: Math.round(cart.totalPrice * 100),
					currency: 'usd',
					description: 'Order at ' + APPNAME,
					customer: customer.id
				});

				// create new order and save to database
				const order = await Order.create({
					user: req.user.id,
					cart: cart,
					address: cusAddress,
					name: cusName,
					paymentId: charge.id
				});

				req.session.cart = null;
				res.render('shop/success', {
					title: 'Success',
					cart: cart,
					charge: charge
				});
			} catch(err) {
				debug(err);
				if(err) req.flash('error', err.message);
				res.redirect('/shop/checkout');
			}
		} else {
			// TODO: process new user signup on checkout, if req was not authenticated
			debug('TODO: process new user signup on checkout, if req was not authenticated');
			req.flash('msg_secondary', 'TODO: process new user signup on checkout, if req was not authenticated');
			res.redirect('/shop/checkout');
		}
	} else {
		res.redirect('/shop/cart');
	}
});

/* GET shop cart. */
router.get('/cart', (req, res) => {
	if(req.session.cart) {
		let cart = new Cart(req.session.cart);
		res.render('shop/cart', {
			title: 'Cart',
			products: cart.generateArray(),
			totalPrice: cart.totalPrice
		});
	} else {
		res.render('shop/cart', {
			title: 'Cart',
			products: null
		});
	}
});

/* GET shop cart add. */
router.get('/cart/add/:pid', async (req, res) => {
	try {
		let pid = req.params.pid;
		let cart = new Cart(req.session.cart ? req.session.cart : {});
		const product = await Product.getProduct(pid);
		cart.add(product, product.id);
		req.session.cart = cart;
		res.redirect('/shop');
	} catch(err) {
		debug(err);
		req.flash('error', err.message);
		res.redirect('/shop');
	}
});

/* GET shop cart delete one. */
router.get('/cart/delete/one/:pid', (req, res) => {
	let pid = req.params.pid;
	let cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.deleteOne(pid); // TODO: test edge case (empty cart)
	req.session.cart = cart;
	res.redirect('/shop/cart');
});

/* GET shop cart delete all. */
router.get('/cart/delete/all/:pid', (req, res) => {
	let pid = req.params.pid;
	let cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.deleteAll(pid); // TODO: test edge case (empty cart)
	req.session.cart = cart;
	res.redirect('/shop/cart');
});

/* GET shop product. */
router.get('/product/:pid', async (req, res) => {
	let pid = req.params.pid;
	try {
		let product = await Product.getProduct(pid);
		res.render('shop/product', {
			title: product.title,
			product: product
		});
	} catch(err) {
		req.flash('error', err.message);
		res.redirect('/shop');
	}
});




/* XXX EXPORTS XXX */
module.exports = router;
