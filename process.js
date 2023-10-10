let currentBlock = new Array(2); // [x][y]
let nextBlocks = Array.from(Array(3), () => new Array(2)); // next three blocks
let preDropBlock =  Array.from(Array(4), () => new Array(2));
let rotateVariations; // Current Variations of Rotation
let rotateIndex = 1; // Current Rotation Status

for (let i = 0; i < 3; i++) {
    nextBlocks[i] = randomBlockType();
}
nextBlock()
let intervalF = setInterval(fallGuys, 1000);
preDrop();

/**
 * free blocks are falling down
 */
function fallGuys() {
    if (currentBlock[0][0][1] < 19 && currentBlock[0][1][1] < 19 && currentBlock[0][2][1] < 19 && currentBlock[0][3][1] < 19) { // Checks if next block isn't the ground
        if (checkCollision(0, 1)) { // Checks next block
            for (let i = 0; i < currentBlock[0].length; i++) {
                gameBoard[currentBlock[0][i][1]][currentBlock[0][i][0]] = ""; // Clear current block
                currentBlock[0][i][1]++; // y-axis increases by 1
            }
            for (let i = 0; i < currentBlock[0].length; i++) {
                gameBoard[currentBlock[0][i][1]][currentBlock[0][i][0]] = currentBlock[1]; // Set updated block
            }
        }
    }
    else {
        fixBlock();
    }
}

/**
 * rotates the current block into the next position
 */
function rotateBlock() {
    let midX, midY; // x- and y-axis of the focus block
    rotateVariations = rotation(currentBlock[1])

    if (rotateIndex > 3) {
        rotateIndex = 0;
    }
    let rotations = rotateVariations[rotateIndex++];


    if (checkRotation(rotations)) { // if rotation is possible
        for (let i = 0; i < gameBoard.length; i++) { // clears all moving blocks
            for (let j = 0; j < gameBoard[0].length; j++) {
                if (gameBoard[i][j].charAt(1) === 'M') {
                    gameBoard[i][j] = "";
                }
            }
        }

        for (let i = 0; i < currentBlock[0].length; i++) { // set focus block (middle block)
            if (currentBlock[0][i][2] === 'M') {
                midX = currentBlock[0][i][0]; // x-axis of the focus block
                midY = currentBlock[0][i][1]; // y-axis of the focus block
                gameBoard[midY][midX] = currentBlock[1]
            }
        }

        let count = 0;
        for (let i = 0; i < currentBlock[0].length; i++) { // set surrounding blocks
            if (currentBlock[0][i][2] !== 'M') {
                currentBlock[0][i][0] = midX + rotations[count][0];
                currentBlock[0][i][1] = midY + rotations[count][1];
                gameBoard[midY + rotations[count][1]][midX + rotations[count][0]] = currentBlock[1];
                count++;
            }
        }
    }
    loadGameBoard(true);
}

/**
 * checks if the rotation is possible
 * @param rotations
 * @returns {boolean}
 */
function checkRotation(rotations) {
    let tempBlock = Array.from(Array(4), () => new Array(2)); // [x][y]
    let midX, midY;

    for (let i = 0; i < currentBlock[0].length; i++) {
        if (currentBlock[0][i][2] === 'M') {
            midX = currentBlock[0][i][0];
            midY = currentBlock[0][i][1];
        }
    }

    let count = 0;
    for (let i = 0; i < currentBlock[0].length; i++) {
        if (currentBlock[0][i][2] !== 'M') {
            tempBlock[i][0] = midX + rotations[count][0];
            tempBlock[i][1] = midY + rotations[count][1];
            count++;
        } else {
            tempBlock[i][0] = midX;
            tempBlock[i][1] = midY;
        }
    }

    for (let i = 0; i < tempBlock.length; i++) {
        if (tempBlock[i][1] > 19) {
            fixBlock();
            return false;
        }
        if (tempBlock[i][0] < 0 || tempBlock[i][0] > 19) {
            return false;
        }
        if (gameBoard[tempBlock[i][1]][tempBlock[i][0]] !== "" && gameBoard[tempBlock[i][1]][tempBlock[i][0]] !== currentBlock[1]) {
            return false;
        }
    }
    return true;
}

