export const fragShader = `
    uniform sampler2D texture1;
    uniform sampler2D textures[4];
    
    varying vec2 vUv;
    varying vec2 cloudUV;
    
    void main() {
      float contrast = 1.5;
      float brightness = 0.1;
      vec3 color = texture2D(textures[0], vUv).rgb * contrast + vec3(brightness);
      color = mix(color, texture2D(textures[1], cloudUV).rgb, 0.4);
      gl_FragColor = vec4(color, 1.0);
    }
`;

export const vertexShader = `
    varying vec2 vUv;
    varying vec2 cloudUV;
    
    uniform float iTime;
    
    void main() {
      vUv = uv;
      cloudUV = uv;
      
      float waveSize = 10.0;
      float tipDistance = 0.3;
      float centerDistance = 0.1;
      
      vec3 cpos = position;
      
      if (color.x > 0.6) {
        cpos.x += sin((iTime / 500.0) + (uv.x * waveSize)) * tipDistance;
      } else if (color.x > 0.0) {
        cpos.x += sin((iTime / 500.0) + (uv.x * waveSize)) * centerDistance;
      }
      
      float diff = position.x - cpos.x;
      cloudUV.x += iTime / 20000.0;
      cloudUV.y += iTime / 10000.0;
      
      vec4 mvPosition = modelViewMatrix * vec4(cpos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
    }
`;
