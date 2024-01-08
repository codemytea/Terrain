export const fragShader = `
    // Uniforms representing texture samples
    uniform sampler2D texture1;
    uniform sampler2D textures[4];
    
    // Varying variables passed from the vertex shader
    varying vec2 textureColour;
    varying vec2 fakeClouds;
    
    // Adjustment parameters for color and clouds
    float exposure = 1.5;
    float luminosity = 0.1;
    float fakeCloudDensity = 0.4;
    
    void main() {   
        // Sample the base texture and apply exposure and luminosity adjustments
        vec3 color = texture2D(textures[0], textureColour).rgb * exposure + vec3(luminosity);
        
        // Mix the color with fake clouds texture based on density
        color = mix(color, texture2D(textures[1], fakeClouds).rgb, fakeCloudDensity);
        
        // Set the final fragment color with alpha value 1.0
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
        
        // Update fake clouds UV coordinates based on time delta
        fakeClouds.x += delta / (rippleEffect*30.0);
        fakeClouds.y += delta / (rippleEffect*20.0);
        
        // Transform the vertex position using model-view and projection matrices
        vec4 mvPosition = modelViewMatrix * vec4(temp, 1.0);
        gl_Position = projectionMatrix * mvPosition;
    }
`;
