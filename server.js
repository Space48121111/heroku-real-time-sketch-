
const http = require('http');

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Finally! Hello World!");
  response.end();
}).listen(process.env.PORT);
