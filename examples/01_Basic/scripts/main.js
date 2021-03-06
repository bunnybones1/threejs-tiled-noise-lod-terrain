

function init() {

	var scene = new Vaca.scenes.Basic();

	var view = new Vaca.View({
		scene: scene.scene,
		camera: scene.camera,
		stats: true,
	});

	scene.initView(view);
	
	view.renderManager.onEnterFrame.add(scene.onEnterFrame);
}

init();
