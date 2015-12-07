'use strict';

var uuid = require('node-uuid');

module.exports = {
	proxyCall: function (plivoApi, initiator, recipient) {
		var conferenceName = uuid.v4();
		
		plivoApi.make_call({
			to: initiator,
			from: process.env.HOST_NUMBER,
			answer_url: process.env.HOST_PLIVO_ENDPOINT + '/join?participant=initiator&conference=' + conferenceName
		}, function (status, response) {
			if (status < 200 || status >= 300) {
				console.log('Initiator Error', status);
				console.log('Response:', response);
				return;
			}
			
			console.log('Initiator', response);
			
			// plivoApi.make_call({
			// 	to: recipient,
			// 	from: process.env.HOST_NUMBER,
			// 	answer_url: process.env.HOST_PLIVO_ENDPOINT + '/join?participant=recipient&conference=' + conferenceName'
			// }, function (status, response) {
			// 	if (status < 200 || status >= 300) {
			// 		console.log('Recipient Error', status);
			// 		console.log('Response:', response);
			// 		return;
			// 	}
				
			// 	console.log('Recipient', response);
			// });
		});
	}
};
