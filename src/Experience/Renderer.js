import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import { EffectComposer } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/examples/jsm/postprocessing/RenderPass.js'
import { SMAAPass } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/examples/jsm/postprocessing/SMAAPass.js'
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/examples/jsm/postprocessing/UnrealBloomPass.js'
import { BokehPass } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/examples/jsm/postprocessing/BokehPass.js'
import { ShaderPass } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/examples/jsm/postprocessing/ShaderPass.js'

import VertexShader from './Postprocessing/shaders/vertex.glsl'
import FragmentShader from './Postprocessing/shaders/fragment.glsl'

import Experience from './Experience'

export default class Renderer {
    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.time = this.experience.time
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.cameraFixed = this.experience.cameraFixed
        this.debug = this.experience.debug

        //Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('DOF')
        }
        this.setInstance()
        this.setPostProcessing()
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        }
        )
        this.instance.physicallyCorrectLights = true
        this.instance.setClearColor(0x444444, 0)
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        this.instance.logarithmicDepthBuffer = false
        this.instance.autoClear = false
    }

    setPostProcessing() {
        const renderTarget = new THREE.WebGLRenderTarget(
            800,
            600,
            {
                samples: this.instance.getPixelRatio() === 1 ? 2 : 0
            }
        )
        const renderPass = new RenderPass(this.scene, this.camera.instance)

        this.bloomComposer = new EffectComposer(this.instance, renderTarget)
        this.bloomComposer.setSize(this.sizes.width, this.sizes.height)
        this.bloomComposer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
        this.bloomComposer.renderToScreen = false
        this.bloomComposer.addPass(renderPass)

        this.blurComposer = new EffectComposer(this.instance, renderTarget)
        this.blurComposer.setSize(this.sizes.width, this.sizes.height)
        this.blurComposer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
        this.blurComposer.renderToScreen = true
        this.blurComposer.addPass(renderPass)

        this.finalComposer = new EffectComposer(this.instance, renderTarget)
        this.finalComposer.addPass(renderPass)
        const finalPass = this.createFinalPass(
            this.bloomComposer
        )

        this.finalComposer.addPass(finalPass)

        this.setUnrealBloom()
        this.setDepthOfField()

        if (this.instance.getPixelRatio() === 1 && !this.instance.capabilities.isWebGL2) {
            this.setAntialias()
        }
    }

    createFinalPass(
        bloomComposer,
    ) {
        const finalPass = new ShaderPass(
            new THREE.ShaderMaterial({
                vertexShader: VertexShader,
                fragmentShader: FragmentShader,
                uniforms: {
                    bloomTexture: { value: bloomComposer.renderTarget2.texture },
                },
                defines: {},
                blending: THREE.AdditiveBlending,
                transparent: true
            }),
            'baseTexture'
        )
        finalPass.renderToScreen = true

        return finalPass
    }

    setUnrealBloom() {
        this.unrealBloomPass = new UnrealBloomPass()
        this.unrealBloomPass.threshold = 0.21
        this.unrealBloomPass.strength = 2
        this.unrealBloomPass.radius = 0.55
        this.bloomComposer.addPass(this.unrealBloomPass)
    }

    setDepthOfField() {

        const bokehPass = new BokehPass(this.scene, this.camera.instance, {
            focus: 725,
            aperture: 0.000021, //0.0000005,
            maxblur: 0.005
        })
        this.blurComposer.addPass(bokehPass)

    }

    setAntialiasSMAA() {
        const smaaPass = new SMAAPass()
        this.effectComposer.addPass(smaaPass)
        console.log('Using SMAA')
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        if (this.instance.fov = this.sizes.width > 768) {
            this.blurComposer.setSize(this.sizes.width, this.sizes.height)
            this.blurComposer.setPixelRatio(this.sizes.pixelRatio)
        }
        this.bloomComposer.setSize(this.sizes.width, this.sizes.height)
        this.bloomComposer.setPixelRatio(this.sizes.pixelRatio)
        this.finalComposer.setSize(this.sizes.width, this.sizes.height)
        this.finalComposer.setPixelRatio(this.sizes.pixelRatio)
    }

    update() {



        //Main view 
        this.instance.setViewport(0, 0, window.innerWidth, window.innerHeight)
        if (this.experience.world.ring) {
            this.experience.world.ring.material.resolution.set(window.innerWidth * 1.2, window.innerHeight * 1.2)
        }
        if (this.experience.world.dashedCircles) this.experience.world.dashedCircles.circleMaterial.visible = false
        if (this.experience.world.stars) this.experience.world.stars.particles.material.visible = true


        this.instance.clear()

        if (this.instance.fov = this.sizes.width > 768) {
            this.camera.instance.layers.set(2)
            this.blurComposer.swapBuffers()
            this.blurComposer.render(this.scene, this.camera.instance)
        } else {
            this.camera.instance.layers.set(2)
            this.instance.render(this.scene, this.camera.instance)
        }

        this.camera.instance.layers.set(0)
        this.bloomComposer.swapBuffers()
        this.bloomComposer.render(this.scene, this.camera.instance)

        this.camera.instance.layers.set(1)
        this.finalComposer.swapBuffers()
        this.finalComposer.render(this.scene, this.camera.instance)

        this.instance.clearDepth()
        this.camera.instance.layers.set(3)
        this.instance.render(this.scene, this.camera.instance)

        //Inset view
        this.instance.clearDepth()
        this.instance.setScissorTest(true)
        this.cameraFixed.instance.layers.set(3)

        this.instance.setScissor(20, 20, this.sizes.height / 4, this.sizes.height / 4)

        this.instance.setViewport(20, 20, this.sizes.height / 4, this.sizes.height / 4)
        if (this.experience.world.ring) {
            this.experience.world.ring.material.resolution.set(
                this.sizes.height * 1.2, this.sizes.height * 1.2)
        }
        if (this.experience.world.dashedCircles) this.experience.world.dashedCircles.circleMaterial.visible = true

        if (this.experience.world.stars) this.experience.world.stars.particles.material.visible = false
        this.instance.render(this.scene, this.cameraFixed.instance)
        this.instance.setScissorTest(false)
    }
}
