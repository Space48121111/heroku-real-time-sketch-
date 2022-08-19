      var canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      var socket = io();
      var x;
      var y;
      var pixels = [];
      var startX;
      var startY;
      var isDrawing = false;

      function enter1() {
        var chitChat = document.getElementById('messagebox1').value;
		if (chitChat.length > 0)
		{
			socket.emit('chitChat1', chitChat);
			document.getElementById('messagebox1').value = '';
		}
      }
	  
      function enter2() {
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

      socket.on('messages', function(convo) 
	  {
		var div1 = document.getElementById("messages1");	
		updateMessages(div1, convo, 1);
		var div2 = document.getElementById("messages2");	
		updateMessages(div2, convo, 2);
      })

      document.addEventListener('keydown', (event) => {
        if (event.key == 'Enter') {
          enter1();
		  enter2();
        }
      }, false);


      socket.on('pixels', function(message) {
        pixels = message;
        sketch();
      } )

      function mouseEvent() {
        socket.emit('draw', x+':'+y);
      }
      function mouseMovement(e) {
        var rect = canvas.getBoundingClientRect();
        // canvas relative pos from the screen
        // global absolute position rect --> local x y
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }

      function sketch() {
        // clear the screen as soon as rec'd message from the server
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (i=0; i<pixels.length; i++) {
          // ctx.fillStyle = 'black';
          // ctx.beginPath();
          // ctx.rect(pixels[i].pixelX, pixels[i].pixelY, 1, 1)
          // ctx.fill();
          ctx.strokeStyle = 'black';
          ctx.beginPath();
          ctx.moveTo(pixels[i].startX, pixels[i].startY);
          ctx.lineTo(pixels[i].x, pixels[i].y);
          ctx.stroke();
        }
      }

      function startDrawing() {
        startX = x;
        startY = y;
        isDrawing = true;


      }
      // keep track of the mouse pos
      function stopDrawing() {
        isDrawing = false;

      }

      function clear() {
        console.log('clear');
        socket.emit('clear');
      }
      document.getElementById('clear').addEventListener('click', clear);

      function frame() {
        if (isDrawing && (startX != x || startY != y)) {
          socket.emit('line', startX+":"+startY+':'+x+':'+y);
          startX = x;
          startY = y;
        }
      }


      setInterval(function (){
        frame()
      }, 50);
