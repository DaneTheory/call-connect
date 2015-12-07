'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var lib = require('./lib.js');
var plivo = require('plivo');

var app = express();

if (!process.env.PLIVO_AUTH_ID || !process.env.PLIVO_AUTH_TOKEN || !process.env.HOST_NUMBER || !process.env.HOST_PLIVO_ENDPOINT) {
	console.error('must provide PLIVO_AUTH_ID, PLIVO_AUTH_TOKEN, HOST_NUMBER, and HOST_PLIVO_ENDPOINT as environment variables');
	process.exit(1);
}

var port = process.env.PLIVO_ENDPOINT_PORT || process.env.PORT || 80;

var plivoApi = plivo.RestAPI({
	authId: process.env.PLIVO_AUTH_ID,
	authToken: process.env.PLIVO_AUTH_TOKEN
});

app.use(bodyParser.urlencoded({extended: true}));

app.all('/plivo-endpoint/join', function(req, res) {
	console.log('Content-Type', req.get('Content-Type'));
	console.log('req.query', req.query);
	console.log('req.body', req.body);
	
	var plivoResponse = plivo.Response();
	
	if (req.query.participant === 'initiator') {
		plivoResponse.addSpeak('connecting');
	}
	plivoResponse.addConference(req.query.conference);
	
	res.set('Content-Type', 'text/xml');
	res.send(plivoResponse.toXML());
});

app.all('/plivo-endpoint/message', function(req, res) {
	console.log('Content-Type', req.get('Content-Type'));
	console.log('req.query', req.query);
	console.log('req.body', req.body);
	
	var initiator = req.body.From;
	
	// the txt message stripped to just numbers
	var msg = req.body.Text.replace(/[^0-9]/g, '');
	
	var recipient = msg.match(/^1\d{10}$/) && recipient
		|| msg.match(/^\d{10}$/) && ('1' + recipient)
		|| msg.match(/^\d{7}$/) && ('1613' + recipient)
	;
	
	if (recipient && msg.match(/^1900/)) {
		recipient = false;
	}
	
	if (recipient) {
		lib.proxyCall(plivoApi, initiator, recipient);
	}
	
	var plivoResponse = plivo.Response();
	
	res.set('Content-Type', 'text/xml');
	res.send(plivoResponse.toXML());
});

app.listen(port);
