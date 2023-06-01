import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import Experience from '../Experience.js'

export default class Objects {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera

        this.resources = this.experience.resources
        this.starTexture = this.resources.items.starTexture

        this.setParticules()
    }

    setParticules() {
        // Geometry
        const particlesGeometry = new THREE.BufferGeometry()
        const count = 150
        const positions = new Float32Array(count * 3)

        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 4000
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

        const particlesMaterial = new THREE.PointsMaterial({
            size: 30,
            sizeAttenuation: true,
            map: this.starTexture,
            transparent: true,
            opacity: 0.15,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })

        this.particles = new THREE.Points(particlesGeometry, particlesMaterial)
        this.scene.add(this.particles)
        this.particles.layers.enable(3)

    }

    update() {
        if (this.experience.gameOn === true) this.particles.rotation.y += this.experience.contextSpeed
        if (this.experience.gameOn === false) this.particles.rotation.y += this.experience.endSpeed
    }
}