"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const WIDTH = 10;
    const PREVIEW_WIDTH = 4;

    const COLORS = ["orange", "red", "purple", "green", "blue", "lightblue", "magenta"];

    // . 1 1    . . .     . 1 .    1 . .
    // . 1 .    1 1 1     . 1 .    1 1 1
    // . 1 .    . . 1     1 1 .    . . .
    const lBlock = [
        [1, 2, WIDTH + 1, WIDTH * 2 + 1],
        [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 2],
        [1, WIDTH + 1, WIDTH * 2, WIDTH * 2 + 1],
        [0, WIDTH, WIDTH + 1, WIDTH + 2],
    ];

    // 1 1 .    . . 1     . 1 .    . . .
    // . 1 .    1 1 1     . 1 .    1 1 1
    // . 1 .    . . .     . 1 1    1 . .
    const jBlock = [
        [0, 1, WIDTH + 1, WIDTH * 2 + 1],
        [2, WIDTH, WIDTH + 1, WIDTH + 2],
        [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2 + 2],
        [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2],
    ];

    // 1 . .   . . .   1 . .   . . .
    // 1 1 .   . 1 1   1 1 .   . 1 1
    // . 1 .   1 1 .   . 1 .   1 1 .
    //
    const sBlock = [
        [0, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
        [WIDTH + 1, WIDTH + 2, WIDTH * 2, WIDTH * 2 + 1],
        [0, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
        [WIDTH + 1, WIDTH + 2, WIDTH * 2, WIDTH * 2 + 1],
    ];

    // . . 1   . . .   . . 1   . . .
    // . 1 1   1 1 .   . 1 1   1 1 .
    // . 1 .   . 1 1   . 1 .   . 1 1
    //
    const zBlock = [
        [2, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1],
        [WIDTH, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2 + 2],
        [2, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1],
        [WIDTH, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2 + 2],
    ];

    // . 1 .   . 1 .   . . .   . 1 .
    // 1 1 1   . 1 1   1 1 1   1 1 .
    // . . .   . 1 .   . 1 .   . 1 .
    //
    const tBlock = [
        [1, WIDTH, WIDTH + 1, WIDTH + 2],
        [1, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1],
        [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1],
        [1, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
    ];

    // 1 1 .   1 1 .   1 1 .   1 1 .
    // 1 1 .   1 1 .   1 1 .   1 1 .
    // . . .   . . .   . . .   . . .
    //
    const oBlock = [
        [0, 1, WIDTH, WIDTH + 1],
        [0, 1, WIDTH, WIDTH + 1],
        [0, 1, WIDTH, WIDTH + 1],
        [0, 1, WIDTH, WIDTH + 1],
    ];

    // . 1 . .   . . . .   . 1 . .   . . . .
    // . 1 . .   1 1 1 1   . 1 . .   1 1 1 1
    // . 1 . .   . . . .   . 1 . .   . . . .
    // . 1 . .   . . . .   . 1 . .   . . . .
    //
    const iBlock = [
        [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
        [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3],
        [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
        [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3],
    ];

    const blocks = [lBlock, jBlock, sBlock, zBlock, tBlock, oBlock, iBlock];

    const lPreviewBlock = [1, 2, PREVIEW_WIDTH + 1, PREVIEW_WIDTH * 2 + 1];
    const jPreviewBlock = [0, 1, PREVIEW_WIDTH + 1, PREVIEW_WIDTH * 2 + 1];
    const sPreviewBlock = [0, PREVIEW_WIDTH, PREVIEW_WIDTH + 1, PREVIEW_WIDTH * 2 + 1];
    const zPreviewBlock = [2, PREVIEW_WIDTH + 1, PREVIEW_WIDTH + 2, PREVIEW_WIDTH * 2 + 1];
    const tPreviewBlock = [1, PREVIEW_WIDTH, PREVIEW_WIDTH + 1, PREVIEW_WIDTH + 2];
    const oPreviewBlock = [0, 1, PREVIEW_WIDTH, PREVIEW_WIDTH + 1];
    const iPreviewBlock = [1, PREVIEW_WIDTH + 1, PREVIEW_WIDTH * 2 + 1, PREVIEW_WIDTH * 3 + 1];

    const previewBlocks = [lPreviewBlock, jPreviewBlock, sPreviewBlock, zPreviewBlock, tPreviewBlock, oPreviewBlock, iPreviewBlock];

    // ==== game logic ====

    const GAME_GRID_COLUMNS = 10;
    const GAME_GRID_ROWS = 20;
    const GAME_GRID_CELLS = GAME_GRID_COLUMNS * GAME_GRID_ROWS;
    const PREVIEW_GRID_CELLS = 16;

    const START_POSITION = 4;
    const START_ROTATION = 0;
    const START_INTERVAL_MILLIS = 1000;
    const END_INTERVAL_MILLIS = 100;
    const DROP_INTERVAL_MILLIS = 20;

    const scoreDisplay = document.getElementById("score");
    const startStop = document.getElementById("start-stop");

    let gameGrid;
    let cells;
    let previewCells;

    const createGameGrid = () => {
        gameGrid = document.getElementById("game-grid");
        for (let i = 0; i < GAME_GRID_CELLS; i++) {
            const div = document.createElement("div");
            gameGrid.appendChild(div);
        }

        for (let i = 0; i < GAME_GRID_COLUMNS; i++) {
            const div = document.createElement("div");
            div.className = "taken base";
            gameGrid.appendChild(div);
        }
        cells = Array.from(document.querySelectorAll("#game-grid div"));
    };

    const createPreviewGrid = () => {
        const previewGrid = document.getElementById("preview-grid");

        for (let i = 0; i < PREVIEW_GRID_CELLS; i++) {
            const div = document.createElement("div");
            previewGrid.appendChild(div);
        }

        previewCells = document.querySelectorAll("#preview-grid div");
    };

    createGameGrid();
    createPreviewGrid();

    let currentPosition = START_POSITION;
    let currentRotation = START_ROTATION;

    let random;
    let previewRandom;
    let block;
    let previewBlock;

    let score = 0;

    const draw = () => {
        updateBlock((cell) => {
            cell.classList.add("cell");
            cell.style.backgroundColor = COLORS[random];
        });
    };

    const undraw = () => {
        updateBlock((cell) => {
            cell.removeAttribute("class");
            cell.removeAttribute("style");
        });
    };

    const updateBlock = (updater) => {
        block.forEach((index) => {
            const cell = cells[currentPosition + index];
            updater(cell);
        });
    };

    const drawPreview = () => {
        previewCells.forEach((cell) => {
            cell.removeAttribute("class");
            cell.removeAttribute("style");
        });

        previewBlock.forEach((index) => {
            previewCells[index].classList.add("cell");
            previewCells[index].style.backgroundColor = COLORS[previewRandom];
        });
    };

    const resetGame = () => {
        for (let i = 0; i < GAME_GRID_CELLS; i++) {
            const cell = cells[i];
            cell.removeAttribute("class");
            cell.removeAttribute("style");
        }
        score = 0;
        scoreDisplay.innerHTML = score;
        lastTime = 0;
        intervalMillis = START_INTERVAL_MILLIS;
        previousIntervalMillis = START_INTERVAL_MILLIS;
    };

    const addScore = () => {
        for (let i = 0; i < GAME_GRID_CELLS; i += GAME_GRID_COLUMNS) {
            const row = Array.from({ length: GAME_GRID_COLUMNS }, (_, index) => i + index);

            if (row.every((index) => cells[index].classList.contains("taken"))) {
                score += 10;
                scoreDisplay.innerHTML = `${score}`;
                row.forEach((index) => {
                    cells[index].removeAttribute("style");
                    cells[index].removeAttribute("class");
                });
                const cellsRemoved = cells.splice(i, WIDTH);
                cells = cellsRemoved.concat(cells);
                cells.forEach((cell) => gameGrid.appendChild(cell));
            }
        }
    };

    function newBlock() {
        currentPosition = START_POSITION;
        currentRotation = START_ROTATION;

        random = previewRandom || Math.floor(Math.random() * blocks.length);
        previewRandom = Math.floor(Math.random() * blocks.length);

        block = blocks[random][currentRotation];
        if (isGameOver()) {
            cancelAnimationFrame(timerId);
            timerId = null;
        } else {
            draw();
            previewBlock = previewBlocks[previewRandom];
            drawPreview();
        }
    }

    const lockBlock = () => {
        if (block.some((index) => cells[currentPosition + index + WIDTH].classList.contains("taken"))) {
            block.forEach((index) => cells[currentPosition + index].classList.add("taken"));
            addScore();
            newBlock();
            if (intervalMillis === DROP_INTERVAL_MILLIS) {
                intervalMillis = previousIntervalMillis;
            }
            if (intervalMillis > END_INTERVAL_MILLIS) {
                intervalMillis -= 25;
            }
            console.log(intervalMillis);
        }
    };

    const moveLeft = () => {
        undraw();
        if (!isOnLeftEdge()) currentPosition--;
        if (isBlockCollision()) currentPosition++;
        draw();
        lockBlock();
    };

    const moveRight = () => {
        undraw();
        if (!isOnRightEdge()) currentPosition++;
        if (isBlockCollision()) currentPosition--;
        draw();
        lockBlock();
    };

    const moveDown = () => {
        undraw();
        currentPosition += WIDTH;
        draw();
        lockBlock();
    };

    const rotate = () => {
        undraw();
        currentRotation = (currentRotation + 1) % 4;
        block = blocks[random][currentRotation];
        checkRotationPosition();
        draw();
    };

    const checkRotationPosition = (position = currentPosition) => {
        while (true) {
            if ((position + 1) % WIDTH < 4) {
                if (isOnRightEdge()) {
                    currentPosition++;
                    position = currentPosition;
                    continue;
                }
            } else if (position % WIDTH > 5) {
                if (isOnLeftEdge()) {
                    currentPosition--;
                    position = currentPosition;
                    continue;
                }
            }
            break;
        }
    };

    const isOnRightEdge = () => {
        return block.some((index) => (currentPosition + index) % WIDTH === WIDTH - 1);
    };

    const isOnLeftEdge = () => {
        return block.some((index) => (currentPosition + index) % WIDTH === 0);
    };

    function isBlockCollision() {
        return block.some((index) => cells[currentPosition + index].classList.contains("taken"));
    }

    const isGameOver = () => {
        if (currentPosition < WIDTH && isBlockCollision()) {
            scoreDisplay.innerHTML = "game over";
            startStop.removeAttribute("style");
            return true;
        }
        return false;
    };

    const controller = (event) => {
        if (timerId) {
            switch (event.key) {
                case "ArrowUp":
                    rotate();
                    break;
                case "ArrowDown":
                    break;
                case "ArrowLeft":
                    moveLeft();
                    break;
                case "ArrowRight":
                    moveRight();
                    break;
                case " ":
                    if (intervalMillis !== DROP_INTERVAL_MILLIS) {
                        previousIntervalMillis = intervalMillis;
                    }
                    intervalMillis = DROP_INTERVAL_MILLIS;
                    break;
                default:
                    return;
            }
        }
    };

    document.addEventListener("keyup", controller);

    let timerId = null;
    let lastTime = 0;
    let intervalMillis = START_INTERVAL_MILLIS;
    let previousIntervalMillis = START_INTERVAL_MILLIS;

    const gameLoop = (currentTime) => {
        if (lastTime > 0) {
            if (currentTime - lastTime > intervalMillis) {
                moveDown();
                lastTime = currentTime;
            }
        } else {
            lastTime = currentTime;
        }

        if (timerId) {
            timerId = requestAnimationFrame(gameLoop);
        }
    };

    const onClickStartStop = () => {
        if (!timerId) {
            resetGame();
            newBlock();
            intervalMillis = START_INTERVAL_MILLIS;
            timerId = requestAnimationFrame(gameLoop);
            startStop.style.visibility = "hidden";
        }
    };

    startStop.addEventListener("click", onClickStartStop);

    // - - - - websocket

    const socket = new WebSocket("ws://localhost:8765");

    socket.addEventListener("open", (event) => {
        console.log("WebSocket is connected.");
    });

    socket.addEventListener("message", (event) => {
        console.log("Message from server:", event.data);
        switch (event.data) {
            case "Start":
                onClickStartStop();
                break;
            case "Left":
                controller({ key: "ArrowLeft" });
                break;
            case "Right":
                controller({ key: "ArrowRight" });
                break;
            case "Rotate":
                controller({ key: "ArrowUp" });
                break;
            case "Drop":
                controller({ key: " " });
                break;
        }
    });
});
