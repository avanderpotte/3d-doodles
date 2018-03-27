uniform float uTime;
uniform vec3 uColor;

varying vec3 vNormal;
varying vec3 vViewPos;

vec3 faceNormal(vec3 pos) {
  vec3 fdx = dFdx(pos);
  vec3 fdy = dFdy(pos);
  return normalize(cross(fdx, fdy));
}

void main() {
  vec3 normal = vNormal;
  normal = faceNormal(vViewPos);
  float diffuse = normal.y * 0.5 + 1.;
  vec3 color = uColor;
  color *= diffuse;
  gl_FragColor = vec4( color, 1.0 );
}