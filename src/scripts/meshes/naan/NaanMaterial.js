import { MeshPhongMaterial, ShaderLib, TextureLoader } from 'three'
import fragmentShader from './shader/frag.glsl'
import vertexShader from './shader/vert.glsl'
import glslify from 'glslify'

class NaanMaterial extends MeshPhongMaterial {
  constructor ( props ) {
    super( props )
    this.uniforms = {
      uTime: { value: 0.0 },
      uBumpMap: { value: new TextureLoader().load( 'bumpMap.jpg' ) },
      uScale: { value: 0.0 },
      ...ShaderLib.phong.uniforms
    }
    this.type = 'ShaderMaterial'
    this.isMeshPhongMaterial = true
    this.vertexShader = glslify( vertexShader )
    this.fragmentShader = glslify( fragmentShader )
  }

  update ( time ) {
    this.uniforms.uTime.value += time * 0.001
  }
}

export default NaanMaterial
