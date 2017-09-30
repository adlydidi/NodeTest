'use strict';

console.log("Running....");

const PORT = 3000;
const HOST = 'localhost';


var express = require('express');

var app = express();



var server = app.listen(3000);

app.use(express.static('public'));


const redis = require('redis');
const publisher = redis.createClient();


var socket = require('socket.io');

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);





//this information has to be retreived from database
var eventHubs = {
	eventHubinFence: {
		subscriptionName: 'hub1',
		endpointHubName: 'sb://f-eventhub-prod.servicebus.windows.net/',
		sharedAccessKeyName: 'infence_listen',
		shareAccessKey: 'LeE07aCbU3y4GbS3k36WuY2uogwGwBgHKWVPR+7bTHA=',
		entityPath: 'telemetryinfence'
	},

	eventHuboutFence: {
		subscriptionName: 'hub1',
		endpointHubName: 'sb://f-eventhub-prod.servicebus.windows.net/',
		sharedAccessKeyName: 'notinfence_listen',
		shareAccessKey: 'N6WY55FyGP6vxPh0jJmtvuZaEOsxlF7AyltV5rEZ0v8=',
		entityPath: 'telemetrynotinfence'
	}
}

io.sockets.on('connection', function (client) {
	const subscriber = redis.createClient();
	subscriber.subscribe(`${eventHubs.eventHubinFence.subscriptionName}:Infence`, `${eventHubs.eventHuboutFence.subscriptionName}:Outfence`); //    listen to messages from channel pubsub

	console.log('subscribed to pubsub');
	subscriber.on("message", function (channel, message) {
		//client.send(message);

		//console.log(message);

		//checks for unexpected JSON tokens
		try {
			var obj = JSON.parse(message);
		} catch (err) {

			//console.log(err);

			message = '{}';
			var obj = JSON.parse(message);
		}

		var mapData = {
			fence: channel,
			marker: obj.marker,
			lat: obj.latitude,
			lng: obj.longitude,
			compassdir: obj.targetcompassdir
		}

		//emit messages with marker information ONLY
		if (obj['marker'] != null) {
			//console.log('no marker');
			// client == (browser sessions) connected
			//client.broadcast.emit('hubData', mapData);
			//console.log(client.id);
			client.emit('hubData', mapData);
			//io.sockets.emit('hubData', mapData);
		}
	});

	//this is used to get the client data
	client.on('message', function (msg) {
		console.log("hello");
	});



	client.on('disconnect', function () {
		subscriber.quit();
	});
});

var spawn = require('child_process').spawn;

var cp = spawn("node", ["azureHubSubscribe",
	"-epIn",`${eventHubs.eventHubinFence.endpointHubName}`,
	"-knIn", `${eventHubs.eventHubinFence.sharedAccessKeyName}`,
	"-keyIn", `${eventHubs.eventHubinFence.shareAccessKey}`,
	"-entpIn", `${eventHubs.eventHubinFence.entityPath}`,
	"-epOut", `${eventHubs.eventHuboutFence.endpointHubName}`,
	"-knOut", `${eventHubs.eventHuboutFence.sharedAccessKeyName}`,
	"-keyOut", `${eventHubs.eventHuboutFence.shareAccessKey}`,
	"-entpOut", `${eventHubs.eventHuboutFence.entityPath}`,
	"-sname", `${eventHubs.eventHuboutFence.subscriptionName}`]);


cp.stdout.on("data", function (data) {
	console.log(`STDOUT ${data.toString()}`);
});