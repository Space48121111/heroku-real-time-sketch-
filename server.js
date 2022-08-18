
const http = require('http');

http.createServer(function(request, response) {
  // response.writeHead(200, {"Content-Type": "text/plain"});
  // response.write("Finally! Hello World!");
  // response.end();
  response.sendFile(__dirname+'/css/styles.css');
}).listen(process.env.PORT);
