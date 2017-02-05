function Grid(size) {
    this.size = size
    this.cells = this.empty()
}

Grid.prototype = {

    // 构造一个空的矩阵[[null,..,size.length],[]]
    empty: function() {
        let cells = []
        for (let x = 0; x < this.size; x++) {
            let row = cells[x] = [];
            for (let y = 0; y < this.size; y++) {
                row.push(null)
            }
        }
        // [[{x:0,y:0},{x:0,y:1}],[]]
        return cells
    },

    // 在空格子中随机挑选出一个格子
    randomAvailableCell: function() {
        const cells = this.availableCells()
        // 存在可填充的格子
        if (cells.length) {
            return cells[Math.floor(Math.random() * cells.length)]
        }
    },

    // 获取可填充的格子坐标
    availableCells: function() {
        let cells = []
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                // 当前格子无内容
                if (!this.cells[i][j]) {
                    cells.push({
                        x: i,
                        y: j
                    })
                }
            }
        }
        return cells
    },

    // 是否存在空单元格
    cellsAvailable: function() {
        return !!this.availableCells().length
    },

    cellAvailable: function(cell) {
        return !this.cellContent(cell)
    },

    insertTile: function(tile) {
        this.cells[tile.x][tile.y] = tile
    },

    removeTile: function(tile) {
        this.cells[tile.x][tile.y] = null
    },

    /* 
     * 获取单元格内容
     * @param {object} cell {x:0,y:0} 单元格坐标
     */
    cellContent: function(cell) {
        if (this.withinBounds(cell)) {
            return this.cells[cell.x][cell.y] || null
        } else {
            return null
        }
    },

    // 空单元格，格子还未填充数字
    emptyCell: function(cell) {
        return !this.cellContent(cell)
    },

    withinBounds: function(cell) {
        return cell.x >= 0 && cell.x < this.size && cell.y >= 0 && cell.y < this.size
    }
}

module.exports = Grid
