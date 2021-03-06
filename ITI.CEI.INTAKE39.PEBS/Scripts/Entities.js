function assignUVs(geometry) {
    geometry.faceVertexUvs[0] = [];
    geometry.faces.forEach(function (face) {
        var components = ['x', 'y', 'z'].sort(function (a, b) {
            return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
        });

        var v1 = geometry.vertices[face.a];
        var v2 = geometry.vertices[face.b];
        var v3 = geometry.vertices[face.c];

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(v1[components[0]], v1[components[1]]),
            new THREE.Vector2(v2[components[0]], v2[components[1]]),
            new THREE.Vector2(v3[components[0]], v3[components[1]])
        ]);

    });
    geometry.uvsNeedUpdate = true;
}

class CladdingDoubleSide {
    constructor(span, height, length) {
        //super(span);
        this.Span = span;
        this.Height = height;
        this.Length = length;
        this.RightCladding = null;
        this.LeftCladding = null;
        this.Color = "rgb(0,0,0)";
    }

    DrawGeometry(scene) {
        var Cladding_path = document.getElementById("cladding_image").getAttribute("src");
        var CladdingTexture = new THREE.TextureLoader().load(Cladding_path);
        CladdingTexture.wrapS = THREE.RepeatWrapping;
        //CladdingTexture.wrapT = THREE.RepeatWrapping;
        CladdingTexture.repeat.set(5, 5);
        var materialCladding = new THREE.MeshBasicMaterial({ map: CladdingTexture });

        let RightCladding = CreateCube(0, this.Height, this.Length, materialCladding, "Side_Cladding", "Right_Side_Cladding");
        RightCladding.position.x = this.Span / 2;
        RightCladding.position.z = (this.Length / 2) * -1;
        this.RightCladding = RightCladding;
        this.RightCladding.Instance = this;

        let LeftCladding = CreateCube(0, this.Height, this.Length, materialCladding, "Side_Cladding", "Left_Side_Cladding");
        LeftCladding.position.x = (this.Span / 2) * -1;
        LeftCladding.position.z = (this.Length / 2) * -1;
        this.LeftCladding = LeftCladding;
        this.LeftCladding.Instance = this;

        scene.add(RightCladding);
        scene.add(LeftCladding);
        return this;
    }

    SetSpan(span) {
        this.RightCladding.position.x = span / 2;
        this.LeftCladding.position.x = (span / 2) * -1;
        this.Span = span;
    }

    SetHeight(newheight) {
        let oldheight = this.Height;

        this.RightCladding.scale.y *= (newheight / oldheight);
        this.RightCladding.position.y = 0;
        this.RightCladding.position.y = newheight / 2;

        this.LeftCladding.scale.y *= (newheight / oldheight);
        this.LeftCladding.position.y = 0;
        this.LeftCladding.position.y = newheight / 2;

        this.Height = newheight;
    }

    SetLength(newLength) {
        let oldLength = this.Length;

        this.RightCladding.scale.z *= (newLength / oldLength);
        this.RightCladding.position.z = 0;
        this.RightCladding.position.z = -newLength / 2;

        this.LeftCladding.scale.z *= (newLength / oldLength);
        this.LeftCladding.position.z = 0;
        this.LeftCladding.position.z = -newLength / 2;

        this.Length = newLength;
    }

    SetColor(newColor) {
        this.RightCladding.material.color = new THREE.Color(newColor);
        this.LeftCladding.material.color = new THREE.Color(newColor);
        this.Color = newColor;
    }



    toJson(array) {
        debugger;
    var MyCladdingDoubleSide = {
       
        "Span": this.Span,
        "Height": this.Height,
        "Length": this.Length,
        "Color": this.Color

    }
    array.push(MyCladdingDoubleSide);
}

}

var numberOfWalls = 0;
class FrontWall {
    constructor(span, height, slope, zPos) {
        //super(span);
        this.Span = span;
        this.Height = height;
        this.Slope = slope;
        this.ZPosition = zPos;
        this.Wall = null;
        this.Triangle = null;
    }

    DrawGeometry(scene, direction) {
        numberOfWalls++;

        let cladd_image_path = document.getElementById("cladding_image").getAttribute("src");
        let WallTexture = new THREE.TextureLoader().load(cladd_image_path);
        WallTexture.wrapS = THREE.RepeatWrapping;
        WallTexture.repeat.set(7, 7);

        let material = NewMaterialByColor('rgb(115, 115, 115)');

        let wall;
        let dir;
        switch (direction) {
            case "north":
                dir = "_North";
                break;
            case "south":
                dir = "_South";
                break;
        }

        wall = CreateCube(this.Span, this.Height, .05, material, "Front_Wall" + dir, "Front_Wall_" + numberOfWalls)
        wall.position.z = this.ZPosition;

        let dH = (this.Span / 2) * this.Slope;
        let triangleGeometry = new THREE.Geometry();
        triangleGeometry.vertices = [new THREE.Vector3(this.Span / 2, this.Height, this.ZPosition), new THREE.Vector3(0, this.Height + dH, this.ZPosition), new THREE.Vector3(-this.Span / 2, this.Height, this.ZPosition)];
        triangleGeometry.faces = [new THREE.Face3(0, 1, 2)];


        triangleGeometry.computeFaceNormals();
        triangleGeometry.computeVertexNormals();

        //let mesh = new THREE.Mesh(triangleGeometry, new THREE.MeshBasicMaterial({ color: 'rgb(115, 115, 115)', side: THREE.DoubleSide }));
        let mesh = new PebsObject(triangleGeometry, new THREE.MeshBasicMaterial({ color: 'rgb(115, 115, 115)', side: THREE.DoubleSide }), "Front_Wall" + dir, "Front_Wall");


        scene.add(mesh);
        scene.add(wall);

        this.Wall = wall;
        this.Wall.Instance = this;
        this.Triangle = mesh;
        this.Triangle.Instance = this;
        return this;
    }

