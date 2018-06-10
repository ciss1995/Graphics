
var grobjects = grobjects || [];

(function() {
    "use strict";

    var vertexSource = ""+
        "precision highp float;" +
        "attribute vec3 pos;" +
        "attribute vec3 inColor;" +
        "varying vec3 outColor;" +
        "uniform mat4 view;" +
        "uniform mat4 proj;" +
        "void main(void) {" +
        "  gl_Position = proj * view * vec4(pos, 1.0);" +
        "  outColor = inColor;" +
        "}";
    var fragmentSource = "" +
        "precision highp float;" +
        "varying vec3 outColor;" +
        "void main(void) {" +
        "  gl_FragColor = vec4(outColor, 1.0);" +
        "}";

    var vertexPos = [
        -2.9,  5.6,  0.0,  -3.2,  5.1, -0.3,  -2.6,  5.1, -0.3,
        -2.9,  5.6,  0.0,  -2.6,  5.1,  0.3,  -3.2,  5.1,  0.3,
        -2.9,  5.6,  0.0,  -2.6,  5.1,  0.3,  -2.6,  5.1, -0.3,
        -2.9,  5.6,  0.0,  -3.2,  5.1, -0.3,  -3.2,  5.1,  0.3 ];                    
                               
    // vertex colors
    var vertexColors = [
        1.0, 0.0, 0.6,
        1.0, 0.0, 0.6,
        1.0, 0.0, 0.6,
        0.2, 1.0, 0.4,    
        0.2, 1.0, 0.4,    
        0.2, 1.0, 0.4,
        0.0, 0.5, 1.0,
        0.0, 0.5, 1.0,
        0.0, 0.5, 1.0,
        1.0, 1.0, 0.3,    
        1.0, 1.0, 0.3,    
        1.0, 1.0, 0.3 ];
                  

    var pyramid = {
        name : "pyramid",

        init : function(drawingState) {
            // an abbreviation...
            var gl = drawingState.gl;

            // compile the vertex shader
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader,vertexSource);
            gl.compileShader(vertexShader);
              if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                      alert(gl.getShaderInfoLog(vertexShader));
                      return null;
                  }
            // now compile the fragment shader
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader,fragmentSource);
            gl.compileShader(fragmentShader);
            if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                  alert(gl.getShaderInfoLog(fragmentShader));
                  return null;
            }

            this.shaderProgram = gl.createProgram();
            gl.attachShader(this.shaderProgram, vertexShader);
            gl.attachShader(this.shaderProgram, fragmentShader);
            gl.linkProgram(this.shaderProgram);
            if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
                alert("Could not initialize shaders");
            }

            this.posLoc = gl.getAttribLocation(this.shaderProgram, "pos");
            this.colorLoc = gl.getAttribLocation(this.shaderProgram, "inColor");
            this.projLoc = gl.getUniformLocation(this.shaderProgram,"proj");
            this.viewLoc = gl.getUniformLocation(this.shaderProgram,"view");

            // now to make the buffers for the 4 triangles
            this.posBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);
            this.colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);
        },
        draw : function(drawingState) {
            var gl = drawingState.gl;
            // choose the shader program we have compiled
            gl.useProgram(this.shaderProgram);
            // enable the attributes we had set up
            gl.enableVertexAttribArray(this.posLoc);
            gl.enableVertexAttribArray(this.colorLoc);
            // set the uniforms
            gl.uniformMatrix4fv(this.viewLoc,false,drawingState.view);
            gl.uniformMatrix4fv(this.projLoc,false,drawingState.proj);
            // connect the attributes to the buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.vertexAttribPointer(this.colorLoc, 3, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
            gl.vertexAttribPointer(this.posLoc, 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLES, 0, 12);
        },
        center : function(drawingState) {
            return [0,.5,0];
        },

        shaderProgram : undefined,
        posBuffer : undefined,
        colorBuffer : undefined,
        posLoc : -1,
        colorLoc : -1,
        projLoc : -1,
        viewLoc : -1
    };

     var cube = {
        name : "pyramid",

        init : function(drawingState) {
            // an abbreviation...
            var gl = drawingState.gl;

            // compile the vertex shader
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader,vertexSource);
            gl.compileShader(vertexShader);
              if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                      alert(gl.getShaderInfoLog(vertexShader));
                      return null;
                  }
            // now compile the fragment shader
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader,fragmentSource);
            gl.compileShader(fragmentShader);
            if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                  alert(gl.getShaderInfoLog(fragmentShader));
                  return null;
            }

            this.shaderProgram = gl.createProgram();
            gl.attachShader(this.shaderProgram, vertexShader);
            gl.attachShader(this.shaderProgram, fragmentShader);
            gl.linkProgram(this.shaderProgram);
            if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
                alert("Could not initialize shaders");
            }

            this.posLoc = gl.getAttribLocation(this.shaderProgram, "pos");
            this.colorLoc = gl.getAttribLocation(this.shaderProgram, "inColor");
            this.projLoc = gl.getUniformLocation(this.shaderProgram,"proj");
            this.viewLoc = gl.getUniformLocation(this.shaderProgram,"view");

            // now to make the buffers for the 4 triangles
            this.posBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);
            this.colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);
        },
        draw : function(drawingState) {
            var gl = drawingState.gl;
            // choose the shader program we have compiled
            gl.useProgram(this.shaderProgram);
            // enable the attributes we had set up
            gl.enableVertexAttribArray(this.posLoc);
            gl.enableVertexAttribArray(this.colorLoc);
            // set the uniforms
            gl.uniformMatrix4fv(this.viewLoc,false,drawingState.view);
            gl.uniformMatrix4fv(this.projLoc,false,drawingState.proj);
            // connect the attributes to the buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.vertexAttribPointer(this.colorLoc, 3, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
            gl.vertexAttribPointer(this.posLoc, 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLES, 0, 12);
        },
        center : function(drawingState) {
            return [0,.5,0];
        },

        shaderProgram : undefined,
        posBuffer : undefined,
        colorBuffer : undefined,
        posLoc : -1,
        colorLoc : -1,
        projLoc : -1,
        viewLoc : -1
    };   


    grobjects.push(pyramid);
    //grobjects.push(cube);
})();