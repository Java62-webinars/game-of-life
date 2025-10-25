import { LiveGrid } from './LiveGrid.js'
// ====== Константы ======
const ROWS = 20;      // количество строк
const COLS = 30;      // количество столбцов
const CELL_SIZE = 20; // размер клетки в пикселях

// ====== Элементы на странице ======
const grid = document.getElementById('grid');
const liveGrid = new LiveGrid(grid, ROWS, COLS, CELL_SIZE)
liveGrid.setupContainer()

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

liveGrid.mount(state);
// ====== Тоггл клетки по клику ======
grid.addEventListener('click', (e) => {
    const el = e.target;
    if (!el.classList.contains('cell')) return;
    const r = Number(el.dataset.r);
    const c = Number(el.dataset.c);
    // переключаем: 0 -> 1, 1 -> 0
    state[r][c] = state[r][c] ? 0 : 1;
    // синхронизируем DOM
    liveGrid.updateCell(r, c, state[r][c]);

});

function randomizeState (state, prob=0.3) {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            state[r][c] = Math.random() < prob ? 1 :0;
        }
    }
}


const btnRnd = document.getElementById('rand');
const rndInput = document.getElementById('random-input');
btnRnd.addEventListener('click', (e) => {
    const p = rndInput.value;
    randomizeState(state, p);
    drawGridFromState();
});

//функция для подсчета живых соседей
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
 //инициируем "допросную клетку"
let oldVictim = null;

 //вешаем листенер на правую кнопку мыши
grid.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    const el = e.target;
    if (!el.classList.contains('cell')) return;
    const r = Number(el.dataset.r);
    const c = Number(el.dataset.c);
    if (oldVictim){
        oldVictim.classList.remove('victim');
    }
    el.classList.add('victim');
    oldVictim = el;
    console.log(liveNeighbors(r, c, state))
});

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


// TODO добавить кнопку - > Step
//TODO повесить обработчик
//запускает один цикл
//считает количество живых соседей и реализует один цикл жизни изменяя state
const nextTurn = document.getElementById('turn');
nextTurn.addEventListener('click', (e) => {
    state = nextGen();
    drawGridFromState();
});
//Проблемы кода
//1. Плохо читается
//2. Не оптимизирован
//3. Не реализован MVC паттерн
//4. LiveGrid ->
//4.1. Инициализировал сетку
//4.2. Изменял одиночные клетки (менял класс по клику)
//4.3. Обновлял (рендерил) сетку при обновлении state
//Итог - LiveGrid отвечает за view, main отвечает и за model и за controller
//Реализовать жизнь через setInterval -> все умерли -> следующее поколение === предыдущему.