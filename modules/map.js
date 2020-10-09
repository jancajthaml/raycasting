
class WorldMap {

  #data

  constructor() {
    this.data = [
      1,1,1,1,1,1,1,1,
      1,0,0,0,0,1,0,1,
      1,0,1,1,1,0,0,1,
      1,0,1,0,1,0,0,1,
      1,0,0,0,0,0,0,1,
      1,0,0,0,0,0,0,1,
      1,0,0,0,0,0,0,1,
      1,1,1,1,1,1,1,1,
    ]
  }

  render(viewport, buffer) {
    buffer.lineWidth = 1
    buffer.strokeStyle = "red"

    for (let y = 0 ; y < 8 ; y++) {
      for (let x = 0 ; x < 8 ; x++) {
        if (this.data[y*8+x] === 0) {
          buffer.fillStyle = "black"
        } else {
          buffer.fillStyle = "white"
        }
        buffer.fillRect((x*64), (y*64), 64, 64)
      }
    }
  }

}


export default WorldMap
