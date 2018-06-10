var grobjects = grobjects || [];

var Cube = undefined;
var SpinningCube = undefined;

(function() {
    "use strict";
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Cubes
    Cube = function Cube(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
    }
    Cube.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5, .5,-.5,        -.5,-.5,-.5,  .5, .5,-.5, -.5, .5,-.5,    
                    -.5,-.5, .5,  .5,-.5, .5,  .5, .5, .5,        -.5,-.5, .5,  .5, .5, .5, -.5, .5, .5,    
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5,-.5, .5,        -.5,-.5,-.5,  .5,-.5, .5, -.5,-.5, .5,    
                    -.5, .5,-.5,  .5, .5,-.5,  .5, .5, .5,        -.5, .5,-.5,  .5, .5, .5, -.5, .5, .5,    
                    -.5,-.5,-.5, -.5, .5,-.5, -.5, .5, .5,        -.5,-.5,-.5, -.5, .5, .5, -.5,-.5, .5,    
                     .5,-.5,-.5,  .5, .5,-.5,  .5, .5, .5,         .5,-.5,-.5,  .5, .5, .5,  .5,-.5, .5     
                ] },
                vnormal : {numComponents:3, data: [
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
                ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }
    };

    Cube.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Cube.prototype.center = function(drawingState) {
        return this.position;
    }

    // constructor for Cubes
    SpinningCube = function SpinningCube(name, position, size, color, axis) {
        Cube.apply(this,arguments);
        this.axis = axis || 'X';
    }
    SpinningCube.prototype = Object.create(Cube.prototype);
    SpinningCube.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        var theta = Number(drawingState.realtime)/200.0;
        if (this.axis == 'X') {
            twgl.m4.rotateX(modelM, theta, modelM);
        } else if (this.axis == 'Z') {
            twgl.m4.rotateZ(modelM, theta, modelM);
        } else {
            twgl.m4.rotateY(modelM, theta, modelM);
        }
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    SpinningCube.prototype.center = function(drawingState) {
        return this.position;
    }


})();

//Hotel building 
//From left to right 
grobjects.push(new Cube("cube4",[ 1.7,0.3, 0],0.6, [0.6,0.0,0.4]));
grobjects.push(new Cube("cube4",[ 1.7,0.9, 0],0.6, [0.5,0.0,0.5]));
grobjects.push(new Cube("cube4",[ 1.7,1.5, 0],0.6, [0.4,0.0,0.6]));
grobjects.push(new Cube("cube4",[ 1.7,2.1, 0],0.6, [0.3,0.0,0.7]));

grobjects.push(new Cube("cube4",[ 2.3,0.3, 0],0.6, [0.6,0.1,0.4]));
grobjects.push(new Cube("cube4",[ 2.3,0.9, 0],0.6, [0.5,0.1,0.5]));
grobjects.push(new Cube("cube4",[ 2.3,1.5, 0],0.6, [0.4,0.1,0.6]));
grobjects.push(new Cube("cube4",[ 2.3,2.1, 0],0.6, [0.3,0.1,0.7]));

grobjects.push(new Cube("cube4",[ 2.9,0.3, 0],0.6));
grobjects.push(new Cube("cube4",[ 2.9,0.9, 0],0.6));
grobjects.push(new Cube("cube4",[ 2.9,1.5, 0],0.6));
grobjects.push(new Cube("cube4",[ 2.9,2.1, 0],0.6, [0.3,0.2,0.7]));

grobjects.push(new Cube("cube4",[ 3.5,0.3, 0],0.6, [0.6,0.3,0.4]));
grobjects.push(new Cube("cube4",[ 3.5,0.9, 0],0.6, [0.5,0.3,0.5]));
grobjects.push(new Cube("cube4",[ 3.5,1.5, 0],0.6, [0.4,0.3,0.6]));
grobjects.push(new Cube("cube4",[ 3.5,2.1, 0],0.6, [0.3,0.3,0.7]));

grobjects.push(new Cube("cube4",[ 4.1,0.3, 0],0.6, [0.6,0.4,0.4]));
grobjects.push(new Cube("cube4",[ 4.1,0.9, 0],0.6, [0.6,0.4,0.5]));
grobjects.push(new Cube("cube4",[ 4.1,1.5, 0],0.6, [0.6,0.4,0.6]));
grobjects.push(new Cube("cube4",[ 4.1,2.1, 0],0.6, [0.6,0.4,0.7]));

//From Front to back 
grobjects.push(new Cube("cube4",[ 2.9,0.3, -1.2],0.6, [0.6,0.5,0.4]));
grobjects.push(new Cube("cube4",[ 2.9,0.9, -1.2],0.6, [0.5,0.5,0.5]));
grobjects.push(new Cube("cube4",[ 2.9,1.5, -1.2],0.6, [0.4,0.5,0.6]));
grobjects.push(new Cube("cube4",[ 2.9,2.1, -1.2],0.6, [0.3,0.5,0.7]));

grobjects.push(new Cube("cube4",[ 2.9,0.3, -0.6],0.6, [0.6,0.6,0.4]));
grobjects.push(new Cube("cube4",[ 2.9,0.9, -0.6],0.6, [0.5,0.6,0.5]));
grobjects.push(new Cube("cube4",[ 2.9,1.5, -0.6],0.6, [0.4,0.6,0.6]));
grobjects.push(new Cube("cube4",[ 2.9,2.1, -0.6],0.6, [0.3,0.6,0.7]));

grobjects.push(new Cube("cube4",[ 2.9,0.3, 0.6],0.6, [0.6,0.7,0.4]));
grobjects.push(new Cube("cube4",[ 2.9,0.9, 0.6],0.6, [0.5,0.7,0.5]));
grobjects.push(new Cube("cube4",[ 2.9,1.5, 0.6],0.6, [0.4,0.7,0.6]));
grobjects.push(new Cube("cube4",[ 2.9,2.1, 0.6],0.6, [0.3,0.7,0.7]));

grobjects.push(new Cube("cube4",[ 2.9,0.3, 1.2],0.6, [0.6,0.8,0.4]));
grobjects.push(new Cube("cube4",[ 2.9,0.9, 1.2],0.6, [0.5,0.8,0.5]));
grobjects.push(new Cube("cube4",[ 2.9,1.5, 1.2],0.6, [0.4,0.8,0.6]));
grobjects.push(new Cube("cube4",[ 2.9,2.1, 1.2],0.6, [0.3,0.8,0.7]));

grobjects.push(new SpinningCube("cube4",[ 2.9,2.8, 0],0.7, [0.7,0.4,0.8], 'X'));
