export function createZeroVector(){
    return [0, 0, 0, 0]
}
export function sumTwoVec(a, b){
    let out = this.createZeroVector()
    for (let i = 0; i < 4; i++)
        out[i] = a[i] + b[i]
    return out
}
export function multiplyScalar(a, s){
    let out = this.createZeroVector()
    for (let i = 0; i < 4; i++)
        out[i] = s * a[i]
    return out;
}