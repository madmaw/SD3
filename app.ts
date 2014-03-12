
//request animation frame shim

(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
        || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
} ());


window.onload = () => {
    var svg = document.getElementById('svg');
    var controls = document.getElementById("controls");
    var textarea = <HTMLTextAreaElement>document.getElementById("log");
    var rotateLeft = <HTMLButtonElement>document.getElementById("rotate-left");
    var rotateRight = <HTMLButtonElement>document.getElementById("rotate-right");
    var tiltUp = <HTMLButtonElement>document.getElementById("tilt-up");
    var tiltBack = <HTMLButtonElement>document.getElementById("tilt-back");
    var redraw = <HTMLButtonElement>document.getElementById("redraw");
    var rebuild = <HTMLButtonElement>document.getElementById("rebuild");
    var clearDebug = <HTMLButtonElement>document.getElementById("clear-debug");
    var toggleDebug = <HTMLButtonElement>document.getElementById("toggle-debug");
    var incButton = <HTMLButtonElement>document.getElementById("inc");
    var decButton = <HTMLButtonElement>document.getElementById("dec");
    var pauseButton = <HTMLButtonElement>document.getElementById("pause");
    var w = document.documentElement.clientWidth;
    var h = document.documentElement.clientHeight - controls.clientHeight;


    svg.setAttribute("width", ""+w);
    svg.setAttribute("height", "" + h);

    var oldLog = console.log;
    console.log = function () {
        oldLog.apply(console, arguments);
        textarea.value += "" + arguments[0] + '\n';
        textarea.scrollTop = textarea.scrollHeight;
    };
    
    var contentElement = document.getElementById('content');
    var debugContainer = document.getElementById('debug-container');
    var debugRectPrototype = document.getElementById('debug-bounds');
    var debugLinePrototype = document.getElementById('debug-order');
    svg.removeChild(debugRectPrototype);
    svg.removeChild(debugLinePrototype);

    var groupElement = document.getElementById("group");
    svg.removeChild(groupElement);

    var camera = new SD3.CameraSD3();
    camera.setRotationZ(0);
    var view = new SD3.ViewSVGGroupMainSD3(contentElement, camera);
    view.setViewDimensions(w, h);
    view.setViewPosition(-w/2, -h/2);
    var viewMain = new SD3.ViewDebugProxySD3(view, debugContainer, <SVGRectElement><any>debugRectPrototype, <SVGLineElement><any>debugLinePrototype);
    viewMain.debugging = false;
    SD3.VISUAL_DEBUG = viewMain;


    var eastElement = document.getElementById('east');
    svg.removeChild(eastElement);

    var northElement = document.getElementById('north');
    svg.removeChild(northElement);

    var westElement = document.getElementById('west');
    svg.removeChild(westElement);

    var southElement = document.getElementById('south');
    svg.removeChild(southElement);

    var topElement = document.getElementById('top');
    svg.removeChild(topElement);

    var ballElement = document.getElementById('ball');
    svg.removeChild(ballElement);

    var arrowElement = document.getElementById("arrow");
    var arrowRotaterElement = document.getElementById("arrow-rotater");
    svg.removeChild(arrowElement);

    var arrow2Element = document.getElementById("arrow2");
    svg.removeChild(arrow2Element);

    var wallWidth = 100;
    var wallHeight = 50;
    var ballDiameter = 80;

    var objectGroupA = new SD3.ObjectGroupSD3(camera);
    var objectGroupB = new SD3.ObjectGroupSD3(camera);
    var objectGroup = new SD3.ObjectGroupSD3(camera);

    objectGroup.setView(viewMain, true);
    objectGroup.setObject("a", objectGroupA, new SD3.PointSD3(0, 0, 0), 0 * Math.PI / 3);
    //objectGroup.setObject("b", objectGroupB, new SD3.PointSD3(0, 0, 0), 0);

    var westObject = new SD3.ObjectVerticalSurfaceSD3(<Element>westElement.cloneNode(true), camera, Math.PI, wallWidth, wallHeight);
    /*
    var eastObject = new SD3.ObjectVerticalSurfaceSD3(eastElement, 0, wallWidth, wallHeight);
    var westObject = new SD3.ObjectVerticalSurfaceSD3(westElement, Math.PI, wallWidth, wallHeight);
    var southObject = new SD3.ObjectVerticalSurfaceSD3(southElement, Math.PI / 2, wallWidth, wallHeight);
    var northObject = new SD3.ObjectVerticalSurfaceSD3(northElement, Math.PI * 3 / 2, wallWidth, wallHeight);
    */
    var topObject = new SD3.ObjectHorizontalSurfaceSD3(topElement, camera, wallWidth, wallWidth);

    var width = 5;
    var height = 5;
    var depth = 5;

    var unorderedGroupView = new SD3.ViewSVGGroupListSD3(groupElement, new SD3.UnorderedListSD3<SD3.ViewSVGGroupListNodeSD3>());

    var boxObject = SD3.ObjectGroupCubeSD3.create(camera, unorderedGroupView, wallWidth, wallWidth, wallHeight, topElement, eastElement, northElement, westElement, southElement);
    var boxObject2 = boxObject.clone();

    var ballObject = new SD3.ObjectSphereSD3(ballElement, camera, ballDiameter);

    var arrowObject = new SD3.ObjectVerticalSurfaceSD3(arrowElement, camera, 0, 140, 80, true);

    var arrow2Object = new SD3.ObjectSphereSD3(arrow2Element, camera, 70);

    // note the coordinates are SVG-ish
    /*
    objectGroupA.setObject("east", eastObject, new SD3.PointSD3(wallWidth / 2, wallWidth / 2, 0), 0);
    objectGroupA.setObject("south", southObject, new SD3.PointSD3(-wallWidth / 2, wallWidth / 2, 0), 0);
    objectGroupA.setObject("north", northObject, new SD3.PointSD3(wallWidth / 2, -wallWidth / 2, 0), 0);
    */
    //objectGroupA.setObject("top", topObject, new SD3.PointSD3(0, 0, -200), 0);
    //objectGroupA.setObject("west", westObject, new SD3.PointSD3(0, 0, -200), 0);


    var fill = function (x: number, y: number, z: number) {
        return x >= 0 && y >= 0 && z >= 0 && x < width && y < height && z < depth && x + z > y;
    };

    var fill = function (x: number, y: number, z: number) {
        if (x == 2 && y == 2) {
            return z >= 0 && z < depth;
        } else {
            return x >= 0 && y >= 0 && z >= 0 && x < width && y < height && z < depth && z == depth - 1;
        }
    };

    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            for (var z = 0; z < depth; z++) {
                if (fill(x, y, z)) {
                    var boxCopy = <SD3.ObjectGroupCubeSD3>boxObject.clone();
                    if (fill(x-1, y, z)) {
                        boxCopy.hide(SD3.ObjectGroupCubeSD3.FACE_WEST);
                    }
                    if (fill(x+1, y, z)) {
                        boxCopy.hide(SD3.ObjectGroupCubeSD3.FACE_EAST);
                    }
                    if (fill(x, y-1, z)) {
                        boxCopy.hide(SD3.ObjectGroupCubeSD3.FACE_NORTH);
                    }
                    if (fill(x, y+1, z)) {
                        boxCopy.hide(SD3.ObjectGroupCubeSD3.FACE_SOUTH);
                    }
                    if (fill(x, y, z-1)) {
                        boxCopy.hide(SD3.ObjectGroupCubeSD3.FACE_TOP);
                    }
                    var offset = new SD3.PointSD3(x * wallWidth, y * wallWidth, z * wallHeight);
                    objectGroupA.setObject("box (" + x + "," + y + "," + z + ")", boxCopy, offset, 0);
                }
            }
        }
    }
   // objectGroupA.setObject("arrow2", arrow2Object, new SD3.PointSD3(w / 2, h / Math.cos(Math.PI / 3), -38), 0);

    objectGroupB.setObject("ball", ballObject, new SD3.PointSD3(w / 2, h / Math.cos(Math.PI / 3), 0), 0);


    var time = 0;
    var pauseTime = (new Date()).getTime();
    //view.setViewPosition(0, 0);
    var on = false;
    camera.setRotationX(Math.PI/3);
    objectGroup.render(0, 0, 0, 0, false);

    var transaction: SD3.ViewSVGGroupMainTransactionSD3 = null;
    var transforming = false;

    // add in some interactivity
    var hammer = new Hammer(svg, {
        swipe: false
    });
    hammer.on('dragstart', function (event: HammerEvent) {
        // do nothing
        if (transaction == null) {
            transaction = view.begin();
        }
    });
    hammer.on('dragend', function (event: HammerEvent) {
        // do nothing
        transaction = null;
    });
    hammer.on('drag', function (event: HammerEvent) {
        if (transaction != null && !transforming) {
            transaction.setViewPositionOffset(-event.gesture.deltaX, -event.gesture.deltaY);
            objectGroup.render(0, 0, 0, view.camera.getRotationZ(), false);
        }
    });
    hammer.on('transformstart', function (event: HammerEvent) {
        console.log("transform started");
        if (transaction == null) {
            transaction = view.begin();
            transforming = true;
        }
    });
    hammer.on('transformend', function (event: HammerEvent) {
        console.log("transform ended");
        transaction = null;
        transforming = false;
    });
    hammer.on('rotate', function (event: HammerEvent) {
        if (transaction != null) {
            console.log("rotated");
            var dRotation = (event.gesture.rotation * Math.PI) / 180;
            transaction.setViewRotationZOffset(dRotation, event.gesture.center.pageX, event.gesture.center.pageY);

            objectGroup.render(0, 0, 0, view.camera.getRotationZ(), true);
        }
    });
    hammer.on('pinch', function (event: HammerEvent) {
        if (transaction != null) {
            console.log("pinched");
            transaction.multiplyViewScale(event.gesture.scale, event.gesture.center.pageX, event.gesture.center.pageY);
            objectGroup.render(0, 0, 0, view.camera.getRotationZ(), true);
        }

    });
    hammer.on('doubletap', function (event: HammerEvent) {
        var tx = view.begin();
        //tx.setViewRotationZOffset(Math.PI / 12, event.gesture.center.pageX, event.gesture.center.pageY);
        //tx.multiplyViewScale(1/view._viewScale, event.gesture.center.pageX, event.gesture.center.pageY);
        //objectGroup.render(0, 0, 0, view.camera.getRotationZ(), true);
        /*
        var tx = view.begin();
        tx.setViewRotationZOffset(Math.PI / 12, event.gesture.center.pageX, event.gesture.center.pageY);
        objectGroup.render(0, 0, 0, view.camera.getRotationZ(), viewMain, true);
        */
        view.foreach(function (node: SD3.ViewSVGGroupGraphNodeSD3) {
            var screenPoint = view.getScreenPoint(event.gesture.center.pageX, event.gesture.center.pageY);
            var bounds = node._render.getBounds();
            console.log(bounds);
            if (bounds.contains(screenPoint.x, screenPoint.y)) {
                view.removeTreeNode(node);
                view.redraw();
                return false;
            } else {
                return true;
            }
        });

    });

    hammer.on('tap', function (event: HammerEvent) {
        var p = view.getWorldPoint(event.gesture.center.pageX, event.gesture.center.pageY);
        console.log(event.gesture.center);
        console.log(p);
        var e = document.elementFromPoint(event.gesture.center.pageX, event.gesture.center.pageY);
        console.log(e);
        view.foreach(function (node: SD3.ViewSVGGroupGraphNodeSD3) {
            var screenPoint = view.getScreenPoint(event.gesture.center.pageX, event.gesture.center.pageY);
            var bounds = node._render.getBounds();
            console.log(bounds);
            if (bounds.contains(screenPoint.x, screenPoint.y)) {
                var z = node._render.getScreenDepth(screenPoint.x, screenPoint.y);
                console.log(z);
            }
            return true;
        });
        /*
        var tx = view.begin();
        tx.setViewRotationZOffset(Math.PI / 12, event.gesture.center.pageX, event.gesture.center.pageY);
        objectGroup.render(0, 0, 0, view.camera.getRotationZ(), viewMain, true);
        */
    });
    /*
    document["ontouchstart"] = function (e: UIEvent) {
        // also stops any kind of interaction with UI elements!
        e.preventDefault();
    };
        */
    document["ontouchmove"] = function (e: UIEvent) {
        e.preventDefault();
    };
    document.onmousewheel = function (e: MouseWheelEvent) {
        //view.setScale(view.getScale() + e.wheelDelta * 0.001);
        var tx = view.begin();
        tx.multiplyViewScale(1 + e.wheelDelta * 0.001, e.clientX, e.clientY);
        objectGroup.render(0, 0, 0, view.camera.getRotationZ(), false);

    };
    rotateLeft.onclick = function () {
        var tx = view.begin();
        tx.setViewRotationZOffset(Math.PI / 8, w / 2, h / 2);
        objectGroup.render(0, 0, 0, view.camera.getRotationZ(), true);

    };
    rotateRight.onclick = function () {
        var tx = view.begin();
        tx.setViewRotationZOffset(-Math.PI / 8, w / 2, h / 2);
        objectGroup.render(0, 0, 0, view.camera.getRotationZ(), true);

    };
    tiltUp.onclick = function () {
        var rotationX = camera.getRotationX() - Math.PI / 24;
        camera.setRotationX(rotationX);
        objectGroup.render(0, 0, 0, view.camera.getRotationZ(), true);
    };
    tiltBack.onclick = function () {
        var rotationX = camera.getRotationX() + Math.PI / 24;
        camera.setRotationX(rotationX);
        objectGroup.render(0, 0, 0, view.camera.getRotationZ(), true);
    };
    redraw.onclick = function () {
        //view.invalidate();
        //objectGroup.render(0, 0, 0, view.camera.getRotationZ(), true);
        view.redraw();
    }
    rebuild.onclick = function () {
        view.invalidate();
        objectGroup.render(0, 0, 0, view.camera.getRotationZ(), true);
        view.redraw();
    }
    clearDebug.onclick = function () {
        viewMain.clear();
    }
    toggleDebug.onclick = function () {
        viewMain.debugging = !viewMain.debugging;
    }
    incButton.onclick = function () {
        time += 100;
        inc(true);
    }
    decButton.onclick = function () {
        time -= 100;
        inc(true);
    }
    pauseButton.onclick = function () {
        if (pauseTime) {
            pauseTime = null;
            pauseButton.textContent = "Pause";
        } else {
            pauseTime = (new Date()).getTime();
            pauseButton.textContent = "Start";
        }
        
    }


    var inc = function (manual: boolean = false) {
        var now;
        if (!pauseTime || manual == true) {
            if (pauseTime) {
                now = pauseTime;
            } else {
                now = (new Date()).getTime();
            }
            var dTime = now - time;
            //var dTime = time;
            //var xRotation = Math.PI / 2;
            /*
            var xRotation = Math.PI / 4;
            if (on) {
                xRotation = 0;
                zRotation = Math.PI / 2;
                on = false;
            } else {
                zRotation = 0;
                on = true;
            }
            */
            //zRotation = -dTime / 4000;

            //arrowRotaterElement.setAttribute("transform", "rotate(" + (dTime / 100) % 360 + ")");
            //objectGroup.setObject("arrow", arrowObject, new SD3.PointSD3(width * wallWidth / 2, height * wallHeight / 2, -80), -(dTime / 4000) % (Math.PI * 2), true);
            objectGroup.setObject("lift", boxObject, new SD3.PointSD3(2 * wallWidth, 1 * wallWidth, (depth - 2) * (wallHeight / 2) + ((depth - 2) * wallHeight / 2) * Math.cos(dTime / 4000)), 0 * -(dTime / 10000) % (Math.PI * 2), true);
            objectGroup.setObject("slider", boxObject2, new SD3.PointSD3(wallWidth + ((width) * wallWidth / 2) * Math.sin(dTime / 4000), 3 * wallWidth, wallHeight * (depth - 2)), 0, true);
            //objectGroup.render(0, 0, 0, view.camera.getRotationZ(), true);
            //objectGroup.setObject("a", objectGroupA, new SD3.PointSD3(wallWidth * 2, 0, 0), (zRotation * 2) % (Math.PI * 2));
            //arrowObject.zRotation = -(zRotation * 2) % (Math.PI * 2);

            //camera.setRotationX(xRotation);
            //objectGroup.render(Math.sin(dTime / 5000) * wallWidth * 5, 0, 0, 0, viewMain, false);
            // requestanimationframe supplies a number as the first parameter
        }
        if (manual != true) {
            requestAnimationFrame(inc);
        }
    };

    //objectGroup.setObject("lift", boxObject, new SD3.PointSD3(0 * wallWidth, 1 * wallWidth, 0 * wallHeight), 0, true);
    
    inc();
};