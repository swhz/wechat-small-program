function Tile(position, value) {
    this.x = position.x
    this.y = position.y
    this.value = value || 2
    this.content = this.value
    this.previousPosition = null
    this.mergedFrom = null
}

Tile.prototype = {
    // 记录格子上次的位置
    savePosition: function() {
        this.previousPosition = { 
        	x: this.x, 
        	y: this.y 
        }
    },
    // 更新当前格子的位置
    updatePosition: function(position) {
        this.x = position.x
        this.y = position.y
    }
}

module.exports = Tile
