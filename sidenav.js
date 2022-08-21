function generateLinks()
{
  var nav = document.getElementById('sidenav');
  nav.innerHTML = '';
  nav.innerHTML += '<a href="/">Home</a><br>'
  nav.innerHTML += '<a href="#">Bingo Game</a><br>'
  nav.innerHTML += '<a href="/Asteroid.html">Asteroid Game</a><br>'
  nav.innerHTML += '<a href="#">Sudoku Game</a><br>'
  nav.innerHTML += '<a href="#">Dev tools</a><br>'
  nav.innerHTML += '<a href="https://mail.google.com/mail/u/0/?pli=1#inbox">myEmail</a>'

}

generateLinks();
