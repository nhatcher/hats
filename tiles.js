
import { getKitesInHat, getKitesInAntiHat} from './hats.js';
import { getKitesInTurtle, getKitesInAntiTurtle } from './turtles.js';

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