//var eventHubs = {
//	eventHubinFence: {
//		endpointHubName: 'sb://f-eventhub-prod.servicebus.windows.net/',
//		sharedAccessKeyName: 'infence_listen',
//		shareAccessKey: 'LeE07aCbU3y4GbS3k36WuY2uogwGwBgHKWVPR+7bTHA=',
//		entityPath: 'telemetryinfence'
//	},

//	eventHuboutFence: {
//		endpointHubName: 'sb://f-eventhub-prod.servicebus.windows.net/',
//		sharedAccessKeyName: 'notinfence_listen',
//		shareAccessKey: 'N6WY55FyGP6vxPh0jJmtvuZaEOsxlF7AyltV5rEZ0v8=',
//		entityPath: 'telemetrynotinfence'
//	}
//}


//////Do not remove this code
////for (var i = 0; i < Object.keys(eventHubs).length; i++) {

////	var connectionStringNotInFence = 'Endpoint=' + eventHubs.eventHuboutFence.endpointHubName +
////		';SharedAccessKeyName=' + eventHubs.eventHuboutFence.sharedAccessKeyName +
////		';SharedAccessKey=' + eventHubs.eventHuboutFence.shareAccessKey +
////		';EntityPath=' + eventHubs.eventHuboutFence.entityPath;


////	var connectionStringInFence = 'Endpoint=' + eventHubs.eventHubinFence.endpointHubName +
////		';SharedAccessKeyName=' + eventHubs.eventHubinFence.sharedAccessKeyName +
////		';SharedAccessKey=' + eventHubs.eventHubinFence.shareAccessKey +
////		';EntityPath=' + eventHubs.eventHubinFence.entityPath;

////	console.log(connectionStringNotInFence + '\n' + connectionStringInFence);

////	callHub(connectionStringNotInFence, connectionStringInFence);
////}


//var connectionStringNotInFence = 'Endpoint=' + eventHubs.eventHuboutFence.endpointHubName +
//	';SharedAccessKeyName=' + eventHubs.eventHuboutFence.sharedAccessKeyName +
//	';SharedAccessKey=' + eventHubs.eventHuboutFence.shareAccessKey +
//	';EntityPath=' + eventHubs.eventHuboutFence.entityPath;


//var connectionStringInFence = 'Endpoint=' + eventHubs.eventHubinFence.endpointHubName +
//	';SharedAccessKeyName=' + eventHubs.eventHubinFence.sharedAccessKeyName +
//	';SharedAccessKey=' + eventHubs.eventHubinFence.shareAccessKey +
//	';EntityPath=' + eventHubs.eventHubinFence.entityPath;



//function callHub() {


//	var printError= function (err) {
//	console.log(err.message);
//	};

//	var printMessageNotInFence = function (message) {
//		//console.log('Message received: NIF :');
//		//console.log(JSON.stringify(message.body));

//		publisher.publish('hub1:Outfence', JSON.stringify(message.body));
//		//console.log('');
//	};





//	var printMessageInFence = function (message) {
//		//console.log('Message received: IF :');
//		//console.log(JSON.stringify(message.body));
//		publisher.publish('hub1:Infence', JSON.stringify(message.body));
//		//console.log('');
//	};

//	console.log('creating..... fence');

//	var EventHubClient = require('azure-event-hubs').Client;

//	var clientNotInFence = EventHubClient.fromConnectionString(connectionStringNotInFence);

//	var clientInFence = EventHubClient.fromConnectionString(connectionStringInFence);

//	clientNotInFence.open()
//		.then(clientNotInFence.getPartitionIds.bind(clientNotInFence))
//		.then(function (partitionIds) {
//			return partitionIds.map(function (partitionId) {
//				return clientNotInFence.createReceiver('$Default', partitionId, { 'startAfterTime': Date.now() }).then(function (receiver) {
//					console.log('Created partition receiver: ' + partitionId)
//					receiver.on('errorReceived', printError);
//					receiver.on('message', printMessageNotInFence);
//				});
//			});
//		})
//		.catch(printError);


//	clientInFence.open()
//		.then(clientInFence.getPartitionIds.bind(clientInFence))
//		.then(function (partitionIds) {
//			return partitionIds.map(function (partitionId) {
//				return clientInFence.createReceiver('$Default', partitionId, { 'startAfterTime': Date.now() }).then(function (receiver) {
//					console.log('Created partition receiver: ' + partitionId)
//					receiver.on('errorReceived', printError);
//					receiver.on('message', printMessageInFence);
//				});
//			});
//		})
//		.catch(printError);
//}


//callHub();