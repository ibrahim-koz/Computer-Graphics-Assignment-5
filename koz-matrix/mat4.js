import * as vec3 from "./vec3.js"
import * as vec4 from "./vec4.js"
export function createIdentityMatrix() {
    return [1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1]
}

export function multiply(a, b) {
    let out = createIdentityMatrix()
    let a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    let a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    let a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    let a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];

    // Cache only the current line of the second matrix
    let b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
}

export function createTranslationMatrix(x, y, z) {
    let out = createIdentityMatrix();
    out[12] = x;
    out[13] = y;
    out[14] = z;
    return out;
}

export function createScaleMatrix(x, y, z) {
    let out = createIdentityMatrix();
    out[0] = x
    out[5] = y
    out[10] = z
    return out;
}


export function createRotationMatrix(thetaX, thetaY, thetaZ) {
    let rotationX = this.createRotationXMatrix(thetaX)
    let rotationY = this.createRotationYMatrix(thetaY)
    let rotationZ = this.createRotationZMatrix(thetaZ)

    let out = createIdentityMatrix();
    out = multiply(rotationX, out);
    out = multiply(rotationY, out);
    out = multiply(rotationZ, out);
    return out;
}

export function createRotationXMatrix(theta) {
    let out = createIdentityMatrix();
    out[5] = Math.cos(theta);
    out[6] = Math.sin(theta);
    out[9] = -Math.sin(theta);
    out[10] = Math.cos(theta);
    return out;
}

export function createRotationYMatrix(theta) {
    let out = createIdentityMatrix();
    out[0] = Math.cos(theta);
    out[2] = -Math.sin(theta);
    out[8] = Math.sin(theta);
    out[10] = Math.cos(theta);
    return out;
}

export function createRotationZMatrix(theta) {
    let out = createIdentityMatrix();
    out[0] = Math.cos(theta);
    out[1] = Math.sin(theta);
    out[4] = -Math.sin(theta);
    out[5] = Math.cos(theta);
    return out;
}

/*export function lookAt(cameraPos, cameraTarget, upVector) {
    let cameraDirection = vec3.normalize(vec3.subtract(cameraPos, cameraTarget))
    let cameraRight = vec3.normalize(vec3.crossProduct(upVector, cameraDirection))
    let cameraUp = vec3.crossProduct(cameraDirection, cameraRight)

    let A = createIdentityMatrix()
    //let B = createIdentityMatrix()

    A[0] = cameraRight[0]
    A[4] = cameraRight[1]
    A[8] = cameraRight[2]

    A[1] = cameraUp[0]
    A[5] = cameraUp[1]
    A[9] = cameraUp[2]

    A[2] = cameraDirection[0]
    A[6] = cameraDirection[1]
    A[10] = cameraDirection[2]

    A[12] = -cameraPos[0]
    A[13] = -cameraPos[1]
    A[14] = -cameraPos[2]

    let viewMatrix = A
    return viewMatrix
}*/

export function lookAt(eye, center, up) {
    let out = createIdentityMatrix()
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    let eyex = eye[0];
    let eyey = eye[1];
    let eyez = eye[2];
    let upx = up[0];
    let upy = up[1];
    let upz = up[2];
    let centerx = center[0];
    let centery = center[1];
    let centerz = center[2];

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.hypot(z0, z1, z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.hypot(x0, x1, x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.hypot(y0, y1, y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
}


export function transpose(a) {
    let out = createIdentityMatrix()
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        let a01 = a[1],
            a02 = a[2],
            a03 = a[3];
        let a12 = a[6],
            a13 = a[7];
        let a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }

    return out;
}

// this will be assigned to cameraFront
export function lookAround(pitch, yaw = -90) {
    let direction = vec3.createVector()
    direction[0] = Math.cos(degrees_to_radians(yaw)) * Math.cos(degrees_to_radians(pitch))
    direction[1] = Math.sin(degrees_to_radians(pitch))
    direction[2] = Math.sin(degrees_to_radians(yaw)) * Math.cos(degrees_to_radians(pitch))

    return direction
}

export function degrees_to_radians(degrees) {
    return degrees * (Math.PI / 180)
}

export function perspective(fovy, aspect, near, far) {
    let out = createIdentityMatrix()
    let f = 1.0 / Math.tan(fovy / 2),
        nf;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
        nf = 1 / (near - far);
        out[10] = (far + near) * nf;
        out[14] = 2 * far * near * nf;
    } else {
        out[10] = -1;
        out[14] = -2 * near;
    }
    return out;
}

export function inverse(a) {
    let b = createIdentityMatrix();
    var c = a[0], d = a[1], e = a[2], g = a[3], f = a[4], h = a[5], i = a[6], j = a[7], k = a[8], l = a[9], o = a[10],
        m = a[11], n = a[12], p = a[13], r = a[14], s = a[15], A = c * h - d * f, B = c * i - e * f, t = c * j - g * f,
        u = d * i - e * h, v = d * j - g * h, w = e * j - g * i, x = k * p - l * n, y = k * r - o * n,
        z = k * s - m * n, C = l * r - o * p, D = l * s - m * p, E = o * s - m * r,
        q = 1 / (A * E - B * D + t * C + u * z - v * y + w * x);
    b[0] = (h * E - i * D + j * C) * q;
    b[1] = (-d * E + e * D - g * C) * q;
    b[2] = (p * w - r * v + s * u) * q;
    b[3] = (-l * w + o * v - m * u) * q;
    b[4] = (-f * E + i * z - j * y) * q;
    b[5] = (c * E - e * z + g * y) * q;
    b[6] = (-n * w + r * t - s * B) * q;
    b[7] = (k * w - o * t + m * B) * q;
    b[8] = (f * D - h * z + j * x) * q;
    b[9] = (-c * D + d * z - g * x) * q;
    b[10] = (n * v - p * t + s * A) * q;
    b[11] = (-k * v + l * t - m * A) * q;
    b[12] = (-f * C + h * y - i * x) * q;
    b[13] = (c * C - d * y + e * x) * q;
    b[14] = (-n * u + p * B - r * A) * q;
    b[15] = (k * u - l * B + o * A) * q;
    return b
};

export function makeRotationAxis( axis, angle ) {

    // Based on http://www.gamedev.net/reference/articles/article1199.asp

    const c = Math.cos( angle );
    const s = Math.sin( angle );
    const t = 1 - c;
    const x = axis.x, y = axis.y, z = axis.z;
    const tx = t * x, ty = t * y;

    return [
        tx * x + c, tx * y - s * z, tx * z + s * y, 0,
        tx * y + s * z, ty * y + c, ty * z - s * x, 0,
        tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
        0, 0, 0, 1
    ];
}

export function multiplyByRHSVec4(a, b) {
    let out = vec4.createZeroVector()
    out[0] = b[0] * a[0] + b[1] * a[1] + b[2] * a[2] + b[3] * a[3]
    out[1] = b[4] * a[0] + b[5] * a[1] + b[6] * a[2] + b[7] * a[3]
    out[2] = b[8] * a[0] + b[9] * a[1] + b[10] * a[2] + b[11] * a[3]
    out[3] = b[12] * a[0] + b[13] * a[1] + b[14] * a[2] + b[15] * a[3]
    return out;
}

