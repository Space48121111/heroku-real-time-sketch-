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

const v = require("./serverVariables.js");
var sp = require("./serverPlayer.js");
var todo = [];
var isChecked = [];

const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI;

// define the first route
app.get("/api/movie", async function (req, res) {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  
  try {
    await client.connect();

    const database = client.db('sample_mflix');
    const collection = database.collection('movies');

    // Query for a movie that has the title 'Back to the Future'
    const query = { genres: "Comedy", poster: { $exists: true } };
    const cursor = await collection.aggregate([
      { $match: query },
      { $sample: { size: 1 } },
      { $project: 
        {
          title: 1,
          fullplot: 1,
          poster: 1
        }
      }
    ]);

    const movie = await cursor.next();

    return res.json(movie);
  } catch(err) {
    console.log(err);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

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

var allowedFiles = ["/Asteroid.html", "/home.js", "/variables.js", "/css/styles.css", "/input.js", "/clientPlayer.js",  "/utilFuncs.js", "/background.webp", "/messages.js", "/sidenav.js", '/todo.js'];

function FindFile(req)
{
	for (var i=0; i<allowedFiles.length; i++)
	{
		if (req.includes(allowedFiles[i]))
			return allowedFiles[i];
	}

	return "";
}

//Add all the allowed files
for (var i=0; i<allowedFiles.length; i++)
{
	app.get('*' + allowedFiles[i], (req, res) => {
		var fileName = FindFile(req.originalUrl);
		if (fileName.length > 0)
		{
  			res.sendFile(__dirname + fileName);
		}
		console.log("Requesting file:" + fileName);
	});
}

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


function addPlayer(id)
{
	var newPlayer =
	{
		x: 100,
		y: 100,
		angle: 0,
		velocityX: 0,
		velocityY: 0,
		upPressed: false,
		rightPressed: false,
		downPressed: false,
		leftPressed: false,
		id: id,
		score: 0
	};

	v.users.push(newPlayer);
}

function removePlayer(id)
{
	for (var i=v.users.length-1; i>=0; i--)
	{
		if (v.users[i].id == id)
		{
				v.users.splice(i, 1);
				break;
		}
	}
}

function findPlayer(id)
{
	for (var i=v.users.length-1; i>=0; i--)
	{
		if (v.users[i].id == id)
		{
			return i;
		}
	}

	return -1;
}

function transmitTodo() 
{
	io.emit('todo', todo);
	io.emit('isChecked', isChecked);
}

io.on('connection', (socket) => {
  console.log('A user has connected.');
  io.emit('pixels', pixels);
  
  // when a new user enters, it will join the chat.
  transmitMessages();
  transmitTodo();

  addPlayer(socket.id);
  socket.emit("id", socket.id);
  
  socket.on('addTodo', (message) => {
  	todo.push(message);
	// uncheck the task
	isChecked.push(false); 
	transmitTodo();
	})
  socket.on('isChecked', (message) => {
  	var ck = message.split(':');
	// 1:true
	isChecked[ck[0]] = ck[1];
	transmitTodo();
  })

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
    removePlayer(socket.id);
  });

	socket.on('up', (msg) =>
	{
		var i = findPlayer(socket.id);
		if (i != -1)
		{
			v.users[i].upPressed = msg;
		}
	});

	socket.on('down', (msg) =>
	{
		var i = findPlayer(socket.id);
		if (i != -1)
		{
			v.users[i].downPressed = msg;
		}
	});

	socket.on('right', (msg) =>
	{
		var i = findPlayer(socket.id);
		if (i != -1)
		{
			v.users[i].rightPressed = msg;
		}
	});

	socket.on('left', (msg) =>
	{
		var i = findPlayer(socket.id);
		if (i != -1)
		{
			v.users[i].leftPressed = msg;
		}
	});
});


//
function serverFrame()
{
	for (var i=0; i<v.users.length; i++)
	{
			sp.updateMovement(i);
			sp.updateRotation(i);
	}

	var outUsers = [];
	for (var i=0; i<v.users.length; i++)
	{
		var outUser =
		{
			x: v.users[i].x,
			y: v.users[i].y,
			angle: v.users[i].angle,
			id: v.users[i].id,
			score: v.users[i].score
		};

		outUsers.push(outUser);
	}

	io.emit("users", outUsers);
}

setInterval(function(){
  serverFrame();
}, 50);

server.listen(process.env.PORT, () => {
  console.log('Listening on ' + process.env.PORT);
});
