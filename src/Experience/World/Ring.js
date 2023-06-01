import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import { Line2 } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/examples/jsm/lines/Line2.js'
import { LineMaterial } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/examples/jsm/lines/LineMaterial.js'
import { LineGeometry } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/examples/jsm/lines/LineGeometry.js'
import Experience from '../Experience.js'

export default class Ring {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera
        this.debug = this.experience.debug

        this.material = new LineMaterial({

            color: 0xffffff,
            vertexColors: false,
            opacity: 1,
            transparent: true,
            dashed: false,
            alphaToCoverage: false

        })
        this.material.linewidth = this.sizes.width > 768 ? 40 : 20

        this.ringGroup = new THREE.Group()
        this.ringPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(4000, 4000),
            new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
        )
        this.ringPlane.rotation.x = Math.PI * 0.5
        this.ringGroup.add(this.ringPlane)
        this.scene.add(this.ringGroup)

        this.ringPoints = [this.experience.startAsteroidPosition]
    }

    ringCreated(asteroid) {
        this.ringGroup.remove(this.curveObject)
        this.ringPoints.push(asteroid.position)
        const positions = []

        const spline = new THREE.CatmullRomCurve3(this.ringPoints)
        const divisions = Math.round(12 * this.ringPoints.length)
        const point = new THREE.Vector3()
        for (let i = 0, l = divisions; i < l; i++) {

            const t = i / l

            spline.getPoint(t, point)
            positions.push(point.x, point.y, point.z)

        }
        positions.push(asteroid.position.x, asteroid.position.y, asteroid.position.z)
        const geometry = new LineGeometry()
        geometry.setPositions(positions)


        this.curveObject = new Line2(geometry, this.material)

        this.curveObject.layers.set(3)
        this.ringGroup.add(this.curveObject)

        if (this.ringPoints.length > 1 && asteroid.position.equals(this.experience.startAsteroidPosition)) {
            this.experience.win = true
            this.experience.end()
        }

    }

    end() {
        this.material.opacity = 1
    }

    update() {
        if (this.experience.gameOn === false) this.ringGroup.rotation.y -= this.experience.endSpeed
    }
}