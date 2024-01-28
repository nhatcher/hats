import decorateTilesWithVertices from './spectre.js';

// enum Tiles {
//     Hat=1,
//     AntiHat,
//     Turtle,
//     AntiTurtle,
// }


class Grid {
    width;
    height;
    columnCount;
    rowCount;
    tiles;
    clickX;
    clickY;
    a;
    b;

    constructor(width, height, columnCount) {
        this.width = width;
        this.height = height;

        this._setColumnCount(columnCount);

        this.clickX = null;
        this.clickY = null;
        this.tiles = [{ m: 6, n: 4, isDragging: false, i: 0, isSelected: true, kind: 1 }];
    }

    *selectedTiles() {
        for (let tile of this.tiles) {
            if (tile.isSelected) {
                yield tile;
            }
        }
    }

    _setColumnCount(m) {
        console.assert(m % 2 === 1, "columnCount must be odd");
        this.columnCount = m;
        const scale = this.width / (3 * m);
        this.scale = scale;
        this.a = scale;
        this.b = scale * Math.sqrt(3);
        this.rowCount = Math.ceil(this.height / this.b);
        if (this.rowCount % 2 === 0) {
            this.rowCount += 1;
        }
    }

    setColumnCount = (m) => {
        this._setColumnCount(m);
        this.redraw();
    }

    getDimensions() {
        return {
            rowCount: this.rowCount,
            columnCount: this.columnCount,
        }
    }

    setDimensions(w, h) {
        this.width = w;
        this.height = h;
        const scale = this.width / (3 * this.columnCount);
        this.scale = scale;
        this.a = scale;
        this.b = scale * Math.sqrt(3);
        this.rowCount = Math.ceil(this.height / this.b);
        if (this.rowCount % 2 === 0) {
            this.rowCount += 1;
        }
        this.redraw();
    }

    setTiles = (h) => {
        this.tiles = h;
    }

    getSelectedTiles = () => {
        return this.tiles.filter( t => t.isSelected);
    }

    turn(point, alpha, l) {
        const [x, y] = point;
        return [x + l * Math.cos(alpha), y - l * Math.sin(alpha)];
    }

    rotate(alpha) {
        for (let tile of this.tiles) {
            if (tile.isSelected) {
                let beta = (tile.i + alpha) % 6;
                if (beta < 0) {
                    beta += 6;
                }
                tile.i = beta;
            }
        }
        this.redraw();
    }

    toggleSign() {
        for (let tile of this.tiles) {
            if (tile.isSelected) {
                tile.kind = tile.kind % 4 + 1;
            }
        }
        this.redraw();
    }

    deleteTile() {
        this.tiles = this.tiles.filter((tile) => !tile.isSelected);
        this.redraw();
    }

    moveLeft() {
        for (const tile of this.selectedTiles()) {
            let x = tile.m - 1;
            const y = tile.m % 2 === 0 ? tile.n + 1 : tile.n - 1;
            if (x < -1) {
                x = x % 2 === 0 ? this.columnCount + 1 : this.columnCount;
            }
            tile.m = x;
            tile.n = y;
        };
        this.redraw();
    }

    moveRight() {
        for (const tile of this.selectedTiles()) {
            let x = tile.m + 1;
            const y = tile.m % 2 === 0 ? tile.n + 1 : tile.n - 1;
            if (x > this.columnCount + 1) {
                x = x % 2 === 0 ? 0 : -1;
            }
            tile.m = x;
            tile.n = y;
        };
        this.redraw();
    }

    moveUp() {
        for (const tile of this.selectedTiles()) {
            let y = tile.n - 2;
            if (y < -1) {
                y = y % 2 === 0 ? this.rowCount + 1 : this.rowCount;
            }
            tile.n = y;
        };
        this.redraw();
        this.redraw();
    }

    moveDown() {
        for (const tile of this.selectedTiles()) {
            let y = tile.n + 2;
            if (y > this.rowCount + 1) {
                y = y % 2 === 0 ? 0 : -1;
            }
            tile.n = y;

        }
        this.redraw();
    }

