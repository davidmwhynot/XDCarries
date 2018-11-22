const debug = require('debug')('TODO:server');
const Cart = require('../models/CartModel');




class OrderService {
	constructor(Order) {
		this.Order = Order;
		this.getOrders = this.getOrders.bind(this);
		this.create = this.create.bind(this);
	}

	// returns an array of orders cart with the users orders
	async getOrders(userId) {
		try {
			const orders = await this.Order.find({
				user: userId
			});
			let cart;
			orders.forEach((order) => {
				cart = new Cart(order.cart);
				order.items = cart.generateArray();
			});
			return orders;
		} catch(err) {
			// TODO: only throw certain types of errors
			debug(err);
			throw err;
		}
	}

	async create(order) {
		try {
			const newOrder = new this.Order(order);
			return await newOrder.save();
		} catch(err) {
			// TODO: only throw certain types of errors
			debug(err);
			throw err;
		}
	}

}

module.exports = OrderService;
