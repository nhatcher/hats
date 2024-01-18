export const getKitesInAntiHat = (tile) => {
    const {m, n, i} = tile;
    const kites = [[m, n, (2+i)%6], [m, n, (3+i)%6], [m, n, (4+i)%6],[m, n, (5+i)%6] ];
    switch (i) {
        case 0: {
            kites.push([m-1, n+1, 1], [m-1, n+1, 2], [m-1, n-1, 0], [m-1, n-1, 5]);
            break;
        }
        case 1: {
            kites.push([m, n+2, 2], [m, n+2, 3], [m-1, n+1, 1], [m-1,n+1, 0]);
            break;
        }
        case 2: {
            kites.push([m+1, n+1, 3], [m+1, n+1, 4], [m, n+2, 2], [m,n+2, 1]);
            break;
        }
        case 3: {
            kites.push([m+1, n-1, 4], [m+1, n-1, 5], [m+1, n+1, 3], [m+1,n+1, 2]);
            break;
        }
        case 4: {
            kites.push([m, n-2, 5], [m, n-2, 0], [m+1, n-1, 4], [m+1,n-1, 3]);
            break;
        }
        case 5: {
            kites.push([m-1, n-1, 0], [m-1, n-1, 1], [m, n-2, 5], [m,n-2, 4]);
            break;
        }
    }
    return kites;
}

export const getKitesInHat = (tile) => {
    const {m, n, i} = tile;
    const kites = [[m, n, i], [m, n, (i+1) % 6], [m, n, (i+4) % 6], [m, n, (i+5) % 6]];
    switch (i) {
        case 0: {
            kites.push([m+1, n+1, 1], [m+1, n+1, 2], [m+1, n-1, 3], [m+1, n-1, 4]);
            break;
        }
        case 1: {
            kites.push([m+1, n-1, 2], [m+1, n-1, 3], [m, n-2, 4], [m, n-2, 5]);
            break;
        }
        case 2: {
            kites.push([m, n-2, 3], [m, n-2, 4], [m-1, n-1, 5], [m-1, n-1, 0]);
            break;
        }
        case 3: {
            kites.push([m-1, n-1, 4], [m-1, n-1, 5], [m-1,n+1, 0], [m-1, n+1, 1]);
            break;
        }
        case 4: {
            kites.push([m-1, n+1, 5], [m-1, n+1, 0], [m,n+2, 1], [m, n+2, 2]);
            break;
        }
        case 5: {
            kites.push([m,n+2, 0], [m, n+2, 1], [m+1, n+1, 2], [m+1, n+1, 3]);
            break;
        }
    }
    return kites;
}


// export const kiteIsInHat = (kite, hat) => {
//     const [m1, n1, i1] = kite;
//     const [m2,n2, i2] = hat;
//     const kites = getKitesInHat(m2, n2, i2);
//     for (const k of kites) {
//         if (k[0] === m1 && k[1] === n1 && k[2] === i1) {
//             return true;
//         }
//     }
//     return false;
// }

// export const kiteIsInAntiHat = (kite, hat) => {
//     const [m1, n1, i1] = kite;
//     const [m2, n2, i2] = hat;
//     const kites = getKitesInAntiHat(m2, n2, i2);
//     for (const k of kites) {
//         if (k[0] === m1 && k[1] === n1 && k[2] === i1) {
//             return true;
//         }
//     }
//     return false;
// }
