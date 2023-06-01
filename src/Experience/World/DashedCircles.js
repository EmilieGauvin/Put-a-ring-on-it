import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import Experience from '../Experience.js'

export default class DashedCircles {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera
        this.resources = this.experience.resources

        this.setUp()
    }

    setUp() {
        this.circleMaterial = new THREE.LineDashedMaterial({
            color: 0xffffff,
            linewidth: 1,
            scale: 1,
            dashSize: 200,
            gapSize: 100,
            transparent: true,
            opacity: 0.5
        })

        for (let j = 0; j < 3; j++) {
            var R = 1000 + j * 300
            var pointsArray = []
            var count = 20
            for (let i = 0; i < count; i++) {
                var point = new THREE.Vector3(R * Math.cos(i * Math.PI * 2 / count), 0, R * Math.sin(i * Math.PI * 2 / count))
                pointsArray.push(point)
            }

            const curve = new THREE.CatmullRomCurve3(pointsArray)
            curve.closed = true

            const points = curve.getPoints(50)
            const geometry = new THREE.BufferGeometry().setFromPoints(points)

            const circle = new THREE.Line(geometry, this.circleMaterial)
            circle.computeLineDistances()
            this.scene.add(circle)
            circle.layers.set(3)

        }

    }

}