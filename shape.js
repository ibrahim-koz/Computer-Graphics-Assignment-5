import * as mat4 from './koz-matrix/mat4.js'
import {uuidv4} from './utils.js'
class Shape {
    constructor(gl) {
        this.modelMatrix = mat4.createIdentityMatrix()
        this.id = uuidv4()
        this.primitiveMode = gl.TRIANGLES
    }

    scale(x, y, z) {
        let scaleMatrix = mat4.createScaleMatrix(x, y, z)
        this.modelMatrix = mat4.multiply(scaleMatrix, this.modelMatrix)
    }

    rotate(thetaX, thetaY, thetaZ) {
        let rotationMatrix = mat4.createRotationMatrix(thetaX, thetaY, thetaZ)
        this.modelMatrix = mat4.multiply(rotationMatrix, this.modelMatrix)
    }

    translate(x, y, z) {
        let translationMatrix = mat4.createTranslationMatrix(x, y, z)
        this.modelMatrix = mat4.multiply(translationMatrix, this.modelMatrix)
    }

    addPositionVertices(positionVertices, positionVerticesItemSize) {
        this.positionVertices = positionVertices
        this.positionVertices.numItems = this.positionVertices.length / positionVerticesItemSize
        this.positionVertices.itemSize = positionVerticesItemSize
    }

    addColorVertices(colorVertices, colorVerticesItemSize){
        this.colorVertices = colorVertices
        this.colorVertices.numItems = this.colorVertices.length / colorVerticesItemSize
        this.colorVertices.itemSize = colorVerticesItemSize
    }

    addTextureVertices(textureVertices, textureUnit){
        const itemSize = 2
        this.textureVertices = textureVertices
        this.textureVertices.numItems = this.textureVertices.length / itemSize
        this.textureVertices.itemSize = itemSize
        this.textureVertices.unit = textureUnit
    }

    addNormalVertices(normalVertices){
        const itemSize = 3
        this.normalVertices = normalVertices
        this.normalVertices.numItems = this.normalVertices.length / itemSize
        this.normalVertices.itemSize = itemSize
    }
}

export {Shape}
