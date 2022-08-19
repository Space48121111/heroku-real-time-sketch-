function rotateShipCorner(index, i, sin, cos) {
  // rotation matrix in cartesian coordinate system
  var cx = i_users[index].x+cos*xAxis[i]+sin*yAxis[i];
  var cy = i_users[index].y+cos*yAxis[i]-sin*xAxis[i];
  return [cx, cy];
}

// within the velocity bounds
function clamp(val, min, max) {
  if (val < min) {
	return min;
  }
  if (val > max) {
	return max;
  }
  return val;
}

// player1 vs #todo player2-->arrow-shaped AI
function drawSpaceship(index) 
{
	var isMe = myID == users[index].id;
	
  // 1 radian: one arc length equals to radius
  var radian = (Math.PI/180)*i_users[index].angle;
  var sin = Math.sin(radian);
  var cos = Math.cos(radian);
  ctx.lineWidth = 1;
  if (isMe)
  {
	  ctx.fillStyle = 'white';
  }
  else
  {
		ctx.fillStyle = 'red';
  }
  ctx.beginPath();
  var path=new Path2D();
  var cPos=rotateShipCorner(index, xAxis.length-1, sin, cos);
  path.moveTo(cPos[0], cPos[1]);
  // i iterate thru 0 -> 3
  for (var i=0; i<xAxis.length; i++) 
  {
    var nPos = rotateShipCorner(index, i, sin, cos);
    path.lineTo(nPos[0], nPos[1]);
  }
  ctx.fill(path);

  // rendering engine flickering
  var timeOffset = time*2;
  // sin oscillating wave 0-1
  var alpha = (1+Math.sin(timeOffset))*0.5;
  var yRadius = 2+alpha*4;
  for (var i=0; i<2; i++) {
    ctx.lineWidth = 1;
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    var dynamicY = engineY[i]+yRadius-6;
    var cx = i_users[index].x+cos*engineX[i]+sin*dynamicY;
    var cy = i_users[index].y+cos*dynamicY-sin*engineX[i];
    // ellipse(x, y, xRadius, yRadius, rotation, startAngle, endAngle);
    ctx.ellipse(cx, cy, 4, yRadius, -radian, 0, Math.PI*2);
    ctx.fill();
  }
}
