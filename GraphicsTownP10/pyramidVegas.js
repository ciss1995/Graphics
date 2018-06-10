
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
        [  0, -0.3, 0,  0.4, -1, -1,  -0.4, -1, -1,         
           0, -0.3, 0,  0.4, -1, 1, -0.4, -1, 1, 
           0, -0.3, 0,  0.4, -1, 1,  0.4, -1, -1, 
           0, -0.3, 0,  -0.4, -1, 1,  -0.4, -1, -1]);

    /*var uvs = new Float32Array(
        [  0, 0,   1, 0,   1, 1,   
           0, 1,   1, 0,   1, 1,   
           0, 1,   0, 0,   0, 1,   
           0, 0,   1, 0,   1, 1,
           0, 0,   1, 0,   1, 1,   
           0, 1,   1, 1,   0, 1,   
           0, 0,   1, 0,   1, 1,   
           0, 1,   0, 0,   1, 0 ]);*/

    var uvs = new Float32Array(
        [  0, 0,   1, 0,   1, 1,   
           0, 0,   1, 0,   1, 1,   
           0, 0,   1, 0,   1, 1,   
           0, 0,   1, 0,   1, 1 ]);           

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
    image.src = "data:image/jpeg;base64,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"

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

        gl.drawArrays(gl.TRIANGLES, 0, 12);

        disableLocations(gl, this.attributes);
    }


    var test = new TexturedPlane();
        test.position[1] = 3;
        test.scale = [3, 3];

    grobjects.push(test);

})();