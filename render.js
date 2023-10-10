// Create GameBoard
let gameBoard = Array.from(Array(20), () => new Array(10)); // [y][x]
let lines = 0;
let score = 0;

for (let i = 0; i < gameBoard.length; i++) {
    for (let j = 0; j < gameBoard[0].length; j++) {
        gameBoard[i][j] = ""; // Set all blocks to ""
    }
}

// BlockTypes
let blockTypes = ["OM", "IM", "SM", "ZM", "LM", "JM", "TM"] // All block types

// Creating canvas
const c = document.getElementById("gameBoardCanvas");
const ctx = c.getContext("2d");
const c2 = document.getElementById("nextCanvas");
const ctx2 = c2.getContext("2d");

loadStartMenu()
function loadStartMenu(){
    // Interval load GameBoard
    loadGameBoard();
    let intervalG = setInterval(loadGameBoard, 1);
}
function loadGameBoard() {
    ctx.clearRect(0, 0, 400, 800) // Clear canvas
    for (let y = 0; y < gameBoard.length; y++) {
        for (let x = 0; x < gameBoard[0].length; x++) {
            if (gameBoard[y][x] !== "") {
                if(gameBoard[y][x].charAt(1) === "R"){
                    buildRound(x, y, blockColors(gameBoard[y][x])) // Draw pre drop blocks on canvas
                } else{
                    buildBlock(x, y, blockColors(gameBoard[y][x])) // Draw all blocks on canvas
                }
            } else {
                buildBlock(x, y, "#1b1b1b") // Draw block
            }
        }
    }

    document.querySelector('.score p').innerHTML = score;
    document.querySelector('.lines p').innerHTML = lines;
}
function loadNextBlockMenu() {
    console.log("test");
    ctx2.clearRect(0, 0, 400, 800); // Clear canvas
    ctx2.font = "30px Arial";
    ctx2.fillStyle = "white";
    ctx2.fillText("Next", 40, 35);

    for (let i = 0; i < 3; i++) {
        let currentBlock = nextBlocks[i];
        let coords = blockType(currentBlock);

        for (let j = 0; j < coords.length; j++) {
            ctx2.fillStyle = blockColors(currentBlock.charAt(0)); // Colorize block
            ctx2.fillRect(coords[j][0] * 20 - 40, (coords[j][1] * 20) + 50 + (i * 100), 20, 20); // Draw block with y-offset
            ctx2.strokeStyle = "rgb(0,0,0)";
            ctx2.strokeRect(coords[j][0] * 20 - 40, (coords[j][1] * 20) + 50 + (i * 100), 20, 20); // Draw outline with y-offset
            ctx2.stroke();
        }
    }
}


//Select Keys for Movement
document.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
        //W
        case 87:
        case 38: rotateBlock(); preDrop(); break;
        //S
        case 83:
        case 40: fallGuys(); break;
        //A
        case 65:
        case 37: moveBlock(-1); preDrop(); break;
        //D
        case 68:
        case 39: moveBlock(1); preDrop(); break;
        //Space
        case 32: dropBlock(); break;
    }
});

/**
 * draws the square with a given color on a set spot
 */
function buildBlock(x, y, color, c) {
    x *= 40;
    y *= 40;

    ctx.fillStyle = color; // Colorize block
    ctx.fillRect(x, y, 40, 40); // Draw block
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.strokeRect(x, y, 40, 40);
    ctx.stroke();
}

/**
 * draws the frame of a square with a given color on a set spot
 */
function buildRound(x, y, color){
    x *= 40;
    y *= 40;

    ctx.fillStyle = "hsl(0, 0%, 12%)";
    ctx.fillRect(x, y, 40, 40);
    ctx.strokeStyle = color;
    ctx.strokeRect(x, y, 40, 40);
    ctx.stroke();
}

function randomBlockType() {
    let index = Math.floor(Math.random() * blockTypes.length);
    return blockTypes[index]
}

function nextBlock(isNext) {
    if (gameBoard[0][5] === "") {
        let index = Math.floor(Math.random() * blockTypes.length);
        let type = isNext ? (nextBlocks[0]) : (blockTypes[index])
        let coords = blockType(type);

        if (isNext){
            nextBlocks[0] = nextBlocks[1]; nextBlocks[1] = nextBlocks[2]
            nextBlocks[2] = randomBlockType();
        }

        currentBlock = [coords, type]
        rotateIndex = 1;

        for (let i = 0; i < coords.length; i++) {
            gameBoard[coords[i][1]][coords[i][0]] = type;
        }

        loadNextBlockMenu()
    } else {
        interval = null;
    }
}

/**
 * get coordinates of a certain blockType
 */
function blockType(blockType) {
    let thisBlock;
    switch (blockType.charAt(0)) {
        case "O":
            thisBlock = [[5, 0, ""], [5, 1, ""], [6, 0, ""], [6, 1, ""]]
            break;
        case "I":
            thisBlock = [[5, 0, ""], [5, 1, "M"], [5, 2], [5, 3, ""]]
            break;
        case "S":
            thisBlock = [[5, 0, "M"], [6, 0, ""], [5, 1, ""], [4, 1, ""]]
            break;
        case "Z":
            thisBlock = [[5, 0, "M"], [4, 0, ""], [5, 1, ""], [6, 1, ""]]
            break;
        case "L":
            thisBlock = [[5, 0, ""], [5, 1, "M"], [5, 2, ""], [6, 2, ""]]
            break;
        case "J":
            thisBlock = [[5, 0, ""], [5, 1, "M"], [5, 2, ""], [4, 2, ""]]
            break;
        case "T":
            thisBlock = [[5, 0, "M"], [5, 1, ""], [6, 0, ""], [4, 0, ""]]
            break;
    }
    return thisBlock
}

/**
 * get the block color of a certain block type
 */
function blockColors(blockType) {
    switch (blockType.charAt(0)) {
        case "O":
            return "#ffd91f"
        case "I":
            return "#2cace1"
        case "S":
            return "#eb1846"
        case "Z":
            return "#00ab51"
        case "L":
            return "#f4821f"
        case "J":
            return "#003495"
        case "T":
            return "#a7218a"
    }
}