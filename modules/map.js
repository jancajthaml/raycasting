
class WorldMap {

  #data
  #width
  #height
  #dx
  #dy

  constructor() {
    this.dx = 0
    this.dy = -1
    this.data = [
      [ 5, 5, 5, 5, 5, 5, 5, 4, 0, 0, 0, 4, 5, 6, 5, 6, 5, 6, 5, 6],
      [ 6, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0, 0, 0, 4],
      [ 5, 0, 0, 0, 0, 0, 0, 0, 5, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [ 6, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 7, 8, 0, 6],
      [ 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 7, 0, 5],
      [ 6, 0, 0,10, 0,10, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0, 7, 8, 0, 6],
      [ 5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 8, 7, 0, 5],
      [ 6, 0, 0,10, 0,10, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0, 7, 8, 0, 6],
      [ 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [ 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
      [ 5, 0, 0,11,11,11,11,11,11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      [ 6, 0, 0,11, 0, 0, 0, 0,11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
      [ 5, 0, 0,11,11,11,11,11,11, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 5],
      [ 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
      [ 5, 7, 8, 9, 8, 7, 7, 8, 9, 8, 7, 8, 3, 3, 3, 3, 3, 3, 8, 7]
    ]
    this.height = this.data.length
    this.width = this.data[0].length
    this.data = [].concat.apply([], this.data)
  }

  render(viewport, buffer) {
    buffer.lineWidth = 1
    buffer.strokeStyle = "red"
    buffer.globalAlpha = 0.5
    for (let y = 0 ; y < this.height ; y++) {
      for (let x = 0 ; x < this.width ; x++) {
        if (this.data[y * this.width + x] === 0) {
          buffer.fillStyle = "black"
        } else {
          buffer.fillStyle = "white"
        }
        buffer.fillRect(x*30, y*30, 30, 30)
      }
    }
    buffer.globalAlpha = 1
  }

}


export default WorldMap



