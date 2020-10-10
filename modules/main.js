import Loop from './loop.js'
import Canvas from './canvas.js'
import Player from './player.js'
import WorldMap from './map.js'
import Ray from './ray.js'
import Controls from './controls.js'

const map = new WorldMap()
const player = new Player()
const controls = new Controls(player, map)
const rays = [
  new Ray(player, map),
]
const canvas = new Canvas('canvas', [controls, ...rays, /*map, player*/])

window.addEventListener("load", function() {
  player.x = 224
  player.y = 400
  new Loop(30, [canvas]).run()
})
