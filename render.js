// Create GameBoard
let gameBoard = Array.from(Array(20), () => new Array(10)); // [y][x]
let lines = 0;

for (let i = 0; i < gameBoard.length; i++) {
    for (let j = 0; j < gameBoard[0].length; j++) {
        gameBoard[i][j] = ""; // Set all blocks to ""
    }
}

// BlockTypes
let blockTypes = ["OM", "IM", "SM", "ZM", "LM", "JM", "TM"] // All block types

// Creating canvas
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

// Interval load GameBoard
loadGameBoard(true);
let intervalG = setInterval(loadGameBoard, 1);
function loadGameBoard(ask) {
    ctx.clearRect(0, 0, 400, 800) // Clear canvas
    for (let y = 0; y < gameBoard.length; y++) {
        for (let x = 0; x < gameBoard[0].length; x++) {
            if (gameBoard[y][x] != "") {
                if(gameBoard[y][x].charAt(1) == "R"){
                    buildRound(x, y, blockColors(gameBoard[y][x]))
                } else{
                    buildBlock(x, y, blockColors(gameBoard[y][x])) // Draw all blocks on canvas
                }
            } else {
                buildBlock(x, y, "black")
            }
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

function buildBlock(x, y, color, c) {
    x *= 40;
    y *= 40;

    ctx.fillStyle = color; // Colorize block
    ctx.fillRect(x, y, 40, 40); // Draw block
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.strokeRect(x, y, 40, 40);
    ctx.stroke();
}
function buildRound(x, y, color){
    x *= 40;
    y *= 40;

    ctx.fillStyle = "black";
    ctx.fillRect(x, y, 40, 40);
    ctx.strokeStyle = color;
    ctx.strokeRect(x, y, 40, 40);
    ctx.stroke();
}

// Random Block + Cordinates
function randomBlock() {
    if (gameBoard[0][5] == "") {
        let index = Math.floor(Math.random() * blockTypes.length);
        let type = blockType(blockTypes[index]);

        for (let i = 0; i < type.length; i++) {
            gameBoard[type[i][1]][type[i][0]] = blockTypes[index];
        }

        let returning = [type, blockTypes[index]]
        rotateIndex = 1;
        return returning;
    } else {
        interval = null;
    }
}
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
function blockColors(blockType) {
    switch (blockType.charAt(0)) {
        case "O":
            return "yellow"
        case "I":
            return "turquoise"
        case "S":
            return "red"
        case "Z":
            return "green"
        case "L":
            return "orange"
        case "J":
            return "pink"
        case "T":
            return "purple"
    }
}