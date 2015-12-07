'use strict';

var express = require('express');
var plivo = require('plivo');

var app = express();

var port = process.env.PLIVO_ENDPOINT_PORT || 80;

app.get('/plivo-endpoint/join', function(req, res){
	var plivoResponse = plivo.Response();
	
	res.set('Content-Type', 'text/xml');
	
	console.log('req.query', req.query);
	
	plivoResponse.addSpeak('connecting');
	
	plivoResponse.addConference('call-connect');
	
	res.send(plivoResponse.toXML());
});

app.listen(port);
