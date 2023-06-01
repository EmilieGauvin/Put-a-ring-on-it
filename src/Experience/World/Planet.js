import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import Experience from '../Experience.js'

export default class Planet {
    constructor(texture) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.resources = this.experience.resources
        this.planetTexture = this.resources.items.planetTexture

        this.planetSetUp()
    }

    planetSetUp() {

        this.planet = new THREE.Mesh(
            new THREE.SphereGeometry(800, 64, 64),
            new THREE.MeshBasicMaterial({
                color: new THREE.Color('#ffffff'),
                map: this.planetTexture,
            })
        )
        this.planet.position.set(0, 0, 0)
        this.scene.add(this.planet)
        this.planet.layers.enable(3)
    }

    update() {

        if (this.experience.gameOn === true) this.planet.rotation.y -= this.experience.contextSpeed
        if (this.experience.gameOn === false) this.planet.rotation.y -= this.experience.endSpeed
    }


}