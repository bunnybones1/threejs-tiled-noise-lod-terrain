var EventUtil = require('../utils/Events');
var Highlights = require('../materials/utils/Highlights');
var Mouse = require('../user/inputs/Mouse');

var MouseDrag = {};
function init(camera, scene, container, canvas) {
	var mouse = new THREE.Vector2(),
	worldCameraPosition = new THREE.Vector3(),
	offset = new THREE.Vector3(),
	cameraVector = new THREE.Vector3(),
	INTERSECTED, SELECTED;

	var projector = new THREE.Projector();

	var objects = [];

	function updateCameraVector(x, y) {
		//flip y, just cuz
		cameraVector.set( x, -y, 0.5 );
		projector.unprojectVector( cameraVector, camera );
		worldCameraPosition.copy(camera.position);
		camera.parent.localToWorld(worldCameraPosition);
		cameraVector.sub( worldCameraPosition ).normalize();
	};

	function onMouseHover( x, y ) {
		updateCameraVector(x, y);

		var raycaster = new THREE.Raycaster( worldCameraPosition, cameraVector );
		var intersects = raycaster.intersectObjects( objects );

		if ( intersects.length > 0 ) {
			if ( INTERSECTED != intersects[ 0 ].object ) {
				if ( INTERSECTED ) Highlights.unhighlight(INTERSECTED);
				INTERSECTED = intersects[ 0 ].object;
				Highlights.highlight(INTERSECTED);
			}
			container.style.cursor = 'pointer';
		} else {
			if ( INTERSECTED ) Highlights.unhighlight(INTERSECTED);
			INTERSECTED = null;
			container.style.cursor = 'auto';
		}
	};

	function onMouseDrag(x, y) {
		if ( SELECTED ) {
			updateCameraVector(x, y);
			cameraVector.multiplyScalar(SELECTED.dragDistanceToCamera).add(worldCameraPosition);
			SELECTED.position.copy(SELECTED.parent.worldToLocal(cameraVector)).sub(SELECTED.dragOffset);
		}

	};

	function onMouseDown( x, y ) {
		updateCameraVector(x, y);
		var raycaster = new THREE.Raycaster( worldCameraPosition, cameraVector );

		var intersects = raycaster.intersectObjects( objects );

		if ( intersects.length > 0 ) {
			SELECTED = intersects[ 0 ].object;
			SELECTED.dragOffset = SELECTED.parent.worldToLocal( intersects[ 0 ].point ).sub(SELECTED.position);
			SELECTED.dragDistanceToCamera = intersects[ 0 ].distance;
			container.style.cursor = 'move';
		}

	};

	function onMouseUp( x, y ) {
		if ( SELECTED ) {
			delete SELECTED.dragOffset;
			delete SELECTED.dragDistanceToCamera;
			SELECTED = null;
		}
		container.style.cursor = 'auto';
	};

	function add(object) {
		objects.push(object);
	};

	Mouse.onHoverSignal.add(onMouseHover);
	Mouse.onDragSignal.add(onMouseDrag);
	Mouse.onDownSignal.add(onMouseDown);
	Mouse.onUpSignal.add(onMouseUp);
	Mouse.onOutSignal.add(onMouseUp);
	MouseDrag.add = add;
	delete MouseDrag.init;
}

MouseDrag.init = init;
module.exports = MouseDrag;