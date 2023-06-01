uniform sampler2D bloomTexture;
varying vec2 vUv;

void main() {
  vec4 bloom = texture2D(bloomTexture, vUv);

  gl_FragColor = bloom;
}