    SetSpan(span) {
        this.RightCladding.position.x = span / 2;
        this.LeftCladding.position.x = (span / 2) * -1;
        this.Span = span;
    }

    SetHeight(newheight) {
        let oldheight = this.Height;

        this.RightCladding.scale.y *= (newheight / oldheight);
        this.RightCladding.position.y = 0;
        this.RightCladding.position.y = newheight / 2;

        this.LeftCladding.scale.y *= (newheight / oldheight);
        this.LeftCladding.position.y = 0;
        this.LeftCladding.position.y = newheight / 2;

        this.Height = newheight;
    }

    SetLength(newLength) {
        let oldLength = this.Length;

        this.RightCladding.scale.z *= (newLength / oldLength);
        this.RightCladding.position.z = 0;
        this.RightCladding.position.z = -newLength / 2;

        this.LeftCladding.scale.z *= (newLength / oldLength);
        this.LeftCladding.position.z = 0;
        this.LeftCladding.position.z = -newLength / 2;

        this.Length = newLength;
    }

    SetColor(newColor) {
        this.Wall.material.color = new THREE.Color(newColor);
        this.Triangle.material.color = new THREE.Color(newColor);
    }


    toJson(array) {
        var MyFrontWall = {
            "Span": this.Span,
            "Height": this.Height,
            "Slope": this.Slope,
            "ZPosition": this.ZPosition,
            //"Wall": this.Wall,
           // "Triangle": this.Triangle,
        }
        array.push(MyFrontWall);
    }
}

class RoofDouble extends THREE.Mesh {
    constructor(span, length, slope, zPosition) {
        super();
        this.Span = span;
        this.Length = length;
        this.Slope = slope;
        this.ZPosition = zPosition;
        this.RightPivot = null;
        this.LeftPivot = null;
        this.RightRoof = null;
        this.LeftRoof = null;
        this.Color = "rgb(255,0,0)";
    }

    DrawGeometry(scene) {
        var rightRoofMaterial = NewMaterialByColor('rgb(255, 0, 0)');
        var leftRoofMaterial = NewMaterialByColor('rgb(225, 0, 0)');

        let RightEdge = CreateCube(0.000000001, 0.000000001, 2, redMaterial, "Pivot", "Right_Pivot");
        RightEdge.position.x = this.Span / 2;
        RightEdge.position.y = this.ZPosition;
        RightEdge.rotation.z = this.Slope * -1;

        let LeftEdge = CreateCube(0.000000001, 0.000000001, 2, redMaterial, "Pivot", "Left_Pivot");
        LeftEdge.position.x = (this.Span / 2) * -1;
        LeftEdge.position.y = this.ZPosition;
        LeftEdge.rotation.z = this.Slope;

        let theta = Math.atan(this.Slope);
        let cosTheta = Math.cos(theta);
        let finalLength = (0.5 * this.Span) / (cosTheta);

        let RightRoof = CreateCube((finalLength) + .01, .02, this.Length * -1, rightRoofMaterial, "Roof", "Right Roof");
        RightRoof.position.x = 0 - (finalLength / 2);
        RightRoof.position.z = 0 - this.Length / 2;
        this.RightPivot = RightEdge;
        this.RightRoof = RightRoof;
        this.RightRoof.Instance = this;

        let LeftRoof = CreateCube((finalLength) + .01, .02, this.Length * -1, leftRoofMaterial, "Roof", "Left Roof");
        LeftRoof.position.x = 0 + (finalLength / 2);
        LeftRoof.position.z = 0 - this.Length / 2;
        this.LeftPivot = LeftEdge;
        this.LeftRoof = LeftRoof;
        this.LeftRoof.Instance = this;

        RightEdge.add(RightRoof);
        scene.add(RightEdge);

        LeftEdge.add(LeftRoof);
        scene.add(LeftEdge);

        return this;
    }

    SetSlope(newSlope) {
        this.RightPivot.rotation.z = -newSlope;
        this.LeftPivot.rotation.z = newSlope;
        this.Slope = newSlope;
    }

