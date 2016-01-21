

function init() {

	var scene = new Vaca.scenes.Basic();

	var view = new Vaca.View({
		scene: scene.scene,
		camera: scene.camera,
		stats: true,
	});

	var mouseDrag = Vaca.manipulators.MouseDrag;
	mouseDrag.init(scene.camera, scene.scene, view.canvasContainer, view.canvas);
	scene.onNewMeshSignal.add(mouseDrag.add);

	var sway = new Vaca.controllers.camera.Sway({
		camera: scene.camera,
		lookAtTarget: new THREE.Vector3(0, 1.5, 0),
		angle: new THREE.Vector2(.25, 0),
	});
	
	scene.initView(view);
	
	view.renderManager.onEnterFrame.add(sway.onEnterFrame);
	view.renderManager.onEnterFrame.add(scene.onEnterFrame);
}

init();
