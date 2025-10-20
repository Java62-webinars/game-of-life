<!--    TODO field 30x20-->

// ====== Константы ======
const ROWS = 20;      // количество строк
const COLS = 30;      // количество столбцов
const CELL_SIZE = 20; // размер клетки в пикселях

// ====== Элементы на странице ======
const grid = document.getElementById('grid');

// Настраиваем сетку: 30 колонок по 20px
grid.style.display = 'grid';
grid.style.gridTemplateColumns = `repeat(${COLS}, ${CELL_SIZE}px)`;
// grid.style.gridTemplateRows = `repeat(${ROWS}, ${CELL_SIZE}px)`;

// ====== Состояние (2D-массив 0/1) ======
let state = createEmptyState(ROWS, COLS); // всё мёртвое по умолчанию
console.log(state);
function createEmptyState(rows, cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(0));//Можно реализовать двумя вложенными циклами
}


// ====== Создаём клетки и связываем их с координатами ======
function drawGridFromState() {
    const frag = document.createDocumentFragment();
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.width = `${CELL_SIZE}px`;
            cell.style.height = `${CELL_SIZE}px`;
            // сохранить координаты в атрибуты
            cell.dataset.r = r;
            cell.dataset.c = c;
            // визуал по состоянию
            if (state[r][c] === 1) cell.classList.add('alive');
            frag.appendChild(cell);
        }
    }
    grid.innerHTML = '';
    grid.appendChild(frag);
}

drawGridFromState();

<!--    TODO addEventListener по клику на клетке делал ее живой и добавлял в массив живых клеток-->

// ====== Тоггл клетки по клику ======
grid.addEventListener('click', (e) => {
    const el = e.target;
    if (!el.classList.contains('cell')) return;

    const r = Number(el.dataset.r);
    const c = Number(el.dataset.c);

    // переключаем: 0 -> 1, 1 -> 0
    state[r][c] = state[r][c] ? 0 : 1;

    // синхронизируем DOM
    el.classList.toggle('alive', state[r][c] === 1);
});
// TODO добавить кнопку - > Step
//TODO повесить обработчик
//запускает один цикл
//считает количество живых соседей и реализует один цикл жизни изменяя state

function randomizeState (state, prob=0.3) {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            state[r][c] = Math.random() < prob ? 1 :0;
        }
    }
}

// randomizeState(state, 0.5);
// drawGridFromState();
const btnRnd = document.getElementById("rand");
const rndInput = document.getElementById('random-input');
btnRnd.addEventListener('click', (e) => {
    const p = rndInput.value;
    randomizeState(state, p);
    drawGridFromState();
})