import { tilesCollide, kiteIsInTile } from './tiles.js';

let mMax = 45;
let nMax = 43;
let tileKinds = [1, 2];

const tilesAreEqual = (tile1, tile2) => {
    return tile1.m !== tile2.m && tile1.n !== tile2.n && tile1.i !== tile2.i && tile1.kind !== tile2.kind;
}

const fromTileToIndex = (tile) => {
    const tileCount = tileKinds.length;
    const { m, n, i, kind } = tile;
    const index = n * (mMax + 1) * (3 * tileCount) + Math.floor(m / 2) * (tileCount * 6) + i + 1;
    console.assert(index > 0);
    return index + tileKinds.indexOf(kind) * 6;
}

const fromIndexToTile = (index) => {
    const tileCount = tileKinds.length;
    const n = Math.floor((index - 1) / ((mMax + 1) * (3 * tileCount)));
    const rest = index - 1 - n * (mMax + 1) * 3 * tileCount;
    const m_half = Math.floor(rest / (6 * tileCount));
    const m = n % 2 === 0 ? m_half * 2 : m_half * 2 + 1;
    const alpha = rest - m_half * (tileCount * 6);
    const i = alpha % 6;
    const indexKind = Math.floor(alpha / 6);
    return {
        m,
        n,
        i,
        kind: tileKinds[indexKind]
    };
}

// There are 12 variables per node. So 12 x mMax x nMax variables
const createClauses = (maxX, maxY, kinds) => {
    mMax = maxX;
    nMax = maxY;
    tileKinds = kinds;
    let clausesCount = 0;
    let data = [];
    let variableCount = 0;
    for (let m = 0; m <= mMax; m++) {
        for (let n = 0; n <= nMax; n++) {
            if (n % 2 !== m % 2) {
                // coordinates must have same parities
                continue;
            }
            for (let i = 0; i < 6; i++) {
                for (const kind1 of tileKinds) {
                    const tile1 = { m, n, i: i, kind: kind1 };
                    const index1 = fromTileToIndex(tile1);
                    variableCount = Math.max(index1, variableCount);
                    for (let j = 0; j < 6; j++) {
                        for (const kind2 of tileKinds) {
                            if (i === j && kind1 === kind2) {
                                continue;
                            }
                            const index2 = fromTileToIndex({ m, n, i: j, kind: kind2 });
                            // add statement [-index1, -index2]
                            data.push(2, -index1, -index2);
                            clausesCount++;
                        }
                    }
                }

                // now we need to check that (n, m, i) does not collide with folks in surrounding vertices     
                const vertices = [[m + 2, n], [m + 1, n + 1], [m, n + 2], [m + 1, n - 1], [m + 1, n + 3], [m - 1, n + 3], [m + 2, n + 2], [m + 2, n - 2], [m, n + 4]];
                for (const vertex of vertices) {
                    const [m1, n1] = vertex;
                    if (m1 > mMax || n1 > nMax || n1 < 1 || m1 < 1) {
                        continue;
                    }
                    for (const kind1 of tileKinds) {
                        const tile1 = { m, n, i: i, kind: kind1 };
                        const index1 = fromTileToIndex(tile1);
                        for (let j = 0; j < 6; j++) {
                            for (const kind2 of tileKinds) {
                                const tile2 = { m: m1, n: n1, i: j, kind: kind2 };
                                if (tilesCollide(tile1, tile2)) {
                                    const index2 = fromTileToIndex(tile2);
                                    // add statement [-index1, -index2]
                                    data.push(2, -index1, -index2);
                                    clausesCount++
                                }
                            }
                        }
                    }
                }
            }
            // We don't enforce the borders to be full
            const borderWidth = 2;
            if (m <= borderWidth || n <= borderWidth || n >= nMax - borderWidth || m >= mMax - borderWidth) {
                continue;
            }
            for (let i = 0; i < 6; i++) {
                // there is at least one hat that covers kite (m, n, i)
                const indices = [];
                const vertices = [[m, n], [m - 1, n - 1], [m, n - 2], [m + 1, n - 1], [m + 1, n + 1], [m, n + 2], [m - 1, n + 1]];
                for (const vertex of vertices) {
                    const [m1, n1] = vertex;
                    if (m1 < 1 || n1 < 1 || m1 > mMax || n1 > nMax) {
                        continue;
                    }
                    for (let j = 0; j < 6; j++) {
                        for (const kind of tileKinds) {
                            const tile = { m: m1, n: n1, i: j, kind };
                            if (kiteIsInTile([m, n, i], tile)) {
                                const index = fromTileToIndex(tile);
                                indices.push(index);
                            }
                        }
                    }
                }
                // add statement indices
                console.assert(indices.length > 0);
                data.push(indices.length, ...indices);
                clausesCount++;
            }
        }
    }
    return {data, clausesCount};
}

const addHatsToClauses = (tiles, data) => {
    for (const tile of tiles) {
        const index = fromTileToIndex(tile);
        if (index <= 0) {
            throw Error(`Invalid hat: ${tile}`);
        }
        data.push(1, index);
    }
}


export { fromIndexToTile, addHatsToClauses };
export default createClauses;