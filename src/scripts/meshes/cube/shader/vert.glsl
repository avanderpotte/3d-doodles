uniform float uTime;
uniform float uShift;


varying vec3 vNormal;
varying vec3 vViewPos;

#define PI 3.14159265358979323846264

float stripes( float x, float f ) {
  float t = 1.0 + 0.5 * sin( f * 2.0 * PI * x );
  return t * t - .5;
}

void main() {
  vNormal = normal;
  // vPosition = position;
  vec3 newPos = position;
  float s1 = cos( newPos.x + uTime );
  float s2 = cos( newPos.x + uShift + uTime );
  float s3 = -sign(s1 * s2);
  float stripeCoeff = stripes( position.x + uTime, uShift);
  float scaleCoeff = 0.9 + sin(uv.x * PI);
  float coeff = stripeCoeff >= 0.0 ? 1.0 : 0.0;
  newPos *= coeff;
  
  
  vec4 mpos = modelViewMatrix * vec4( newPos, 1.0 );
  vViewPos = -mpos.xyz;

  gl_Position = projectionMatrix * mpos; 
}