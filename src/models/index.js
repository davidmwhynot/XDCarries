/*

	title: index.js
	desc: Index for database models
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: TODO
	Created: 11/12/18
	Updated: 11/12/18

*/


/* XXX IMPORTS XXX */
const LoginModel = require('./LoginModel');
const UserModel = require('./UserModel');
const OrderModel = require('./OrderModel');
const CartModel = require('./CartModel');
const ProductModel = require('./ProductModel');




/* XXX EXPORTS XXX */
module.exports = {
	LoginModel,
	UserModel,
	OrderModel,
	CartModel,
	ProductModel
}
