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

    mount(initialState) {
        const frag = document.createDocumentFragment()

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.style.width = `${this.cellSize}px`;
                cell.style.height = `${this.cellSize}px`;
                cell.dataset.r = r;
                cell.dataset.c = c;
                if (initialState[r][c] === 1) cell.classList.add('alive')
                frag.appendChild(cell);
            }
        }

        // полностью обновляем содержимое контейнера
        this.container.innerHTML = '';
        this.container.appendChild(frag);
        this.cells = Array.from(this.container.children); //Кэш массива -> на будущее
    }

    // точечное обновление одной клетки
    updateCell(r, c, alive) {
        const idx = r * this.cols + c
        const el = this.cells && this.cells[idx]
        if (!el) return
        el.classList.toggle('alive', !!alive);
        console.log(el.classList.contains('alive'));
    }

    //массовое обновление по всему state без пересоздания DOM
    renderAll(state) {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const idx = r * this.cols + c;
                this.cells[idx].classList.toggle('alive', state[r][c] === 1);
            }
        }
    }
}
