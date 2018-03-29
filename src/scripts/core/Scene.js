import { Scene, PerspectiveCamera, WebGLRenderer, Vector3 } from 'three'
import Stats from 'stats-js'
// import OrbitControls from 'orbit-controls'
import TrackballControls from '../utils/TrackballControls'
import { EffectComposer, RenderPass } from 'postprocessing'
import GUI from 'Utils/GUI'

class SceneObj extends Scene {
  constructor ( options ) {
    super()
    const defaultOptions = {
      camera: {
        fov: 45,
        near: 1,
        far: 1000,
        position: new Vector3( 0, 0, 70 )
      },
      renderer: {
        antialias: false,
        alpha: true,
        pixelRatio: Math.max( 1, Math.min( window.devicePixelRatio, 2 ) )
      },
      debug: {
        stats: false,
        orbitControls: false
      },
      postProcessing: {
        active: false
      }
    }

    this.options = { ...defaultOptions, ...options }

    this.container = this.options.container

    this.width = window.innerWidth
    this.height = window.innerHeight

    this.renderer = new WebGLRenderer( this.options.renderer )
    this.renderer.setSize( this.width, this.height )

    this.container.appendChild( this.renderer.domElement )

    this.camera = new PerspectiveCamera( this.options.fov, this.width / this.height, this.options.near, this.options.far )
    this.camera.position.copy( this.options.camera.position )

    if ( this.options.postProcessing.active ) {
      this.initPostProcessing()
    }

    if ( this.options.debug.stats ) {
      this.initStats()
    }

    if ( this.options.debug.orbitControls ) {
      this.initControls()
    }
  }

  initControls () {
    this.controls = new TrackballControls( this.camera, this.renderer.domElement )
    this.controls.rotateSpeed = 2
    this.controls.noZoom = true
    this.controls.noPan = true
    this.target = new Vector3()
    this.camera.lookAt( this.target )
  }

  initStats () {
    this.stats = new Stats()
    this.stats.domElement.style.position = 'absolute'
    this.stats.domElement.style.left = '0px'
    this.stats.domElement.style.top = '0px'
    this.stats.domElement.addEventListener( 'mousedown', ( e ) => {
      e.stopPropagation()
    }, false )

    this.container.appendChild( this.stats.domElement )
  }

  initPostProcessing () {
    this.composer = new EffectComposer( this.renderer )
    const renderPass = new RenderPass( this, this.camera )
    renderPass.renderToScreen = false
    this.composer.addPass( renderPass )

    let passObject
    GUI.panel.addGroup( { label: 'Postprocessing' } )

    this.options.postProcessing.passes.forEach( pass => {
      passObject = pass.constructor()
      if ( pass.active ) this.composer.addPass( passObject )
      if ( pass.gui ) passObject.initGUI()
    } )
    passObject.renderToScreen = true
  }
  render ( dt ) {
    if ( this.options.debug.orbitControls ) {
      this.controls.update()
    }

    if ( this.options.postProcessing.active ) {
      this.composer.render( dt )
    } else {
      this.renderer.render( this, this.camera )
    }

    if ( this.options.debug.stats ) {
      this.stats.update()
    }
  }

  resize ( newWidth, newHeight ) {
    this.camera.aspect = newWidth / newHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize( newWidth, newHeight )
    if ( this.options.debug.orbitControls ) {
      this.controls.handleResize()
    }
    if ( this.composer ) {
      this.composer.setSize( newWidth, newHeight )
    }
  }
}

export default SceneObj
