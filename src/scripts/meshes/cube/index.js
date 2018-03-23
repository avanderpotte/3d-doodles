import { Mesh, Object3D, BoxGeometry, Color, ShaderMaterial } from 'three'
import glslify from 'glslify'
import fragmentShader from './shader/frag.glsl'
import vertexShader from './shader/vert.glsl'
import GUI from 'Utils/GUI'

class Cube extends Object3D {
  constructor () {
    super()
    const geometry = new BoxGeometry( 2, 2, 2 )
    this.colors = {
      primary: '#EF6853',
      secondary: '#F7904A'
    }
    this.uniforms = {
      uTime: { value: 0 },
      uColorPrimary: { value: new Color( this.colors.primary ) },
      uColorSecondary: { value: new Color( this.colors.secondary ) }
    }
    const material = new ShaderMaterial( {
      uniforms: this.uniforms,
      fragmentShader: glslify( fragmentShader ),
      vertexShader: glslify( vertexShader )
    } )

    this.mesh = new Mesh( geometry, material )
    this.add( this.mesh )

    this.initGUI()
  }

  initGUI () {
    this.rotation.range = [ -Math.PI, Math.PI ]
    GUI.panel
      .addGroup( { label: 'Cube' } )
        .addSlider( this.rotation, 'x', 'range', { label: 'rX' } )
        .addColor( this.colors, 'primary', { colorMode: 'hex', label: 'Primary Color', onChange: ( v ) => { this.uniforms.uColorPrimary.value = new Color( v ) } } )
        .addColor( this.colors, 'secondary', { colorMode: 'hex', label: 'Secondary Color', onChange: ( v ) => { this.uniforms.uColorSecondary.value = new Color( v ) } } )
  }

  update = ( dt ) => {
    this.uniforms.uTime.value += dt * 0.001
  }
}

export default Cube
