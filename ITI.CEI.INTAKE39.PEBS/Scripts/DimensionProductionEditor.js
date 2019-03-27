//#region   Minimum Need
var fieldOfView = 45;
var AspectRatio = 1367 / 470;
//var AspectRatio = window.innerWidth / window.innerHeight;
var nearClip = 1;
var farClip = 1000;

var viewer = document.getElementById("TemplateProductionDimensions");

var Dimscene = CreateScene();
var camera = CreateCamera(fieldOfView, AspectRatio, nearClip, farClip);
var renderer = CreateRenderer("TemplateProductionDimensions");
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
var project_span = 24;
var project_height = 6;
var project_length = 80;
var project_slope = 0.1;

var project_span_min = 24;
var project_span_max = 36;

var project_height_min = 7;
var project_height_max = 10;

var project_length_min = 80;
var project_length_max = 100;

var project_slope_min = .01;
var project_slope_max = .1;

//#endregion

SetCameraPosition(camera, 20, 20, 20);
camera.lookAt(new THREE.Vector3(0, 0, -project_length / 2));

//#region Project_Components

sideCladding = new CladdingDoubleSide(project_span, project_height, project_length);
sideCladding.DrawGeometry(Dimscene);

roof = new RoofDouble(project_span, project_length, project_slope, project_height);
roof.DrawGeometry(Dimscene);

//#endregion

//#region ThreeJsViewer Controls
var HeightSlider = new PebsVerticalSlider(0.7, .2, "Height", -(project_span / 2) - 1);
HeightSlider.Draw(Dimscene);

var LengthSlider = new PebsHorizontalSlider(0.7, .2, "Length", 0);
LengthSlider.Draw(Dimscene);
LengthSlider.Slider.position.x = (project_span / 2) + 1;
//LengthSlider.Slider.position.y = 0.5;

var SpanSlider = new PebsHorizontalSlider(0.7, .2, "Span", 0);
SpanSlider.Draw(Dimscene);
SpanSlider.Slider.rotation.y = Math.PI / 2;
//SpanSlider.Slider.position.y = .5;

var SlopeSlider = new PebsVerticalSlider(0.7, .2, "Slope", 0);
SlopeSlider.Draw(Dimscene);
SlopeSlider.Slider.position.y = project_height;
SlopeSlider.Slider.position.z = .2;
//#endregion

//#region Dimensions
var lengthDim = new PebsDimension(15, 0, project_length, "z");
lengthDim.Drawzdimebsion(Dimscene);

var spanDim = new PebsDimension(project_span / 2, 1, project_span, "x");
spanDim.Drawzdimebsion(Dimscene);
//#endregion

function EditProjectSlope(newSlope) {
	if (newSlope >= project_slope_min && newSlope <= project_slope_max) {
		roof.SetSlope(newSlope);
	}
	else if (newSlope < project_slope_min) {
		confirm("Span Must Be At Least " + project_slope_min + " m");
	}
	else if (newSlope > project_slope_max) {
		confirm("Span Can not Exceed Value Of" + project_slope_max);
	}
}

function EditProjectSpan(newSpan) {
	if (newSpan >= project_span_min && newSpan <= project_span_max) {
		sideCladding.SetSpan(newSpan);
		roof.SetSpan(newSpan);
		HeightSlider.Slider.position.x = -(newSpan / 2) - 1;
		LengthSlider.Slider.position.x = (newSpan / 2) + 1;
		spanDim.SetLength(newSpan);
		project_span = newSpan;
		//console.log(project_span);
	}
	else if (newSpan < project_span_min) {
		confirm("Span Must Be At Least " + project_span_min + " m");
	}
	else if (newSpan > project_span_max) {
		confirm("Span Can not Exceed Value Of" + project_span_max + " m");
	}
}

