/*

	title: ProductModel.js
	desc: Database model for Products
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: TODO
	Created: 11/12/18
	Updated: 11/21/18

*/


/* XXX IMPORTS XXX */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;




/* XXX MAIN XXX */
const schema = new Schema({
	imagePath: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	}
});




/* XXX EXPORTS XXX */
module.exports = mongoose.model('Product', schema);
