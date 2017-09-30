var socket;
var json;

function setup() {
	createCanvas(400, 400);
	background(200, 200, 0);

	socket = io.connect('http://localhost:3000');

	socket.on('hubData', mapUpdate);

	socket.on('connect_error', serverError);
}


function mapUpdate(mapData) {
		
	console.log(mapData);
}


function serverError() {
	//console.log('server error');
}

function draw() {
    ellipse(mouseX, mouseY, 10, 10);
}