function EditProjectLength(newLength) {
	if (newLength >= project_length_min && newLength <= project_length_max) {
		sideCladding.SetLength(newLength);
		roof.SetLength(newLength);
		lengthDim.SetLength(newLength);
		project_length = newLength;
	}
	else if (newLength < project_length_min) {
		confirm("Length Must Be At Least " + project_length_min + " m");
	}
	else if (newLength > project_length_max) {
		confirm("Length Can not Exceed Value Of" + project_length_max + " m");
	}
}

function EditProjectHeight(newHeight) {
	if (newHeight >= project_height_min && newHeight <= project_height_max) {
		sideCladding.SetHeight(newHeight);
		roof.SetHeight(newHeight);
		SlopeSlider.Slider.position.y = newHeight;
		project_height = newHeight;
	}
	else if (newHeight < project_height_min) {
		confirm("Height Must Be At Least " + project_height_min + " m");
	}
	else if (newHeight > project_height_max) {
		confirm("Height Can not Exceed Value Of" + project_height_max + " m");
	}

}

Update(renderer, camera, Dimscene);

OnClick(onDocumentMouseDown);
//OnHover(onDocumentMouseMove);

function onDocumentMouseDown(event) {
	//debugger

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

		//Span SLider Functionality On Click
		if (intersects[0].object.ObjectType != null && intersects[0].object.Name == "Span_Slider_Plus") {
			project_span += .5;
			lengthDim.DimensionLine.position.x += .5;
			lengthDim.StartExtent.position.x += .5;
			lengthDim.EndExtent.position.x += .5;
			EditProjectSpan(project_span);
		}
		if (intersects[0].object.ObjectType != null && intersects[0].object.Name == "Span_Slider_Minus") {
			project_span -= .5;
			lengthDim.DimensionLine.position.x -= .5;
			lengthDim.StartExtent.position.x -= .5;
			lengthDim.EndExtent.position.x -= .5;
			EditProjectSpan(project_span);
		}
		//Slope SLider Functionality On Click
		if (intersects[0].object.ObjectType != null && intersects[0].object.Name == "Slope_Slider_Plus") {
			project_slope += 0.01;
			EditProjectSlope(project_slope);
		}
		if (intersects[0].object.ObjectType != null && intersects[0].object.Name == "Slope_Slider_Minus") {
			project_slope -= 0.01;
			EditProjectSlope(project_slope);
		}
	}
}

var intersected;
var oldcolor;
function onDocumentMouseMove(event) {

	var bounds = viewer.getBoundingClientRect()
	mouse.x = ((event.clientX - bounds.left) / viewer.clientWidth) * 2 - 1;
	mouse.y = - ((event.clientY - bounds.top) / viewer.clientHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(Dimscene.children, true);


	if (intersects.length > 0) {

		if (intersects[0].object.hasOwnProperty("ObjectType") == true && intersects[0].object.ObjectType.includes("PEBS_OBJ")) {

			intersected = intersects[0].object;
			oldcolor = intersected.material.color.getStyle().toString();
			console.log("intersected Before Assign : " + intersected.material.color.getStyle().toString());

			var newColor = new THREE.Color('rgb(0, 0, 200)');
			intersects[0].object.material.color = newColor;
			//console.log("moamen");
		}
		else if (intersected != null) {
			console.log("AnyThing");
			intersected.material.color = new THREE.Color(oldcolor);
			//intersected.material.color = new THREE.Color('rgb(0, 0, 255)');
		}
	}


	//intersected != null && intersected.ObjectType.includes("PEBS_OBJ");
	//else if(){
	//	console.log(oldcolor);
	//	intersected.material.color = oldcolor;
	//	//intersected.material.color = new THREE.Color('rgb(0, 0, 255)');
	//}
}

var lbl_dimensions = document.getElementById("dimension_label");
lbl_dimensions.onclick = function () {
	document.getElementById("TemplateProductionDimensions").style.display = "block";
	document.getElementById("TemplateProductionBays").style.display = "none";
}

var lbl_Bays = document.getElementById("Bays_label");
lbl_Bays.onclick = function () {
	document.getElementById("TemplateProductionDimensions").style.display = "none";
	document.getElementById("TemplateProductionBays").style.display = "block";
}