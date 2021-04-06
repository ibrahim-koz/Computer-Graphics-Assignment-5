// load object files here
import {Shape} from "../shape.js";


export function downloadMeshes(callbackFunction) {
    let numCopiesOfMeshes = [625, 1]
    let textureIDs = [0, 1]
    obj_utils.downloadMeshes({'meshCube': './object_files/cube_2.obj', 'meshGround': './object_files/ground.obj'},
        mapObject, numCopiesOfMeshes, textureIDs, callbackFunction);
}


function mapObject(meshes, gl, boundContainer, numCopiesOfMeshes, textureIDs, callbackFunction) {
    for (const mesh of Object.values(meshes)) {
        mesh.vertices.forEach(function (part, index) {
            mesh.vertices[index] = parseFloat(mesh.vertices[index]);
        });
        mesh.vertexNormals.forEach(function (part, index) {
            mesh.vertexNormals[index] = parseFloat(mesh.vertexNormals[index]);
        });
        mesh.textures.forEach(function (part, index) {
            mesh.textures[index] = parseFloat(mesh.textures[index]);
        });

    }

    let kkk = 0;
    for (const mesh of Object.values(meshes)) {
        let positionVertices = mapIndices(mesh.vertices, mesh.indices, 3);
        let textureVertices = mapIndices(mesh.textures, mesh.indices, 2);
        let normalVertices = mapIndices(mesh.vertexNormals, mesh.indices, 3);

        for (let i = 0; i < numCopiesOfMeshes[kkk]; i++) {
            let shp = new Shape(gl)
            shp.addPositionVertices(positionVertices, 3)
            shp.addTextureVertices(textureVertices, textureIDs[kkk])
            shp.addNormalVertices(normalVertices)
            boundContainer.push(shp)
        }
        kkk += 1
    }
    callbackFunction()
}

function mapIndices(vertices, indices, dimension){
    let mappedVertices = []
    for (let i = 0; i < indices.length; i += 1) {
        mappedVertices.push(...(vertices.slice(indices[i] * dimension, indices[i] * dimension + dimension)))
    }
    return mappedVertices
}
