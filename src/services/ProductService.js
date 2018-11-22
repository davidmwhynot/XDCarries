const debug = require('debug')('TODO:server');




class ProductService {
	constructor(Product) {
		this.Product = Product;
		this.getProducts = this.getProducts.bind(this);
		this.getProduct = this.getProduct.bind(this);
	}

	// returns an array of all products
	async getProducts() {
		try {
			const prodcuts = await this.Product.find();
			return prodcuts;
		} catch(err) {
			// TODO: only throw certain types of errors
			debug(err);
			throw err;
		}
	}

	async getProduct(pid) {
		try {
			const product = await this.Product.findById(pid)
			return product;
		} catch(err) {
			// TODO: only throw certain types of errors
			debug(err);
			throw err;
		}
	}

}

module.exports = ProductService;
