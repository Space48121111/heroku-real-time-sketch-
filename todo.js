var todo = ['Please take care of urself.'];
var isShown = false;
var isChecked = [false];
var isAdding = false;

// set client todo to server emitted todo task
socket.on('todo', function(task) 
	  {
		todo = task;		
      })
socket.on('isChecked', function(task) 
{
  isChecked = task;
  // after receiving both todo and ischecked
  updatels();

})
      
function updatels() {
  var ls = document.getElementById('todo');
  ls.innerHTML = '';
  ls.innerHTML += '<b>Todo: </b>';
  ls.innerHTML += '<ul>';

  for (var i=0; i<todo.length; i++)
  {
    if (isChecked[i])
    {
      ls.innerHTML += '<li><font color="green">' + todo[i] + '</font>';
    }
    else
    {
      ls.innerHTML += '<li>' + todo[i]
    }

    if (isChecked[i])
    {
      ls.innerHTML += '<button type="button" name="button" onclick=checked('+i+')>UnCheck</button>';

    }
    else
    {
      ls.innerHTML += '<button type="button" name="button" onclick=checked('+i+')>Checked</button>';

    }
    ls.innerHTML += '</li>';
  }
    ls.innerHTML += '</ul><br>';
    ls.innerHTML +=  '<button type="button" name="button"id="showmore" onclick=showmore()>Show More</button><br>';
    if (isAdding)
    {
      ls.innerHTML +=  '<button type="button" name="button"id="getTodo" onclick=getTodo()>Send</button>';
      ls.innerHTML +=  '<input type="text" id="addTodo" rows="40" cols="40"></input>';
    }
    else
    {
      ls.innerHTML +=  '<button type="button" name="button"id="add" onclick=add()>Add</button>';
    }

}

function showmore() {
  isShown = true;
  updatels();
}
updatels();

function add() {
  isAdding = true;
  updatels();
}

function getTodo() {
  var str = document.getElementById('addTodo').value;

  if (str.length > 0)
  {
     socket.emit('addTodo', str+' ');
     console.log('Sending');
  }

  isAdding = false;
  updatels();
  

}

function checked(i) {
  // toggle and change true to false, false to true
  // isChecked[i] = !isChecked[i];
  // toggle, once the button is pressed, send the opposite val of isChecked  
  socket.emit('isChecked', i+':'+!isChecked[i]);
  updatels();

}
