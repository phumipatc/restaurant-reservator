const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please add a name'],
		unique: true,
		trim: true,
		maxlength: [50, 'Name can not be more than 50 characters']
	},
	address: {
		type: String,
		required: [true, 'Please add an address']
	},
	tel: {
		type: String,
		match: [
			/^\d{3}\d{3}\d{4}$/,
			'Please add a valid phone number'
		]
	},
	openTime: {
		type: String,
		required: [true, 'Please add an open time'],
		match: [
			/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
			'Please add a valid time'
		]
	},
	closeTime: {
		type: String,
		required: [true, 'Please add a close time'],
		match: [
			/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
			'Please add a valid time'
		]
	},
});

module.exports = mongoose.model('Restaurant', restaurantSchema);