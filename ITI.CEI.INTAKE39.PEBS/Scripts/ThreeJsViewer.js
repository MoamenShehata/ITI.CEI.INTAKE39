class PebsObject extends THREE.Mesh {
	constructor(geometry, material, type, name) {
		super(geometry, material);
		this.Geometry = geometry;
		this.Material = material;
		this.ObjectType = "PEBS_OBJ_" + type;
		this.Name = name;
		this.Instance = null;
	}
}

//var THREE = require('three');
//var MeshLine = require('three.meshline');

class PebsVerticalSlider {
	constructor(size, spacing, sliderfor, xPosition) {
		this.XPosition = xPosition;
		this.Size = size;
		this.Spacing = spacing;
		this.SliderFor = sliderfor;
		this.Slider = null;
		this.Count = null;
	}

	Draw(scene) {
		this.Count++;
		var blueMaterial = NewMaterialByColor(0x0000ff);
		let parent = CreateCube(.000001, .000001, 1, blueMaterial, "Pivot", "Slider_Pivot");
		parent.position.x = this.XPosition
		parent.position.y = 0;

		let SliderMinus = CreateCube(this.Size, this.Size, .01, SliderMaterialMinus, "VerticalSlider", this.SliderFor + "_Slider_Minus");
		//SliderMinus.position.y = 0;

		let SliderPlus = CreateCube(this.Size, this.Size, .01, SliderMaterialPlus, "VerticalSlider", this.SliderFor + "_Slider_Plus");
		SliderPlus.position.y = 0 + this.Size / 2 + this.Size + this.Spacing;

		parent.add(SliderMinus);
		parent.add(SliderPlus);
		scene.add(parent);

		this.Slider = parent;
		this.Slider.ObjectType = "PEBS_OBJECT_VERTICAL_SLIDER";
		this.Slider.Name = "V_Slider" + this.Count;
		return parent;
	}

}

class PebsHorizontalSlider {
	constructor(size, spacing, sliderfor, zPosition) {
		this.ZPosition = zPosition;
		this.Size = size;
		this.Spacing = spacing;
		this.SliderFor = sliderfor;
		this.Slider = null;
		this.Plus = null;
		this.Minus = null;
		this.Count = null;
	}

	Draw(scene) {
		this.Count++;
		var blueMaterial = NewMaterialByColor(0x0000ff);
		let parent = CreateCube(.000001, .000001, 1, blueMaterial, "Pivot", "Slider_Pivot");
		parent.position.z = this.ZPosition - this.Size / 2;

		let SliderMinus = CreateCube(this.Size, .01, this.Size, SliderMaterialMinus, "HorizontalSlider", this.SliderFor + "_Slider_Minus");
		//SliderMinus.position.z = this.ZPosition;

		let SliderPlus = CreateCube(this.Size, .01, this.Size, SliderMaterialPlus, "HorizontalSlider", this.SliderFor + "_Slider_Plus");
		SliderPlus.position.z = - this.Size - this.Spacing;

		parent.add(SliderMinus);
		parent.add(SliderPlus);
		scene.add(parent);

		this.Slider = parent;
		this.Slider.ObjectType = "PEBS_OBJECT_Horizontal_SLIDER";
		this.Slider.Name = "H_Slider" + this.Count;

		this.Plus = SliderPlus;
		this.Minus = SliderMinus;

		return parent;
	}

	//Hide() {
	//	this.Slider.scale.x = 0.000000001;
	//}
}

class PebsDimension {
	constructor(xPosition, zPosition, length, direction) {
		this.XPosition = xPosition;
		this.ZPosition = zPosition;
		this.Length = length;
		this.Direction = direction;
		this.DimensionLine = null;
		this.EndExtent = null;
		this.StartExtent = null;
	}

	DrawGeometry(scene) {
		var Material = NewMaterialByColor('rgb(0, 0, 0)');
		let totalLength = this.Length + .8;
		let dimGeometry;
		let startExtentGeometry;
		let endExtentGeometry;

		switch (this.Direction) {
			case "z":
				dimGeometry = CreateCube(.1, .01, totalLength, Material, "Dimension", "LengthDimension");
				dimGeometry.position.x = this.XPosition;
				dimGeometry.position.z = this.ZPosition - (totalLength / 2) + .4;

				startExtentGeometry = CreateCube(.6, .01, .06, Material, "Dimension_Extents", "Dimension_Start_Extent");
				startExtentGeometry.position.x = this.XPosition;
				startExtentGeometry.position.z = this.ZPosition;

				endExtentGeometry = CreateCube(.6, .01, .06, Material, "Dimension_Extents", "Dimension_End_Extent");
				endExtentGeometry.position.x = this.XPosition;
				endExtentGeometry.position.z = this.ZPosition - this.Length;
				break;
			case "x":
				dimGeometry = CreateCube(totalLength, .01, .1, Material, "Dimension", "LengthDimension");
				//dimGeometry.position.x = this.XPosition + (totalLength / 2) + .4;
				dimGeometry.position.z = this.ZPosition;

				startExtentGeometry = CreateCube(.06, .01, .6, Material, "Dimension_Extents", "Dimension_Start_Extent");
				startExtentGeometry.position.x = this.XPosition;
				startExtentGeometry.position.z = this.ZPosition

				endExtentGeometry = CreateCube(.06, .01, .6, Material, "Dimension_Extents", "Dimension_End_Extent");
				endExtentGeometry.position.x = this.XPosition - this.Length;
				endExtentGeometry.position.z = this.ZPosition;
				break;
		}

		this.DimensionLine = dimGeometry;
		this.EndExtent = endExtentGeometry;
		this.StartExtent = startExtentGeometry;

		scene.add(dimGeometry);
		scene.add(startExtentGeometry);
		scene.add(endExtentGeometry);
	}