/**
 * function to get all rotation phases of any block you want
 * @param thisBlock block ype
 * @returns {any[][]} all rotation phases
 */
function rotation(thisBlock) {
    let rotate = Array.from(Array(4), () => new Array(4)); // [x][y]
    switch (thisBlock.charAt(0)) {
        case "I": // [1. Rotation][2. Rotation][3. Rotation][4. Rotation]
            rotate = [[[0, -1], [0, 1], [0, 2]], [[-1, 0], [-2, 0], [1, 0]], [[0, -2], [0, -1], [0, 1]], [[-1, 0], [1, 0], [2, 0]]]
            break;
        case "S":
            rotate = [[[1, 0], [0, 1], [-1, 1]], [[-1, 0], [-1, -1], [0, 1]], [[1, 0], [0, 1], [-1, 1]], [[-1, 0], [-1, -1], [0, 1]]]
            break;
        case "Z":
            rotate = [[[-1, 0], [0, 1], [1, 1]], [[-1, 0], [-1, 1], [0, -1]], [[-1, 0], [0, 1], [1, 1]], [[-1, 0], [-1, 1], [0, -1]]]
            break;
        case "L":
            rotate = [[[0, -1], [0, 1], [1, 1]], [[1, 0], [-1, 0], [-1, 1]], [[0, 1], [0, -1], [-1, -1]], [[-1, 0], [-1, -1], [1, 0]]]
            break;
        case "J":
            rotate = [[[0, -1], [0, 1], [-1, 1]], [[-1, 0], [-1, -1], [1, 0]], [[0, 1], [0, -1], [1, -1]], [[-1, 0], [1, 0], [1, 1]]]
            break;
        case "T":
            rotate = [[[-1, 0], [1, 0], [0, 1]], [[-1, 0], [0, -1], [0, 1]], [[-1, 0], [1, 0], [0, -1]], [[0, -1], [0, 1], [1, 0]]]
            break;
    }
    return rotate
}

/**
 * calculates the position where the block will drop
 */
function preDrop() {
    // set the pre drop block coordination's
    for(let i = 0; i < currentBlock[0].length; i++){
        preDropBlock[i][0] = currentBlock[0][i][0];
        preDropBlock[i][1] = currentBlock[0][i][1];
    }

    // remove all pre drop blocks
    for (let i = 0; i < gameBoard.length; i++) {
        for(let j = 0; j < gameBoard[0].length; j++){
            if(gameBoard[i][j].charAt(1) === "R"){
                gameBoard[i][j] = "";
            }
        }
    }

    // Drop the block
    let fix = false;
    do {
        if (preDropBlock[0][1] < 19 && preDropBlock[1][1] < 19 && preDropBlock[2][1] < 19 && preDropBlock[3][1] < 19) {
            let canMoveDown = true;
            for (let i = 0; i < 4; i++) {
                if (!(gameBoard[preDropBlock[i][1] + 1][preDropBlock[i][0]] === "" || gameBoard[preDropBlock[i][1] + 1][preDropBlock[i][0]] === currentBlock[1])) {
                    canMoveDown = false;
                    break;
                }
            }
            if (canMoveDown) {
                for (let i = 0; i < 4; i++) {
                    preDropBlock[i][1]++;
                }
            } else {
                fix = true;
            }
        } else {
            fix = true;
        }
    } while (fix === false);

    // Set the block into the matrix
    for(let x = 0; x < preDropBlock.length; x++){
        for (let i = 0; i < gameBoard.length; i++) {
            for(let j = 0; j < gameBoard[0].length; j++){
                if(i === preDropBlock[x][1] && j === preDropBlock[x][0]){
                    if(gameBoard[i][j] === ""){
                        gameBoard[i][j] = currentBlock[1].charAt(0) + "R"
                    }
                }
            }
        }
    }
}

/**
 * function to drop a block
 */
function dropBlock(){
    for(let i = 0; i < gameBoard.length; i++){
        for(let j = 0; j < gameBoard[0].length; j++){
            if(gameBoard[i][j].charAt(1) === "M"){
                gameBoard[i][j] = "";
            }
            if(gameBoard[i][j].charAt(1) === "R"){
                gameBoard[i][j] = currentBlock[1];
            }
        }
    }
    fixBlock();
}

