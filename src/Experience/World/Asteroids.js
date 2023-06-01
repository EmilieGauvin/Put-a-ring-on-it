import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'

import gsap from 'gsap'
import Experience from '../Experience.js'

export default class Asteroids {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.renderer = this.experience.renderer
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera
        this.resources = this.experience.resources

        this.destroyingAsteroid = false
        this.asteroidsArray = []
        this.asteroids()
        this.setOpacity()
    }

    asteroids() {
        this.startAsteroid = this.resources.items.asteroidModel.scene
        this.asteroidNormal = this.resources.items.asteroidNormal

        this.startAsteroid.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.layers.set(2)
            }
        })

        this.asteroidMaterial = new THREE.MeshStandardMaterial({
            transparent: true,
            normalMap: this.asteroidNormal,
        })
        this.asteroidMaterial.normalScale.set(1, 1)
        this.asteroidNormal.repeat.x = 3
        this.asteroidNormal.repeat.y = 3

        this.asteroidNormal.wrapS = THREE.RepeatWrapping
        this.asteroidNormal.wrapT = THREE.RepeatWrapping



        this.startAsteroid.children[0].material = this.asteroidMaterial
        this.startAsteroid.children[0].material.normalScale.set(1, 1)
        this.startAsteroid.scale.set(10, 10, 10)
        this.startAsteroid.position.copy(this.experience.startAsteroidPosition)
        this.asteroidsArray.push(this.startAsteroid)
        this.experience.currentAsteroid = this.startAsteroid
        this.scene.add(this.startAsteroid)

        for (let i = 0; i < 100; i++) {

            const asteroid = this.startAsteroid.clone()
            asteroid.children[0].material = this.asteroidMaterial.clone()

            asteroid.scale.set(10, 10, 10)

            var R = 1000 + Math.random() * 600
            var A = Math.random() * Math.PI * 2
            asteroid.position.set(
                R * Math.cos(A),
                (Math.random() - 0.5) * 300,
                R * Math.sin(A)
            )
            var S = Math.random() * 15 + 5
            asteroid.scale.set(S, S, S)
            asteroid.rotation.z = Math.random() * Math.PI
            asteroid.rotation.x = Math.random() * Math.PI
            let collidingAsteroid = false
            this.asteroidsArray.forEach((otherAsteroid) => {
                if (otherAsteroid.position.distanceTo(asteroid.position) < 40) {
                    collidingAsteroid = true
                }
            })
            if (collidingAsteroid === false) {
                this.asteroidsArray.push(asteroid)
                this.scene.add(asteroid)
            }
        }
        this.setLayers(this.experience.camera.instance.position)
    }

    jump() {
        this.destroyCurrentAsteroid(this.experience.currentAsteroid)
    }

    destroyCurrentAsteroid(asteroid) {
        asteroid.children[0].material.opacity = 1
        this.experience.currentAsteroid.children[0].material.opacity = 1
        gsap.to(asteroid.children[0].material, {
            duration: 0.15, ease: 'power1.inOut', opacity: 0, repeat: 20, yoyo: true,
            onComplete: () => {
                asteroid.children[0].material.opacity = 1
                if (asteroid != this.startAsteroid) asteroid.children[0].material.visible = false
            }
        })
    }

    setLayers(cameraPosition) {

        this.asteroidsArray.forEach(asteroid => {
            if (asteroid.position.distanceTo(cameraPosition) < 700) {
                asteroid.children[0].layers.set(3)
            }
            else {
                asteroid.children[0].layers.enable(2)
            }
        })
    }

    setOpacity() {
        this.asteroidsArray.filter(asteroid => asteroid != this.experience.currentAsteroid).forEach(asteroid => {
            asteroid.children[0].material.opacity = 0.1 + 500 / asteroid.position.distanceTo(this.experience.world.model.modelGroup.position)
        })
    }

    end() {
        this.asteroidsArray.forEach(asteroid => {
            this.scene.remove(asteroid)
        })
        this.asteroidsArray = []
    }

    update() {
        this.asteroidsArray.filter(asteroid => asteroid != this.experience.currentAsteroid).forEach(asteroid => {
            switch (this.asteroidsArray.indexOf(asteroid) % 4) {

                case 0:
                    asteroid.rotation.x += 0.001
                    asteroid.rotation.z += 0.002
                    break
                case 1:
                    asteroid.rotation.x -= 0.001
                    asteroid.rotation.y -= 0.002
                    break
                case 1:
                    asteroid.rotation.x += 0.001
                    asteroid.rotation.z -= 0.002
                    break
                case 3:
                    asteroid.rotation.x -= 0.001
                    asteroid.rotation.y += 0.002
                    break
                default:
                    asteroid.rotation.x += 0.001
                    asteroid.rotation.z += 0.002
                    break
            }
        })

    }
}
