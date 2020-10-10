
const FOV = 60

/*
const PI = Math.PI
const PI_2 = PI * 2
const PI_HALF = PI / 2
const PI_75 = 3 * PI_HALF
*/

const PI_TWO = Math.PI * 2;
const PI_HALF = Math.PI / 2;
const VOF = FOV * (Math.PI / 180);
const VOF_HALF = VOF / 2;
const TILE = 64;

function distance(ax, ay, bx, by) {
  return Math.sqrt((bx-ax) * (bx-ax) + (by-ay) * (by-ay))
}

class Ray {

  #player
  #map

  constructor(player, map) {
    this.player = player
    this.map = map
  }

  renderBackground(viewport, buffer) {
    var grd = buffer.createLinearGradient(0,viewport.height/2,0,0)
    grd.addColorStop(0, "black")
    grd.addColorStop(1, "green")
    buffer.fillStyle = grd
    buffer.fillRect(0, 0, viewport.width, viewport.height/2)

    grd = buffer.createLinearGradient(0, viewport.height/2, 0, viewport.height)
    grd.addColorStop(0, "black")
    grd.addColorStop(1, "blue")
    buffer.fillStyle = grd
    buffer.fillRect(0, viewport.height/2, viewport.width, viewport.height)
  }

  getLine(x1, y1, x2, y2, lineElement) {
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var sx = (x1 < x2) ? 1 : -1;
    var sy = (y1 < y2) ? 1 : -1;
    var err = dx - dy;
    var e2;
    var perviousTileX = 0;
    var perviousTileY = 0;

    while (!((x1 == x2) && (y1 == y2))) {
      e2 = err << 1;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      else if (e2 < dx) {
        err += dx;
        y1 += sy;
      }

      var mapX = Math.round(x1 / TILE);
      var mapY = Math.round(y1 / TILE);
      //if ()
      if (this.map.data[mapY][mapX]) {
        lineElement.y = y1;
        lineElement.x = x1;
        //lineElement.texture = textures[this.map[mapY][mapX]];
        //lineElement.north = perviousTileX == mapX;
        //lineElement.part = lineElement.north ? x1 - (mapX * TILE) : y1 - (mapY * TILE)
        return;
      }
      perviousTileX = mapX;
      perviousTileY = mapY;
    }
  }

  renderWalls(viewport, buffer) {
    //this.draw = function(ctx) {
      //  this.drawBackgound(ctx);

    var lineElement = {
      y: 0,
      x: 0,
      //texture: null,
      //north: false,
      //dist: 0,
      //part: 0
    };

    const RAY_ANGLE = VOF / viewport.width
    const HALF_H = viewport.height / 2
    let angle = Math.atan2(this.player.dy, this.player.dx)
    let i = 0


    for (let rayAngle = -VOF_HALF; rayAngle < VOF_HALF; rayAngle += RAY_ANGLE) {
      const dx = this.player.x + Math.cos(angle + rayAngle) * 100;
      const dy = this.player.y + Math.sin(angle + rayAngle) * 100;

      this.getLine(this.player.x, this.player.y, dx, dy, lineElement);

      var vX = this.player.x - lineElement.x;
      var vY = this.player.y - lineElement.y;
      lineElement.dist = Math.sqrt(vX * vX + vY * vY) * Math.cos(rayAngle);

      var wallFactor = (HALF_H / lineElement.dist * TILE / 2) * 2
      //var texture = lineElement.texture;

      //if (texture)
      //ctx.drawImage(texture, Math.floor(lineElement.part * (texture.width / TILE)), 0, 1, texture.height, i, SCR_H_HALF - wallFactor, 1, wallFactor * 2)

      //buffer.globalAlpha = lineElement.dist / 1000 * (lineElement.north ? 1 : 1.5);

      let color = 255 * (1-(lineElement.dist / 1000 * (lineElement.north ? 1 : 1.5)))
      if (color < 10) {
        color = 10
      } else if (color > 255) {
        color = 255
      }

      buffer.strokeStyle = `rgb(${color},0,0)`
      buffer.beginPath();
      buffer.moveTo(i, HALF_H - wallFactor);
      buffer.lineTo(i, HALF_H + wallFactor);
      //buffer.closePath();
      buffer.stroke();
      //buffer.globalAlpha = 1;

      //if (i == viewport.width / 2) {
        //this.player.moveableForward = lineElement.dist > 10;
      //}

      i++;
    }

        //this.drawMap(ctx);
    //}
  }

  /*
  renderWalls2(viewport, buffer) {
    const scale = 10
    const step = 0.0174533/scale

    let angle = Math.atan2(this.player.dy, this.player.dx)
    if (angle > PI_2) {
      angle -= PI_2
    } else if (angle < 0) {
      angle += PI_2
    }

    let ra = angle - (step*(FOV* scale)/2)
    const size = Math.ceil(viewport.width / (FOV * scale))

    if (ra < 0) {
      ra += PI_2
    } else if (ra > PI_2) {
      ra -= PI_2
    }

    for (let r = 0 ; r < (FOV* scale) ; r++) {
      let rhy, rhx, rvy, rvx

      let distanceH = Number.MAX_SAFE_INTEGER
      let distanceV = Number.MAX_SAFE_INTEGER

      let dof
      let yo, xo

      dof = 0
      const aTan = -1 / Math.tan(ra)
      if (ra > PI) {
        rhy = ((this.player.y >> 6)<<6) - 0.0001
        rhx = (this.player.y - rhy) * aTan + this.player.x
        yo = -64
        xo = 64 * aTan
      }
      if (ra < PI) {
        rhy = ((this.player.y >> 6)<<6) + 64
        rhx = (this.player.y - rhy) * aTan + this.player.x
        yo = 64
        xo = -64 * aTan
      }
      if (ra === 0 || ra === PI) {
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
      if (ra > PI_HALF && ra < PI_75) {
        rvx = ((this.player.x >> 6)<<6) - 0.0001
        rvy = (this.player.x - rvx) * nTan + this.player.y
        xo = -64
        yo = 64 * nTan
      }
      if (ra < PI_HALF || ra > PI_75) {
        rvx = ((this.player.x >> 6)<<6) + 64
        rvy = (this.player.x - rvx) * nTan + this.player.y
        xo = 64
        yo = -64 * nTan
      }
      if (ra === 0 || ra === PI) {
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
        ca += PI_2
      } else if (ca > PI_2) {
        ca -= PI_2
      }

      perpWallDist *= Math.cos(ca)
      let lineH = (64*viewport.height) / perpWallDist
      if (lineH > viewport.height) {
        lineH = viewport.height
      }
      let lineO = viewport.height /2 - lineH / 2

      let color = 3*255*(lineH/viewport.height)
      if (color < 10) {
        color = 10
      } else if (color > 255) {
        color = 255
      }

      buffer.fillStyle = `rgb(${color},0,0)`
      buffer.fillRect(r*size, lineO, size, lineH)

      ra += step
      if (ra < 0) {
        ra += PI_2
      } else if (ra > PI_2) {
        ra -= PI_2
      }
    }
  }
  */

  render(viewport, buffer, currentTime) {
    this.renderBackground(viewport, buffer)
    this.renderWalls(viewport, buffer)
  }

}

export default Ray
