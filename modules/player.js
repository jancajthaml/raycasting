
class Player {

  #x
  #y
  #dx
  #dy

  #keysBuffer

  constructor() {
    this.x = 0
    this.y = 0
    this.dx = 0
    this.dy = -1

    this.keysBuffer = []
  }

  render(viewport, buffer, currentTime) {
    buffer.fillStyle = "yellow"
    buffer.strokeStyle = "yellow"
    buffer.fillRect(this.x - 1, this.y - 1, 2, 2)

    buffer.lineWidth = 1

    buffer.beginPath()
    buffer.moveTo(this.x, this.y)
    buffer.lineTo(this.x+this.dx*10, this.y+this.dy*10)
    buffer.stroke()
  }

}

export default Player
