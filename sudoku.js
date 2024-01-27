// Generates all the clauses for an empty sudoku board
const createClauses = () => {
    let clausesCount = 0;
    // 729 variables
    const variableCount = 8 * 9 * 9 + 8 * 9 + 9;
    const data = [];

    // Every row must contain every number (81 clauses)
    for (let row = 0; row < 9; row++) {
        for (let n = 1; n < 10; n++) {
            const statement = [];
            for (let column = 0; column < 9; column++) {
                statement.push(fromCellToIndex(row, column, n));
            }
            clausesCount++;
            data.push(9, ...statement);
        }
    }

    // every column must contain every number (81 clauses)
    for (let column = 0; column < 9; column++) {
        for (let n = 1; n < 10; n++) {
            const statement = [];
            for (let row = 0; row < 9; row++) {
                statement.push(fromCellToIndex(row, column, n));
            }
            clausesCount++;
            data.push(9, ...statement);
        }
    }
    // every block must contain every number (81 clauses)
    for (let blockX = 0; blockX < 3; blockX++) {
        for (let blockY = 0; blockY < 3; blockY++) {
            for (let n = 1; n < 10; n++) {
                const statement = [];
                for (let i = 0; i < 3; i++) {
                    const row = blockX * 3 + i;
                    for (let j = 0; j < 3; j++) {
                        const column = blockY * 3 + j;
                        statement.push(fromCellToIndex(row, column, n));
                    }
                }
                clausesCount++;
                data.push(9, ...statement);
            }
        }
    }

    // In every spot if there is n, there cannot be m ( (9*8/2) * 81 = 2916 clauses)
    for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
            for (let n = 1; n < 10; n++) {
                for (let m = n + 1; m < 10; m++) {
                    clausesCount++;
                    data.push(2, -(fromCellToIndex(row, column, n)), -(fromCellToIndex(row, column, m)));
                }
            }
        }
    }

    return {
        data,
        clausesCount,
        variableCount
    }
}

// adds the clauses of the known numbers
const addClauses = (values, data) => {
    for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
            const value = values[row][column];
            if (value !== 0) {
                data.push(1, fromCellToIndex(row, column, value));
            }
        }
    }
}

// the statement there is a number n in (row, column) has index:
// index = row*9*9+column*9+n
const fromCellToIndex = (row, column, n) => {
    return row * 9 * 9 + column * 9 + n;
}

const fromIndexToCell = (index) => {
    // index = row*9*9+column*9+n
    const row = Math.floor((index - 1) / 81);
    const column = Math.floor((index - 1 - row * 81) / 9);
    const n = index - row * 81 - column * 9;
    return { row, column, n };
}

export { addClauses, fromIndexToCell };
export default createClauses;