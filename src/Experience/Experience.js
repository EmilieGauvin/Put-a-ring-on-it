import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import Sizes from './Utils/Sizes'
import Time from './Utils/Time'
import Camera from './Camera'
import CameraFixed from './CameraFixed'
import Renderer from './Renderer'
import World from './World/World.js'
import Debug from './Utils/Debug'
import sources from './World/sources'
import Resources from './Utils/Resources'
import PointerEvents from './Utils/PointerEvents'
import Stats from 'stats.js'

let instance = null

export default class Experience {
    constructor(canvas) {
        if (instance) {
            return instance
        }
        instance = this

        // //Stats, run 'npm install --save stats.js'
        this.statsActive = window.location.hash === '#stats'
        if (this.statsActive) {
            this.stats = new Stats()
            this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(this.stats.dom)
        }
        this.gameOn = true
        this.isJumping = false
        this.contextSpeed = 0.0003
        this.endSpeed = 0.003
        this.win = false
        this.currentAsteroid = null
        this.startAsteroidPosition = new THREE.Vector3(900, 100, 900)

        //Global acces
        window.experience = this

        //Options
        this.canvas = canvas

        //Set up
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.camera = new Camera()
        this.cameraFixed = new CameraFixed()
        this.renderer = new Renderer()
        this.resources = new Resources(sources)
        this.pointerEvents = new PointerEvents()
        this.pointer = this.pointerEvents.pointer


        this.world = new World()

        this.sizes.on('resize', () => {
            this.resize()
        })

        // Fullscreen
        window.addEventListener('dblclick', () => {
            if (this.camera.controls.enabled === true) this.jump()
        })

        //Time tick event
        this.time.on('tick', () => {
            this.update()
        })

    }

    jump() {
        this.isJumping = true
        this.camera.jump()
        this.world.jump()
    }

    settle(asteroid, jumpDirection) {
        this.isJumping = false
        this.camera.settle(asteroid, jumpDirection)
    }

    end() {
        this.gameOn = false
        this.camera.end()
        this.world.end()
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }


    update() {
        if (this.statsActive) this.stats.begin()

        this.camera.update()
        this.renderer.update()

        if (this.world) this.world.update()

        if (this.statsActive) this.stats.end()
    }

}