	SetLength(newLength) {
		let oldlength = this.Length;
		let increment = newLength - oldlength;
		switch (this.Direction) {
			case "z":
				this.DimensionLine.scale.z *= (newLength / oldlength);
				this.DimensionLine.position.z = this.ZPosition - (newLength / 2);
				this.Length = newLength;
				this.EndExtent.position.z -= increment;
				break;
			case "x":
				this.DimensionLine.scale.x *= (newLength / oldlength);
				this.Length = newLength;
				this.StartExtent.position.x = this.XPosition + newLength / 2;
				this.EndExtent.position.x = this.XPosition - newLength / 2;
				break;
		}
	}

	MoveDimension(newPosition) {
		switch (this.Direction) {
			case "z":
				this.DimensionLine.position.x = newPosition;
				this.StartExtent.position.x = newPosition;
				this.EndExtent.position.x = newPosition;
				break;
			case "x":
				this.DimensionLine.position.z = step;
				this.StartExtent.position.z = step;
				this.EndExtent.position.z = step;
				break;
		}
	}
}

function CreateCamera(fieldView, aspR, nClip, fClip) {
	//Parameters(field of view , aspect ratio, near clib , far clib)
	var camera = new THREE.PerspectiveCamera(
		fieldView, aspR, nClip, fClip
	);
	return camera;
}

function SetCameraPosition(camera, x, y, z) {
	camera.position.x = x;
	camera.position.y = y;
	camera.position.z = z;
}

function CreateRenderer(htmlId) {
	let renderer = new THREE.WebGLRenderer();
	renderer.setSize(1367, 520);
	var div_WebGL = document.getElementById(htmlId);
	div_WebGL.appendChild(renderer.domElement);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setClearColor('rgb(205, 205, 205)');
	return renderer;
}

function Drawzdimebsion(xPosition, zPosition, length, scene) {
	var Material = NewMaterialByColor('rgb(0, 0, 0)');
	let totalLength = length + .8;
	let dimGeometry = CreateCube(.1, .01, totalLength, Material, "Dimension", "LengthDimension");
	dimGeometry.position.x = xPosition;
	dimGeometry.position.z = zPosition - (totalLength / 2) + .4;

	let startExtentGeometry = CreateCube(.4, .01, .04, Material, "Dimension_Extents", "Dimension_Start_Extent");
	startExtentGeometry.position.x = xPosition;
	startExtentGeometry.position.z = zPosition;

	let endExtentGeometry = CreateCube(.6, .01, .06, Material, "Dimension_Extents", "Dimension_End_Extent");
	endExtentGeometry.position.x = xPosition;
	endExtentGeometry.position.z = zPosition - length;

	scene.add(dimGeometry);
	scene.add(startExtentGeometry);
	scene.add(endExtentGeometry);
}

function DrawZDimension(xPosition, zPosition, Length) {
	let blackMaterial = new THREE.LineBasicMaterial({ color: 'rgb(0, 0, 0)' });
	let geometry = new THREE.Geometry();
	let x = xPosition;
	let z = zPosition;

	let StartextentGeometry = new THREE.Geometry();
	StartextentGeometry.vertices.push(new THREE.Vector3(x - .3, 0, z - .3));
	StartextentGeometry.vertices.push(new THREE.Vector3(x + .4, 0, z - .3));

	let EndextentGeometry = new THREE.Geometry();
	EndextentGeometry.vertices.push(new THREE.Vector3(x + - .3, 0, z + Length + .3));
	EndextentGeometry.vertices.push(new THREE.Vector3(x + .4, 0, z + Length + .3));

	for (let i = 0; i < 50; i++) {
		geometry.vertices.push(new THREE.Vector3(x, 0, z));
		geometry.vertices.push(new THREE.Vector3(x, 0, Length));
		x += .001;
		z += .001;
	}
	let line = new THREE.Line(geometry, blackMaterial);
	let StartextentLine = new THREE.Line(StartextentGeometry, blackMaterial);
	let EndtextentLine = new THREE.Line(EndextentGeometry, blackMaterial);

	//////////////////////////

	//var geometry = new THREE.Geometry();
	//geometry.vertices.push(new THREE.Vector3(0, 0, 0));
	//geometry.vertices.push(new THREE.Vector3(0, 0, 10));
	//var line = new THREE.MeshLine();
	//line.setGeometry(geometry, function (p) { return 2; });
	//var material = new MeshLineMaterial({ color: 'rgb(0, 0, 0)',});
	//var mesh = new Mesh(line.geometry, material);
	//scene.add(mesh);
	Dimscene.add(line);
	Dimscene.add(StartextentLine);
	Dimscene.add(EndtextentLine);
}

