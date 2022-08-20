 function enter1() 
{
    var chitChat = document.getElementById('messagebox1').value;
		if (chitChat.length > 0)
		{
			socket.emit('chitChat1', chitChat);
			document.getElementById('messagebox1').value = '';
		}
}
	  
function enter2() 
{
    var chitChat = document.getElementById('messagebox2').value;
		if (chitChat.length > 0)
		{
			socket.emit('chitChat2', chitChat);
			document.getElementById('messagebox2').value = '';
		}
}	  
	  
function updateMessages(div, convo, index)
{
		div.innerHTML = "<ul>";
		
		for (var i=0; i<convo.length; i++)
		{
			if (convo[i].index == index)
			{
				div.innerHTML += "<li>" + convo[i].message + "</li>";
			}
		}
		
		div.innerHTML += "</ul>";
		div.scrollTop = div.scrollHeight;
}
