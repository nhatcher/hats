


class Grid {
    width;
    height;
    columnCount;
    rowCount;
    hats;
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
        this.hats = [{ x: 6, y: 4, isDragging: false, beta: 0, isSelected: true, sign: 1 }];
    }

    *selectedHats() {
        for (let hat of this.hats) {
            if (hat.isSelected) {
                yield hat;
            }
        }
    }

    _setColumnCount(m) {
        console.assert(m % 2 === 1, "columnCount must be odd");
        this.columnCount = m;
        const scale = this.width / (3 * m);
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
        this.a = scale;
        this.b = scale * Math.sqrt(3);
        this.redraw();
    }

    setHats = (h) => {
        this.hats = h;
    }

    turn(point, alpha, l) {
        const [x, y] = point;
        return [x + l * Math.cos(alpha), y - l * Math.sin(alpha)];
    }

    rotate(alpha) {
        for (let hat of this.hats) {
            if (hat.isSelected) {
                const beta = (hat.beta + alpha) % 6;
                hat.beta = beta;
            }
        }
        this.redraw();
    }

    toggleSign() {
        for (let hat of this.hats) {
            if (hat.isSelected) {
                hat.sign = -hat.sign;
            }
        }
        this.redraw();
    }

    deleteHat() {
        this.hats = this.hats.filter((hat) => !hat.isSelected);
        this.redraw();
    }

    moveLeft() {
        for (const hat of this.selectedHats()) {
            let x = hat.x - 1;
            const y = hat.x % 2 === 0 ? hat.y + 1 : hat.y - 1;
            if (x < -1) {
                x = x % 2 === 0 ? this.columnCount + 1 : this.columnCount;
            }
            hat.x = x;
            hat.y = y;
        };
        this.redraw();
    }

    moveRight() {
        for (const hat of this.selectedHats()) {
            let x = hat.x + 1;
            const y = hat.x % 2 === 0 ? hat.y + 1 : hat.y - 1;
            if (x > this.columnCount + 1) {
                x = x % 2 === 0 ? 0 : -1;
            }
            hat.x = x;
            hat.y = y;
        };
        this.redraw();
    }

    moveUp() {
        for (const hat of this.selectedHats()) {
            let y = hat.y - 2;
            if (y < -1) {
                y = y % 2 === 0 ? this.rowCount + 1 : this.rowCount;
            }
            hat.y = y;
        };
        this.redraw();
        this.redraw();
    }

    moveDown() {
        for (const hat of this.selectedHats()) {
            let y = hat.y + 2;
            if (y > this.rowCount + 1) {
                y = y % 2 === 0 ? 0 : -1;
            }
            hat.y = y;

        }
        this.redraw();
    }

    onKeydown = (event) => {
        switch (event.code) {
            case 'KeyD': {
                this.deleteHat();
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
                console.log(event);
                if (event.ctrlKey) {
                    this.hats.forEach(h => h.isSelected = true);
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
        // 1. vertical lines every 3 * a
        {
            let lineCount = Math.ceil(width / 3 * a);
            ctx.strokeStyle = "#EEE";
            ctx.beginPath();
            for (let i = 0; i < lineCount; i++) {
                const x = 3 * a * i + 0.5;
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
            }
            ctx.stroke();
        }

        // 2. horizontal lines every b

        {
            let lineCount = Math.ceil(height / b);
            ctx.strokeStyle = "#EEE";
            ctx.beginPath();
            for (let i = 0; i < lineCount; i++) {
                const y = b * i + 0.5;
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
            }
            ctx.stroke();
        }

        // 3. Draw the "triangles"
        {
            const columnCount = Math.ceil(width / (3 * a));
            const rowCount = Math.ceil(height / b);

            ctx.strokeStyle = "#EEE";
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
        for (const hat of this.hats) {
            hat.isSelected = false;
        }
        this.hats.push(
            { x: 1, y: 1, isDragging: false, beta: 0, isSelected: true, sign: 1 }
        );

        this.redraw();
    }

    redraw = (e) => {
        const canvas = document.getElementById("canvas");
        const width = this.width;
        const height = this.height;
        this.hatColors = [...document.querySelectorAll('.color.hat')].map(s => s.value);
        this.antiHatColors = [...document.querySelectorAll('.color.antihat')].map(s => s.value);
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
                for (const hat of this.hats) {
                    hat.isSelected = false;
                }
            }
        } else {
            this.clickX = undefined;
            this.clickY = undefined;
        }

        for (let hat of this.hats) {
            this.drawHat(hat, ctx);
        }
    }

    drawHat(hat, ctx) {
        const a = this.a;
        const b = this.b;
        let x = hat.x * 3 * a;
        let y = hat.y * b;

        let beta = hat.beta * Math.PI / 3;
        if (hat.sign === -1) {
            beta += Math.PI;
        }

        // draw the hat
        const trips = [
            [90, b],     // 2
            [0, a],      // 3
            [60, a],     // 4
            [-30, b],    // 5
            [-90, b],    // 6
            [0, a],      // 7
            [-60, a],    // 8
            [-150, b],   // 9
            [-210, b],   // 10
            [-120, a],   // 11
            [-180, 2 * a], // 12
            [-240, a],   // 13
            [30, b]     // 14
        ];

        ctx.beginPath();

        ctx.moveTo(x, y);

        for (let trip of trips) {
            const [xn, yn] = this.turn([x, y], hat.sign * trip[0] * Math.PI / 180 + beta, trip[1]);
            ctx.lineTo(xn, yn);
            x = xn;
            y = yn;
        }

        if ((this.clickX && this.clickY) && ctx.isPointInPath(this.clickX, this.clickY)) {
            hat.isSelected = true;
        }


        ctx.strokeStyle = "#333";

        if (hat.sign === 1) {
            ctx.fillStyle = this.hatColors[hat.beta];
        } else {
            ctx.fillStyle = this.antiHatColors[hat.beta];
        }
        if (hat.isSelected) {
            ctx.lineWidth = 2;
        } else {
            ctx.lineWidth = 1;
        }

        ctx.stroke();
        ctx.fill();
    }
}

export default Grid;