import { Mesh, Object3D, BoxBufferGeometry, Color, ShaderMaterial, FlatShading } from 'three'
import glslify from 'glslify'
import fragmentShader from './shader/frag.glsl'
import vertexShader from './shader/vert.glsl'
import GUI from 'Utils/GUI'

class Cube extends Object3D {
  constructor () {
    super()
    const geometry = new BoxBufferGeometry( 20, 20, 20, 64, 64, 64 )
    this.uniforms = {
      uTime: { value: 0 },
      uColor: { value: new Color( '#19CBE2' ) },
      uShift: { value: 4, range: [ 0, 10 ] }
    }
    const material = new ShaderMaterial( {
      uniforms: this.uniforms,
      fragmentShader: glslify( fragmentShader ),
      vertexShader: glslify( vertexShader ),
      flatShading: FlatShading,
      transparent: true
    } )

    this.mesh = new Mesh( geometry, material )
    this.add( this.mesh )

    this.initGUI()
  }

  initGUI () {
    this.rotation.range = [ -Math.PI, Math.PI ]
    GUI.panel
      .addGroup( { label: 'Cube' } )
        .addSlider( this.uniforms.uShift, 'value', 'range', { label: 'shift', step: 0.01 } )
  }

  update = ( dt ) => {
    this.uniforms.uTime.value += dt * 0.001
  }
}

export default Cube
