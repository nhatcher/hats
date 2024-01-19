
export const getKitesInTurtle = (tile) => {
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


export const getKitesInAntiTurtle = (tile) => {
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