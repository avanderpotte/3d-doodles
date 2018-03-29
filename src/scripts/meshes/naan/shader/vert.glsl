
#pragma glslify: pnoise3 = require(glsl-noise/periodic/3d)
#pragma glslify: ease = require(glsl-easings/sine-out)

#define PHONG

uniform float uTime;
uniform sampler2D uBumpMap;
uniform float uScale;

varying vec3 vViewPosition;

#ifndef FLAT_SHADED

	varying vec3 vNormal;

#endif

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>

#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED

	vNormal = normalize( transformedNormal );

#endif

	#include <begin_vertex>
  vec2 center = vec2( 0.5, 0.5 );
  float scale = length( uv - center );
  float displacement = 3. * pnoise3( scale * 0.08 * transformed + uTime, vec3( 0.0, 0.70, 0.0 )) * ease( uScale );
  float bumpScale = texture2D( uBumpMap, uv ).r;
  transformed += normal * exp( bumpScale );
  transformed += normal * exp( displacement );
  transformed.z *= 0.3;
  transformed *= 1.0 + ease( uScale * 0.5 );
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}