export const fragShader = `
    uniform sampler2D texture1;
    uniform sampler2D textures[4];
    
    varying vec2 textureColour;
    varying vec2 fakeClouds;
    
    float exposure = 1.5;
    float luminosity = 0.1;
    float fakeCloudDensity = 0.4;
    
    void main() {   
        vec3 color = texture2D(textures[0], textureColour).rgb * exposure + vec3(luminosity);
        color = mix(color, texture2D(textures[1], fakeClouds).rgb, fakeCloudDensity);
        gl_FragColor = vec4(color, 1.0);
    }
`;

export const vertexShader = `
    varying vec2 textureColour;
    varying vec2 fakeClouds;
    
    uniform float delta;
    
    void main() {
        textureColour = uv;
        fakeClouds = uv;
        vec3 temp = position; 
        
        float rippleEffect = 600.0;
        
        fakeClouds.x += delta / (rippleEffect*30.0);
        fakeClouds.y += delta / (rippleEffect*20.0);
        
        vec4 mvPosition = modelViewMatrix * vec4(temp, 1.0);
        gl_Position = projectionMatrix * mvPosition;
    }
`;