    SetLength(newLength) {
        let oldlength = this.Length;
        this.RightRoof.scale.z *= (newLength / oldlength);
        this.RightRoof.position.z = 0 - (newLength / 2);
        this.LeftRoof.scale.z *= (newLength / oldlength);
        this.LeftRoof.position.z = 0 - (newLength / 2);
        this.Length = newLength;
    }

    SetSpan(newSpan) {
        let oldspan = this.Span;
        this.RightRoof.scale.x *= (newSpan / oldspan);
        this.RightPivot.position.x = newSpan / 2;
        this.RightRoof.position.x = 0 - (newSpan / 4);

        this.LeftRoof.scale.x *= (newSpan / oldspan);
        this.LeftPivot.position.x = (newSpan / 2) * -1;
        this.LeftRoof.position.x = 0 + (newSpan / 4);
        this.Span = newSpan;
    }

    SetHeight(newHeight) {
        this.RightPivot.position.y = newHeight;
        this.LeftPivot.position.y = newHeight;
        this.ZPosition = newHeight;
    }

    SetColor(newColor) {

        this.RightRoof.material.color = new THREE.Color(newColor);
        this.LeftRoof.material.color = new THREE.Color(newColor);
        this.Color = newColor;
    }




    toJson(array) {
        debugger;
        var MyRoofDouble =
        {
            "Span": this.Span,
            "Length": this.Length,
            "Slope": this.Slope,
            "ZPosition": this.ZPosition,
            "Color": this.Color
        }
        array.push(MyRoofDouble);
    }
}

class SingleWindow extends THREE.Mesh {
    constructor(width, height, frameColor, workPlane, x, y, z) {
        super();
        this.Width = width;
        this.Height = height;
        this.FrameColor = frameColor;
        this.WorkPlane = workPlane;
        this.X = x;
        this.Y = y;
        this.Z = z;
        this.Frame = null;
        this.Glass = null;
        this.Window = null;
    }

    DrawGeometry(scene) {
        var frameMaterial = NewMaterialByColor(this.FrameColor);
        var glassMaterial = NewMaterialByColor('rgb(94, 92, 89)');

        var materialGlass = new THREE.MeshLambertMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });

        let Frame;
        let Glass;
        let thick = .1;

        switch (this.WorkPlane) {
            case "front":
                Frame = CreateCube(this.Width, this.Height, thick, frameMaterial, "Window_Frame", "Window_Frame_1");
                Frame.position.x = this.X;
                Frame.position.y = this.Y - this.Height / 2;
                Frame.position.z = this.Z;
                Glass = CreateCube(this.Width - .2, this.Height - .2, thick, materialGlass, "Window_Glass", "Window_Glass_1");
                Glass.position.y = 0;
                if (this.Z >= 0) {
                    Glass.position.z += 0.005;
                }
                else {
                    Glass.position.z -= 0.005;
                }
                break;

            case "side":
                Frame = CreateCube(thick, this.Height, this.Width, frameMaterial, "Window_Frame", "Window_Frame_1");
                Frame.position.x = this.X;
                Frame.position.y = this.Y - this.Height / 2;
                Frame.position.z = this.Z - this.Width / 2;

                Glass = CreateCube(thick, this.Height - .2, this.Width - .2, materialGlass, "Window_Glass", "Window_Glass_1");
                Glass.position.y = 0;
                if (this.X > 0) {
                    Glass.position.x += 0.005;
                }
                else {
                    Glass.position.x -= 0.005;
                }
                break;
        }

        Frame.add(Glass);
        scene.add(Frame);

        Frame.Instance = this;
        Glass.Instance = this;
        this.Window = Frame;
        this.Window.Instance = this;
        return this;
    }

    SetWidth(newWidth) {
        let oldwidth = this.Width;
        switch (this.WorkPlane) {
            case "front":
                this.Window.scale.x *= (newWidth / oldwidth);
                this.Width = newWidth;
                break;

            case "side":
                this.Window.scale.z *= (newWidth / oldwidth);
                this.Width = newWidth;
                break;
        }
    }

    SetHeight(newHeight) {
        let oldHeight = this.Height;
        this.Window.scale.y *= (newHeight / oldHeight);
        this.Window.position.y = this.Y - newHeight / 2;
        this.Height = newHeight;
    }

    SetFrameColor(newColor) {
        this.Window.material.color = new THREE.Color(newColor);
    }


    toJson(array) {
        var MySingleWindow ={
  
            "Width": this.Width,
            "Height": this.Height,
            "FrameColor": this.FrameColor,
            //"WorkPlane": this.WorkPlane,
            "X": this.X,
            "Y": this.Y,
            "Z": this.Z,
           // "Frame": this.Frame,
           // "Glass": this.Glass,
           // "Window": this.Window
        }
        array.push(MySingleWindow);
    }



}

class RowWindow extends THREE.Mesh {
    constructor(pWidth, height, frameColor, workPlane, x, y, z, n) {
        super();
        this.PWidth = pWidth;
        this.TotalWidth = 0;
        this.Height = height;
        this.FrameColor = frameColor;
        this.WorkPlane = workPlane;
        this.Number = n;
        this.X = x;
        this.Y = y;
        this.Z = z;
        this.Frame = null;
        this.Window = null;
        this.Panels = [];
    }


