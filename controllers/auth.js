const User = require('../models/User');
const sendEmail = require('../config/mailer');

// @desc	Register user
// @route	POST /api/v1/auth/register
// @access	Public
exports.register = async (req, res, next) => {
	try {
		const {name, email, password, role} = req.body;

		const user = await User.create({
			name,
			email,
			password,
			role
		});

		// const token = user.getSignedJwtToken();
		// res.status(200).json({ success: true, token });
		sendTokenResponse(user, 200, res);
	} catch (err) {
		res.status(400).json({ success: false});
		console.log(err.stack);
	}
}

// @desc	Login user
// @route	POST /api/v1/auth/login
// @access	Public
exports.login = async (req, res, next) => {

	// Check for user
	try {
		const { email, password } = req.body;

		// Validate email & password
		if (!email || !password) {
			return res.status(400).json({ success: false, error: 'Please provide an email and password' });
		}
		
		const user = await User.findOne({ email }).select('+password');	

		if (!user) {
			return res.status(401).json({ success: false, error: 'Invalid credentials' });
		}
		
		// Check if password matches
		const isMatch = await user.matchPassword(password);
		if (!isMatch) {
			return res.status(401).json({ success: false, error: 'Invalid credentials' });
		}
	
		// Create token
		// const token = user.getSignedJwtToken();
		// res.status(200).json({ success: true, token });
		sendTokenResponse(user, 200, res);
	} catch (err) {
		return res.status(401).json({ success: false, error: 'Cannot convert email or password to string' });
	}
}

//@desc		Logout user / clear cookie
//@route	GET /api/v1/auth/logout
//@access	Private
exports.logout = async (req, res, next) => {
	res.cookie('token', 'none', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true
	});

	res.status(200).json({ success: true, data: {} });
}

const sendTokenResponse = (user, statusCode, res) => {
	const token = user.getSignedJwtToken();

	const options = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
		httpOnly: true
	};

	if (process.env.NODE_ENV === 'production') {
		options.secure = true;
	}

	res
		.status(statusCode)
		.cookie('token', token, options)
		.json({
			success: true,
			_id: user._id,
			name: user.name,
			email: user.email,
			token
		});
}

// @desc	Get current logged in user
// @route	GET /api/v1/auth/me
// @access	Private
exports.getMe = async (req, res, next) => {
	const user = await User.findById(req.user.id);
	res.status(200).json({ success: true, data: user });
}

// @desc	Forgot password
// @route	POST /api/v1/auth/forgotpassword
// @access	Public
exports.forgotPassword = async (req, res, next) => {
	const { email } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		return res.status(404).json({ success: false, error: 'User not found' });
	}

	try {
		const newPassword = Math.random().toString(36).slice(-8);
		// console.log(newPassword);

		const subject = 'Password reset';
		const text = `Your new password is ${newPassword}`;

		await sendEmail(email, subject, text);
		
		user.password = newPassword;
		await user.save();
		
		res.status(200).json({ success: true, data: 'Email sent' });
	} catch(err) {
		console.log(err);
		return res.status(500).json({ success: false, error: 'Email not sent' });
	}
}

// @desc	Change password
// @route	PUT /api/v1/auth/changepassword
// @access	Private
exports.changePassword = async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password');
	if (!user) {
		return res.status(404).json({ success: false, error: 'User not found' });
	}

	const { currentPassword, newPassword } = req.body;

	// Check current password
	if (!await user.matchPassword(currentPassword)) {
		return res.status(401).json({ success: false, error: 'Password is incorrect' });
	}

	user.password = newPassword;
	await user.save();
	sendTokenResponse(user, 200, res);
}