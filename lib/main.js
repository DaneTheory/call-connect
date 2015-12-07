'use strict';

var dotenv = require('dotenv');
var plivo = require('plivo');
var when = require('when');

dotenv.config({silent: true});

if (!process.env.PLIVO_AUTH_ID || !process.env.PLIVO_AUTH_TOKEN || !process.env.HOST_NUMBER || !process.env.HOST_PLIVO_ENDPOINT) {
	console.error('must provide PLIVO_AUTH_ID, PLIVO_AUTH_TOKEN, HOST_NUMBER, and HOST_PLIVO_ENDPOINT as environment variables');
	process.exit(1);
}

if (!process.argv[2]) {
	console.error('must provide initiator phone number');
	process.exit(1);
}
var initiator = process.argv[2];

// if (!process.argv[3]) {
// 	console.error('must provide recipient phone number');
// 	process.exit(1);
// }
// var recipient = process.argv[3];

var plivoApi = plivo.RestAPI({
	authId: process.env.PLIVO_AUTH_ID,
	authToken: process.env.PLIVO_AUTH_TOKEN
});

plivoApi.make_call({
	to: initiator,
	from: process.env.HOST_NUMBER,
	answer_url: process.env.HOST_PLIVO_ENDPOINT + '/join'
}, function (status, response) {
	if (status >= 200 && status < 300) {
		console.log('Successfully made call request.');
		console.log('Response:', response);
	} else {
		console.log('ERROR');
		console.log('Status:', status);
		console.log('Response:', response);
	}
});
// plivoApi.make_call({
// 	to: recipient,
// 	from: process.env.PLIVO_NUMBER,
// 	answer_url: ''
// });
