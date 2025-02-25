const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');
let currentPlayer = false;
let deck = [];
let isGameEnded = false;
let size = 3
let isAIActive = false;

startGame();
addResetListener();

function startGame () {
    size = parseInt(prompt("Введите размер поля"), 10);
    if (isNaN(size) || size < 3){
        alert("Некорректный размер поля")
        isGameEnded = true;
        return;
    }

    toggleAI()
    deck = Array(size).fill(null).map(() => Array(size).fill(EMPTY));
    renderGrid(size);
    currentPlayer = false;
    isGameEnded = false;
}

function renderGrid (dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler (row, col) {
    console.log(`Clicked on cell: ${row}, ${col}`);
    if (deck[row][col] !== EMPTY || isGameEnded) return;

    currentSymbol = currentPlayer ? ZERO : CROSS;
    renderSymbolInCell(currentSymbol, row, col);
    deck[row][col] = currentSymbol;

    if (checkWinner()){
        alert(`Победил ${currentSymbol === CROSS ? "первый" : "второй"} игрок`);
        isGameEnded = true;
        return
    }

    if (deck.flat().every(cell => cell !== EMPTY)) {
        alert("Победила дружба!");
        isGameEnded = false;
        return;
    }

    if (deck.flat().filter(cell => cell !== EMPTY).length > (size * size) / 2) {
        expandGrid();
    }

    currentPlayer = !currentPlayer;
    if (isAIActive && currentPlayer) {
        aiMove();
    }
}

function expandGrid() {
    size += 2;
    let newDeck = Array(size).fill(null).map(() => Array(size).fill(EMPTY));

    for (let i = 0; i < size - 2; i++) {
        for (let j = 0; j < size - 2; j++) {
            newDeck[i + 1][j + 1] = deck[i][j];
        }
    }

    deck = newDeck;
    renderGrid(size);

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (deck[i][j] !== EMPTY) {
                renderSymbolInCell(deck[i][j], i, j);
            }
        }
    }
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell (row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    console.log('reset!');
    startGame();
}

function checkWinner() {
    let target;
    target = checkRows();
    if (target !== -1){
        for (let i = 0; i < size; i++){
            renderSymbolInCell(deck[target][i], target, i, '#F00');
        }
        return true;
    }
    target = checkColumns();
    if (target !== -1){
        for (let i = 0; i < size; i++){
            renderSymbolInCell(deck[i][target], i, target, '#F00');
        }
        return true;
    }
    target = checkDiagonals();
    if (target === 0) {
        for (let i = 0; i < size; i++){
            renderSymbolInCell(deck[i][i], i, i, '#F00');
        }
        return true;
    }
    else if (target === 1) {
        for (let i = 0; i < size; i++){
            renderSymbolInCell(deck[size - 1 - i][i], size - 1 - i, i, '#F00');
        }
        return true;
    }
    return false;
}

function checkRows() {
    for (let i = 0; i < size; i++){
        let player = deck[i][0];
        if (player === EMPTY) continue;
        if (deck[i].every(x => x === player)) return i;
    }
    return -1;
}

function checkColumns(){
    for (let i = 0; i < size; i++){
        let player = deck[0][i];
        if (player === EMPTY) continue;
        if (deck.every(x => x[i] === player)) return i;
    }
    return -1;
}

function checkDiagonals(){
    let player = deck[0][0];
    if (player !== EMPTY) {
        let hasWinner = true;
        for (let i = 0; i < size; i++){
            if (deck[i][i] !== player){
                hasWinner = false
            }
        }
        if (hasWinner){
            return 0;
        }
    }
    player = deck[0][size - 1];
    if (player !== EMPTY) {
        let hasWinner = true;
        for (let i = 0; i < size; i++){
            if (deck[size - 1 - i][i] !== player){
                hasWinner = false
            }
        }
        if (hasWinner){
            return 1;
        }
    }
    return -1;
}

function aiMove() {
    let emptyCells = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (deck[i][j] === EMPTY) emptyCells.push([i, j]);
        }
    }
    if (emptyCells.length === 0) return;
    let [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    cellClickHandler(row, col);
}

function toggleAI() {
    isAIActive = confirm("Включить ИИ для второго игрока?");
}

/* Test Function */
/* Победа первого игрока */
function testWin () {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw () {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}
