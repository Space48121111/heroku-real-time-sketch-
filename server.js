const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var pixels = [];
var convo = [];
const fs1 = require('fs');
const fs = require('fs').promises;

function loadMessages()
{
	var doesExist = fs1.existsSync(__dirname + "/messages.json");
	if (doesExist)
	{
		fs.readFile(__dirname + "/messages.json")
		.then(contents => {
			convo = JSON.parse(contents);
		})
	}
}

loadMessages();

function saveMessages()
{
	fs.writeFile('messages.json', JSON.stringify(convo), function(err) {
		if (err) throw err;
		// return true;
	});
}

function transmitMessages() {
  // send messages to all the users
  io.emit('messages', convo);
}

function drawLine(startX, startY, x, y) {
  var obj = {
    startX: startX,
    startY: startY,
    x: x,
    y: y
  }
  pixels.push(obj);
  io.emit('pixels', pixels);
}


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.js');
});

app.get('*/css/styles.css', (req, res) => {
  res.sendFile(__dirname + '/css/styles.css');
});

function receiveMessage(message, index, id)
{
	var newMessage = {
		message: message,
		id: id,
		index: index
	};
  
	convo.push(newMessage);
	saveMessages();
	// chatting part
	transmitMessages();
}

io.on('connection', (socket) => {
  console.log('A user has connected.');
  io.emit('pixels', pixels);
  // when a new user enters, it will join the chat.
  transmitMessages();
  // socket.on('draw', (message) => {
  //   var pos = message.split(':'); // x+':'+y divide x y into an array [x, y]
  //   var intX = parseInt(pos[0]);
  //   var intY = parseInt(pos[1]);
  //   drawPixels(intX, intY);
  // })
  // message: startX+":"+startY+':'+x+':'+y

  socket.on('chitChat1', (message) => {
	receiveMessage(message, 1, socket.id);
  })
  
  socket.on('chitChat2', (message) => {
	receiveMessage(message, 2, socket.id);
  })  

  socket.on('line', (message) => {
    console.log(message);
    var pos = message.split(':'); // x+':'+y divide x y into an array [x, y]
    drawLine(pos[0], pos[1], pos[2], pos[3]);
  });
  socket.on('clear', () => {
    pixels = [];
    // send updated to the client
    io.emit('pixels', pixels);
    console.log("Rec'd");
  });
  socket.on('disconnect', () => {
    console.log('A user has disconnected.');
  });
});

server.listen(process.env.PORT, () => {
  console.log('Listening on ' + process.env.PORT);
});
