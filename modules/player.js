
const SPEED = 5

class Player {

  #x
  #y
  #dx
  #dy
  #angle

  #keysBuffer

  constructor() {
    this.x = 0
    this.y = 0
    this.dx = Math.cos(0) * SPEED
    this.dy = Math.sin(0) * SPEED
    this.angle = 0.1

    this.keysBuffer = []

    window.addEventListener('keydown', (event) => {
      if (['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(event.code)) {
        const index = this.keysBuffer.indexOf(event.code)
        if (index == -1) {
          this.keysBuffer.push(event.code)
        }
      }
    })

    window.addEventListener('keyup', (event) => {
      if (['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(event.code)) {
        const index = this.keysBuffer.indexOf(event.code)
        if (index != -1) {
          this.keysBuffer = this.keysBuffer.filter((code) => code != event.code)
        }
      }
    })
  }

  updatePosition() {
    this.keysBuffer.forEach((key) => {
      switch (key) {
        case 'ArrowUp': {
          this.x += this.dx
          this.y += this.dy
          break
        }
        case 'ArrowDown': {
          this.x -= this.dx
          this.y -= this.dy
          break
        }
        case 'ArrowLeft': {
          this.angle -= 0.07
          if (this.angle < 0) {
            this.angle += 2 * Math.PI
          }
          this.dx = Math.cos(this.angle) * SPEED
          this.dy = Math.sin(this.angle) * SPEED
          break
        }
        case 'ArrowRight': {
          this.angle += 0.07
          if (this.angle > 2 * Math.PI) {
            this.angle -= 2 * Math.PI
          }
          this.dx = Math.cos(this.angle) * SPEED
          this.dy = Math.sin(this.angle) * SPEED
          break
        }
      }
    })
  }

  render(viewport, buffer) {
    this.updatePosition()

    buffer.fillStyle = "yellow"
    buffer.strokeStyle = "yellow"
    buffer.fillRect(this.x - 1, this.y - 1, 2, 2)

    buffer.lineWidth = 1

    buffer.beginPath()
    buffer.moveTo(this.x, this.y)
    buffer.lineTo(this.x+this.dx*SPEED, this.y+this.dy*SPEED)
    buffer.stroke()
  }

}

export default Player
