

export const hatAngles = [90, 0, 60, -30, -90, 0, -60, -150, -210, -120, -180, -180, -240, 30];

export const turtleAngles = [90, 0, -60, 30, -30, -120, -180, -90, -150, -150, -210, 60, 120, 30];

const getKitesInAntiHat = (tile) => {
    const { m, n, i } = tile;
    const kites = [2, 3, 4, 5].map(s => [m, n, (s + i) % 6]);
    const vertices = [[1, -1], [0, -2], [-1, -1], [-1, 1], [0, 2], [1, 1]];

    const vertex1 = vertices[(i + 3) % 6];
    const vertex2 = vertices[(i + 2) % 6];

    kites.push(...[1, 2].map(s => [vertex1[0] + m, vertex1[1] + n, (s + i) % 6]));
    kites.push(...[0, 5].map(s => [vertex2[0] + m, vertex2[1] + n, (s + i) % 6]));

    return kites;
}

const getKitesInHat = (tile) => {
    const { m, n, i } = tile;
    const kites = [0, 1, 4, 5].map(s => [m, n, (s + i) % 6]);
    const vertices = [[1, -1], [0, -2], [-1, -1], [-1, 1], [0, 2], [1, 1]];

    const vertex1 = vertices[(i + 5) % 6];
    const vertex2 = vertices[i % 6];

    kites.push(...[1, 2].map(s => [vertex1[0] + m, vertex1[1] + n, (s + i) % 6]));
    kites.push(...[3, 4].map(s => [vertex2[0] + m, vertex2[1] + n, (s + i) % 6]));

    return kites;
}


const getKitesInTurtle = (tile) => {
    const {m, n, i} = tile;
    const kites = [4, 5, 0, 1].map(s => [m, n, (s + i) % 6]);
    const vertices = [[1, -1], [0, -2], [-1, -1], [-1, 1], [0, 2], [1, 1]];

    const vertex1 = vertices[i];
    const vertex2 = vertices[(i + 4) % 6];
    const vertex3 = vertices[(i + 5) % 6];

    kites.push(...[4, 5].map(s => [vertex1[0] + m, vertex1[1] + n, (s + i) % 6]));
    kites.push(...[1, 2].map(s => [vertex2[0] + m, vertex2[1] + n, (s + i) % 6]));
    kites.push(...[2, 3].map(s => [vertex3[0] + m, vertex3[1] + n, (s + i) % 6]));

    return kites;
}


const getKitesInAntiTurtle = (tile) => {
    const {m, n, i} = tile;
    const kites = [5, 0, 1, 2].map(s => [m, n, (s + i) % 6]);
    const vertices = [[1, -1], [0, -2], [-1, -1], [-1, 1], [0, 2], [1, 1]];

    const vertex1 = vertices[(i + 5) % 6];
    const vertex2 = vertices[i];
    const vertex3 = vertices[(i + 1) % 6];

    kites.push(...[1, 2].map(s => [vertex1[0] + m, vertex1[1] + n, (s + i) % 6]));
    kites.push(...[3, 4].map(s => [vertex2[0] + m, vertex2[1] + n, (s + i) % 6]));
    kites.push(...[4, 5].map(s => [vertex3[0] + m, vertex3[1] + n, (s + i) % 6]));

    return kites;
}


export const getKitesInTile = (tile) => {
    switch (tile.kind) {
        case 1:
            return getKitesInHat(tile);
        case 2:
            return getKitesInAntiHat(tile);
        case 3:
            return getKitesInTurtle(tile);
        case 4:
            return getKitesInAntiTurtle(tile);
        default:
            throw new Error("Unreachable");
    }

}

export const tilesCollide = (tile1, tile2) => {
    const k1 = getKitesInTile(tile1);
    const k2 = getKitesInTile(tile2);
    for (let i = 0; i < k1.length; i++) {
        const kite1 = k1[i];
        for (let j = 0; j < k2.length; j++) {
            const kite2 = k2[j];
            if (kite1[0] === kite2[0] && kite1[1] === kite2[1] && kite1[2] === kite2[2]) {
                return true;
            }
        }
    }
    return false;
}

export const kiteIsInTile = (kite, tile) => {
    const kites = getKitesInTile(tile);
    const [m, n, i] = kite;
    for (const k of kites) {
        if (k[0] === m && k[1] === n && k[2] === i) {
            return true;
        }
    }
    return false;
}
