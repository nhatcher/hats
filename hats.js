
export const getKitesInAntiHat = (tile) => {
    const { m, n, i } = tile;
    const kites = [2, 3, 4, 5].map(s => [m, n, (s + i) % 6]);
    const vertices = [[1, -1], [0, -2], [-1, -1], [-1, 1], [0, 2], [1, 1]];

    const vertex1 = vertices[(i + 3) % 6];
    const vertex2 = vertices[(i + 2) % 6];

    kites.push(...[1, 2].map(s => [vertex1[0] + m, vertex1[1] + n, (s + i) % 6]));
    kites.push(...[0, 5].map(s => [vertex2[0] + m, vertex2[1] + n, (s + i) % 6]));

    return kites;
}

export const getKitesInHat = (tile) => {
    const { m, n, i } = tile;
    const kites = [0, 1, 4, 5].map(s => [m, n, (s + i) % 6]);
    const vertices = [[1, -1], [0, -2], [-1, -1], [-1, 1], [0, 2], [1, 1]];

    const vertex1 = vertices[(i + 5) % 6];
    const vertex2 = vertices[i % 6];

    kites.push(...[1, 2].map(s => [vertex1[0] + m, vertex1[1] + n, (s + i) % 6]));
    kites.push(...[3, 4].map(s => [vertex2[0] + m, vertex2[1] + n, (s + i) % 6]));

    return kites;
}
