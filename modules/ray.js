
const FOV = 70

function distance(ax, ay, bx, by) {
  return Math.sqrt((bx-ax) * (bx-ax) + (by-ay)*(by-ay))
}

class Ray {

  #player
  #map

  constructor(player, map) {
    this.player = player
    this.map = map
  }

  renderWalls(viewport, buffer) {
    const scale = 2
    const step = 0.0174533/scale

    let angle = Math.atan2(this.player.dy, this.player.dx)
    if (angle > 2 * Math.PI) {
      angle -= 2 * Math.PI
    }
    if (angle < 0) {
      angle += 2 * Math.PI
    }

    let ra = angle - (step*(FOV* scale)/2)
    const size = Math.ceil(viewport.width / (FOV* scale))

    if (ra < 0) {
      ra += 2 * Math.PI
    }
    if (ra > 2 * Math.PI) {
      ra -= 2 * Math.PI
    }

    for (let r = 0 ; r < (FOV* scale) ; r++) {
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
          distanceH = distance(this.player.x, this.player.y, rhx, rhy)
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
          distanceV = distance(this.player.x, this.player.y, rvx, rvy)
          dof = 8
        } else {
          rvx += xo
          rvy += yo
          dof += 1
        }
      }

      let rx, ry, perpWallDist

      if (distanceV<distanceH) {
        rx = rvx
        ry = rvy
        perpWallDist = distanceV
      } else {
        rx = rhx
        ry = rhy
        perpWallDist = distanceH
      }

      let ca = angle - ra
      if (ca < 0) {
        ca += 2 * Math.PI
      }
      if (ca > 2 * Math.PI) {
        ca -= 2 * Math.PI
      }

      perpWallDist *= Math.cos(ca)
      let lineH = (64*viewport.height) / perpWallDist
      if (lineH > viewport.height) {
        lineH = viewport.height
      }
      let lineO = viewport.height/2 - lineH/2

      const color = Math.max(10, Math.min(255, 3*255*(lineH/viewport.height)))

      buffer.fillStyle = `rgb(${color},0,0)`
      buffer.fillRect(r*size, lineO, size, lineH)

      ra += step
      if (ra < 0) {
        ra += 2 * Math.PI
      }
      if (ra > 2 * Math.PI) {
        ra -= 2 * Math.PI
      }
    }
  }

  render(viewport, buffer, currentTime) {
    this.renderWalls(viewport, buffer)
  }

}

export default Ray