    DrawGeometry(scene) {
        var frameMaterial = NewMaterialByColor(this.FrameColor);
        var glassMaterial = NewMaterialByColor('rgb(94, 92, 89)');

        var materialGlass = new THREE.MeshLambertMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });

        let Frame;
        let thick = .1;

        switch (this.WorkPlane) {
            case "front":
                Frame = CreateCube(.0000001, .0000001, .0000001, frameMaterial, "RowWd_pivot", "Window_pivot_1");
                Frame.position.x = this.X + this.PWidth / 2;
                Frame.position.y = this.Y - this.Height / 2;
                Frame.position.z = this.Z;

                for (var i = 0; i < this.Number; i++) {
                    let frame = CreateCube(this.PWidth, this.Height, thick, frameMaterial, "RowWd_Frame", "Window_Frame_1");
                    let glass = CreateCube(this.PWidth - .2, this.Height - .2, thick, materialGlass, "RowWd_RowGlass", "Window_Glass_1");
                    glass.position.y = 0;
                    if (this.Z === 0) {
                        glass.position.z += 0.005;
                    }
                    else if (this.Z < 0) {
                        glass.position.z -= 0.005;
                    }
                    frame.add(glass);
                    this.Panels.push(frame);
                    Frame.add(frame);
                    frame.Instance = this;
                    glass.Instance = this;
                    frame.position.x += i * this.PWidth;
                    frame.position.y -= this.Height / 2;
                }
                this.TotalWidth = this.PWidth * this.Number;
                Frame.position.z = this.Z;
                break;

            case "side":
                Frame = CreateCube(.0000001, .0000001, .0000001, frameMaterial, "RowWd_pivot", "Window_pivot_1");
                Frame.position.x = this.X;
                Frame.position.y = this.Y - this.Height / 2;
                Frame.position.z = this.Z;

                for (var i = 0; i < this.Number; i++) {
                    let frame = CreateCube(thick, this.Height, this.PWidth, frameMaterial, "RowWd_Frame", "Window_Frame_1");
                    let glass = CreateCube(thick, this.Height - .2, this.PWidth - .2, materialGlass, "RowWd_RowGlass", "Window_Glass_1");
                    glass.position.y = 0;
                    if (this.X > 0) {
                        glass.position.x += 0.005;
                    }
                    else {
                        glass.position.x -= 0.005;
                    }
                    frame.add(glass);
                    this.Panels.push(frame);
                    Frame.add(frame);
                    frame.Instance = this;
                    glass.Instance = this;
                    frame.position.z -= i * this.PWidth;
                    frame.position.y -= this.Height / 2;
                }
                this.TotalWidth = this.PWidth * this.Number;
                Frame.position.x = this.X;
                Frame.position.z = this.Z - this.PWidth / 2;
                break;
        }
        scene.add(Frame);

        Frame.Instance = this;
        this.Window = Frame;
        this.Window.Instance = this;
        return this;
    }

    SetTotalWidth(newWidth) {
        let oldwidth = this.TotalWidth;
        switch (this.WorkPlane) {
            case "front":
                this.Window.scale.x *= (newWidth / oldwidth);
                this.PWidth = newWidth / this.Number;
                this.Window.position.x = this.X + this.PWidth / 2;
                this.TotalWidth = newWidth;
                break;

            case "side":
                this.Window.scale.z *= (newWidth / oldwidth);
                this.TotalWidth = newWidth;
                this.PWidth = newWidth / this.Number;
                this.Window.position.z = this.Z - this.PWidth / 2;
                break;
        }
    }

    SetHeight(newHeight) {
        let oldHeight = this.Height;

        this.Window.scale.y *= (newHeight / oldHeight);
        this.Window.position.y = this.Y - newHeight / 2;

        //for (var i = 0; i < this.Panels.Length; i++) {
        //    this.Panels[i].scale.y *= (newHeight - .4 / oldHeight - .4);
        //    //this.Panels[i].position.y = this.Window.position.y - .2;
        //}


        this.Height = newHeight;
    }

    SetFrameColor(newColor) {
        for (var i = 0; i < this.Panels.length; i++) {
            this.Panels[i].material.color = new THREE.Color(newColor);
        }
        //this.Window.material.color = new THREE.Color(newColor);
    }

    AddPanel() {
        let r = false;
        if (this.Number < 4) {
            r = true;
            var frameMaterial = NewMaterialByColor(this.Window.material.color);
            var glassMaterial = NewMaterialByColor('rgb(94, 92, 89)');

            switch (this.WorkPlane) {
                case "front":
                    let frame = CreateCube(this.PWidth, this.Height, .1, frameMaterial, "RowWd_Frame", "Window_Frame_1");
                    let glass = CreateCube(this.PWidth - .2, this.Height - .2, .1, glassMaterial, "RowWd_RowGlass", "Window_Glass_1");
                    glass.position.y = 0;
                    if (this.Z === 0) {
                        glass.position.z += 0.005;
                    }
                    else if (this.Z < 0) {
                        glass.position.z -= 0.005;
                    }
                    frame.add(glass);
                    this.Panels.push(frame);
                    this.Window.add(frame);
                    frame.Instance = this;
                    glass.Instance = this;
                    frame.position.x = 0 + this.TotalWidth;
                    frame.position.y -= this.Height / 2;
                    this.TotalWidth += this.PWidth;
                    this.Number++;
                    break;

                case "side":
                    let frame1 = CreateCube(.1, this.Height, this.PWidth, frameMaterial, "RowWd_Frame", "Window_Frame_1");
                    let glass1 = CreateCube(.1, this.Height - .2, this.PWidth - .2, glassMaterial, "RowWd_RowGlass", "Window_Glass_1");
                    glass1.position.y = 0;
                    if (this.X > 0) {
                        glass1.position.x += 0.005;
                    }
                    else {
                        glass1.position.x -= 0.005;
                    }
                    frame1.add(glass1);
                    this.Panels.push(frame1);
                    this.Window.add(frame1);
                    frame1.Instance = this;
                    glass1.Instance = this;
                    frame1.position.z = 0 + this.TotalWidth;
                    frame1.position.y -= this.Height / 2;
                    this.TotalWidth += this.PWidth;
                    this.Number++;
                    break;
            }
        }
        return r;
    }

    DeletePanel() {
        //debugger;
        if (this.Panels.length > 1) {
            let lastIndex = this.Panels.length - 1;
            this.Window.remove(this.Panels[lastIndex]);
            this.Panels.pop();
            this.Number -= 1;
            this.TotalWidth -= this.PWidth;
        }

    }



    toJson(array) {
        var MyRowWindow = {
            "PWidth": this.PWidth,
            "TotalWidth": this.TotalWidth,
            "Height": this.Height,
            "FrameColor": this.FrameColor,
           // "WorkPlane": this.WorkPlane,
            "Number": this.Number,
            "X": this.X,
            "Y": this.Y,
            "Z": this.Z,
           // "Frame": this.Frame,
           // "Window": this.Window,
          //  "Panels": this.Window,
        }
        array.push(MyRowWindow);
    }


}

