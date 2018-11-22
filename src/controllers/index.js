/*

	title: index.js
	desc: Index for controllers
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: TODO
	Created: 11/12/18
	Updated: 11/12/18

*/


/* XXX IMPORTS XXX */
const homeController = require("./homeController");
const userController = require("./userController");
const shopController = require("./shopController");




/* XXX EXPORTS XXX */
module.exports = {
	homeController,
	userController,
	shopController
};