function CreateScene() {
	var scene = new THREE.Scene();

	//Grids Parallel to X-Axis
	var z = 100;
	//for (let i = 0; i < 200; i++) {
	//	let greyMaterial = new THREE.LineBasicMaterial({ color: 'rgb(65, 65, 65)' });
	//	var geometry = new THREE.Geometry();
	//	geometry.vertices.push(new THREE.Vector3(100, 0, z));
	//	geometry.vertices.push(new THREE.Vector3(-100, 0, z));
	//	var line = new THREE.Line(geometry, greyMaterial);
	//	scene.add(line);
	//	z -= 1;
	//}

	//Grids Parallel to Z-Axis	
	var x = 100;
	//for (let i = 0; i < 200; i++) {
	//	let greyMaterial = new THREE.LineBasicMaterial({ color: 'rgb(65, 65, 65)' });
	//	var geometry = new THREE.Geometry();
	//	geometry.vertices.push(new THREE.Vector3(x, 0, 100));
	//	geometry.vertices.push(new THREE.Vector3(x, 0, -100));
	//	var line = new THREE.Line(geometry, greyMaterial);
	//	scene.add(line);
	//	x -= 1;
	//}
	return scene;

}

function ClearScene(scene) {
	while (scene.children.length > 0) {
		scene.remove(scene.children[0]);
	}
}
//for hexadecimal color => matColor: 0x0000ff
//for rgb color => matColor: 'rgb(255, 255, 255)'
function NewMaterialByColor(matColor) {
	return new THREE.MeshBasicMaterial({ color: matColor });
}

//imageUrl:'path'
function NewTexturedMaterial(imageUrl) {
	var texture = new THREE.TextureLoader().load(imageUrl);
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(1, 1);
	//var origin = new THREE.Vector2(0.5,0.5);
	// texture.center.set(.5,.5);
	//texture.matrixAutoUpdate= true;
	texture.rotation = Math.PI / 3;
	return new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

	// return new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load(imageUrl),side:THREE.DoubleSide});

}

// var plane1 = CreatePlane(.1, 2, yellowMaterial, Math.PI / 2, 0, 0);

function CreatePlane(lengthX, lengthz, material, rotationx, rotationy, rotationz) {
	var planeGeometry = new THREE.PlaneGeometry(lengthX, lengthz);
	var mat = material;
	mat.side = THREE.DoubleSide;
	var meshPlane = new THREE.Mesh(planeGeometry, material);
	meshPlane.rotation.x = rotationx;
	meshPlane.rotation.y = rotationy;
	meshPlane.rotation.z = rotationz;
	return meshPlane;

}

function CreatePlaneByPosition(lengthX, lengthz, material, rotationx, rotationy, rotationz, x, y, z) {
	var planeGeometry = new THREE.PlaneGeometry(lengthX, lengthz);
	var mat = material;
	mat.side = THREE.DoubleSide;
	var meshPlane = new THREE.Mesh(planeGeometry, material);
	meshPlane.position.x = x - (lengthX / 2);
	meshPlane.position.y = y;
	meshPlane.position.z = z - (lengthz / 2);
	meshPlane.rotation.x = rotationx;
	meshPlane.rotation.y = rotationy;
	meshPlane.rotation.z = rotationz;
	return meshPlane;
}

function CreateCube(length, height, width, material, type, name) {
	var cubeGeometry = new THREE.BoxGeometry(length, height, width);
	let meshCube = new PebsObject(cubeGeometry, material, type, name);
	meshCube.position.y = height / 2;
	return meshCube;
}

function Update(renderer, camera, scene) {

	renderer.render(scene, camera);
	requestAnimationFrame(function () {
		Update(renderer, camera, scene);
	});

}

function OnClick(Functionality) {
	document.addEventListener('mousedown', Functionality, false);
}

function OnHover(Functionality) {
	document.addEventListener('mousemove', Functionality, false);
}


// function onDocumentMouseDown(event) {
//     var bounds = viewer.getBoundingClientRect()
//     mouse.x = ( (event.clientX - bounds.left) / viewer.clientWidth ) * 2 - 1;
//     mouse.y = - ( (event.clientY - bounds.top) / viewer.clientHeight ) * 2 + 1;
//     raycaster.setFromCamera( mouse, camera );
//     var intersects = raycaster.intersectObjects(scene.children, true);
//     if (intersects.length > 0) {
//     //    intersects[0].object.material.color = new THREE.Color( 'rgb(238, 255, 0)' );
//        intersects[0].object.material.color.setHex( Math.random() * 0xffffff );

//        //confirm("Fucckkkkkkkkkkk");
//     }
// }


//window.addEventListener('resize', function () {
//	var w = window.innerWidth;
//	var h = window.innerHeight;
//	// confirm(w);
//	renderer.setSize(w, h);
//	camera.aspect = w / h;
//	camera.updateProjectionMatrix();
//});