class IBeamColumn {
    constructor(height, flangeWidth, flangeThickness, webHeight, webThickness, x, z) {
        this.Height = height;
        this.FlangeWidth = flangeWidth;
        this.FlangeThickness = flangeThickness;
        this.WebHeight = webHeight;
        this.WebThickness = webThickness;
        this.X = x;
        this.Z = z;
        this.TopFlange = null;
        this.BottomFlange = null;
        this.Web = null;
        this.Column = null;
    }

    DrawGeometry(scene) {
        var webMaterial = NewMaterialByColor('rgb(0, 0, 255)');
        var flangeMaterial = NewMaterialByColor('rgb(0, 0, 200)');

        let parent = CreateCube(0.000000001, 0.0000001, 2, blueMaterial, "Pivot", `column ${this.FlangeWidth} x ${this.WebHeight}_Pivot`);
        parent.position.x = this.X;
        parent.position.z = this.Z;

        let topFlange = CreateCube(this.FlangeThickness, this.Height, this.FlangeWidth, flangeMaterial, "IBeam_Flange", `TopFlange ${this.FlangeWidth} x ${this.FlangeThickness}`);
        topFlange.position.x = 0 - (this.WebHeight / 2);
        topFlange.position.z = 0;
        this.TopFlange = topFlange;

        let bottomFlange = CreateCube(this.FlangeThickness, this.Height, this.FlangeWidth, flangeMaterial, "IBeam_Flange", `BottomFlange ${this.FlangeWidth} x ${this.FlangeThickness}`);
        bottomFlange.position.x = 0 + (this.WebHeight / 2);
        bottomFlange.position.z = 0;
        this.BottomFlange = bottomFlange;

        let web = CreateCube(this.WebHeight, this.Height, this.WebThickness, webMaterial, "IBeam_Web", `Web ${this.WebHeight} x ${this.WebThickness}`);
        this.Web = web;

        parent.add(topFlange);
        parent.add(bottomFlange);
        parent.add(web);

        scene.add(parent);

        this.Column = parent;
        this.Column.Instance = this;
        return parent;
    }

    SetFlangeSize(newWidth, newThickness) {
        let oldwidth = this.FlangeWidth;
        let oldthickness = this.FlangeThickness;

        this.TopFlange.scale.x *= (newThickness / oldthickness);
        this.TopFlange.scale.z *= (newWidth / oldwidth);
        this.TopFlange.position.x = 0 - (this.WebHeight / 2) - (newThickness / 2);

        this.BottomFlange.scale.x *= (newThickness / oldthickness);
        this.BottomFlange.scale.z *= (newWidth / oldwidth);
        this.BottomFlange.position.x = 0 + (this.WebHeight / 2) + (newThickness / 2);

        this.FlangeWidth = newWidth;
        this.FlangeThickness = newThickness;
    }

