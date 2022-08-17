
const http = require('http');

const requestListener = function (req, res) {
	if (req.method == 'GET' && (req.url == '/' || req.url == '/create'))
	{
    res.sendFile(__dirname+'/index.html');
	};
}


const server = http.createServer(requestListener);
server.listen(8000);
