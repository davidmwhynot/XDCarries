/*

	title: User.js
	desc: Database model for a User
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: TODO
	Created: 11/12/18
	Updated: 11/12/18

*/


/* XXX IMPORTS XXX */
const mongoose = require("mongoose");




/* XXX MAIN XXX */
const Schema = mongoose.Schema;

const User = new Schema({
  email: {
		type: String,
		required: true
	},
  password: {
		type: String,
		required: true
	}
});




/* XXX EXPORTS XXX */
module.exports = mongoose.model("User", User);