    SetWebSize(newHeight, newThickness) {
        let oldheight = this.WebHeight;
        let oldthickness = this.WebThickness;

        this.Web.scale.x *= (newHeight / oldheight);
        this.Web.scale.z *= (newThickness / oldthickness);

        this.TopFlange.position.x = 0 - (newHeight) / 2;
        this.BottomFlange.position.x = 0 + (newHeight) / 2;

        this.WebHeight = newHeight;
        this.WebThickness = newThickness;
    }

    SetHeight(newHeight) {
        let oldheight = this.Height;

        this.Instance.scale.y *= (newHeight / oldheight);
        this.Instance.position.y = 0;
        this.Height = newHeight;
    }
}   /////not but json

class Bay extends THREE.Mesh {

    constructor(length, width, zPosition) {
        super();
        this.Length = length;
        this.Width = width;
        this.ZPosition = zPosition;
        this.Instance = null;
        this.RightBoundary = null;
        this.LeftBoundary = null;
        this.Next = null;
        this.Previous = null;
        this.Dimension = null;
        //Bay.Count++;
    }

    DrawGeometry(scene) {
        let originMaterial = NewMaterialByColor('rgb(0, 67, 168)');
        let boundaryMaterial = NewMaterialByColor('rgb(255, 255, 255)');
        let Bay = CreateCube(this.Length, .001, this.Width * -1, originMaterial, "Bay", "Bay-NO.");

        let rightBoundary = CreateCube(this.Length, .001, this.Width / 80, boundaryMaterial, "Boundary", "right-boundary");
        rightBoundary.position.z = 0 - (this.Width / 2) + .03;
        rightBoundary.position.y = .01;
        this.RightBoundary = rightBoundary;

        let leftBoundary = CreateCube(this.Length, .001, this.Width / 80, boundaryMaterial, "Boundary", "left-boundary");
        leftBoundary.position.z = 0 + (this.Width / 2) - .03;
        leftBoundary.position.y = .01;
        this.LeftBoundary = leftBoundary;

        Bay.add(rightBoundary);
        Bay.add(leftBoundary);
        Bay.position.z = this.ZPosition - this.Width / 2;
        this.Instance = Bay;
        scene.add(Bay);

        //let text = document.createElement('label');
        //text.innerText = "Moamen";
        //document.getElementById("TemplateProductionBays").append(text);

        let dim = new PebsDimension((this.Length / -2) - 0.25, this.ZPosition, this.Width, "z");
        dim.DrawGeometry(scene);
        //dim.DimensionLine.material.color.setHex(Math.random() * 0xbf2020);
        this.Dimension = dim;
        Bay.Instance = this;
        return Bay;
    }

    SetWidth(newWidth) {
        //debugger;
        let oldWidth = this.Width;
        let Incerment = newWidth - oldWidth;
        this.Instance.scale.z *= (newWidth / oldWidth);
        this.Instance.position.z = this.ZPosition - (newWidth / 2);

        this.Dimension.SetLength(newWidth);
        let current = this;
        while (current.Next != null) {
            //debugger;
            //Note Next = Instance = Gemoetry of the bay
            current.Next.Instance.position.z -= Incerment;
            current.Next.ZPosition -= Incerment;
            current.Next.Dimension.DimensionLine.position.z -= Incerment;
            current.Next.Dimension.ZPosition -= Incerment;
            current.Next.Dimension.StartExtent.position.z -= Incerment;
            current.Next.Dimension.EndExtent.position.z -= Incerment;
            current.Next.Dimension.Text.position.z -= Incerment;
            current = current.Next;
        }
        this.Width = newWidth;
        //this.ZPosition = this.Instance.position.z + (newWidth / 2);
        return Incerment;
        //return newWidth;
    }

    toJson(array) {
        var mybay =
        {
            "Width": this.Width
        }
        array.push(mybay);
    }
}   /////not but json

class SingleDoor extends THREE.Mesh {
    constructor(width, height, color, workPlane, x, z) {
        super();
        this.Width = width;
        this.Height = height;
        this.Color = color;
        this.WorkPlane = workPlane;
        this.X = x;
        this.Y = 0.0;
        this.Z = z;
        this.Door = null;
        this.DoorHandle = null;
    }

