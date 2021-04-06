import * as mat4 from './koz-matrix/mat4.js'
import * as Utils from './utils.js'

class Init {
    constructor(canvasID) {
        this.getCanvas(canvasID)
        this.initGL(this.canvas)
        this.shaders = []
        this.initShaders()
        this.switchProgram(1)
        this.textures = []
        this.initTexture("./texture_files/texnew.png")
        this.initTexture("./texture_files/ground.bmp")
        this.shapeBuffers = {};
        this.innerLimit = 15;
        this.outerLimit = 30;
    }

    getCanvas(canvasID) {
        this.canvas = document.getElementById(canvasID)
    }

    initGL(canvas) {
        this.gl = canvas.getContext('webgl')
        this.gl.width = this.canvas.width
        this.gl.height = this.canvas.height
    }

    initShaders() {
        let newShaderProgram0 = this.createNewProgram("vertex-shader-0", "fragment-shader-0")
        let attributeNames = ["aVertexPosition", "aTextureCoord", "aVertexNormal"]
        this.bindAttribLocations(newShaderProgram0, attributeNames,)

        let uniformNames = ["uMVPMatrix", "uSampler", "uNormalMatrix", "uModelMatrix", "uLightWorldPosition",
            "uCameraWorldPosition", "uShininess", "uLightDirection", "uInnerLimit", "uOuterLimit"]
        this.bindUniformLocations(newShaderProgram0, uniformNames)

        let newShaderProgram1 = this.createNewProgram("vertex-shader-1", "fragment-shader-1")
        attributeNames = ["aVertexPosition", "aTextureCoord", "aVertexNormal"]
        this.bindAttribLocations(newShaderProgram1, attributeNames,)

        uniformNames = ["uMVPMatrix", "uSampler", "uNormalMatrix", "uModelMatrix", "uLightWorldPosition",
            "uCameraWorldPosition", "uShininess", "uLightDirection", "uInnerLimit", "uOuterLimit"]
        this.bindUniformLocations(newShaderProgram1, uniformNames)
    }

    createNewProgram(vertexShaderID, fragmentShaderID){
        let fragmentShader = this.getShader(fragmentShaderID)
        let vertexShader = this.getShader(vertexShaderID)
        let newShaderProgram = this.gl.createProgram()

        this.gl.attachShader(newShaderProgram, fragmentShader)
        this.gl.attachShader(newShaderProgram, vertexShader)
        this.gl.linkProgram(newShaderProgram)

        if (!this.gl.getProgramParameter(newShaderProgram, this.gl.LINK_STATUS)) {
            alert("Could not initialise shaders")
        }
        this.gl.useProgram(newShaderProgram)
        this.shaders.push(newShaderProgram)
        return newShaderProgram;
    }

    switchProgram(index){
        this.gl.useProgram(this.shaders[index])
        this.activeShaderProgram = this.shaders[index]
    }

    bindAttribLocations(shaderProgram, attributeNames) {
        for (let i = 0; i < attributeNames.length; i++) {
            shaderProgram[attributeNames[i] + "Location"] = this.gl.getAttribLocation(shaderProgram, attributeNames[i]);
            this.gl.enableVertexAttribArray(shaderProgram[attributeNames[i] + "Location"])
        }
    }

    bindUniformLocations(shaderProgram, uniformNames) {
        for (let i = 0; i < uniformNames.length; i++) {
            shaderProgram[uniformNames[i] + "Location"] = this.gl.getUniformLocation(shaderProgram, uniformNames[i]);
        }
    }

