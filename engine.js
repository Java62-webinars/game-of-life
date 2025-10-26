export function createEmptyState(rows, cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(0));//Можно реализовать двумя вложенными циклами
}