/**
 * fixes all blocks so that they're static
 */
function fixBlock() {
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (gameBoard[i][j]) {
                gameBoard[i][j] = gameBoard[i][j].charAt(0) + "B"; // Fix all blocks
            }
        }
    }
    nextBlock(true);
    preDrop();
    checkRows();
}

/**
 * moves the block into a direction
 * @param direction
 */
function moveBlock(direction) {
    if (currentBlock[0][0][0] + direction < 10 && currentBlock[0][1][0] + direction < 10 && currentBlock[0][2][0] + direction < 10 && currentBlock[0][3][0] + direction < 10) { // Checks if next block isn't the border
        if (currentBlock[0][0][0] + direction >= -1 && currentBlock[0][1][0] + direction >= -1 && currentBlock[0][2][0] + direction >= -1 && currentBlock[0][3][0] + direction >= -1) { // Checks if next block isn't the ground
            if (checkCollision(direction, 0)) { // Checks next block
                for (let i = 0; i < currentBlock[0].length; i++) {
                    gameBoard[currentBlock[0][i][1]][currentBlock[0][i][0]] = ""; // Clear current block
                    currentBlock[0][i][0] += direction; // x-axis increases by moving factor
                }
                for (let i = 0; i < currentBlock[0].length; i++) {
                    gameBoard[currentBlock[0][i][1]][currentBlock[0][i][0]] = currentBlock[1]; // Set updated block
                }
            }
        }
    }
    loadGameBoard(true);
}

/**
 * checks if a move ends with a collision or not
 * @param x block movement into x
 * @param y block movement into y
 * @returns {boolean} if the move is possible or not
 */
function checkCollision(x, y) {
    let count = 0;
    for (let i = 0; i < gameBoard[0].length; i++) {
        if (gameBoard[currentBlock[0][i][1] + y][currentBlock[0][i][0] + x] !== "" && gameBoard[currentBlock[0][i][1] + y][currentBlock[0][i][0] + x] !== currentBlock[1] && gameBoard[currentBlock[0][i][1] + y][currentBlock[0][i][0] + x].charAt(1) !== "R") { // Check if next move/block isn't selected already
            if (x === 0) {
                fixBlock(); // If the block sits on the ground all blocks get fixed
            }
            return false;
        } else {
            count++;
        }
        if (count === 4) {
            return true;
        }
    }
}

/**
 * checks if a row is finished
 * if it's full it gets cleared
 */
function checkRows() {
    for (let i = 0; i < gameBoard.length; i++) {
        let count = 0;
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (gameBoard[i][j] !== "") {
                count++;
            }
        }
        if (count === gameBoard[0].length) { // clear when the line is full
            lines++;
            clearRow(i)
        }
    }
}

/**
 * clears a row
 * @param row
 */
function clearRow(row) {
    for (let j = 0; j < gameBoard[0].length; j++) {
        gameBoard[row][j] = "";
    }

    for (let i = gameBoard.length - 1; i >= 0; i--) { // from bottom to top
        for (let j = 0; j < gameBoard[0].length; j++) {
            if (gameBoard[i][j] !== "") {
                let block = [j, i, gameBoard[i][j]]
                fallBlocks(block)
            }
        }
    }

    lines++;
    score += lines*5
}

/**
 * this function makes a block fall again
 * @param fallenBlock
 */
function fallBlocks(fallenBlock) {
    if (fallenBlock[1] < 19) { // Checks if next block isn't the ground
        if (gameBoard[fallenBlock[1] + 1][fallenBlock[0]] === "") { // Checks next block
            gameBoard[fallenBlock[1] + 1][fallenBlock[0]] = gameBoard[fallenBlock[1]][fallenBlock[0]]; // Set updated block
            gameBoard[fallenBlock[1]][fallenBlock[0]] = ""; // Clear current
        }
    }
    else {
        gameBoard[fallenBlock[1]][fallenBlock[0]] = fallenBlock[2].charAt(0) + "B"; // Fix all blocks
    }
}