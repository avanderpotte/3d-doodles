import { Mesh, Object3D, SphereGeometry, TextureLoader } from 'three'
import NaanMaterial from './NaanMaterial'
import { TweenMax, TimelineMax } from 'gsap'

class Naan extends Object3D {
  constructor () {
    super()
    const geometry = new SphereGeometry( 10, 128, 128 )
    const faceVertexUvs = geometry.faceVertexUvs[ 0 ]
    for ( let i = 0; i < faceVertexUvs.length; i++ ) {
      const uvs = faceVertexUvs[ i ]
      const face = geometry.faces[ i ]
      for ( let j = 0; j < 3; j++ ) {
        uvs[ j ].x = face.vertexNormals[ j ].x * 0.5 + 0.5
        uvs[ j ].y = face.vertexNormals[ j ].y * 0.5 + 0.5
      }
    }

    this.material = new NaanMaterial( {
      color: 0xf3d4a2,
      shininess: 10,
      specular: 0x945935,
      normalMap: new TextureLoader().load( 'bumpNormal.jpg' )
    } )
    this.mesh = new Mesh( geometry, this.material )
    this.mesh.rotation.x = -Math.PI / 6
    // this.mesh.rotation.y = -Math.PI / 8
    this.add( this.mesh )

    this.mouseDownProgress = 0
    this.mouseDownTl = new TimelineMax( { paused: true } )
    this.mouseDownTl.to( this.material.uniforms.uScale, 1, { value: 1 } )
  }

  onMouseDown () {
    TweenMax.to( this, 1, { mouseDownProgress: 1, onUpdate: () => {
      this.mouseDownTl.progress( this.mouseDownProgress )
    } } )
  }

  onMouseUp () {
    TweenMax.to( this, 0.3, { mouseDownProgress: 0, onUpdate: () => {
      this.mouseDownTl.progress( this.mouseDownProgress )
    } } )
  }

  update = ( dt ) => {
    this.material.update( dt )
  }
}

export default Naan
