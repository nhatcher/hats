import __wbg_init, { solveSat } from './pkg/splr_wasm.js';

async function init() {
    await __wbg_init();
}

init();

onmessage = (e) => {
    const data = e.data[0];
    const clausesCount = e.data[1];
    const t0 = performance.now();
    const result = JSON.parse(solveSat(data));
    const t1 = performance.now();
    result.time = t1 - t0;
    result.clausesCount = clausesCount;
    postMessage(result);
};