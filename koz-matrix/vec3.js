export function createVector(x = 0, y = 0, z = 0){
    return [x, y, z]
}

export function normalize(vector){
    let vecLen = Math.hypot(vector.x,  vector.y, vector.z);
    let normalizedVec = [...vector];
    normalizedVec.forEach(component => component / vecLen)
    return normalizedVec;
}

export function subtract(a, b){
    let out = createVector()
    for (let i = 0; i < 3; i++) {
        out[i] = a[i] - b[i];
    }
    return out;
}

export function add(a, b){
    let out = createVector()
    for (let i = 0; i < 3; i++) {
        out[i] = a[i] + b[i];
    }
    return out;
}


export function crossProduct(a, b){
    let out = createVector()
    out[0] = a[1] * b[2] - a[2] * b[1];
    out[1] = a[0] * b[2] - a[2] * b[0];
    out[2] = a[0] * b[1] - a[1] * b[0];
    return out;
}

export function dotProduct(a, b){
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

export function multiplyByScalar(a, b){
    for (let i = 0; i < 3; i++) {
        a[i] *= b
    }
}