module.exports = {


	// within the velocity bounds
	clamp: function(val, min, max) {
	  if (val < min) {
		return min;
	  }
	  if (val > max) {
		return max;
	  }
	  return val;
	},
	
	interpolate: function(current, target, speed) 
	{
	  var angleTrajectory = target - current;
	  // ignore the diff once it approaches indefinitely to the target
	  if (Math.abs(angleTrajectory) < 0.0001) {
		return target;
	  }
	  // speed <= 1, at most the target val that it won't over-shoot
	  return current + angleTrajectory*Math.min(1, speed);
	}
};