    onKeydown = (event) => {
        switch (event.code) {
            case 'Delete': {
                this.deleteTile();
                break;
            }
            case 'KeyR': {
                if (event.shiftKey) {
                    this.rotate(-1)
                } else {
                    this.rotate(1);
                }
                break;
            }
            case 'KeyS': {
                this.save();
                break;
            }
            case 'Space': {
                this.toggleSign();
                break;
            }
            case 'KeyA': {
                if (event.ctrlKey) {
                    this.tiles.forEach(h => h.isSelected = true);
                    this.redraw();
                } else {
                    this.add();
                }
                break;
            }
            case 'ArrowLeft': {
                this.moveLeft();
                break;
            }
            case 'ArrowRight': {
                this.moveRight();
                break;
            }
            case 'ArrowUp': {
                this.moveUp();
                break;
            }
            case 'ArrowDown': {
                this.moveDown();
                break;
            }
        }
        event.preventDefault();
        event.stopPropagation();
    }

    drawGrid(ctx) {
        const width = this.width;
        const height = this.height;
        const a = this.a;
        const b = this.b;
        ctx.strokeStyle = "#EEE";
        ctx.lineWidth = 1;
        // 1. vertical lines every 3 * a
        {
            ctx.beginPath();
            for (let i = 0; i < this.columnCount; i++) {
                const x = 3 * a * i + 0.5;
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
            }
            ctx.stroke();
        }

        // 2. horizontal lines every b

        {
            ctx.beginPath();
            for (let i = 0; i < this.rowCount; i++) {
                const y = b * i + 0.5;
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
            }
            ctx.stroke();
        }

        // 3. Draw the "triangles"
        {
            const columnCount = this.columnCount;
            const rowCount = this.rowCount;

            ctx.beginPath();

            for (let row = 0; row < rowCount; row++) {
                if (row % 2 === 1) {
                    // odd row
                    for (let column = 0; column < columnCount; column++) {
                        let x = column * 3 * a;
                        let y = row * b;
                        if (column % 2 === 0) {
                            // even column
                            ctx.moveTo(x, y + b);
                            ctx.lineTo(x + a, y);
                            ctx.lineTo(x + 2 * a, y + b);
                            ctx.lineTo(x + 3 * a, y);

                            ctx.moveTo(x, y + b);
                            ctx.lineTo(x + 3 * a, y);
                        } else {
                            ctx.moveTo(x, y);
                            ctx.lineTo(x + a, y + b);
                            ctx.lineTo(x + 2 * a, y);
                            ctx.lineTo(x + 3 * a, y + b);

                            ctx.moveTo(x, y);
                            ctx.lineTo(x + 3 * a, y + b);
                        }
                    }
                } else {
                    // even row
                    for (let column = 0; column < columnCount; column++) {
                        let x = column * 3 * a;
                        let y = row * b;
                        if (column % 2 === 0) {
                            // even column
                            ctx.moveTo(x, y);
                            ctx.lineTo(x + a, y + b);
                            ctx.lineTo(x + 2 * a, y);
                            ctx.lineTo(x + 3 * a, y + b);

                            ctx.moveTo(x, y);
                            ctx.lineTo(x + 3 * a, y + b);

                        } else {
                            ctx.moveTo(x, y + b);
                            ctx.lineTo(x + a, y);
                            ctx.lineTo(x + 2 * a, y + b);
                            ctx.lineTo(x + 3 * a, y);

                            ctx.moveTo(x, y + b);
                            ctx.lineTo(x + 3 * a, y);
                        }
                    }
                }
            }
            ctx.stroke();
        }
    }

    add() {
        for (const tile of this.tiles) {
            tile.isSelected = false;
        }
        this.tiles.push(
            { m: 1, n: 1, isDragging: false, i: 0, isSelected: true, kind: 1 }
        );

        this.redraw();
    }

