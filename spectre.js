import { hatAngles, turtleAngles } from './tiles.js';

// vertices (m, n) for the hexagon centers
// vertices (m, n, l) l in [0, 4] for the hexagon borders

// for a tile = {n, m, i, kind} we find the set of vertices
const decorateTilesWithVertices = (tiles) => {
    // 'm-n-spot' => [tile index]
    const verticesDict = {};

    for (let tileIndex = 0; tileIndex < tiles.length; tileIndex++) {
        const { m, n, i, kind } = tiles[tileIndex];
        let currentM = m;
        let currentN = n;
        let currentSpot = -1;
        let beta = i * 60;
        if (kind === 2) {
            beta += 180;
        }
        const angles = [1, 2].includes(kind) ? hatAngles : turtleAngles;
        const sign = [1, 3].includes(kind) ? 1 : -1;
        const vertices = [{ m, n, spot: -1 }];
        const v = `${m}-${n}-${-1}`;
        if (!(v in verticesDict)) {
            verticesDict[v] = [[tileIndex, 0]];
        } else {
            if (!isTileIndexInList(verticesDict[v], tileIndex)) {
                verticesDict[v].push([tileIndex, 0]);
            }
        }
        for (let edgeIndex = 0; edgeIndex < angles.length; edgeIndex++) {
            const tileAngle = angles[edgeIndex];
            let angle = (beta + sign * tileAngle) % 360;
            while (angle < 0) {
                angle += 360;
            }
            switch (currentSpot) {
                case -1: {
                    switch (angle) {
                        case 30:
                            currentSpot = 4;
                            break;
                        case 90:
                            currentN -= 2;
                            currentSpot = 0;
                            break;
                        case 150:
                            currentM -= 1;
                            currentN -= 1;
                            currentSpot = 2;
                            break;
                        case 210:
                            currentM -= 1;
                            currentN += 1;
                            currentSpot = 4;
                            break;
                        case 270:
                            currentSpot = 0;
                            break;
                        case 330:
                            currentSpot = 2;
                            break;
                        default:
                            throw Error(`Invalid spot: ${currentSpot} and angle: ${angle}`);
                    }
                    break;
                }
                case 0: {
                    switch (angle) {
                        case 0:
                            currentSpot = 1;
                            break;
                        case 90:
                            currentSpot = -1;
                            break;
                        case 180:
                            currentM -= 1;
                            currentN += 1;
                            currentSpot = 3;
                            break;
                        case 270:
                            currentSpot = -1;
                            currentN += 2;
                            break;
                        default:
                            throw Error(`Invalid spot: ${currentSpot} and angle: ${angle}`);
                    }
                    break;
                }
                case 1: {
                    switch (angle) {
                        case 60:
                            currentSpot = 2;
                            break;
                        case 180:
                            currentSpot = 0;
                            break;
                        case 300:
                            currentN += 2;
                            currentSpot = 4;
                            break;
                        default:
                            throw Error(`Invalid spot: ${currentSpot} and angle: ${angle}`);
                    }
                    break;
                }
                case 2: {
                    switch (angle) {
                        case 60:
                            currentSpot = 3;
                            break;
                        case 150:
                            currentSpot = -1;
                            break;
                        case 240:
                            currentSpot = 1;
                            break;
                        case 330:
                            currentSpot = -1;
                            currentN += 1;
                            currentM += 1;
                            break;
                        default:
                            throw Error(`Invalid spot: ${currentSpot} and angle: ${angle}`);
                    }
                    break;
                }
                case 3: {
                    switch (angle) {
                        case 0:
                            currentM += 1;
                            currentN -= 1;
                            currentSpot = 0;
                            break;
                        case 120:
                            currentSpot = 4;
                            break;
                        case 240:
                            currentSpot = 2;
                            break;
                        default:
                            throw Error(`Invalid spot: ${currentSpot} and angle: ${angle}`);
                    }
                    break;
                }
                case 4: {
                    switch (angle) {
                        case 30:
                            currentN -= 1;
                            currentM += 1;
                            currentSpot = -1;
                            break;
                        case 120:
                            currentN -= 2;
                            currentSpot = 1;
                            break;
                        case 210:
                            currentSpot = -1;
                            break;
                        case 300:
                            currentSpot = 3;
                            break;
                        default:
                            throw Error(`Invalid spot: ${currentSpot} and angle: ${angle}`);
                    }
                    break;
                }
                default:
                    throw Error(`Invalid spot: ${currentSpot}`);

            }
            if (edgeIndex === angles.length - 1) {
                // The last vertex has to be the first vertex
                console.assert(m === currentM, `Bad m: ${m} != ${currentM}`);
                console.assert(n === currentN, `Bad n: ${n} != ${currentN}`);
                console.assert(currentSpot === -1, `Wrong spot: ${currentSpot}`);
            } else {
                const v = `${currentM}-${currentN}-${currentSpot}`;
                if (!(v in verticesDict)) {
                    verticesDict[v] = [[tileIndex, edgeIndex + 1]];
                } else {
                    if (!isTileIndexInList(verticesDict[v], tileIndex)) {
                        verticesDict[v].push([tileIndex, edgeIndex + 1]);
                    }
                }
                vertices.push({ m: currentM, n: currentN, spot: currentSpot });
            }
        }
        tiles[tileIndex].vertices = vertices;
    }
    return verticesDict;
}

const isTileIndexInList = (vertices, tileIndex) => {
    for (let i = 0; i < vertices.length; i++) {
        if (vertices[i][0] === tileIndex) {
            return true;
        }
    }
    return false;
}


export default decorateTilesWithVertices;