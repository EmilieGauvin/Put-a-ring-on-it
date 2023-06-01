import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import Experience from '../Experience'
import Environment from './Environment'
import DashedCircles from './DashedCircles'
import Planet from './Planet'
import Sky from './Sky'
import Stars from './Stars'
import Asteroids from './Asteroids'
import Model from './Model'
import Ring from './Ring'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.time = this.experience.time
        this.renderer = this.experience.renderer
        this.resources = this.experience.resources

        this.raycaster = new THREE.Raycaster()
        this.raycaster.layers.set(3)
        this.screenCenter = new THREE.Vector2()
        this.jumpDirection = new THREE.Vector3()
        this.controlJump = false
        this.sceneReady = false

        this.dashedCircles = new DashedCircles()
        this.environment = new Environment()
        this.ring = new Ring()

        this.resources.on('ready', () => {
            this.model = new Model()
            this.asteroids = new Asteroids()
            this.sky = new Sky()
            this.planet = new Planet()
            this.stars = new Stars()

            this.sceneReady = true
        })
    }

    jump() {
        this.jumpDirection.subVectors(this.model.modelGroup.position, this.camera.instance.position).normalize()

        setTimeout(() => {
            this.jumpDirection = new THREE.Vector3()
            this.launch = null
        }, '100')

        setTimeout(() => {
            this.jumpDirection.subVectors(this.camera.instance.position, this.model.modelGroup.position).normalize()
            this.controlJump = true
        }, '300')


        this.model.jump()
        this.asteroids.jump()
    }

    settle(asteroid) {
        this.controlJump = false
        this.experience.settle(asteroid, this.jumpDirection)
        this.model.settle(asteroid)
        this.ring.ringCreated(asteroid)
        this.asteroids.setLayers(this.experience.camera.instance.position)

    }

    end() {
        this.asteroids.end()
        this.model.end()
        this.ring.end()
    }

    update() {
        if (this.stars) this.stars.update()
        if (this.sky) this.sky.update()
        if (this.asteroids) this.asteroids.update()
        if (this.model) this.model.update()
        if (this.planet) this.planet.update()
        if (this.ring) this.ring.update()

        if (this.experience.gameOn === false) return

        if (this.experience.isJumping === true) {
            this.asteroids.setLayers(this.model.modelGroup.position)
            this.asteroids.setOpacity()
            this.asteroids.asteroidsArray.forEach(asteroid => {
                if (asteroid === this.experience.currentAsteroid) return
                if (this.model.modelGroup.position.distanceTo(asteroid.position) < asteroid.scale.x * 1.5) {
                    this.settle(asteroid)
                }
            })

            if (this.controlJump === true) {
                this.raycaster.setFromCamera(this.experience.pointer, this.camera.instance)
                const intersects = this.raycaster.intersectObject(this.model.modelGroup)
                if (intersects.length) {
                    this.jumpDirection.subVectors(this.camera.instance.position, intersects[0].point).normalize()
                }
                this.camera.instance.position.copy(this.camera.instance.position.sub(this.jumpDirection))
            }
            this.model.direction(this.jumpDirection)
        }
        else {
            this.raycaster.setFromCamera(this.screenCenter, this.camera.instance)
            var intersectAsteroid
            if (this.experience.currentAsteroid) {
                intersectAsteroid = this.raycaster.intersectObject(this.experience.currentAsteroid)
                if (intersectAsteroid.length) {
                    this.model.placeModel(this.camera.instance.position.distanceTo(this.model.modelGroup.position) - intersectAsteroid[0].distance)
                }
            }
        }
    }
}