    redraw = (e) => {
        const canvas = document.getElementById("canvas");
        const width = this.width;
        const height = this.height;
        this.a = this.scale;
        this.b = this.a * Math.sqrt(3);
        this.hatColors = [...document.querySelectorAll('.color.hat')].map(s => s.value);
        this.antiHatColors = [...document.querySelectorAll('.color.cher')].map(s => s.value);
        this.turtleColors = [...document.querySelectorAll('.color.turtle')].map(s => s.value);
        this.antiTurtleColors = [...document.querySelectorAll('.color.anti-turtle')].map(s => s.value);
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (document.getElementById("show-grid").checked) {
            this.drawGrid(ctx);
        }

        if (e && e.type === 'mouseup') {
            // Localize the click to within the canvas
            const { clientX, clientY, currentTarget } = e;
            const { left, top } = currentTarget.getBoundingClientRect();
            this.clickX = clientX - left;
            this.clickY = clientY - top;
            if (!e.shiftKey) {
                for (const tile of this.tiles) {
                    tile.isSelected = false;
                }
            }
        } else {
            this.clickX = undefined;
            this.clickY = undefined;
        }

        for (const tile of this.tiles) {
            this.drawHat(tile, ctx);
        }
    }

    drawSpectres = (ratioA, ratioB) => {
        const canvas = document.getElementById("canvas");
        const width = this.width;
        const height = this.height;
        this.a = this.scale * ratioA;
        this.b = this.scale * ratioB;
        this.hatColors = [...document.querySelectorAll('.color.hat')].map(s => s.value);
        this.antiHatColors = [...document.querySelectorAll('.color.cher')].map(s => s.value);
        this.turtleColors = [...document.querySelectorAll('.color.turtle')].map(s => s.value);
        this.antiTurtleColors = [...document.querySelectorAll('.color.anti-turtle')].map(s => s.value);
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const vertexDict = decorateTilesWithVertices(this.tiles);
        this.vertexDict = vertexDict;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.ctx = ctx;
        this.tiles.forEach(tile => tile.drawn = false);
        const tile = this.tiles[0];
        this.drawSpectresRecursively(tile, 0, tile.m * 3 * this.a, tile.n * this.b);
    }

    drawSpectresRecursively = (tile, startVertex, x0, y0) => {
        // draws the tile starting at the vertex startVertex with coordinates (x, y)
        // When it finds another vertex draws every other tile in that vertex first and then continues
        tile.drawn = true;
        const ctx = this.ctx;
        const a = this.a;
        const b = this.b;
        const hatEdges = [
            [90, b],       // 1
            [0, a],        // 2
            [60, a],       // 3
            [-30, b],      // 4
            [-90, b],      // 5
            [0, a],        // 6
            [-60, a],      // 7
            [-150, b],     // 8
            [-210, b],     // 9
            [-120, a],     // 10
            [-180, a],     // 11
            [-180, a],     // 12
            [-240, a],     // 13
            [30, b]        // 14
        ];

        const turtleEdges = [
            [90, b],       // 1
            [0, a],        // 2
            [-60, a],      // 3
            [30, b],       // 4
            [-30, b],      // 5
            [-120, a],     // 6
            [-180, a],     // 7
            [-90, b],      // 8
            [-150, b],     // 9
            [-150, b],     // 10
            [-210, b],     // 11
            [60, a],       // 12
            [120, a],      // 13
            [30, b],       // 14
        ];
        const vertices = tile.vertices;
        const l = vertices.length;
        if (l !== vertices.length) {
            throw Error(`Vertices number do not match ${l} !== ${vertices.length}`);
        }
        const sign = [1, 3].includes(tile.kind) ? 1 : -1;
        const edges = [1, 2].includes(tile.kind) ? hatEdges : turtleEdges;
        let beta = tile.i * Math.PI / 3;
        if (tile.kind === 2) {
            beta += Math.PI;
        }
        let coordinates = [];
        let x = x0;
        let y = y0;
        for (let v = 0; v < l; v++) {
            const vertexIndex = (startVertex + v) % l;
            const vertex = vertices[vertexIndex];
            if (!(`${vertex.m}-${vertex.n}-${vertex.spot}` in this.vertexDict)) {
                throw Error(`${vertex.m}-${vertex.n}-${vertex.spot} is not in dictionary`)
            } else {
                for (const pair of this.vertexDict[`${vertex.m}-${vertex.n}-${vertex.spot}`]) {
                    const [newTileIndex, newVertexIndex] = pair;
                    const newTile = this.tiles[newTileIndex];
                    if (!newTile.drawn) {
                        this.drawSpectresRecursively(newTile, newVertexIndex, x, y);
                    }

                }
            }
            const edge = edges[vertexIndex];
            const [xn, yn] = this.turn([x, y], sign * edge[0] * Math.PI / 180 + beta, edge[1]);
            coordinates.push([xn, yn]);
            x = xn;
            y = yn;
        }
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        for (const coordinate of coordinates) {
            const [xn, yn] = coordinate;
            ctx.lineTo(xn, yn);
            switch (tile.kind) {
                case 1:
                    ctx.fillStyle = this.hatColors[tile.i];
                    break;
                case 2:
                    ctx.fillStyle = this.antiHatColors[tile.i];
                    break;
                case 3:
                    ctx.fillStyle = this.turtleColors[tile.i];
                    break;
                case 4:
                    ctx.fillStyle = this.antiTurtleColors[tile.i];
                    break;
                default:
                    throw new Error(`Invalid kind: ${tile.kind}`);
            }
        }
        ctx.stroke();
        ctx.fill();
    }

