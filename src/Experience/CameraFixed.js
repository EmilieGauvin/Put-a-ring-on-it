import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import Experience from './Experience'

export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            70,
            this.sizes.height / this.sizes.height,
            0.1,
            8000)
        this.instance.position.set(0, 2500, 0)
        this.instance.lookAt(new THREE.Vector3(0, 0, 0))
        this.scene.add(this.instance)
    }

    resize() {
        this.instance.aspect = this.sizes.height / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

}

