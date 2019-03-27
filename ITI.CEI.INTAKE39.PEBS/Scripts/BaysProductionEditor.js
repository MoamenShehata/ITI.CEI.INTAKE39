//#region   Minimum Need
var fieldOfView = 45;
var AspectRatio = 1367 / 470;
//var AspectRatio = window.innerWidth / window.innerHeight;
var nearClip = 1;
var farClip = 1000;

var viewer = document.getElementById("TemplateProductionBays");

var Dimscene = CreateScene();
var camera = CreateCamera(fieldOfView, AspectRatio, nearClip, farClip);
var renderer = CreateRenderer("TemplateProductionBays");
var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(), INTERSECTED;;
//#endregion

//#region   Material Definition
var blueMaterial = NewMaterialByColor(0x0000ff);
var greenMaterial = NewMaterialByColor(0x00FF00);
var redMaterial = NewMaterialByColor(0xFF0000);
var yellowMaterial = NewMaterialByColor('rgb(238, 255, 0)');
var whiteMaterial = NewMaterialByColor('rgb(255, 255, 255)');

var Slider_Image_path = document.getElementById("slider_image").getAttribute("src");
var sliderTexture = new THREE.TextureLoader().load(Slider_Image_path);
var materialSlider = new THREE.MeshBasicMaterial({ map: sliderTexture });

var slider_plus_image = document.getElementById("Plus_image").getAttribute("src");
var slider_plus_texture = new THREE.TextureLoader().load(slider_plus_image);
var SliderMaterialPlus = new THREE.MeshBasicMaterial({ map: slider_plus_texture });

var slider_minus_image = document.getElementById("Minus_image").getAttribute("src");
var slider_minus_texture = new THREE.TextureLoader().load(slider_minus_image);
var SliderMaterialMinus = new THREE.MeshBasicMaterial({ map: slider_minus_texture });

//#endregion

//#region Template Parameters
//var project_span = 24;
//var project_height = 6;
//var project_length = 80;
//var project_slope = 0.1;

//var project_span_min = 24;
//var project_span_max = 36;

//var project_height_min = 7;
//var project_height_max = 10;

//var project_length_min = 80;
//var project_length_max = 100;

//var project_slope_min = .01;
//var project_slope_max = .1;

//#endregion

SetCameraPosition(camera, 20, 20, 20);
camera.lookAt(new THREE.Vector3(0, 0, 0));

//#region Project_Components

heb600 = new IBeamColumn(7, .3, .03, .54, .015, 0, 0);
heb600.DrawGeometry(Dimscene);

//#endregion

//#region ThreeJsViewer Controls
var HeightSlider = new PebsVerticalSlider(0.7, .2, "Height", -(project_span / 2) - 1);
HeightSlider.Draw(Dimscene);

var LengthSlider = new PebsHorizontalSlider(0.7, .2, "Length", 0);
LengthSlider.Draw(Dimscene);
LengthSlider.Slider.position.x = (project_span / 2) + 1;
//LengthSlider.Slider.position.y = 0.5;

//#endregion

Update(renderer, camera, Dimscene);

OnClick(onDocumentMouseDown);

function onDocumentMouseDown(event) {
	var bounds = viewer.getBoundingClientRect();
	mouse.x = ((event.clientX - bounds.left) / viewer.clientWidth) * 2 - 1;
	mouse.y = - ((event.clientY - bounds.top) / viewer.clientHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(Dimscene.children, true);
	if (intersects.length > 0) {

		if (intersects[0].object.ObjectType != null && intersects[0].object.ObjectType.includes("PEBS_OBJ")) {
			//intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
			//intersects[0].object.material.color = new THREE.Color( 'rgb(238, 255, 0)' );
			//console.log(intersects[0].object);
		}

		//Height SLider Functionality On Click
		if (intersects[0].object.ObjectType != null && intersects[0].object.Name == "Height_Slider_Plus") {
			project_height += 0.25;
			EditProjectHeight(project_height);
		}
		if (intersects[0].object.ObjectType != null && intersects[0].object.Name == "Height_Slider_Minus") {
			project_height -= 0.25;
			EditProjectHeight(project_height);
		}

		//Length SLider Functionality On Click
		if (intersects[0].object.ObjectType != null && intersects[0].object.Name == "Length_Slider_Plus") {
			project_length += 0.5;
			EditProjectLength(project_length);
		}
		if (intersects[0].object.ObjectType != null && intersects[0].object.Name == "Length_Slider_Minus") {
			project_length -= 0.5;
			EditProjectLength(project_length);
		}

	}
}

