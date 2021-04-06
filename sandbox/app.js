import {Init} from "../init.js"
import * as vec3 from "../koz-matrix/vec3.js"
import {Camera} from "../camera.js"
import * as Utils from "../utils.js"
import * as Functions from "./functions.js"
import StateMachine from "./state_machine.js"
import {downloadMeshes} from "./objects.js"

function init() {
    let renderingContext = new Init("scene");
    let camera = new Camera(vec3.createVector(0, 5, 5), vec3.createVector(0, -5, -5),
        vec3.createVector(0, +1, 0), renderingContext.gl.width / renderingContext.gl.height);
    let stateMachine = new StateMachine(4);
    let assets = []
    obj_utils.bindRenderingContext(renderingContext)
    obj_utils.bindContainer(assets)
    downloadMeshes(() => {
        Functions.deployCubes(assets.slice(0, 625))
        assets[625].scale(2, 1, 2)
        assets[625].translate(25, -1.5, 25)
        Functions.addAssetsToBuffer(assets, renderingContext)
    })

    document.addEventListener("mousemove", (event) => (Functions.mouseMove(camera, event)))
    document.addEventListener("keydown", (event) => (Functions.keyDown(renderingContext, camera, event)))

    animate(renderingContext, camera, stateMachine, assets);
}

function animate(renderingContext, camera, stateMachine, assets) {
    camera.update();
    stateMachine.updateIndependentVariables()
    renderingContext.drawScene(camera)
    requestAnimationFrame(function () {
        animate(renderingContext, camera, stateMachine, assets)
    });
}

window.onload = function () {
    init()
};
