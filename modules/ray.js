
const FOV = 60

function distance(ax, ay, bx, by, angle) {
  return Math.sqrt((bx-ax) * (bx-ax) + (by-ay)*(by-ay))
}

class Ray {

  #player
  #map

  constructor(player, map) {
    this.player = player
    this.map = map
  }

  render(viewport, buffer) {
    const scale = 10
    const step = 0.0174533/scale

    let ra = this.player.angle - (step*(FOV* scale)/2)
    const size = Math.ceil(viewport.width / (FOV* scale))

    if (ra < 0) {
      ra += 2 * Math.PI
    }
    if (ra > 2 * Math.PI) {
      ra -= 2 * Math.PI
    }

    for (let r = 0 ; r<(FOV* scale) ; r++) {
      let rhy, rhx, rvy, rvx

      let distanceH = Number.MAX_SAFE_INTEGER
      let distanceV = Number.MAX_SAFE_INTEGER

      let dof
      let yo, xo

      dof = 0
      const aTan = -1 / Math.tan(ra)
      if (ra > Math.PI) {
        rhy = ((this.player.y >> 6)<<6) - 0.0001
        rhx = (this.player.y - rhy) * aTan + this.player.x
        yo = -64
        xo = 64 * aTan
      }
      if (ra < Math.PI) {
        rhy = ((this.player.y >> 6)<<6) + 64
        rhx = (this.player.y - rhy) * aTan + this.player.x
        yo = 64
        xo = -64 * aTan
      }
      if (ra === 0 || ra === Math.PI) {
        rhx = this.player.x
        rhy = this.player.y
        dof = 8
      }
      while (dof < 8) {
        let mx = rhx >> 6
        let my = rhy >> 6
        let mp = Math.round(my * 8 + mx)
        if (mp >= 0 && mp<64 && this.map.data[mp] != 0) {
          distanceH = distance(this.player.x, this.player.y, rhx, rhy, ra)
          dof = 8
        } else {
          rhx += xo
          rhy += yo
          dof += 1
        }
      }

      dof = 0
      const nTan = -Math.tan(ra)
      if (ra > Math.PI/2 && ra < 3 * Math.PI/2) {
        rvx = ((this.player.x >> 6)<<6) - 0.0001
        rvy = (this.player.x - rvx) * nTan + this.player.y
        xo = -64
        yo = 64 * nTan
      }
      if (ra < Math.PI/2 || ra > 3 * Math.PI/2) {
        rvx = ((this.player.x >> 6)<<6) + 64
        rvy = (this.player.x - rvx) * nTan + this.player.y
        xo = 64
        yo = -64 * nTan
      }
      if (ra === 0 || ra === Math.PI) {
        rvx = this.player.x
        rvy = this.player.y
        dof = 8
      }
      while (dof < 8) {
        let mx = rvx >> 6
        let my = rvy >> 6
        let mp = Math.round(my * 8 + mx)
        if (mp >= 0 && mp<64 && this.map.data[mp] != 0) {
          distanceV = distance(this.player.x, this.player.y, rvx, rvy, ra)
          dof = 8
        } else {
          rvx += xo
          rvy += yo
          dof += 1
        }
      }

      let rx, ry, distanceT

      if (distanceV<distanceH) {
        rx = rvx
        ry = rvy
        distanceT = distanceV
        buffer.fillStyle = "red"
        buffer.strokeStyle = "red"
      } else {
        rx = rhx
        ry = rhy
        distanceT = distanceH
        buffer.fillStyle = "darkred"
        buffer.strokeStyle = "darkred"
      }

      let ca = this.player.angle - ra
      if (ca < 0) {
        ca += 2 * Math.PI
      }
      if (ca > 2 * Math.PI) {
        ca -= 2 * Math.PI
      }

      distanceT *= Math.cos(ca)

      let lineH = (20*viewport.height)/distanceT
      if (lineH > viewport.height) {
        lineH = viewport.height
      }
      let lineO = viewport.height/2 - lineH/2

      buffer.fillRect(r*size,lineO,size,lineH)
      /*
      buffer.lineWidth = 1
      buffer.beginPath()
      buffer.moveTo(this.player.x, this.player.y)
      buffer.lineTo(rx, ry)
      buffer.stroke()*/

      ra += step
      if (ra < 0) {
        ra += 2 * Math.PI
      }
      if (ra > 2 * Math.PI) {
        ra -= 2 * Math.PI
      }
    }

  }


}

export default Ray
