import Rectangle from './rectangle.js'

class Canvas {

  #screen
  #buffer
  #pixelRatio
  #viewport
  #updating
  #children
  #resizeEvent

  constructor(elemenId, children) {
    this.resizeEvent = null
    this.children = children
    const buffer = document.createElement('canvas')
    this.buffer = buffer.getContext('2d', { alpha: false, desynchronized: true })
    const ref = document.getElementById(elemenId)
    this.screen = ref.getContext('2d', { alpha: false, desynchronized: false })
    this.pixelRatio = window.devicePixelRatio
    this.render = this.render.bind(this)
    this.onResize = this.onResize.bind(this)
    this.viewport = new Rectangle()
    window.addEventListener('resize', this.onResize)
    this.onResize()
  }

  onResize() {
    const wrapper = this.screen.canvas.parentElement
    this.resizeEvent = {
      width: wrapper.clientWidth * this.pixelRatio,
      height: wrapper.clientHeight * this.pixelRatio,
    }
  }

  render() {
    this.screen.imageSmoothingEnabled = false
    this.screen.drawImage(this.buffer.canvas, 0, 0)
  }

  update(currentTime) {
    if (this.updating) {
      return
    }
    this.updating = true
    if (this.resizeEvent) {
      this.screen.canvas.width = this.buffer.canvas.width = this.resizeEvent.width
      this.screen.canvas.height = this.buffer.canvas.height = this.resizeEvent.height
      this.viewport.width = this.resizeEvent.width / this.pixelRatio
      this.viewport.height = this.resizeEvent.height / this.pixelRatio
      this.resizeEvent = null
    }
    this.buffer.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0)
    this.buffer.fillStyle = "black"
    this.buffer.fillRect(0, 0, this.viewport.width, this.viewport.height)
    this.children.forEach((child) => {
      child.render(this.viewport, this.buffer, currentTime)
    })
    this.updating = false
    this.render()
  }

}

export default Canvas;