    DrawGeometry(scene, handleTexturePath) {
        let door = null;
        let doorHandel = null;
        let thick = .1;



        let handleMaterial = NewMaterialByColor("rgb(203,110,0)");
        let sphereMat = NewMaterialByColor("rgb(136,74,0)");
        let doorMaterial = NewMaterialByColor(this.Color);

        var geometrySphere = new THREE.SphereGeometry(0.04, 100, 100);
        var sphere = new THREE.Mesh(geometrySphere, sphereMat);

        switch (this.WorkPlane) {
            case "front":
                door = CreateCube(this.Width, this.Height, thick, doorMaterial, "Door_Single", "Door_Single__Front");
                door.position.x = this.X;
                door.position.y = 0 + this.Height / 2;
                door.position.z = this.Z;
                doorHandel = CreateCube(.15, 0.4, .05, handleMaterial, "Door_Single_Handle", "Door_Single_Handle");
                doorHandel.position.y = 0;
                doorHandel.position.x = (-this.Width / 2) + .15;
                if (this.Z === 0) {
                    doorHandel.position.z = +.05;
                    sphere.position.z = +.03;
                }
                else if (this.Z < 0) {
                    doorHandel.position.z = -.05;
                    sphere.position.z = -.03;
                }
                break;

            case "side":
                door = CreateCube(thick, this.Height, this.Width, doorMaterial, "Door_Single", "Door_Single_Side");
                door.position.x = this.X;
                door.position.y = 0 + this.Height / 2;
                door.position.z = this.Z - this.Width / 2;
                doorHandel = CreateCube(.05, .4, .15, handleMaterial, "Door_Single_Handle", "Door_Single_Handle");
                doorHandel.position.y = 0;
                doorHandel.position.z = (this.Width / 2) - .15;
                if (this.X > 0) {
                    doorHandel.position.x = +.05;
                    sphere.position.x = +.03;
                }
                else if (this.X < 0) {
                    doorHandel.position.x = -.05;
                    sphere.position.x = -.03;
                }
                //doorHandel.position.x = -.005;

                break;
        }
        doorHandel.add(sphere);
        door.add(doorHandel);
        scene.add(door);

        this.Door = door;
        this.Door.Instance = this;
        this.DoorHandle = doorHandel;



       


        return this;
    }

    SetWidth(newWidth) {
        let oldWidth = this.Width;
        switch (this.WorkPlane) {
            case "front":
                this.Door.scale.x *= (newWidth / oldWidth);
                this.Width = newWidth;
                break;

            case "side":
                this.Door.scale.z *= (newWidth / oldWidth);
                this.Width = newWidth;
                break;
        }
    }

    SetHeight(newHeight) {
        let oldHeight = this.Height;
        this.Door.scale.y *= (newHeight / oldHeight);
        this.Door.position.y = 0 + newHeight / 2;
        this.Height = newHeight;
    }

    SetColor(newColor) {
        this.Door.material.color = new THREE.Color(newColor);
    }

    toJson(array) {
        var MySingleDoor = {
            "Width": this.Width,
            "Height": this.Height,
            "Color": this.Color,
           // "WorkPlane": this.WorkPlane,
            "X": this.X,
            "Y": this.Y,
            "Z": this.Z,
          //  "Door": this.Door,
           // "DoorHandle": this.DoorHandle,

        }
        array.push(MySingleDoor);
    }



}

class SectionalDoor extends THREE.Mesh {
    constructor(width, height, workPlane, x, z) {
        super();
        this.Width = width;
        this.Height = height;
        this.WorkPlane = workPlane;
        this.X = x;
        this.Y = 0.0;
        this.Z = z;
        this.Door = null;
        this.Color = "rgb(0, 131, 136)";
    }

    DrawGeometry(scene, imgPath) {
        let door = null;
        let doorHandel;
        let thick = .1;

        let _texture = new THREE.TextureLoader().load(imgPath);
        let material = new THREE.MeshBasicMaterial({ map: _texture });

        //let handleTexture = new THREE.TextureLoader().load(handleTexturePath);
        //let handleMaterial = new THREE.MeshBasicMaterial({ map: handleTexture });
        switch (this.WorkPlane) {
            case "front":
                door = CreateCube(this.Width, this.Height, thick, material, "Door_Sectional", "Door_Sectional__Front");
                door.position.x = this.X;
                door.position.y = 0 + this.Height / 2;
                door.position.z = this.Z;
                break;

            case "side":
                door = CreateCube(thick, this.Height, this.Width, material, "Door_Sectional", "Door_Sectional_Side");
                door.position.x = this.X;
                door.position.y = 0 + this.Height / 2;
                door.position.z = this.Z - this.Width / 2;
                break;
        }
        scene.add(door);

        this.Door = door;
        this.Door.Instance = this;
        return this;
    }

    SetWidth(newWidth) {
        let oldWidth = this.Width;
        switch (this.WorkPlane) {
            case "front":
                this.Door.scale.x *= (newWidth / oldWidth);
                //this.Door.position.x = this.X - (newWidth / 2);
                this.Width = newWidth;
                break;

            case "side":
                this.Door.scale.z *= (newWidth / oldWidth);
                //this.Door.position.z = this.Z - newWidth / 2;
                this.Width = newWidth;
                break;
        }
    }

    SetHeight(newHeight) {
        let oldHeight = this.Height;
        this.Door.scale.y *= (newHeight / oldHeight);
        this.Door.position.y = 0 + newHeight / 2;
        this.Height = newHeight;
    }

    SetColor(newColor) {
        this.Door.material.color = new THREE.Color(newColor);
        this.Color = newColor;
    }

    toJson(array) {
    var MySectionalDoor = {
            "Width": this.Width,
            "Height": this.Height,
            "Color": this.Color,
            "X": this.X,
            "Y": this.Y,
            "Z": this.Z,
        }
    array.push(MySectionalDoor);
    }
}

class CProjectMousePosToXYPlaneHelper {
    constructor() {
        this.m_vPos = new THREE.Vector3();
        this.m_vDir = new THREE.Vector3();
    }

