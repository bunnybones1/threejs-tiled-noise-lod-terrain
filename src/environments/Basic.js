var MapFactory = require('../maps/factory');
var MaterialFactory = require('../materials/factory');

var _objectCallback;
var _environmentObjects = [];
var _universalObjects = [];
function Environment(objectCallback) {
	_objectCallback = objectCallback;
	//Environment objects
	//lights
	var directionalLight = new THREE.DirectionalLight( 0xffeedd, .8 );
	directionalLight.position.set( .43, .63, 0 );
	objectCallback( directionalLight );
	_universalObjects.push(directionalLight);

	//var hemisphereLight = new THREE.HemisphereLight( 0xcceeff, 0x443300, 1.0  );
	//objectCallback( hemisphereLight );
	
	var ambientLight = new THREE.AmbientLight(0x99aaff);
	objectCallback(ambientLight);
	_universalObjects.push(ambientLight);

}
Environment.prototype = {
	initView: function(view) {
		//view.renderer.autoClear = false;
		var scene = view.scene;
		var environmentCamera = view.camera.clone();
		environmentCamera.position.set(0,0,0);
		view.onResizeSignal.add(function(w, h){
			environmentCamera.aspect = w/h;
//			environmentCamera.setLens(w, h);
			environmentCamera.updateProjectionMatrix();
		});

		var sky = new THREE.Mesh(
			new THREE.SphereGeometry(2000, 16, 8, 0, Math.PI * 2, 0, Math.PI * .5),
			new THREE.MeshBasicMaterial({
				//map: THREE.ImageUtils.loadTexture(require('../paths').assets + '/gradients/sunnySky.png'),
				color: 0x1155EE,
				side: THREE.BackSide,
			})
		);
		var ground = new THREE.Mesh(
			new THREE.SphereGeometry(1800, 16, 8, 0, Math.PI * 2, Math.PI * .5, Math.PI),
			new THREE.MeshBasicMaterial({
				//map: require('../textures/factory').createGradient(require('../gradients/libraries/skies').sunnyDay),
				color: 0x886633,
				side: THREE.BackSide,
			})
		);
		var atmosphere = new THREE.Mesh(
			new THREE.SphereGeometry(1700, 16, 8, 0, Math.PI * 2, 0, Math.PI),
			new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture(require('../paths').assets + '/gradients/atmosphere.png'),
				transparent: true,
				//color: 0x886633,
				side: THREE.BackSide,
			})
		);
		//scene.add(new THREE.DirectionalLight(0xffff00, 1));
		scene.add(sky);
		_environmentObjects.push(sky);
		_environmentObjects.push(atmosphere);
		scene.add(ground);
		_environmentObjects.push(ground);
		var enviroCubeCamera = new THREE.CubeCamera(1, 10000, 128, THREE.FloatType);
		enviroCubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter; // mipmap filter
		this.cubeMap = enviroCubeCamera.renderTarget;
		scene.add(enviroCubeCamera);

		var sunHalo = new THREE.Mesh(
			new THREE.SphereGeometry(
				1900, 16, 8, 0, Math.PI * 2, 0, Math.PI * .4
			),
			MaterialFactory.createBasicFakeHDR({
				map: THREE.ImageUtils.loadTexture(require('../paths').assets + '/gradients/sunHalo.png'),
				side: THREE.BackSide,
				blending: THREE.AdditiveBlending,
				transparent: true,
			})
		)
		_environmentObjects.push(sunHalo);
		scene.add(sunHalo);
		scene.add(atmosphere);

		function toggleVisibility(object, env, state) {
			if(_universalObjects.indexOf(object) == -1 && (env && _environmentObjects.indexOf(object) != -1) || (!env && _environmentObjects.indexOf(object) == -1)) {
				object.visible = state;
			}
		}

		function traverse(object, env, state) {
			if(object.children) {
				for (var i = object.children.length - 1; i >= 0; i--) {
					traverse(object.children[i], env, state);
				}
			}
			toggleVisibility(object, env, state);
		}

		function setNonEnvironmentVisibility(state) {
			traverse(scene, false, state);
		}

		function setEnvironmentVisibility(state) {
			traverse(scene, true, state);
		}

		view.renderManager.onEnterFrame.add( function () {
			setEnvironmentVisibility(true);
			setNonEnvironmentVisibility(false);
			view.renderer.clear();

			view.renderer.autoUpdateObjects = false;
			view.renderer.initWebGLObjects( scene );

			sunHalo.rotateX(.05);
			//view.renderer.initWebGLObjects(scene);
			view.renderer.autoClear = true;
			enviroCubeCamera.updateCubeMap(view.renderer, scene);
			view.renderer.autoClear = false;
			view.renderer.initWebGLObjects( view.scene );
			environmentCamera.rotation.copy(view.camera.rotation);
			view.renderer.render(view.scene, environmentCamera)
			setEnvironmentVisibility(false);
			setNonEnvironmentVisibility(true);
		});

	}
}

module.exports = Environment;