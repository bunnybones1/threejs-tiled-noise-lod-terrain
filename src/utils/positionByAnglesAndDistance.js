module.exports = function (object, angle, distance) {
	object.position.y = Math.sin(angle.x) * distance;
	object.position.x = Math.cos(angle.y) * Math.cos(angle.x) * distance;
	object.position.z = Math.sin(angle.y) * Math.cos(angle.x) * distance;
}