    Compute(nMouseX, nMouseY, Camera, vOutPos) {
        let vPos = this.m_vPos;
        let vDir = this.m_vDir;

        vPos.set(
            -1.0 + 2.0 * nMouseX / 1367,
            -1.0 + 2.0 * nMouseY / 320,
            0.5
        ).unproject(Camera);

        // Calculate a unit vector from the camera to the projected position
        vDir.copy(vPos).sub(Camera.position).normalize();

        // Project onto z=0
        let flDistance = -Camera.position.z / vDir.z;
        vOutPos.copy(Camera.position).add(vDir.multiplyScalar(flDistance));
    }
}

// #region For Test*/
class Column {
    constructor(length, width, height) {
        this.length = length;
        this.width = width;
        this.height = height;
        this.Instance = null;
    }

    Create(scene) {
        var blueMaterial = NewMaterialByColor(0x0000ff);
        let column = CreateCube(this.length, this.height, this.width, blueMaterial);
        column.name = "PEBS-PBJECT";
        scene.add(column);
        this.Instance = column;
        return column;
    }

    SetSize(newLength, newWidth, newHeight, oldLength, oldWidth, oldHeight) {
        this.Instance.scale.x = newLength / oldLength;
        this.Instance.scale.z = newWidth / oldWidth;
        this.Instance.scale.y = newHeight / oldHeight;
        this.Instance.position.y = 0;
        this.Instance.position.y = newHeight / 2;
        //Still Needs to update the column dimension itself
        this.length = newLength;
        this.width = newWidth;
        this.height = newHeight;
    }

    SetLength(newLength, oldLength) {
        this.Instance.scale.x = newLength / oldLength;
        this.length = newLength;
    }

    SetWidth(newWidth, oldWidth) {
        this.Instance.scale.z = newWidth / oldWidth;
        this.width = newWidth;
    }

    SetHeight(newHeight, oldHeight) {
        this.Instance.scale.y = newHeight / oldHeight;
        this.Instance.position.y = 0;
        this.Instance.position.y = newHeight / 2;
        this.height = newHeight;
    }
}

class ISpan {
    constructor(span) {
        this.Span = span;
    }

    EditSpan(newSpan, right, left) {
        right.position.x = newSpan / 2;
        left.position.x = (newSpan / 2) * -1;
        this.Span = newSpan;
    }
}

class ILength {
    constructor(length) {
        this.Length = length;
    }

    EditLength(newLength, right, left) {
        let oldLength = this.Length;
        right.scale.z *= (newLength / oldLength);
        right.position.z = 0;
        right.position.z = -newLength / 2;

        left.scale.z *= (newLength / oldLength);
        left.position.z = 0;
        left.position.z = -newLength / 2;
        this.Length = newLength;
    }
}

class IHeight {
    constructor(height) {
        this.Height = height;
    }

    EditHeight(newHeight, right, left) {
        let oldheight = this.Height;

        right.scale.y *= (newHeight / oldheight);
        right.position.y = 0;
        right.position.y = newHeight / 2;

        left.scale.y *= (newHeight / oldheight);
        left.position.y = 0;
        left.position.y = newHeight / 2;
        this.Height = newHeight;
    }
}

class MyWindow {
    constructor(hieght, width, materialUrl, x, y) {
        this.hieght = hieght;
        this.width = width;
        this.materialUrl = materialUrl;
        this.x = x;
        this.y = y;
        this.Window = null;
    }
    DrawWindow(scene, material) {
        var Windowgeometry = new THREE.BoxGeometry(this.hieght, this.width, .1);
        //THREE.ImageUtils.crossOrigin = '';
        //var Windowtexture = THREE.ImageUtils.loadTexture(this.materialUrl);
        //Windowtexture.anisotropy = renderer.getMaxAnisotropy();
        var WindowMaterial = [
            new THREE.MeshBasicMaterial({
                color: 'White' //left
            }),
            new THREE.MeshBasicMaterial({
                color: 'White' // top
            }),
            new THREE.MeshBasicMaterial({
                color: 'White' // bottom
            }),
            new THREE.MeshBasicMaterial({
                color: 'White' //
            }),
            new THREE.MeshBasicMaterial({
                map: material //front
            }),
            new THREE.MeshBasicMaterial({
                map: material //front
            }),
        ];
        this.Window = new THREE.Mesh(Windowgeometry, WindowMaterial);
        this.Window.position.x = this.x;
        this.Window.position.y = this.y;
        scene.add(this.Window);
        //camera.position.z = 3;
    }
    MoveWindow(X, Y) {
        this.x = X;
        this.y = Y;
        // this.DrawWindow(scene);
        this.Window.position.x = this.x;
        this.Window.position.y = this.y;
    }

    toJson(array) {
        var MyWindow = {
            "hieght": this.hieght,
            "width": this.width,
            "materialUrl": this.materialUrl,
            "X": this.x,
            "Y": this.y,
            "Window": this.Window,
        }
        array.push(MyWindow);
    }


}
// #endregion For Test*/