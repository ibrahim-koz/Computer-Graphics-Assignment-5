import * as mat4 from "./koz-matrix/mat4.js";
import * as vec3 from "./koz-matrix/vec3.js";
import {degToRad, radToDeg} from "./utils.js";
import {dotProduct} from "./koz-matrix/vec3.js";

class Camera {
    constructor(cameraPosition, cameraFront, upVector, aspect) {
        this.cameraPosition = cameraPosition
        this.cameraFront = cameraFront
        this.upVector = upVector
        this.aspect = aspect
        this.lock = false;

        this.yawl = -90;
        this.pitch = 0;
        this.update()
    }

    update() {
        this.viewMatrix = mat4.lookAt(this.cameraPosition, vec3.add(this.cameraPosition, this.cameraFront), this.upVector)
        this.projectionMatrix = mat4.perspective(45, this.aspect, 0.001, 1000)
    }

    lockOnOff(){
        this.lock = !this.lock;
    }
}

class FlyingCamera {
    constructor(position, viewPoint, upVector, moveSpeed, mouseSensitivity) {
        this.position = position;
        this.viewPoint = viewPoint;
        this.upVector = upVector;
    }

    setMoveSpeed(moveSpeed) {
        this.moveSpeed = moveSpeed;
    }

    setMouseSensitivity(mouseSensitivity) {
        this.mouseSensitivity = mouseSensitivity;
    }

    setControls(forwardKeyCode, backwardKeyCode, strafeLeftKeyCode, strafeRightKeyCode) {
        this.forwardKeyCode = forwardKeyCode
        this.backwardKeyCode = backwardKeyCode
        this.strafeLeftKeyCode = strafeLeftKeyCode
        this.strafeRightKeyCode = strafeRightKeyCode
    }

    setWindowsCenterPosition(windowCenterPosition) {
        this.windowCenterPosition = windowCenterPosition;
    }

    getViewMatrix() {

    }

    update(keyInputFunc, getCursorPosFunc, setCursorPosFunc, speedCorrectionFunc) {
        if (keyInputFunc(this.forwardKeyCode)) {
            this.moveBy(speedCorrectionFunc(this.moveSpeed));
        }

        if (keyInputFunc(this.backwardKeyCode)) {
            this.moveBy(-speedCorrectionFunc(this.moveSpeed));
        }

        if (keyInputFunc(this.strafeLeftKeyCode)) {
            this.strafeBy(-speedCorrectionFunc(this.moveSpeed));
        }

        if (keyInputFunc(this.strafeRightKeyCode)) {
            this.strafeBy(speedCorrectionFunc(this.moveSpeed));
        }



        let curMousePosition = getCursorPosFunc()
        let delta = this.windowCenterPosition - curMousePosition;

        if (delta.x !== 0) {
            this.rotateLeftRight(delta.x * this.mouseSensitivity);
        }

        if (delta.y !== 0) {
            this.rotateUpDown(delta.y * this.mouseSensitivity);
        }
        setCursorPosFunc(this.windowCenterPosition);


    }

    moveBy(distance) {

    }

    strafeBy(distance) {
        let strafeVector = vec3.normalize(vec3.crossProduct(this.getNormalizedViewVector(), this.upVector))
        strafeVector = vec3.multiplyByScalar(strafeVector, distance)
        this.position = vec3.add(strafeVector, this.position)
        this.viewPoint = vec3.add(strafeVector, this.position)
    }

    rotateLeftRight(angleInDegrees) {

    }

    rotateUpDown(angleInDegrees) {
        let viewVector = this.getNormalizedViewMatrix()
        let viewVectorNoY = vec3.createVector(viewVector.x, 0, viewVector.z)

        let currentAngleDegrees = radToDeg(Math.acos(vec3.dotProduct(viewVectorNoY, viewVector)))

        if (viewVector.y < 0.0) {
            currentAngleDegrees = -currentAngleDegrees
        }

        if (currentAngleDegrees > -85.0 && currentAngleDegrees < 85.0) {
            let rotationAxis = vec3.crossProduct(this.getNormalizedViewVector(), this.upVector)
            rotationAxis = vec3.normalize(rotationAxis)

            let rotationMatrix = mat4.makeRotationAxis(degToRad(angleInDegrees), rotationAxis)
            let rotatedViewVector = mat4.multiplyByRHSVec4(rotationMatrix, [...this.getNormalizedViewVector(), 0.0])
            this.viewPoint = vec3.add(this.position, rotatedViewVector.slice(0, 3))
        }
    }

    getNormalizedViewVector() {
        return vec3.normalize(vec3.subtract(this.viewPoint, this.position))
    }


}

export {Camera}