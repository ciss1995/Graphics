
var grobjects = grobjects || [];


(function() {
    "use strict";

    var vertexSource = ""+
        "precision highp float;" +
        "attribute vec3 aPosition;" +
        "attribute vec2 aTexCoord;" +
        "varying vec2 vTexCoord;" +
        "varying vec2 fTexCoord;" +        
        "uniform mat4 pMatrix;" +
        "uniform mat4 vMatrix;" +
        "uniform mat4 mMatrix;" +
        "void main(void) {" +
        "  gl_Position = pMatrix * vMatrix * mMatrix * vec4(aPosition, 1.0);" +
        "  vTexCoord = aTexCoord;" +
        "  fTexCoord = vTexCoord;" +
        "}";

    var fragmentSource = "" +
        "precision highp float;" +
        "varying vec2 vTexCoord;" +
        "varying vec2 fTexCoord;" +        
        "uniform sampler2D uTexture;" +
        "void main(void) {" +
        "  gl_FragColor = texture2D(uTexture, vTexCoord);" +
        "}";

    var vertices = new Float32Array(
        [   0.4, 1.5, -3,  -0.4, 1.5, -3,  -0.4, -1, -3,   
           -0.4,  -1, -3,   0.4, 1.5, -3,   0.4, -1, -3, 

           0.4, 1.5,-3.8,   0.4, 1.5,-3,    0.4, -1, -3, 
           0.4,  -1,  -3,   0.4, 1.5,-3.8,  0.4, -1, -3.8, 
              
        
           -0.4, 1.5, -3.8,   -0.4, 1.5,-3,     -0.4, -1, -3,
           -0.4,-1,  -3,      -0.4, 1.5,-3.8,   -0.4, -1, -3.8,

            0.4, 1.5, -3,    -0.4, 1.5, -3,  -0.4, 1.5, -3.8,
           -0.4, 1.5, -3.8,   0.4, 1.5, -3,   0.4, 1.5, -3.8,           

            0.4, 1.5, -3.8,  -0.4, 1.5, -3.8,  -0.4,-1, -3.8,   
           -0.4,-1, -3.8,     0.4, 1.5, -3.8,   0.4, -1, -3.8 ]);

    var uvs = new Float32Array(
        [  0, 0,   1, 0,   1, 1,   
           0, 1,   1, 0,   1, 1,   
           0, 0,   1, 0,   1, 1,   
           0, 1,   1, 0,   1, 1,
           0, 0,   1, 0,   1, 1,   
           0, 1,   1, 0,   1, 1,   
           0, 0,   1, 0,   1, 1,
           0, 1,   1, 0,   1, 1,   
           0, 0,   1, 0,   1, 1,   
           0, 1,   1, 0,   1, 1 ]);           

    var triangleIndices = new Uint8Array(
        [  0, 1, 2,   0, 2, 3,    // front
           4, 5, 6,   4, 6, 7,    // right
           8, 9,10,   8,10,11,    // top
          12,13,14,  12,14,15,    // left
          16,17,18,  16,18,19,    // bottom
          20,21,22,  20,22,23 ]);  

    //Compile shader 
    var createGLShader = function (gl, type, src) {
        var shader = gl.createShader(type)
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            console.log("warning: shader failed to compile!")
            console.log(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    var image = new Image();
    image.src = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD/4QPmaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49J++7vycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCc/Pgo8eDp4bXBtZXRhIHhtbG5zOng9J2Fkb2JlOm5zOm1ldGEvJyB4OnhtcHRrPSdJbWFnZTo6RXhpZlRvb2wgMTAuNDAnPgo8cmRmOlJERiB4bWxuczpyZGY9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMnPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6R2V0dHlJbWFnZXNHSUZUPSdodHRwOi8veG1wLmdldHR5aW1hZ2VzLmNvbS9naWZ0LzEuMC8nPgogIDxHZXR0eUltYWdlc0dJRlQ6QXNzZXRJRD41MDE2MzEzMzA8L0dldHR5SW1hZ2VzR0lGVDpBc3NldElEPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpkYz0naHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8nPgogIDxkYzpjcmVhdG9yPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGk+bm9wcGFkb25fc2FuZ3BlYW08L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvZGM6Y3JlYXRvcj4KICA8ZGM6ZGVzY3JpcHRpb24+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5TYW5kc3RvbmUgdGV4dHVyZSAsIGRldGFpbGVkIHN0cnVjdHVyZSBvZiBzYW5kc3RvbmUgIGZvciBiYWNrZ3JvdW5kIGFuZCBkZXNpZ24uPC9yZGY6bGk+CiAgIDwvcmRmOkFsdD4KICA8L2RjOmRlc2NyaXB0aW9uPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpwaG90b3Nob3A9J2h0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8nPgogIDxwaG90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"

    //Attach the shaders and link 
    var createGLProgram = function (gl, vSrc, fSrc) {
        var program = gl.createProgram();
        var vShader = createGLShader(gl, gl.VERTEX_SHADER, vSrc);
        var fShader = createGLShader(gl, gl.FRAGMENT_SHADER, fSrc);
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
            console.log("warning: program failed to link");
            return null;
        }
        return program;
    }

    //creates a gl buffer and unbinds it when done. 
    var createGLBuffer = function (gl, data, usage) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        buffer.numItems = 24;
        return buffer;
    }

    //Pass it positionsas an attribute
    var findAttribLocations = function (gl, program, attributes) {
        var out = {};
        for(var i = 0; i < attributes.length;i++){
            var attrib = attributes[i];
            out[attrib] = gl.getAttribLocation(program, attrib);
        }
        return out;
    }

    //Access to unfirm matrix
    var findUniformLocations = function (gl, program, uniforms) {
        var out = {};
        for(var i = 0; i < uniforms.length;i++){
            var uniform = uniforms[i];
            out[uniform] = gl.getUniformLocation(program, uniform);
        }
        return out;
    }


    var enableLocations = function (gl, attributes) {
        for(var key in attributes){
            var location = attributes[key];
            gl.enableVertexAttribArray(location);
        }
    }

    var disableLocations = function (gl, attributes) {
        for(var key in attributes){
            var location = attributes[key];
            gl.disableVertexAttribArray(location);
        }
    }

    var createGLTexture = function (gl, image, flipY) {
        var texture = gl.createTexture();
        /*        if(flipY){
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        }*/
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,  gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

     var TexturedPlane = function () {
        this.name = "TexturedPlane"
        this.position = new Float32Array([0, 0, 0]);
        this.scale = new Float32Array([1, 1]);
        this.program = null;
        this.attributes = null;
        this.uniforms = null;
        this.buffers = [null, null]
        this.texture = null;
    }

    //Initialized
    TexturedPlane.prototype.init = function (drawingState) {
        var gl = drawingState.gl;

        this.program = createGLProgram(gl, vertexSource, fragmentSource);
        this.attributes = findAttribLocations(gl, this.program, ["aPosition", "aTexCoord"]);
        this.uniforms = findUniformLocations(gl, this.program, ["pMatrix", "vMatrix", "mMatrix", "uTexture"]);

        this.texture = createGLTexture(gl, image, true);

        this.buffers[0] = createGLBuffer(gl, vertices, gl.STATIC_DRAW);
        this.buffers[2] = createGLBuffer(gl, triangleIndices, gl.STATIC_DRAW);
        this.buffers[1] = createGLBuffer(gl, uvs, gl.STATIC_DRAW);
    }

    TexturedPlane.prototype.center = function () {
        return this.position;
    }

    TexturedPlane.prototype.draw = function (drawingState) {
        var gl = drawingState.gl;

        gl.useProgram(this.program);
        gl.disable(gl.CULL_FACE);

        var modelM = twgl.m4.scaling([this.scale[0],this.scale[1], 1]);
        twgl.m4.setTranslation(modelM,this.position, modelM);

        gl.uniformMatrix4fv(this.uniforms.pMatrix, gl.FALSE, drawingState.proj);
        gl.uniformMatrix4fv(this.uniforms.vMatrix, gl.FALSE, drawingState.view);
        gl.uniformMatrix4fv(this.uniforms.mMatrix, gl.FALSE, modelM);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(this.uniforms.uTexture, 0);

        enableLocations(gl, this.attributes)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[0]);
        gl.vertexAttribPointer(this.attributes.aPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[1]);
        gl.vertexAttribPointer(this.attributes.aTexCoord, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 30);

        disableLocations(gl, this.attributes);
    }


    var test = new TexturedPlane();
        test.position[1] = 3;
        test.scale = [3, 3];

    grobjects.push(test);

})();