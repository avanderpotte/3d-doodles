import '../styles/app.styl'
import { TweenMax } from 'gsap'
import { AmbientLight, DirectionalLight, Color } from 'three'
import SceneObj from './core/scene'
import Naan from './meshes/naan'
import Config from 'Config'
import GUI from 'Utils/GUI'

class App {
  constructor ( container ) {
    this.scene = new SceneObj( {
      container: container,
      ...Config
    } )

    this.container = container

    this.DELTA_TIME = 0
    this.LAST_TIME = Date.now()

    this.initMeshes()
    this.initLights()
    // this.initGUI()
    this.addListeners()
  }

  initMeshes () {
    this.naan = new Naan()
    this.scene.add( this.naan )
  }

  initLights () {
    this.lightsColors = {
      ambient: '#bababa',
      directionnal: '#cf9c88'
    }

    this.ambientLight = new AmbientLight( this.lightsColors.ambient )

    this.directionnalLightTop = new DirectionalLight( this.lightsColors.directionnal, 0.3 )
    this.directionnalLightTop.position.set( 20, 20, 30 )

    this.scene.add( this.ambientLight )
    this.scene.add( this.directionnalLightTop )
  }

  initGUI () {
    GUI.panel
      .addGroup( { label: 'Lights' } )
        .addColor( this.lightsColors, 'ambient', { colorMode: 'hex', label: 'Ambient Color', onChange: ( v ) => { this.ambientLight.color = new Color( v ) } } )
        .addColor( this.lightsColors, 'directionnal', { colorMode: 'hex', label: 'Directionnal Color', onChange: ( v ) => { this.directionnalLightTop.color = new Color( v ) } } )
        // .addColor( this.lightsColors, 'directionnalBottom', { colorMode: 'hex', label: 'Directionnal Color', onChange: ( v ) => { this.directionnalLightBottom.color = new Color( v ) } } )
  }

  addListeners () {
    this.scene.renderer.domElement.addEventListener( 'mousedown', this.onMouseDown )
    this.scene.renderer.domElement.addEventListener( 'mouseup', this.onMouseUp )
    this.scene.renderer.domElement.addEventListener( 'touchstart', this.onMouseDown )
    this.scene.renderer.domElement.addEventListener( 'touchend', this.onMouseUp )
    window.addEventListener( 'resize', this.onResize )
    TweenMax.ticker.addEventListener( 'tick', this.update )
  }

  onMouseDown = () => {
    console.log( 'mousedown' )
    if ( this.naan ) this.naan.onMouseDown()
  }

  onMouseUp = () => {
    if ( this.naan ) this.naan.onMouseUp()
  }

  update = () => {
    this.DELTA_TIME = Date.now() - this.LAST_TIME
    this.LAST_TIME = Date.now()

    this.naan.update( this.DELTA_TIME )

    this.scene.render( this.DELTA_TIME )
  }

  onResize = () => {
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.scene.resize( this.width, this.height )
  }
}

export default App
