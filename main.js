import { LiveGrid } from './LiveGrid.js'
import {createEmptyState}  from './engine.js'
// ====== Константы ======
const ROWS = 20;      // количество строк
const COLS = 30;      // количество столбцов
const CELL_SIZE = 20; // размер клетки в пикселях

// ====== Создаем или находим элементы на странице ======
const grid = document.getElementById('grid');
const liveGrid = new LiveGrid(grid, ROWS, COLS, CELL_SIZE)
liveGrid.setupContainer();
const btnRnd = document.getElementById('rand');
const rndInput = document.getElementById('random-input');
rndInput.min = 0;
rndInput.max = 1;
rndInput.step = 0.1;
rndInput.value = 0.2;
const output = document.getElementById('output');
rndInput.addEventListener('input', () => {
    output.textContent = rndInput.value;
});
// кнопка запуска
const btnStart = document.getElementById('start');
// кнопка остановки
const btnStop = document.getElementById('stop');



// ====== Состояние (2D-массив 0/1) ======
let state = createEmptyState(ROWS, COLS); // всё мёртвое по умолчанию
liveGrid.mount(state);

//Навешиваем листенеры
grid.addEventListener('click', onGridCellToggle());
btnRnd.addEventListener('click', handleRandomizing());
// Управление игрой запуск каждые 500 мс (два раза в секунду)
btnStart.addEventListener('click', () => game.start());
// Остановка
btnStop.addEventListener('click', () => game.stop());
//TODO Migrate to engine
function randomizeState (state, prob=0.3) {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            state[r][c] = Math.random() < prob ? 1 :0;
        }
    }
}
//функция для подсчета живых соседей TODO Migrate to engine
 function liveNeighbors(x, y, state) {
     //определяем начальные и конечные координаты
     const xInit = x===0 ? 0 : x-1;
     const yInit = y===0 ? 0 : y-1;
     const xFinal = x+1 === ROWS ? x : x+1;
     const yFinal = y+1 === COLS ? y : y+1;
     //задаем количество соседей
     let n = 0;
     for (let r = xInit; r <= xFinal; r++) {
         for (let c = yInit; c <= yFinal; c++){
             n+=state[r][c];
         }
     }
     return n - state[x][y];
 }
 //TODO Migrate to engine
function nextGen(){
    const next = [];
    for (let r = 0; r < ROWS; r++) {
        next[r] =[]
    for (let c = 0; c < COLS; c++) {
        const n = liveNeighbors( r, c, state);
        const cell = state[r][c];
        next[r][c] = + (n === 3 || (cell && n === 2));//!!!
    }
}
return next;
}
//запускает один цикл
//считает количество живых соседей и реализует один цикл жизни изменяя state
const nextTurn = document.getElementById('turn');
nextTurn.addEventListener('click', (e) => {
    const next= state;
    state    = nextGen();
    liveGrid.renderAll(state);
});

const game = {
    timerId: null,
    start() {
        if (this.timerId) return;
        this.timerId = setInterval(() => {
            state = nextGen(state);
            liveGrid.renderAll(state);
        }, 500);
    },
    stop() {
        clearInterval(this.timerId);
        this.timerId = null;
    },
};
// Листенеры
function onGridCellToggle() {
    return (e) => {
        const el = e.target;
        if (!el.classList.contains('cell')) return;
        const r = Number(el.dataset.r);
        const c = Number(el.dataset.c);
        // переключаем: 0 -> 1, 1 -> 0
        state[r][c] = state[r][c] ? 0 : 1;
        // синхронизируем DOM
        liveGrid.updateCell(r, c, state[r][c]);

    };
}

function handleRandomizing() {
    return (e) => {
        const p = rndInput.value;
        const rand = state;
        state = randomizeState(state, p);
        liveGrid.renderAll(rand);
        state = rand;
    };
}
