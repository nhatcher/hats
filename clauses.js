let mMax = 45;
let nMax = 43;

const kitesInAntiHat = (m, n, i) => {
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

const kiteIsInHat = (kite, hat) => {
    const [m1, n1, i1] = kite;
    const [m2,n2, i2] = hat;
    const kites = kitesInHat(m2, n2, i2);
    for (const k of kites) {
        if (k[0] === m1 && k[1] === n1 && k[2] === i1) {
            return true;
        }
    }
    return false;
}

const kiteIsInAntiHat = (kite, hat) => {
    const [m1, n1, i1] = kite;
    const [m2, n2, i2] = hat;
    const kites = kitesInAntiHat(m2, n2, i2);
    for (const k of kites) {
        if (k[0] === m1 && k[1] === n1 && k[2] === i1) {
            return true;
        }
    }
    return false;
}

const kitesInHat = (m, n, i) => {
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

// hat = {n, m, i, sign}
const hatsCollide = (h1, h2) => {
    const k1 = h1.sign === 1 ? kitesInHat(h1.m, h1.n, h1.i): kitesInAntiHat(h1.m, h1.n, h1.i);
    const k2 = h2.sign === 1 ? kitesInHat(h2.m, h2.n, h2.i): kitesInAntiHat(h2.m, h2.n, h2.i);
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


// We need to index the statement in (n,m,i) there is a(n) (anti)hat
const getIndex = (h) => {
    const index = h.n*(mMax+1)*6+Math.floor(h.m/2)*12+h.i+1;
    console.assert(index> 0);
    if (h.sign === -1) {
        return index + 6;
    }
    return index;
}

const fromIndexToHat = (index) => {
    const n = Math.floor((index-1)/((mMax+1)*6));
    const rest = index-1 - n*(mMax+1)*6;
    const m_half = Math.floor(rest/12);
    const m = n % 2 === 0 ? m_half*2: m_half*2+1;
    const alpha = rest - m_half*12;
    if (alpha < 6) {
        return {m, n, i: alpha, sign: 1};
    } else {
        return {m, n, i: alpha-6, sign: -1};
    }
}

// There are 12 variables per node. So 12 x mMax x nMax variables
const createClauses = (maxX, maxY) => {
    mMax = maxX + 4;
    nMax = maxY + 4;
    let data = [];
    for (let m=0; m <= mMax; m++) {
        for (let n=0; n <= nMax; n++) {
            if ( n % 2 !== m % 2) {
                // coordinates must have same parities
                continue;
            }
            // nor two hats or anti-hats can be together. This is (12 2) = 12!/(10!*2!) = 66 statements
            for (let i=0; i <12; i++) {
                const hat1 = i > 5 ? {m, n, i: i-6, sign: -1 }: {m, n, i, sign: 1};
                const index1 = getIndex(hat1);
                for (let j=i+1; j<12; j++) {
                    const index2 = j > 5 ? getIndex({m, n, i: j-6, sign: -1}) : getIndex({m, n, i: j, sign:1});
                    // add statement [-index1, -index2]
                    data.push(2, -index1, -index2);
                }
                
                // now we need to check that (n, m, i) does not collide with folks in surrounding vertices     
                const vertices = [[m+2, n], [m+1, n+1], [m, n+2], [m+1, n-1], [m+1, n+3], [m-1, n+3], [m+2, n+2], [m+2, n-2], [m, n+4]];
                for (const vertex of vertices) {
                    const [m1, n1] = vertex;
                    if (m1 > mMax || n1 > nMax || n1 < 1 || m1 < 1) {
                        continue;
                    }
                    for (let j=0; j<12; j++) {
                        const hat2 = j > 5 ? {m: m1, n: n1, i: j-6, sign: -1 }: {m: m1, n: n1, i: j, sign: 1};
                        if (hatsCollide(hat1, hat2)) {
                            const index2 = getIndex(hat2);
                            // add statement [-index1, -index2]
                            data.push(2, -index1, -index2);
                        }
                    }
                }
            }
            // We don't enforce the borders to be full
            const borderWidth = 2;
            if (m <= borderWidth || n <= borderWidth || n >= nMax-borderWidth || m >= mMax-borderWidth) {
                continue;
            }
            for (let i=0; i<6; i++) {
                // there is at least one hat that covers kite (m, n, i)
                const indices = [];
                const vertices = [ [m, n], [m-1, n-1], [m, n-2], [m+1, n-1], [m+1, n+1], [m, n+2], [m-1, n+1]];
                for (const vertex of vertices) {
                    const [m1, n1] = vertex;
                    if (m1 < 1 || n1 < 1 || m1> mMax || n1 > nMax) {
                        continue;
                    }
                    for (let j=0; j<6; j++) {
                        if (kiteIsInHat([m,n,i], [m1, n1, j])) {
                            let index = getIndex({m: m1,n:n1, i:j, sign : 1});
                            indices.push(index);
                        }
                        if (kiteIsInAntiHat([m,n,i], [m1, n1, j])) {
                            let index = getIndex({m: m1,n:n1, i:j, sign : -1});
                            indices.push(index);
                        }
                    }
                }
                // add statement indices
                data.push(indices.length, ...indices);
            }
        }
    }
    return data;
}

const addHatsToClauses = (hats, data) => {
    for (const hat of hats) {
        const index = getIndex(hat);
        // console.log(hat);
        if (index <= 0) {
            throw Error("sdfg");
        }
        console.log(index);
        data.push(1, index);
    }
}


export {fromIndexToHat, addHatsToClauses};
export default createClauses;