    initBuffer(vertices) {
        let newBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, newBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW)
        newBuffer.itemSize = vertices.itemSize
        newBuffer.numItems = vertices.numItems
        return newBuffer
    }

    initTexture(filePath) {
        const newTexture = this.gl.createTexture();
        newTexture.image = new Image();
        newTexture.image.onload = () => {
            this.handleLoadedTexture(newTexture)
        }
        newTexture.image.src = filePath
    }

    handleLoadedTexture(texture) {
        this.gl.activeTexture(this.gl.TEXTURE0 + this.textures.length);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true)
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texture.image);
        this.gl.generateMipmap(this.gl.TEXTURE_2D)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST_MIPMAP_LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);

        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.textures.push(texture)
    }

    addPositionBuffer(shape) {
        const positionBuffer = this.initBuffer(shape.positionVertices)
        let newShapeBuffer = {};
        newShapeBuffer.positionBuffer = positionBuffer
        newShapeBuffer.modelMatrix = shape.modelMatrix
        newShapeBuffer.primitiveMode = shape.primitiveMode
        this.shapeBuffers[shape.id] = newShapeBuffer
    }

    addColorBuffer(shape) {
        if (this.shapeBuffers[shape.id] !== undefined) {
            this.shapeBuffers[shape.id].colorBuffer = this.initBuffer(shape.colorVertices)
        }
    }

    addTextureBuffer(shape) {
        if (this.shapeBuffers[shape.id] !== undefined) {
            this.shapeBuffers[shape.id].textureBuffer = this.initBuffer(shape.textureVertices)
            this.shapeBuffers[shape.id].textureBuffer.unit = shape.textureVertices.unit
        }
    }

    addNormalBuffer(shape) {
        if (this.shapeBuffers[shape.id] !== undefined) {
            this.shapeBuffers[shape.id].normalBuffer = this.initBuffer(shape.normalVertices)
        }
    }


    getShader(id) {
        const shaderScript = document.getElementById(id)
        if (!shaderScript) {
            return null
        }

        let str = ""
        let k = shaderScript.firstChild
        if (k) {
            if (k.nodeType === Node.TEXT_NODE) {
                str += k.textContent
            }
            k = k.nextSibling
        }

        let shader
        if (shaderScript.type === "x-shader/x-fragment") {
            shader = this.gl.createShader(this.gl.FRAGMENT_SHADER)
        } else if (shaderScript.type === "x-shader/x-vertex") {
            shader = this.gl.createShader(this.gl.VERTEX_SHADER)
        } else {
            return null
        }

        this.gl.shaderSource(shader, str)
        this.gl.compileShader(shader)

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert(this.gl.getShaderInfoLog(shader))
            return null
        }
        return shader
    }

    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix, cameraWorldPosition, shininess, cameraFront) {
        let mVMatrix = mat4.multiply(viewMatrix, modelMatrix)
        let mVPMatrix = mat4.multiply(projectionMatrix, mVMatrix)
        this.gl.uniformMatrix4fv(this.activeShaderProgram.uMVPMatrixLocation, false, mVPMatrix)

        let normalMatrix = mat4.transpose(mat4.inverse(modelMatrix))
        this.gl.uniformMatrix4fv(this.activeShaderProgram.uNormalMatrixLocation, false, normalMatrix)

        this.gl.uniformMatrix4fv(this.activeShaderProgram.uModelMatrixLocation, false, modelMatrix)

        this.gl.uniform3fv(this.activeShaderProgram.uLightWorldPositionLocation, cameraWorldPosition)
        this.gl.uniform3fv(this.activeShaderProgram.uCameraWorldPositionLocation, cameraWorldPosition) // we send it discretely to make it look as specular.
        this.gl.uniform1f(this.activeShaderProgram.uShininessLocation, shininess);
        this.gl.uniform3fv(this.activeShaderProgram.uLightDirectionLocation, cameraFront)
        this.gl.uniform1f(this.activeShaderProgram.uInnerLimitLocation, Math.cos(Utils.degToRad(this.innerLimit)))
        this.gl.uniform1f(this.activeShaderProgram.uOuterLimitLocation, Math.cos(Utils.degToRad(this.outerLimit)))
    }

    setVertexAttr(vertexAttr, bufferData) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferData);
        this.gl.vertexAttribPointer(vertexAttr, bufferData.itemSize,
            this.gl.FLOAT, false, 0, 0)
    }

    changeTextureUsed(textureUnit) {
        this.gl.activeTexture(this.gl.TEXTURE0 + textureUnit);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[textureUnit])
        this.gl.uniform1i(this.activeShaderProgram.uSamplerLocation, textureUnit);
    }


    drawScene(camera) {
        this.gl.clearColor(0.0, 0.0, 0.0, 1)
        this.gl.viewport(0, 0, this.gl.width, this.gl.height)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
        this.gl.enable(this.gl.DEPTH_TEST);

        Object.values(this.shapeBuffers).forEach(shapeBuffer => {
            this.setVertexAttr(this.activeShaderProgram.aVertexPositionLocation, shapeBuffer.positionBuffer)
            this.setVertexAttr(this.activeShaderProgram.aTextureCoordLocation, shapeBuffer.textureBuffer)
            this.setVertexAttr(this.activeShaderProgram.aVertexNormalLocation, shapeBuffer.normalBuffer)
            this.changeTextureUsed(shapeBuffer.textureBuffer.unit)
            this.setMatrixUniforms(shapeBuffer.modelMatrix, camera.viewMatrix,
                camera.projectionMatrix, camera.cameraPosition, 50, camera.cameraFront)
            this.gl.drawArrays(shapeBuffer.primitiveMode, 0, shapeBuffer.positionBuffer.numItems)
        })
    }
}

export {Init};