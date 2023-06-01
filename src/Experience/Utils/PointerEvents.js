import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import Experience from '../Experience'
import EventEmitter from './EventEmitter'

export default class PointerEvents extends EventEmitter
{
    constructor()
    {
        super()

        this.experience = new Experience()
        this.sizes = this.experience.sizes

        this.pointer = new THREE.Vector2()//initiate the mouse in 0,0

        this.angle = 0
        this.originPointer = {x: 0, y: 0} 
        this.dragging = false
        // Events
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            // Touch down
            window.addEventListener('touchstart', (event) =>
            {
                this.updateTouch(event)
                this.trigger('pointerDown')
                this.originPointer = {x: this.pointer.x, y: this.pointer.y}
                this.dragging = true
            })
            // Touch move
            window.addEventListener('touchmove', (event) =>
            {
                if (this.dragging === true){
                this.updateTouch(event)
                this.trigger('pointerMove')
                }
            })
            // Touch up
            window.addEventListener('touchend', (event) =>
            {    
                this.trigger('pointerCancel')
                this.dragging = false

            })
            // Touch cancel
            window.addEventListener('touchcancel', (event) =>
            {    
                this.trigger('pointerCancel')
                this.dragging = false

            })

        } else {
            // Pointer down
            window.addEventListener('pointerdown', (event) =>
            {
                this.updatePointer(event)
                this.trigger('pointerDown')
                this.originPointer = {x: this.pointer.x, y: this.pointer.y}
                this.dragging = true
            })
            // Pointer move
            window.addEventListener('pointermove', (event) =>
            {
                if (this.dragging === true){
                this.updatePointer(event)
                this.trigger('pointerMove')}
            })
            // Pointer up
            window.addEventListener('pointerup', (event) =>
            {  
                this.trigger('pointerCancel')
                this.dragging = false
            })
            // Pointer cancel
            window.addEventListener('pointercancel', (event) =>
            {  
                this.trigger('pointerCancel')
                this.dragging = false
            })
        }
    }

    updateTouch(event)
    {
        var touch = event.touches[0]
        var x = touch.pageX
        var y = touch.pageY
        this.pointer.x = x / this.sizes.width * 2 - 1 //normalize the coord.
        this.pointer.y = - (y / this.sizes.height) * 2 + 1 //normalize …
        this.updateAngle()
    }

    updatePointer(event)
    {
        this.pointer.x = event.clientX / this.sizes.width * 2 - 1 //normalize the coord.
        this.pointer.y = - (event.clientY / this.sizes.height) * 2 + 1 //normalize …
        this.updateAngle()
    }

    updateAngle()
    {
        var tan = Math.atan(((this.originPointer.x - this.pointer.x)*this.sizes.width)/((this.originPointer.y - this.pointer.y)*this.sizes.height))
        this.angle = this.originPointer.y - this.pointer.y > 0 ? tan + Math.PI : tan  
        
        this.experience.world.model.updateAngle(this.angle)
    }
}
