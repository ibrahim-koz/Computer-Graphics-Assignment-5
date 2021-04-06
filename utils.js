/*
    ar is composed of sets of element-Id, func, args.
 */
export function addEventListeners(ar){
    for (let i = 0; i < ar.length; i++) {
        let id = ar[i][0]
        let func = ar[i][1]
        let args = ar[i][2]

        if (ar[i][3]) {
            let element = document.getElementById(id)
            element.onchange = () => {
                func(...args, element.value)
            };
        }
        else{
            document.getElementById(id).onchange = () => {
                func(...args)
            };
        }
    }
}

export function timeToRadian(t){
    return (Math.sin(t) * (Math.PI/2));
}

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


export function degToRad(degrees)
{
    let pi = Math.PI;
    return degrees * (pi/180);
}

export function radToDeg(radians){
    let pi = Math.PI;
    return radians * (180/pi);
}

