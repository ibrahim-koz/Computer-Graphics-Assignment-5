import {timeToRadian} from "../utils.js"
import * as mat4 from "../koz-matrix/mat4.js"

export function scaleAssets(assets, iv) {
    const scaleRatio = Math.asin(Math.sin(iv)) * (1 / Math.PI) + 1
    for (let i = 0; i < assets.length; i++)
        assets[i].scale(scaleRatio, scaleRatio, 1)
}

export function rotateAssets(assets, iv) {
    let rotationAngle = timeToRadian(iv)
    for (let i = 0; i < assets.length; i++)
        assets[i].rotate(0, 0, rotationAngle)
}

export function translateAssets(assets, iv) {
    for (let i = 0; i < assets.length; i++)
        assets[i].translate(iv, iv, 0)
}

export function start_spin(stateMachine) {
    stateMachine.changeState(0, true)
}

export function stop_spin(stateMachine) {
    stateMachine.changeState(0, false)
}

export function spin_speed(stateMachine, takenSpeed) {
    stateMachine.setSpeedOfCounter(0, takenSpeed)
}

export function start_scale(stateMachine) {
    stateMachine.changeState(1, true)
}

export function stop_scale(stateMachine) {
    stateMachine.changeState(1, false)
}

export function start_spiral(stateMachine) {
    stateMachine.changeState(2, true)
}

export function stop_spiral(stateMachine) {
    stateMachine.changeState(2, false)
}

export function spiral_speed(stateMachine, takenSpeed) {
    stateMachine.setSpeedOfCounter(2, takenSpeed)
}

export function addAssetsToBuffer(assets, renderingContext) {
    for (let i = 0; i < assets.length; i++) {
        renderingContext.addPositionBuffer(assets[i])
        renderingContext.addTextureBuffer(assets[i])
        renderingContext.addNormalBuffer(assets[i])
    }
}


export function resetModelMatricesOfAssets(assets) {
    for (let i = 0; i < assets.length; i++) {
        assets[i].modelMatrix = mat4.createIdentityMatrix()
    }
}

export function mouseMove(camera, event) {
    if (!camera.lock) {
        camera.yawl += event.movementX * 0.1
        camera.pitch -= event.movementY * 0.1

        if (camera.pitch > 89.0)
            camera.pitch = 89.0;
        if (camera.pitch < -89.0)
            camera.pitch = -89.0;

        camera.cameraFront = mat4.lookAround(camera.pitch, camera.yawl)
    }
}

export function keyDown(renderingContext, camera, event) {
    if (event.key === "ArrowDown") {
        camera.cameraPosition[2] += 0.1
    } else if (event.key === "ArrowLeft") {
        camera.cameraPosition[0] -= 0.1
    } else if (event.key === "ArrowUp") {
        camera.cameraPosition[2] -= 0.1
    } else if (event.key === "ArrowRight") {
        camera.cameraPosition[0] += 0.1
    } else if (event.key === "PageUp") {
        camera.cameraPosition[1] += 0.1
    } else if (event.key === "PageDown") {
        camera.cameraPosition[1] -= 0.1
    } else if (event.key === "o") {
        if (renderingContext.innerLimit === 15 && renderingContext.outerLimit === 30) {
            renderingContext.innerLimit = 0;
            renderingContext.outerLimit = 0;
        } else {
            renderingContext.innerLimit = 15;
            renderingContext.outerLimit = 30;
        }
    } else if (event.key === "p") {
        if (renderingContext.activeShaderProgram === renderingContext.shaders[0]) {
            renderingContext.switchProgram(1)
        } else{
            renderingContext.switchProgram(0)
        }
    } else if (event.key === "e") {
        camera.lockOnOff()
    }

}

export function deployCubes(assets) {
    let xStart = -23
    let zStart = -23
    for (let k = 0; k < assets.length; k += Math.trunc(Math.sqrt(assets.length))){
        for (let i = k; i < k + Math.trunc(Math.sqrt(assets.length)); i++) {
            assets[i].translate(xStart, 0, zStart)
            xStart += 4
        }
        xStart = -23
        zStart += 4
    }
}
