function findPlayer(id)
{
	for (var i=users.length-1; i>=0; i--)
	{
		if (users[i].id == id)
		{
			return i;
		}
	}
	
	return -1;
}

// detect how long the key is being pressed down
document.addEventListener('keydown', (event) => {
	
	var i = findPlayer(myID);
	if (i == -1)
		return;
	
	if (event.key == 'Enter') 
	{
        	enter1();
	}
	else if (event.key === "w") 
	{
		users[i].upPressed = true;
		socket.emit("up", true);
	}
	else if (event.key === "d") 
	{
		users[i].rightPressed = true;
		socket.emit("right", true);
	}
	else if (event.key === "s") 
	{
		users[i].downPressed = true;
		socket.emit("down", true);
	}
	else if (event.key === "a") 
	{
		users[i].leftPressed = true;
		socket.emit("left", true);
	}
}, false);

// detect how long the key is being pressed down
document.addEventListener('keyup', (event) => {

	var i = findPlayer(myID);
	if (i == -1)
		return;	
	
	if (event.key === "w") 
	{
		users[i].upPressed = false;
		socket.emit("up", false);
	}
	else if (event.key === "d") 
	{
		users[i].rightPressed = false;
		socket.emit("right", false);
	}
	else if (event.key === "s") 
	{
		users[i].downPressed = false;
		socket.emit("down", false);
	}
	else if (event.key === "a") 
	{
		users[i].leftPressed = false;
		socket.emit("left", false);
	}
}, false);
