uniform float uTime;
uniform vec3 uColorPrimary;
uniform vec3 uColorSecondary;

varying vec2 vUv;

void main() {
  vec2 center = vec2( 0.5, 0.5 );
  vec3 color = mix( uColorPrimary, uColorSecondary, length( vUv - center ) * abs( sin( uTime ) ) );
  gl_FragColor = vec4( color, 1.0 );
}