    drawHat(tile, ctx) {
        const a = this.a;
        const b = this.b;
        let x = tile.m * 3 * a;
        let y = tile.n * b;

        let beta = tile.i * Math.PI / 3;
        if (tile.kind === 2) {
            beta += Math.PI;
        }

        const hatEdges = [
            [90, b],       // 2
            [0, a],        // 3
            [60, a],       // 4
            [-30, b],      // 5
            [-90, b],      // 6
            [0, a],        // 7
            [-60, a],      // 8
            [-150, b],     // 9
            [-210, b],     // 10
            [-120, a],     // 11
            [-180, 2 * a], // 12
            [-240, a],     // 13
            [30, b]        // 14
        ];

        const turtleEdges = [
            [90, b],       // 1
            [0, a],        // 2
            [-60, a],      // 3
            [30, b],       // 4
            [-30, b],      // 5
            [-120, a],     // 6
            [-180, a],     // 7
            [-90, b],      // 8
            [-150, 2 * b], // 9
            [-210, b],     // 10
            [60, a],       // 11
            [120, a],      // 12
            [30, b],       // 13
        ];

        ctx.beginPath();

        ctx.moveTo(x, y);

        const sign = [1, 3].includes(tile.kind) ? 1 : -1;
        const edges = [1, 2].includes(tile.kind) ? hatEdges : turtleEdges;
        for (const edge of edges) {
            const [xn, yn] = this.turn([x, y], sign * edge[0] * Math.PI / 180 + beta, edge[1]);
            ctx.lineTo(xn, yn);
            x = xn;
            y = yn;
        }

        if ((this.clickX && this.clickY) && ctx.isPointInPath(this.clickX, this.clickY)) {
            tile.isSelected = true;
        }


        ctx.strokeStyle = "#333";

        switch (tile.kind) {
            case 1:
                ctx.fillStyle = this.hatColors[tile.i];
                break;
            case 2:
                ctx.fillStyle = this.antiHatColors[tile.i];
                break;
            case 3:
                ctx.fillStyle = this.turtleColors[tile.i];
                break;
            case 4:
                ctx.fillStyle = this.antiTurtleColors[tile.i];
                break;
            default:
                throw new Error(`Invalid kind: ${tile.kind}`);
        }
        if (tile.isSelected) {
            ctx.lineWidth = 2;
        } else {
            ctx.lineWidth = 1;
        }

        ctx.stroke();
        ctx.fill();
    }
}

export default Grid;