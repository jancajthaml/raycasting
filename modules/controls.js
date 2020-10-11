
const MOVE_SPEED = 10 * 16
const ROTATE_SPEED = 2

class Controls {

  #player
  #map
  #keysBuffer
  #lastTime

  constructor(player, map) {
    this.player = player
    this.map = map
    this.keysBuffer = []
    this.lastTime = performance.now()

    window.addEventListener('keydown', (event) => {
      const key = event.code.toLowerCase()
      const index = this.keysBuffer.indexOf(key)
      if (index == -1) {
        this.keysBuffer.push(key)
      }
    })

    window.addEventListener('keyup', (event) => {
      const key = event.code.toLowerCase()
      const index = this.keysBuffer.indexOf(key)
      if (index != -1) {
        this.keysBuffer = this.keysBuffer.filter((code) => code != key)
      }
    })
  }

  updatePosition(currentTime) {
    const frameTime = (currentTime - this.lastTime) / 1000.0
    this.lastTime = currentTime
    const moveSpeed = frameTime * MOVE_SPEED
    const rotateSpeed = frameTime * ROTATE_SPEED

    this.keysBuffer.forEach((key) => {
      switch (key) {
        case 'arrowup':
        case 'keyw': {
          const nextX = this.player.x + (this.player.dx * moveSpeed)
          const nextY = this.player.x + (this.player.dx * moveSpeed)
          this.player.x = nextX
          this.player.y = nextY
          break
        }
        case 'arrowdown':
        case 'keys': {
          const nextX = this.player.x - (this.player.dx * moveSpeed)
          const nextY = this.player.x - (this.player.dx * moveSpeed)
          this.player.x = nextX
          this.player.y = nextY
          break
        }
        case 'arrowleft':
        case 'keya': {
          const oldDirX = this.player.dx
          this.player.dx = this.player.dx * Math.cos(-rotateSpeed) - this.player.dy * Math.sin(-rotateSpeed)
          this.player.dy = oldDirX * Math.sin(-rotateSpeed) + this.player.dy * Math.cos(-rotateSpeed)
          const oldPlaneX = this.map.dx
          this.map.dx = this.map.dx * Math.cos(-rotateSpeed) - this.map.dy * Math.sin(-rotateSpeed)
          this.map.dy = oldPlaneX * Math.sin(-rotateSpeed) + this.map.dy * Math.cos(-rotateSpeed)
          break
        }
        case 'arrowright':
        case 'keyd': {
          const oldDirX = this.player.dx
          this.player.dx = this.player.dx * Math.cos(rotateSpeed) - this.player.dy * Math.sin(rotateSpeed)
          this.player.dy = oldDirX * Math.sin(rotateSpeed) + this.player.dy * Math.cos(rotateSpeed)
          const oldPlaneX = this.map.dx
          this.map.dx = this.map.dx * Math.cos(rotateSpeed) - this.map.dy * Math.sin(rotateSpeed)
          this.map.dy = oldPlaneX * Math.sin(rotateSpeed) + this.map.dy * Math.cos(rotateSpeed)
          break
        }
      }
    })
  }

  render(viewport, buffer, currentTime) {
    this.updatePosition(currentTime)
  }

}

export default Controls
