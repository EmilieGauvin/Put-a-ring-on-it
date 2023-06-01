import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import Experience from '../Experience.js'

export default class Sky {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera
        this.resources = this.experience.resources
        this.skyTexture = this.resources.items.skyTexture

        this.skySetUp()


    }

    skySetUp() {

        this.skySphere = new THREE.Mesh(
            new THREE.SphereGeometry(3000, 16, 16),
            new THREE.MeshBasicMaterial({
                color: new THREE.Color('#edbefe'),
                side: THREE.BackSide,
                map: this.skyTexture,
            })
        )
        this.skySphere.position.set(0, 0, 0)

        this.skySphere.layers.set(2)
        this.scene.add(this.skySphere)
    }

    update() {

        if (this.experience.gameOn === true) this.skySphere.rotation.y += this.experience.contextSpeed
        if (this.experience.gameOn === false) this.skySphere.rotation.y += this.experience.endSpeed

    }


}