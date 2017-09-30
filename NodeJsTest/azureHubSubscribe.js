const redis = require('redis');
const publisher = redis.createClient();


function grab(flag) {
	var index = process.argv.indexOf(flag);
	return (index === -1) ? null : process.argv[index + 1];
}

var endpointIn = grab('-epIn');
var keynameIn = grab('-knIn');
var keyIn = grab('-keyIn');
var entitypathIn = grab('-entpIn');

var endpointOut = grab('-epOut');
var keynameOut = grab('-knOut');
var keyOut = grab('-keyOut');
var entitypathOut = grab('-entpOut');

var subscriptionName = grab('-sname');

if (!endpointIn || !keynameIn || !keyIn || !entitypathIn || !endpointOut || !keynameOut || !keyOut || !entitypathOut || !subscriptionName) {

	console.log(process.argv);
	console.log("Blew it!!!");
}
else {
	console.log(process.argv);

	var eventHubs = {
		eventHubinFence: {
			subscriptionName: `${subscriptionName}`,
			endpointHubName: `${endpointIn}`,
			sharedAccessKeyName: `${keynameIn}`,
			shareAccessKey: `${keyIn }`,
			entityPath: `${entitypathIn}`
		},

		eventHuboutFence: {
			subscriptionName: `${subscriptionName}`,
			endpointHubName: `${endpointOut}`,
			sharedAccessKeyName: `${keynameOut}`,
			shareAccessKey: `${keyOut}`,
			entityPath: `${entitypathOut}`
		}
	}

	//console.log(JSON.stringify(eventHubs));
}

var connectionStringNotInFence = 'Endpoint=' + eventHubs.eventHuboutFence.endpointHubName +
	';SharedAccessKeyName=' + eventHubs.eventHuboutFence.sharedAccessKeyName +
	';SharedAccessKey=' + eventHubs.eventHuboutFence.shareAccessKey +
	';EntityPath=' + eventHubs.eventHuboutFence.entityPath;

var connectionStringInFence = 'Endpoint=' + eventHubs.eventHubinFence.endpointHubName +
	';SharedAccessKeyName=' + eventHubs.eventHubinFence.sharedAccessKeyName +
	';SharedAccessKey=' + eventHubs.eventHubinFence.shareAccessKey +
	';EntityPath=' + eventHubs.eventHubinFence.entityPath;

function callHub() {

	//console.log(connectionStringInFence + ' ' + connectionStringNotInFence);

	var printError = function (err) {
		console.log(err.message);
	};

	var printMessageNotInFence = function (message) {
		//console.log('Message received: NIF :');
		//console.log(JSON.stringify(message.body));
		publisher.publish(`${subscriptionName}:Outfence`, JSON.stringify(message.body));
		//console.log('');
	};

	var printMessageInFence = function (message) {
		//console.log('Message received: IF :');
		//console.log(JSON.stringify(message.body));
		publisher.publish( `${subscriptionName}:Infence`, JSON.stringify(message.body));
		//console.log('');
	};

	var EventHubClient = require('azure-event-hubs').Client;

	var clientNotInFence = EventHubClient.fromConnectionString(connectionStringNotInFence);

	var clientInFence = EventHubClient.fromConnectionString(connectionStringInFence);

	clientNotInFence.open()
		.then(clientNotInFence.getPartitionIds.bind(clientNotInFence))
		.then(function (partitionIds) {
			return partitionIds.map(function (partitionId) {
				return clientNotInFence.createReceiver('$Default', partitionId, { 'startAfterTime': Date.now() }).then(function (receiver) {
					console.log('Created partition receiver: ' + partitionId)
					receiver.on('errorReceived', printError);
					receiver.on('message', printMessageNotInFence);
				});
			});
		})
		.catch(printError);

	clientInFence.open()
		.then(clientInFence.getPartitionIds.bind(clientInFence))
		.then(function (partitionIds) {
			return partitionIds.map(function (partitionId) {
				return clientInFence.createReceiver('$Default', partitionId, { 'startAfterTime': Date.now() }).then(function (receiver) {
					console.log('Created partition receiver: ' + partitionId)
					receiver.on('errorReceived', printError);
					receiver.on('message', printMessageInFence);
				});
			});
		})
		.catch(printError);
}

callHub();