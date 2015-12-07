'use strict';

var express = require('express');
var plivo = require('plivo');

var app = express();

var port = process.env.PLIVO_ENDPOINT_PORT || process.env.PORT || 80;

app.all('/plivo-endpoint/join', function(req, res) {
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
	console.log('req.query', req.query);
	console.log('req.body', req.body);
	
	var plivoResponse = plivo.Response();
	
	res.set('Content-Type', 'text/xml');
	res.send(plivoResponse.toXML());
});

app.listen(port);
