

function init() {

	var scene = new Vaca.scenes.Basic();

	var view = new Vaca.View({
		scene: scene.scene,
		camera: scene.camera,
		stats: true,
		rendererSettings: {
			autoClear: false
		}
	});

	var fpsController = new Vaca.controllers.camera.FirstPerson({
		camera: scene.camera
	});
	
	scene.initView(view);
	
	view.renderManager.onEnterFrame.add(scene.onEnterFrame);
	view.renderManager.onEnterFrame.add(fpsController.update);
}

init();
