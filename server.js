const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// http.createServer(function(request, response) {
//   // response.writeHead(200, {"Content-Type": "text/plain"});
//   // response.write("Finally! Hello World!");
//   // response.end();
//   response.sendFile(__dirname+'/css/styles.css');
// }).listen(process.env.PORT);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('*/css/styles.css', (req, res) => {
  res.sendFile(__dirname + '/css/styles.css');
});



server.listen(process.env.PORT, () => {
  console.log('Listening on process.env.PORT');
});
