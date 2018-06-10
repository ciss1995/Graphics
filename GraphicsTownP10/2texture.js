
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
        "uniform sampler2D uTexture2;" +
        "void main(void) {" +
        "vec4 texColor1 = texture2D(uTexture,fTexCoord);"+
        "vec4 texColor2 = texture2D(uTexture2,fTexCoord);"+
        "  gl_FragColor = vec4(0.8*texColor1.xyz+0.6*texColor2.xyz,texColor1.a);" +
        "}";

    var vertices = new Float32Array(
        [   0.4, 1.5, -2,  -0.4, 1.5, -2,  -0.4, -1, -2,   
           -0.4,  -1, -2,   0.4, 1.5, -2,   0.4, -1, -2, 

           0.4, 1.5,-3.8,   0.4, 1.5,-2,    0.4, -1, -2, 
           0.4,  -1,  -2,   0.4, 1.5,-3.8,  0.4, -1, -3.8, 
              
        
           -0.4, 1.5, -3.8,   -0.4, 1.5,-2,     -0.4, -1, -2,
           -0.4,-1,  -2,      -0.4, 1.5,-3.8,   -0.4, -1, -3.8,

            0.4, 1.5, -2,    -0.4, 1.5, -2,  -0.4, 1.5, -3.8,
           -0.4, 1.5, -3.8,   0.4, 1.5, -2,   0.4, 1.5, -3.8,           

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
    image.src = "data:image/jpeg;base64,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"    
    var image2 = new Image();
    image2.src = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBxdWFsaXR5ID0gNjAK/9sAQwANCQoLCggNCwoLDg4NDxMgFRMSEhMnHB4XIC4pMTAuKS0sMzpKPjM2RjcsLUBXQUZMTlJTUjI+WmFaUGBKUVJP/9sAQwEODg4TERMmFRUmTzUtNU9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09P/8AAEQgBAAEAAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A6aiiivmj1gooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q=="   
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
                if(flipY){
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        }
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
        this.texture2 = null;
    }

    //Initialized
    TexturedPlane.prototype.init = function (drawingState) {
        var gl = drawingState.gl;

        this.program = createGLProgram(gl, vertexSource, fragmentSource);
        this.attributes = findAttribLocations(gl, this.program, ["aPosition", "aTexCoord"]);
        this.uniforms = findUniformLocations(gl, this.program, ["pMatrix", "vMatrix", "mMatrix", "uTexture", "uTexture2"]);

        this.texture = createGLTexture(gl, image, true);
        this.texture2 = createGLTexture(gl, image2, true);

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
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.texture2);
        gl.uniform1i(this.uniforms.uTexture2, 1);

        enableLocations(gl, this.attributes)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[0]);
        gl.vertexAttribPointer(this.attributes.aPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[1]);
        gl.vertexAttribPointer(this.attributes.aTexCoord, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 30);

        disableLocations(gl, this.attributes);
    }


    var test = new TexturedPlane();
        test.position[1] = 2;
        test.position[0] = 3;
        test.scale = [2, 2];

    grobjects.push(test);

})();