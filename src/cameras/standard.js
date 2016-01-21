var degToRad = require('../utils/degToRad');
module.exports = function Camera(cameraDistance) {
	var camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, .01, 20000 );
	cameraDistance = cameraDistance !== undefined ? cameraDistance : 8.5;
	var angleCar = degToRad(-185);
	var angleCamera = degToRad(60) - angleCar;	//relative to car
	camera.position.set(
		Math.cos(angleCamera) * cameraDistance,
		2.6,
		Math.sin(angleCamera) * cameraDistance
	);
	var cameraTarget = new THREE.Vector3( 0, 1.5, 0);
	camera.lookAt( cameraTarget );
	return camera;
}