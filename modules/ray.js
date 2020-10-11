
const FOV = 60

const PI_TWO = Math.PI * 2
const PI_HALF = Math.PI / 2
const VOF = FOV * (Math.PI / 180)
const VOF_HALF = VOF / 2
const TILE = 30 //* 2

function distance(ax, ay, bx, by) {
  let x = (bx-ax)
  let y = (by-ay)
  return Math.sqrt(x*x + y*y)
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
    var dx = Math.abs(x2 - x1)
    var dy = Math.abs(y2 - y1)
    var sx = (x1 < x2) ? 1 : -1
    var sy = (y1 < y2) ? 1 : -1
    var err = dx - dy
    var e2;
    var perviousTileX = 0;
    var perviousTileY = 0;

    while (!((x1 == x2) && (y1 == y2))) {
      e2 = err * 2
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      else if (e2 < dx) {
        err += dx;
        y1 += sy;
      }

      var mapX = ~~(x1 / TILE);
      var mapY = ~~(y1 / TILE);

      const mp = Math.round(mapY * this.map.width + mapX)

      if (mp >= 0 && mp < this.map.data.length && this.map.data[mp]) {
        lineElement.y = y1
        lineElement.x = x1
        return;
      }
      perviousTileX = mapX;
      perviousTileY = mapY;
    }
  }

  renderWalls(viewport, buffer) {
    const lineElement = {
      y: 0,
      x: 0,
    };

    const RAY_ANGLE = VOF / viewport.width
    const HALF_H = viewport.height / 2
    let angle = Math.atan2(this.player.dy, this.player.dx)
    let i = 0

    for (let rayAngle = -VOF_HALF; rayAngle < VOF_HALF; rayAngle += RAY_ANGLE) {
      const dx = this.player.x + Math.cos(angle + rayAngle) * 100;
      const dy = this.player.y + Math.sin(angle + rayAngle) * 100;

      this.getLine(this.player.x, this.player.y, dx, dy, lineElement);

      lineElement.dist = distance(this.player.x, this.player.y, lineElement.x, lineElement.y) * Math.cos(rayAngle);

      const wallFactor = (HALF_H / lineElement.dist * TILE / 2) * 2

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
      buffer.stroke();


      i++;
    }
  }

  render(viewport, buffer, currentTime) {
    this.renderBackground(viewport, buffer)
    this.renderWalls(viewport, buffer)
  }

}

export default Ray
