var delayDefault = 1;
var delay = delayDefault;

function waitForParent(object) {
	if(object.parent) injectObjectUnderObject(object, callback);
	else setTimeout(waitForParent, delay);
	object.delay *= 2;
};

function deinit(object) {
	delete object.object3D;
	delete object.callback;
	delete object.delay;
}

function injectObjectUnderObject(object) {
	object.delay = delayDefault;
	if(object.object3D.parent) {
		var injection = new THREE.Object3D();
		object.object3D.parent.add(injection);
		injection.add(object.object3D);
		object.callback(injection);
		deinit(object);
	} else {
		waitForParent(object);
	}
};

module.exports = {
	injectObjectUnderObject: injectObjectUnderObject
};