import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import { TrackballControls } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/examples/jsm/controls/TrackballControls.js'
import Experience from './Experience'

export default class Camera {
    constructor() {

        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
        this.setTrackballControls()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            70,
            this.sizes.width / this.sizes.height,
            0.1,
            8000)

        this.instance.position.set(930 + 11.547, 130 + 11.547, 930 + 11.547)
        this.instance.layers.enable(1)
        this.scene.add(this.instance)
        this.resize
    }

    setTrackballControls() {
        this.controls = new TrackballControls(this.instance, this.canvas)
        this.controls.target.set(900, 100, 900)
        this.controls.noPan = true
        this.controls.noZoom = true
        this.controls.rotateSpeed = 0.5
        this.controls.addEventListener('start',
            () => this.experience.world.model.playAnimation('running', 0.5))

        this.controls.addEventListener('end',
            () => this.experience.world.model.playAnimation('idle', 1))
    }

    resize() {
        this.instance.fov = this.sizes.width > 768 ? 70 : 100
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
        if (this.experience.gameOn === false) this.end()
    }

    jump() {
        this.controls.enabled = false
    }

    settle(asteroid, jumpDirection) {
        this.experience.currentAsteroid = asteroid
        this.instance.position.copy(
            asteroid.position)

        const jumpDir = new THREE.Vector3()
        jumpDir.copy(jumpDirection)
        this.instance.position.add(jumpDir.multiplyScalar(72))
        this.controls.target.set(asteroid.position.x, asteroid.position.y, asteroid.position.z)
        this.controls.enabled = true
    }

    end() {
        this.controls.enabled = false

        this.sizes.width > 768 ? this.instance.position.set(0, 600, 2000) : this.instance.position.set(0, 1200, 4000)
        this.instance.rotation.x = -Math.atan(600 / 2000)
        this.instance.rotation.y = 0
        this.instance.rotation.z = 0

    }

    update() {
        if (this.experience.gameOn === false) return
        if (this.experience.isJumping === false) this.controls.update()
    }
}

