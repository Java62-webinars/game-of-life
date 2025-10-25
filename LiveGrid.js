// Класс LiveGrid отвечает только за оформление контейнера
export class LiveGrid {
    // При создании объекта мы запоминаем контейнер и размеры поля
    constructor(container, rows, cols, cellSize) {
        this.container = container
        this.rows = rows
        this.cols = cols
        this.cellSize = cellSize
    }

    // Настраиваем контейнер как сетку (grid)
    setupContainer() {
        const el = this.container
        el.style.display = 'grid'
        el.style.gridTemplateColumns = `repeat(${this.cols}, ${this.cellSize}px)`
    }
}
