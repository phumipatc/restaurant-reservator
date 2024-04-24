const nodemailer = require('nodemailer');

function sendEmail(email, subject, text) {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: process.env.EMAIL,
			clientId: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			refreshToken: process.env.REFRESH_TOKEN
		},
		tls: {
			rejectUnauthorized: false
		}
	});

	const mailData = {
		from: process.env.EMAIL,
		to: email,
		subject: subject,
		text: text,
	};
	// console.log(mailData);

	transporter.sendMail(mailData, (err, info) => {
		if (err) {
			console.log(err);
		} else {
			console.log('Email sent');
		}
	});
}

module.exports = sendEmail;