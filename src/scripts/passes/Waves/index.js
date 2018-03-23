import { Pass } from 'postprocessing'
import { ShaderMaterial } from 'three'
import fragmentShader from './shader/frag.glsl'
import vertexShader from './shader/vert.glsl'
import glslify from 'glslify'
import GUI from 'Utils/GUI'

export default class WavesPass extends Pass {
  constructor () {
    super()
    this.name = 'WavesPass'
    this.needsSwap = true
    this.settings = {}
    this.uniforms = {
      uDiffuse: { value: null },
      uTime: { value: 0 },
      uSpeed: { value: 0.005, range: [ 0.001, 0.05 ] },
      uDistortion: { value: 0.05, range: [ 0.005, 0.2 ] },
      uInfluence: { value: 100, range: [ 1, 200 ] }
    }
    this.material = new ShaderMaterial( {
      uniforms: this.uniforms,
      transparent: true,
      opacity: 0.5,
      fragmentShader: glslify( fragmentShader ),
      vertexShader: glslify( vertexShader ),
      depthWrite: false,
      depthTest: false
    } )
    this.quad.material = this.material
  }
  initGUI () {
    GUI.panel
      .addSubGroup( { label: this.name } )
        .addSlider( this.uniforms.uSpeed, 'value', 'range', { label: 'Speed', step: 0.01, dp: 3 } )
        .addSlider( this.uniforms.uDistortion, 'value', 'range', { label: 'Distortion', step: 0.01, dp: 3 } )
        .addSlider( this.uniforms.uInfluence, 'value', 'range', { label: 'Influence', step: 1 } )
  }
  render = ( renderer, readBuffer, writeBuffer, delta ) => {
    this.uniforms.uTime.value += delta
    this.uniforms.uDiffuse.value = readBuffer.texture
    renderer.render( this.scene, this.camera, this.renderToScreen ? null : readBuffer )
  }
}
