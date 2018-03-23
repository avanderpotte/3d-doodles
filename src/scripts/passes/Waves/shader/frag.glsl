uniform sampler2D uDiffuse;
uniform float uTime;
uniform float uSpeed;
uniform float uInfluence;
uniform float uDistortion;

varying vec2 vUv;

void main() {
  vec2 wavedUv = vUv;
  wavedUv.x += sin( vUv.y * uInfluence + uTime * uSpeed ) * uDistortion;
  vec4 color = texture2D( uDiffuse, wavedUv );
  gl_FragColor = color;
}