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

//Effel Tower
//Front right
grobjects.push(new Cube("cube4",[ 1.2,0.2, 4],0.3 ,[1,0,0]));
grobjects.push(new Cube("cube3",[ 1.0, 0.4, 3.8],0.3 , [1,0,0]));
grobjects.push(new Cube("cube5",[ 0.8,0.6, 3.6],0.3,[1,0,0]));
grobjects.push(new Cube("cube6",[ 0.6,0.8, 3.4],0.3,[1,0,0]));

//Front Left 
grobjects.push(new Cube("cube7",[ -1.2,0.2, 4],0.3,[1,0,0]));
grobjects.push(new Cube("cube8",[ -1.0, 0.4, 3.8],0.3,[1,0,0]));
grobjects.push(new Cube("cube9",[ -0.8,0.6, 3.6],0.3,[1,0,0]));
grobjects.push(new Cube("cube10",[ -0.6,0.8, 3.4],0.3,[1,0,0]));

//Back right 
grobjects.push(new Cube("cube4",[ 1.2,0.2, 1.6],0.3,[1,0,0]));
grobjects.push(new Cube("cube3",[ 1.0, 0.4, 1.8],0.3 , [1,0,0]));
grobjects.push(new Cube("cube5",[ 0.8,0.6, 2.0],0.3,[1,0,0]));
grobjects.push(new Cube("cube6",[ 0.6,0.8, 2.2],0.3,[1,0,0]));

//Back left 
grobjects.push(new Cube("cube4",[ -1.2,0.2, 1.6],0.3,[1,0,0]));
grobjects.push(new Cube("cube3",[ -1.0, 0.4, 1.8],0.3 , [1,0,0]));
grobjects.push(new Cube("cube5",[ -0.8,0.6, 2.0],0.3,[1,0,0]));
grobjects.push(new Cube("cube6",[ -0.6,0.8, 2.2],0.3,[1,0,0]));

//Platform
grobjects.push(new Cube("cube7",[0.6,1.2, 3.4],0.5,[1,0,0]));
grobjects.push(new Cube("cube8",[0.6,1.2, 3.0],0.5,[1,0,0]));
grobjects.push(new Cube("cube9",[0.6,1.2, 2.6],0.5,[1,0,0]));
grobjects.push(new Cube("cube10",[0.6,1.2, 2.2],0.5,[1,0,0]));

grobjects.push(new Cube("cube7",[0.2,1.2, 3.4],0.5,[1,0,0]));
grobjects.push(new Cube("cube7",[-0.2,1.2, 3.4],0.5,[1,0,0]));
grobjects.push(new Cube("cube7",[-0.6,1.2, 3.4],0.5,[1,0,0]));

grobjects.push(new Cube("cube7",[-0.6,1.2, 3.4],0.5,[1,0,0]));
grobjects.push(new Cube("cube8",[-0.6,1.2, 3.0],0.5,[1,0,0]));
grobjects.push(new Cube("cube9",[-0.6,1.2, 2.6],0.5,[1,0,0]));
grobjects.push(new Cube("cube10",[-0.6,1.2, 2.2],0.5,[1,0,0]));

grobjects.push(new Cube("cube10",[0.2,1.2, 2.2],0.5,[1,0,0]));
grobjects.push(new Cube("cube10",[-0.2,1.2, 2.2],0.5,[1,0,0]));
grobjects.push(new Cube("cube10",[-0.6,1.2, 2.2],0.5,[1,0,0]));
//---------------------------------------------------//
//Front right
grobjects.push(new Cube("cube4",[ 0.6,1.6, 3.4],0.3,[1,0,0]));
grobjects.push(new Cube("cube3",[ 0.5, 1.8, 3.3],0.3 , [1,0,0]));
grobjects.push(new Cube("cube5",[ 0.4,2.0, 3.2],0.3,[1,0,0]));
grobjects.push(new Cube("cube6",[ 0.3,2.2, 3.1],0.3,[1,0,0]));

//Front Left 
grobjects.push(new Cube("cube7",[ -0.6,1.6, 3.4],0.3,[1,0,0]));
grobjects.push(new Cube("cube8",[ -0.5, 1.8, 3.3],0.3,[1,0,0]));
grobjects.push(new Cube("cube9",[ -0.4,2.0, 3.2],0.3,[1,0,0]));
grobjects.push(new Cube("cube10",[ -0.3,2.2, 3.1],0.3,[1,0,0]));

//Back right 
grobjects.push(new Cube("cube4",[ 0.6,1.6, 2.2],0.3,[1,0,0]));
grobjects.push(new Cube("cube3",[ 0.5, 1.8, 2.3],0.3 , [1,0,0]));
grobjects.push(new Cube("cube5",[ 0.4,2.0, 2.4],0.3,[1,0,0]));
grobjects.push(new Cube("cube6",[ 0.3,2.2, 2.5],0.3,[1,0,0]));

//Back left 
grobjects.push(new Cube("cube4",[ -0.6,1.6, 2.2],0.3,[1,0,0]));
grobjects.push(new Cube("cube3",[ -0.5, 1.8, 2.3],0.3 , [1, 0, 0]));
grobjects.push(new Cube("cube5",[ -0.4,2.0, 2.4],0.3,[1,0,0]));
grobjects.push(new Cube("cube6",[ -0.3,2.2, 2.5],0.3,[1,0,0]));

grobjects.push(new Cube("cube6",[ -0.2, 2.2, 3.0],0.5,[1,0,0]));
grobjects.push(new Cube("cube6",[ 0.2, 2.2, 3.0],0.5,[1,0,0]));
grobjects.push(new Cube("cube6",[ -0.2, 2.2, 2.6],0.5,[1,0,0]));
grobjects.push(new Cube("cube6",[ 0.2, 2.2, 2.6],0.5,[1,0,0]));

grobjects.push(new SpinningCube("scube 2",[ 0, 2.8, 2.8],0.7,  [1,0,0], 'Y'));
grobjects.push(new SpinningCube("scube 2",[ 0, 3.3, 2.8],0.6,  [1,0,0], 'Y'));
grobjects.push(new SpinningCube("scube 2",[0, 3.8, 2.8],0.4,  [1,0,0], 'Y'));
grobjects.push(new SpinningCube("scube 2",[ 0, 4.2, 2.8],0.4,  [1,0,0], 'Y'));
grobjects.push(new SpinningCube("scube 2",[ 0, 4.6, 2.8],0.4,  [1,0,0], 'Y'));
grobjects.push(new SpinningCube("scube 2",[ 0, 5.0, 2.8],0.4,  [1,0,0], 'Y'));
grobjects.push(new SpinningCube("scube 2",[ 0, 5.2, 2.8],0.2,  [1,0,0], 'Y'));
grobjects.push(new SpinningCube("scube 2",[ 0, 5.4, 2.8],0.2,  [1,0,0], 'Y'));