import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import gsap from 'gsap'
import Experience from '../Experience.js'

export default class Model {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera
        this.resources = this.experience.resources

        this.setPlane()
        this.setModel()
    }

    setPlane() {
        this.plane = new THREE.Mesh(
            new THREE.PlaneGeometry(500, 500),
            new THREE.MeshStandardMaterial({
                transparent: true, opacity: 0, depthWrite: false
            })
        )
        this.modelGroup = new THREE.Group()
        this.modelGroup.add(this.plane)
        this.scene.add(this.modelGroup)
        this.plane.layers.set(3)
        this.modelGroup.layers.set(3)
    }

    setModel() {
        this.envMap = this.resources.items.environmentMapTexture
        this.visorMaterial = new THREE.MeshStandardMaterial({
            envMap: this.envMap,
            metalness: 0.95,
            roughness: 0.1,
            envMapIntensity: 0.85,
            normalScale: 1.0
        })

        this.resource = this.resources.items.astronautModel
        this.model = this.resource.scene
        this.model.scale.set(1.2, 1.2, 1.2)
        this.scene.add(this.model)
        const visor = this.model.children[0].children.find((child) => child.name === 'Head_Visor')
        visor.material = this.visorMaterial

        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.layers.set(3)
            }
        })

        this.model.position.z = 20
        this.model.children[0].rotation.x = Math.PI * 0.5
        this.model.children[0].rotation.y = Math.PI
        this.model.layers.set(3)

        this.modelGroup.add(this.model)
        this.modelGroup.position.copy(this.experience.startAsteroidPosition)
        this.setAnimation()
    }

    setAnimation() {
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        this.animation.actions = {}

        this.animation.actions.floating = this.animation.mixer.clipAction(
            this.resource.animations.find((child) => child.name === 'floating')
        )
        this.animation.actions.idle = this.animation.mixer.clipAction(
            this.resource.animations.find((child) => child.name === 'idle')
        )
        this.animation.actions.running = this.animation.mixer.clipAction(
            this.resource.animations.find((child) => child.name === 'running')
        )
        this.animation.actions.endWin = this.animation.mixer.clipAction(
            this.resource.animations.find((child) => child.name === 'end-win')
        )
        this.animation.actions.endLose = this.animation.mixer.clipAction(
            this.resource.animations.find((child) => child.name === 'end-lose')
        )

        this.animation.actions.endWin.clampWhenFinished = true
        this.animation.actions.endWin.setLoop(THREE.LoopOnce)
        this.animation.actions.endLose.clampWhenFinished = true
        this.animation.actions.endLose.setLoop(THREE.LoopOnce)

        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()
    }

    playAnimation(name, speed) {
        const newAction = this.animation.actions[name]
        const oldAction = this.animation.actions.current

        newAction.reset()
        newAction.play()
        newAction.crossFadeFrom(oldAction, speed)

        this.animation.actions.current = newAction
    }

    placeModel(position) {
        this.model.position.z = position + 3
    }

    jump() {
        this.playAnimation('floating', 1.5)
        gsap.killTweensOf(this.model.children[0].rotation)
        this.model.children[0].rotation.y = Math.PI * 2 * Math.random()
        setTimeout(() => {
            gsap.to(this.model.children[0].rotation, {
                duration: 60, ease: 'power1.inOut', y: - 10 * Math.PI
            })
        }, 200)

    }

    direction(position) {
        this.modelGroup.position.copy(this.modelGroup.position.sub(position))
    }

    settle(asteroid) {
        this.modelGroup.position.copy(asteroid.position)
        this.playAnimation('idle', 0.5)
        gsap.killTweensOf(this.model.children[0].rotation)
    }

    end() {
        gsap.killTweensOf(this.model.children[0].rotation)

        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(this.camera.instance.position)

        this.modelGroup.position.copy(cameraPosition.multiplyScalar(0.93))
        this.model.position.z = 0
        this.model.position.y = 0
        this.model.position.x = 0
        this.modelGroup.scale.set(9, 9, 9)
        this.model.children[0].position.x += 6
        this.modelGroup.rotation.x = this.camera.instance.rotation.x - Math.PI * 0.5
        this.modelGroup.rotation.y = this.camera.instance.rotation.y
        this.modelGroup.rotation.z = this.camera.instance.rotation.z
        this.model.children[0].lookAt(this.camera.instance.position)

        this.experience.win === true ? this.playAnimation('endWin', 0) : this.playAnimation('endLose', 0)
    }

    updateAngle(angle) {
        if (this.experience.gameOn === false) return

        if (this.experience.isJumping === false) gsap.to(this.model.children[0].rotation, {
            duration: 0.1, ease: 'power1.inOut', y: -angle + Math.PI
        })
    }

    update() {


        if (this.animation.mixer) {
            this.animation.mixer.update(this.time.delta * 0.001)
        }

        if (this.experience.gameOn === false) return

        if (this.experience.isJumping === false) {
            this.modelGroup.rotation.x = this.camera.instance.rotation.x
            this.modelGroup.rotation.y = this.camera.instance.rotation.y
            this.modelGroup.rotation.z = this.camera.instance.rotation.z
        }

        var R = Math.sqrt(this.modelGroup.position.x * this.modelGroup.position.x + this.modelGroup.position.y * this.modelGroup.position.y + this.modelGroup.position.z * this.modelGroup.position.z)
        if (R < 800 || R > 1800) {
            this.experience.win = false
            this.experience.end()
        }

    }

}