const bcrypt = require('bcrypt');
const debug = require('debug')('TODO:server');




class UserService {
	constructor(User) {
		this.User = User;
		this.deserializeUser = this.deserializeUser.bind(this);
		this.login = this.login.bind(this);
		this.register = this.register.bind(this);
		this.authenticate = this.authenticate.bind(this);
		this.saveUser = this.saveUser.bind(this);
		this.getUser = this.getUser.bind(this);
		this.getUserById = this.getUserById.bind(this);
		this.getUserByEmail = this.getUserByEmail.bind(this);
	}

	async deserializeUser(id, done) {
		const user = await this.getUserById(id);
		done(null, {
			email: user.email,
			id: user._id
		});
	}

	async login(req, email, password, done) {
		req.checkBody('email', 'Invalid email').notEmpty().isEmail();
		req.checkBody('password', 'Invalid password').notEmpty();
		const errors = req.validationErrors();
		if (errors) {
			const messages = [];
			errors.forEach((error) => {
				messages.push(error.msg);
			});
			return done(null, false, req.flash('error', messages));
		}
		let user = await this.getUserByEmail(email);
		if (!user)
			return done(null, false, {
				message: 'Invalid username or password.'
			});
		else {
			if (!(await this.authenticate(password, user.password)))
				return done(null, false, {
					message: 'Invalid username or password.'
				});
			else return done(null, user);
		}
	}

	async register(req, email, password, done) {
		req.checkBody('email', 'Invalid email').notEmpty().isEmail();
		req.checkBody('password', 'Invalid password').notEmpty().isLength({
			min: 4
		}); // TODO: zxcvbn
		const errors = req.validationErrors();
		if (errors) {
			const messages = [];
			errors.forEach((error) => {
				messages.push(error.msg);
			});
			return done(null, false, req.flash('msg_danger', messages));
		}

		if (await this.getUserByEmail(email))
			return done(null, false, {
				message: 'E-Mail address is already in use.'
			});
		else {
			const newUser = new this.User({
				email: email,
				password: await this.encryptPassword(password)
			});
			const savedUser = await this.saveUser(newUser);
			return done(null, savedUser);
		}
	}

	async authenticate(password, hash) {
		return await bcrypt.compare(password, hash);
	}

	async saveUser(user) {
		return await user.save();
	}

	async getUser(email, password) {
		return await this.User.findOne({ email, password });
	}

	async getUserById(userId) {
		return await this.User.findById(userId);
	}

	async getUserByEmail(email) {
		return await this.User.findOne({'email': email});
	}

	serializeUser(user, done) {
		done(null, user.id);
	}

	async encryptPassword(password) {
		return await bcrypt.hash(password, 10);
	}
}

module.exports = UserService;
