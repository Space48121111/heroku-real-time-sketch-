const v = require("./serverVariables.js");
const utils = require("./utilFuncs.js");

module.exports = {

	//
	updateMovement: function(index) 
	{
		var dirX = 0;
		var dirY = 0;
		if (v.users[index].upPressed) 
		{
			dirY = -1;
		} 
		else if (v.users[index].downPressed) 
		{
			dirY = 1;
		}
		if (v.users[index].rightPressed) 
		{
			dirX = 1;
		} 
		else if (v.users[index].leftPressed) 
		{
			dirX = -1;
		}
		
		// break first then turn
		v.users[index].velocityX *= v.deAcceleration;
		v.users[index].velocityY *= v.deAcceleration;
		v.users[index].velocityX += dirX * v.acceleration;
		v.users[index].velocityY += dirY * v.acceleration;
		v.users[index].velocityX = utils.clamp(v.users[index].velocityX, -v.maxSpeed, v.maxSpeed);
		v.users[index].velocityY = utils.clamp(v.users[index].velocityY, -v.maxSpeed, v.maxSpeed);

		v.users[index].x += v.users[index].velocityX;
		v.users[index].y += v.users[index].velocityY;

			// edges
		if (v.users[index].x < v.shipRadius) 
		{
			v.users[index].x = v.shipRadius;
			v.users[index].velocityX = 0;
		} 
		else if (v.users[index].x > v.canvasWidth-v.shipRadius) 
		{
			v.users[index].x = v.canvasWidth - v.shipRadius;
			v.users[index].velocityX = 0;
		}

		if (v.users[index].y < v.shipRadius) 
		{
			v.users[index].y = v.shipRadius;
			v.users[index].velocityY = 0;
		} 
		else if (v.users[index].y > v.canvasHeight-v.shipRadius) 
		{
			v.users[index].y = v.canvasHeight - v.shipRadius;
			v.users[index].velocityY = 0;
		} 	
	},
	
	updateRotation: function(index) 
	{
	  // inertial angle
	  var targetAngle = v.users[index].angle;
	  if (v.users[index].velocityX != 0 || v.users[index].velocityY != 0) {
		// - neg: going upwards
		targetAngle = (Math.atan2(-v.users[index].velocityY, v.users[index].velocityX)/Math.PI)*180;
		targetAngle += -90;
	  }
	  // turn within -180-180 degrees
	  var diff = targetAngle - v.users[index].angle;
	  while (diff > 180) {
		diff -= 360; // 270-360 = -90
	  }
	  while (diff < -180) {
		diff += 360;
	  }
	  v.users[index].angle = utils.interpolate(v.users[index].angle, v.users[index].angle+diff, v.revolutionSpeed);
	}
};
