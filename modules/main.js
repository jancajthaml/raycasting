import Loop from './loop.js'
import Canvas from './canvas.js'
import Player from './player.js'
import WorldMap from './map.js'
import Ray from './ray.js'

const map = new WorldMap()
const player = new Player()
const rays = [
  new Ray(player, map),
]
const canvas = new Canvas('canvas', [...rays, map, player])

window.addEventListener("load", function() {
  player.x = 300
  player.y = 300
  new Loop(30, [canvas]).run()
})
