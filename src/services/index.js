/*

	title: index.js
	desc: Index for services
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: TODO
	Created: 11/12/18
	Updated: 11/12/18

*/


/* XXX IMPORTS XXX */
const UserService = require('./UserService');
const OrderService = require('./OrderService');
const ProductService = require('./ProductService');

const {
	UserModel,
	OrderModel,
	ProductModel
} = require('../models');




/* XXX MAIN XXX */
const User = new UserService(UserModel);
const Order = new OrderService(OrderModel);
const Product = new ProductService(ProductModel);




/* XXX EXPORTS XXX */
module.exports = {
	User,
	Order,
	Product
}
