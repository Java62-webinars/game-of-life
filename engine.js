export function createEmptyState(rows, cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(0));//Можно реализовать двумя вложенными циклами
}

export function randomizeState (state, prob=0.3) {
    for (let r = 0; r < state.length; r++) {
        for (let c = 0; c < state[0].length; c++) {
            state[r][c] = Math.random() < prob ? 1 :0;
        }
    }
}

//функция для подсчета живых соседей
export function liveNeighbors(x, y, state) {
    //определяем начальные и конечные координаты
    const xInit = x===0 ? 0 : x-1;
    const yInit = y===0 ? 0 : y-1;
    const xFinal = x+1 === state.length ? x : x+1;
    const yFinal = y+1 === state[0].length ? y : y+1;
    //задаем количество соседей
    let n = 0;
    for (let r = xInit; r <= xFinal; r++) {
        for (let c = yInit; c <= yFinal; c++){
            n+=state[r][c];
        }
    }
    return n - state[x][y];
}

export function nextGen(state){
    const next = [];
    for (let r = 0; r < state.length; r++) {
        next[r] =[]
        for (let c = 0; c < state[0].length; c++) {
            const n = liveNeighbors( r, c, state);
            const cell = state[r][c];
            next[r][c] = + (n === 3 || (cell && n === 2));//!!!
        }
    }
    return next;
}
