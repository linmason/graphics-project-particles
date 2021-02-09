//3456789_123456789_123456789_123456789_123456789_123456789_123456789_123456789_
// (JT: why the numbers? counts columns, helps me keep 80-char-wide listings)

// Tabs set to 2

/*=====================
  VBObox-Lib.js library: 
  ===================== 
Note that you don't really need 'VBObox' objects for any simple, 
    beginner-level WebGL/OpenGL programs: if all vertices contain exactly 
		the same attributes (e.g. position, color, surface normal), and use 
		the same shader program (e.g. same Vertex Shader and Fragment Shader), 
		then our textbook's simple 'example code' will suffice.
		  
***BUT*** that's rare -- most genuinely useful WebGL/OpenGL programs need 
		different sets of vertices with  different sets of attributes rendered 
		by different shader programs.  THUS a customized VBObox object for each 
		VBO/shader-program pair will help you remember and correctly implement ALL 
		the WebGL/GLSL steps required for a working multi-shader, multi-VBO program.
		
One 'VBObox' object contains all we need for WebGL/OpenGL to render on-screen a 
		set of shapes made from vertices stored in one Vertex Buffer Object (VBO), 
		as drawn by calls to one 'shader program' that runs on your computer's 
		Graphical Processing Unit(GPU), along with changes to values of that shader 
		program's one set of 'uniform' varibles.  
The 'shader program' consists of a Vertex Shader and a Fragment Shader written 
		in GLSL, compiled and linked and ready to execute as a Single-Instruction, 
		Multiple-Data (SIMD) parallel program executed simultaneously by multiple 
		'shader units' on the GPU.  The GPU runs one 'instance' of the Vertex 
		Shader for each vertex in every shape, and one 'instance' of the Fragment 
		Shader for every on-screen pixel covered by any part of any drawing 
		primitive defined by those vertices.
The 'VBO' consists of a 'buffer object' (a memory block reserved in the GPU),
		accessed by the shader program through its 'attribute' variables. Shader's
		'uniform' variable values also get retrieved from GPU memory, but their 
		values can't be changed while the shader program runs.  
		Each VBObox object stores its own 'uniform' values as vars in JavaScript; 
		its 'adjust()'	function computes newly-updated values for these uniform 
		vars and then transfers them to the GPU memory for use by shader program.
EVENTUALLY you should replace 'cuon-matrix-quat03.js' with the free, open-source
   'glmatrix.js' library for vectors, matrices & quaternions: Google it!
		This vector/matrix library is more complete, more widely-used, and runs
		faster than our textbook's 'cuon-matrix-quat03.js' library.  
		--------------------------------------------------------------
		I recommend you use glMatrix.js instead of cuon-matrix-quat03.js
		--------------------------------------------------------------
		for all future WebGL programs. 
You can CONVERT existing cuon-matrix-based programs to glmatrix.js in a very 
    gradual, sensible, testable way:
		--add the glmatrix.js library to an existing cuon-matrix-based program;
			(but don't call any of its functions yet).
		--comment out the glmatrix.js parts (if any) that cause conflicts or in	
			any way disrupt the operation of your program.
		--make just one small local change in your program; find a small, simple,
			easy-to-test portion of your program where you can replace a 
			cuon-matrix object or function call with a glmatrix function call.
			Test; make sure it works. Don't make too large a change: it's hard to fix!
		--Save a copy of this new program as your latest numbered version. Repeat
			the previous step: go on to the next small local change in your program
			and make another replacement of cuon-matrix use with glmatrix use. 
			Test it; make sure it works; save this as your next numbered version.
		--Continue this process until your program no longer uses any cuon-matrix
			library features at all, and no part of glmatrix is commented out.
			Remove cuon-matrix from your library, and now use only glmatrix.

	------------------------------------------------------------------
	VBObox -- A MESSY SET OF CUSTOMIZED OBJECTS--NOT REALLY A 'CLASS'
	------------------------------------------------------------------
As each 'VBObox' object can contain:
  -- a DIFFERENT GLSL shader program, 
  -- a DIFFERENT set of attributes that define a vertex for that shader program, 
  -- a DIFFERENT number of vertices to used to fill the VBOs in GPU memory, and 
  -- a DIFFERENT set of uniforms transferred to GPU memory for shader use.  
  THUS:
		I don't see any easy way to use the exact same object constructors and 
		prototypes for all VBObox objects.  Every additional VBObox objects may vary 
		substantially, so I recommend that you copy and re-name an existing VBObox 
		prototype object, and modify as needed, as shown here. 
		(e.g. to make the VBObox3 object, copy the VBObox2 constructor and 
		all its prototype functions, then modify their contents for VBObox3 
		activities.)

*/

// Written for EECS 351-2,	Intermediate Computer Graphics,
//							Northwestern Univ. EECS Dept., Jack Tumblin
// 2016.05.26 J. Tumblin-- Created; tested on 'TwoVBOs.html' starter code.
// 2017.02.20 J. Tumblin-- updated for EECS 351-1 use for Project C.
// 2018.04.11 J. Tumblin-- minor corrections/renaming for particle systems.
//    --11e: global 'gl' replaced redundant 'myGL' fcn args; 
//    --12: added 'SwitchToMe()' fcn to simplify 'init()' function and to fix 
//      weird subtle errors that sometimes appear when we alternate 'adjust()'
//      and 'draw()' functions of different VBObox objects. CAUSE: found that
//      only the 'draw()' function (and not the 'adjust()' function) made a full
//      changeover from one VBObox to another; thus calls to 'adjust()' for one
//      VBObox could corrupt GPU contents for another.
//      --Created vboStride, vboOffset members to centralize VBO layout in the 
//      constructor function.
//    -- 13 (abandoned) tried to make a 'core' or 'resuable' VBObox object to
//      which we would add on new properties for shaders, uniforms, etc., but
//      I decided there was too little 'common' code that wasn't customized.
//=============================================================================

floatsPerVertex = 7;
makeSphere()
makeGouraudSphere()
//=============================================================================
//=============================================================================
function VBObox0() {
//=============================================================================
//=============================================================================
// CONSTRUCTOR for one re-usable 'VBObox0' object that holds all data and fcns
// needed to render vertices from one Vertex Buffer Object (VBO) using one 
// separate shader program (a vertex-shader & fragment-shader pair) and one
// set of 'uniform' variables.

// Constructor goal: 
// Create and set member vars that will ELIMINATE ALL LITERALS (numerical values 
// written into code) in all other VBObox functions. Keeping all these (initial)
// values here, in this one coonstrutor function, ensures we can change them 
// easily WITHOUT disrupting any other code, ever!
  
	this.VERT_SRC =	//--------------------- VERTEX SHADER source code 
  'precision highp float;\n' +				// req'd in OpenGL ES if we use 'float'
  //
  'uniform mat4 u_ModelMat0;\n' +
  'attribute vec4 a_Pos0;\n' +
  'attribute vec3 a_Colr0;\n'+
  'varying vec3 v_Colr0;\n' +
  //
  'void main() {\n' +
  '  gl_Position = u_ModelMat0 * a_Pos0;\n' +
  '	 v_Colr0 = a_Colr0;\n' +
  ' }\n';

	this.FRAG_SRC = //---------------------- FRAGMENT SHADER source code 
  'precision mediump float;\n' +
  'varying vec3 v_Colr0;\n' +
  'void main() {\n' +
  '  gl_FragColor = vec4(v_Colr0, 1.0);\n' + 
  '}\n';


  //New Stuff: Make each 3D shape in its own array of vertices:
  makeGroundGrid();				// create, fill the gndVerts array
  makeAxes();

    // how many floats total needed to store all shapes?
	var mySiz = (gndVerts.length + axesVerts.length);

	// How many vertices total?
	var nn = mySiz / floatsPerVertex;
	console.log('nn is', nn, 'mySiz is', mySiz, 'floatsPerVertex is', floatsPerVertex);
	// Copy all shapes into one big Float32 array:
  	var colorShapes = new Float32Array(mySiz);
	this.vboContents = new Float32Array(mySiz)
	// Copy them:  remember where to start for each shape:
	gndStart = 0;							// we stored the cylinder first.
  	for(i=0,j=0; j< gndVerts.length; i++,j++) {
  		colorShapes[i] = gndVerts[j];
		}

  axesStart = i;
  for(j=0; j< gndVerts.length; i++,j++) {
    colorShapes[i] = axesVerts[j];
  }

	this.vboContents = colorShapes;

  

//Back to Old Stuff:
	/*this.vboContents = //---------------------------------------------------------
	new Float32Array ([						// Array of vertex attribute values we will
  															// transfer to GPU's vertex buffer object (VBO)
	// 1st triangle:
  	 0.0,	 0.0,	0.0, 1.0,		1.0, 1.0, 1.0, //1 vertex:pos x,y,z,w; color: r,g,b  X AXIS
     1.0,  0.0, 0.0, 1.0,		1.0, 0.0, 0.0,
     
  	 0.0,	 0.0,	0.0, 1.0,		1.0, 1.0, 1.0, // Y AXIS
     0.0,  1.0, 0.0, 1.0,		0.0, 1.0, 0.0,
     
  	 0.0,	 0.0,	0.0, 1.0,		1.0, 1.0, 1.0, // Z AXIS
     0.0,  0.0, 1.0, 1.0,		0.0, 0.2, 1.0,
     
     // 2 long lines of the ground grid:
  	 -100.0,   0.2,	0.0, 1.0,		1.0, 0.2, 0.0, // horiz line
      100.0,   0.2, 0.0, 1.0,		0.0, 0.2, 1.0,
  	  0.2,	-100.0,	0.0, 1.0,		0.0, 1.0, 0.0, // vert line
      0.2,   100.0, 0.0, 1.0,		1.0, 0.0, 1.0,
		 ]);*/

	this.vboVerts = nn;						// # of vertices held in 'vboContents' array
	this.FSIZE = this.vboContents.BYTES_PER_ELEMENT;
	                              // bytes req'd by 1 vboContents array element;
																// (why? used to compute stride and offset 
																// in bytes for vertexAttribPointer() calls)
  this.vboBytes = this.vboContents.length * this.FSIZE;               
                                // total number of bytes stored in vboContents
                                // (#  of floats in vboContents array) * 
                                // (# of bytes/float).
	this.vboStride = this.vboBytes / this.vboVerts; 
	                              // (== # of bytes to store one complete vertex).
	                              // From any attrib in a given vertex in the VBO, 
	                              // move forward by 'vboStride' bytes to arrive 
	                              // at the same attrib for the next vertex. 

	            //----------------------Attribute sizes
  this.vboFcount_a_Pos0 =  4;    // # of floats in the VBO needed to store the
                                // attribute named a_Pos0. (4: x,y,z,w values)
  this.vboFcount_a_Colr0 = 3;   // # of floats for this attrib (r,g,b values) 
  console.assert((this.vboFcount_a_Pos0 +     // check the size of each and
                  this.vboFcount_a_Colr0) *   // every attribute in our VBO
                  this.FSIZE == this.vboStride, // for agreeement with'stride'
                  "Uh oh! VBObox0.vboStride disagrees with attribute-size values!");

              //----------------------Attribute offsets  
	this.vboOffset_a_Pos0 = 0;    // # of bytes from START of vbo to the START
	                              // of 1st a_Pos0 attrib value in vboContents[]
  this.vboOffset_a_Colr0 = this.vboFcount_a_Pos0 * this.FSIZE;    
                                // (4 floats * bytes/float) 
                                // # of bytes from START of vbo to the START
                                // of 1st a_Colr0 attrib value in vboContents[]
	            //-----------------------GPU memory locations:
	this.vboLoc;									// GPU Location for Vertex Buffer Object, 
	                              // returned by gl.createBuffer() function call
	this.shaderLoc;								// GPU Location for compiled Shader-program  
	                            	// set by compile/link of VERT_SRC and FRAG_SRC.
								          //------Attribute locations in our shaders:
	this.a_PosLoc;								// GPU location for 'a_Pos0' attribute
	this.a_ColrLoc;								// GPU location for 'a_Colr0' attribute

	            //---------------------- Uniform locations &values in our shaders
	this.ModelMat = new Matrix4();	// Transforms CVV axes to model axes.
	this.u_ModelMatLoc;							// GPU location for u_ModelMat uniform
}

VBObox0.prototype.init = function() {
//=============================================================================
// Prepare the GPU to use all vertices, GLSL shaders, attributes, & uniforms 
// kept in this VBObox. (This function usually called only once, within main()).
// Specifically:
// a) Create, compile, link our GLSL vertex- and fragment-shaders to form an 
//  executable 'program' stored and ready to use inside the GPU.  
// b) create a new VBO object in GPU memory and fill it by transferring in all
//  the vertex data held in our Float32array member 'VBOcontents'. 
// c) Find & save the GPU location of all our shaders' attribute-variables and 
//  uniform-variables (needed by switchToMe(), adjust(), draw(), reload(), etc.)
// -------------------
// CAREFUL!  before you can draw pictures using this VBObox contents, 
//  you must call this VBObox object's switchToMe() function too!
//--------------------
// a) Compile,link,upload shaders-----------------------------------------------
	this.shaderLoc = createProgram(gl, this.VERT_SRC, this.FRAG_SRC);
	if (!this.shaderLoc) {
    console.log(this.constructor.name + 
    						'.init() failed to create executable Shaders on the GPU. Bye!');
    return;
  }
// CUTE TRICK: let's print the NAME of this VBObox object: tells us which one!
//  else{console.log('You called: '+ this.constructor.name + '.init() fcn!');}

	gl.program = this.shaderLoc;		// (to match cuon-utils.js -- initShaders())

// b) Create VBO on GPU, fill it------------------------------------------------
	this.vboLoc = gl.createBuffer();	
  if (!this.vboLoc) {
    console.log(this.constructor.name + 
    						'.init() failed to create VBO in GPU. Bye!'); 
    return;
  }
  // Specify the purpose of our newly-created VBO on the GPU.  Your choices are:
  //	== "gl.ARRAY_BUFFER" : the VBO holds vertices, each made of attributes 
  // (positions, colors, normals, etc), or 
  //	== "gl.ELEMENT_ARRAY_BUFFER" : the VBO holds indices only; integer values 
  // that each select one vertex from a vertex array stored in another VBO.
  gl.bindBuffer(gl.ARRAY_BUFFER,	      // GLenum 'target' for this GPU buffer 
  								this.vboLoc);				  // the ID# the GPU uses for this buffer.

  // Fill the GPU's newly-created VBO object with the vertex data we stored in
  //  our 'vboContents' member (JavaScript Float32Array object).
  //  (Recall gl.bufferData() will evoke GPU's memory allocation & management: 
  //    use gl.bufferSubData() to modify VBO contents without changing VBO size)
  gl.bufferData(gl.ARRAY_BUFFER, 			  // GLenum target(same as 'bindBuffer()')
 					 				this.vboContents, 		// JavaScript Float32Array
  							 	gl.STATIC_DRAW);			// Usage hint.
  //	The 'hint' helps GPU allocate its shared memory for best speed & efficiency
  //	(see OpenGL ES specification for more info).  Your choices are:
  //		--STATIC_DRAW is for vertex buffers rendered many times, but whose 
  //				contents rarely or never change.
  //		--DYNAMIC_DRAW is for vertex buffers rendered many times, but whose 
  //				contents may change often as our program runs.
  //		--STREAM_DRAW is for vertex buffers that are rendered a small number of 
  // 			times and then discarded; for rapidly supplied & consumed VBOs.

  // c1) Find All Attributes:---------------------------------------------------
  //  Find & save the GPU location of all our shaders' attribute-variables and 
  //  uniform-variables (for switchToMe(), adjust(), draw(), reload(),etc.)
  this.a_PosLoc = gl.getAttribLocation(this.shaderLoc, 'a_Pos0');
  if(this.a_PosLoc < 0) {
    console.log(this.constructor.name + 
    						'.init() Failed to get GPU location of attribute a_Pos0');
    return -1;	// error exit.
  }
 	this.a_ColrLoc = gl.getAttribLocation(this.shaderLoc, 'a_Colr0');
  if(this.a_ColrLoc < 0) {
    console.log(this.constructor.name + 
    						'.init() failed to get the GPU location of attribute a_Colr0');
    return -1;	// error exit.
  }
  
  // c2) Find All Uniforms:-----------------------------------------------------
  //Get GPU storage location for each uniform var used in our shader programs: 
	this.u_ModelMatLoc = gl.getUniformLocation(this.shaderLoc, 'u_ModelMat0');
  if (!this.u_ModelMatLoc) { 
    console.log(this.constructor.name + 
    						'.init() failed to get GPU location for u_ModelMat1 uniform');
    return;
  }  
}

VBObox0.prototype.switchToMe = function() {
//==============================================================================
// Set GPU to use this VBObox's contents (VBO, shader, attributes, uniforms...)
//
// We only do this AFTER we called the init() function, which does the one-time-
// only setup tasks to put our VBObox contents into GPU memory.  !SURPRISE!
// even then, you are STILL not ready to draw our VBObox's contents onscreen!
// We must also first complete these steps:
//  a) tell the GPU to use our VBObox's shader program (already in GPU memory),
//  b) tell the GPU to use our VBObox's VBO  (already in GPU memory),
//  c) tell the GPU to connect the shader program's attributes to that VBO.

// a) select our shader program:
  gl.useProgram(this.shaderLoc);	
//		Each call to useProgram() selects a shader program from the GPU memory,
// but that's all -- it does nothing else!  Any previously used shader program's 
// connections to attributes and uniforms are now invalid, and thus we must now
// establish new connections between our shader program's attributes and the VBO
// we wish to use.  
  
// b) call bindBuffer to disconnect the GPU from its currently-bound VBO and
//  instead connect to our own already-created-&-filled VBO.  This new VBO can 
//    supply values to use as attributes in our newly-selected shader program:
	gl.bindBuffer(gl.ARRAY_BUFFER,	        // GLenum 'target' for this GPU buffer 
										this.vboLoc);			    // the ID# the GPU uses for our VBO.

// c) connect our newly-bound VBO to supply attribute variable values for each
// vertex to our SIMD shader program, using 'vertexAttribPointer()' function.
// this sets up data paths from VBO to our shader units:
  // 	Here's how to use the almost-identical OpenGL version of this function:
	//		http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttribPointer.xml )
  gl.vertexAttribPointer(
		this.a_PosLoc,//index == ID# for the attribute var in your GLSL shader pgm;
		this.vboFcount_a_Pos0,// # of floats used by this attribute: 1,2,3 or 4?
		gl.FLOAT,			// type == what data type did we use for those numbers?
		false,				// isNormalized == are these fixed-point values that we need
									//									normalize before use? true or false
		this.vboStride,// Stride == #bytes we must skip in the VBO to move from the
		              // stored attrib for this vertex to the same stored attrib
		              //  for the next vertex in our VBO.  This is usually the 
									// number of bytes used to store one complete vertex.  If set 
									// to zero, the GPU gets attribute values sequentially from 
									// VBO, starting at 'Offset'.	
									// (Our vertex size in bytes: 4 floats for pos + 3 for color)
		this.vboOffset_a_Pos0);						
		              // Offset == how many bytes from START of buffer to the first
  								// value we will actually use?  (We start with position).
  gl.vertexAttribPointer(this.a_ColrLoc, this.vboFcount_a_Colr0, 
                        gl.FLOAT, false, 
                        this.vboStride, this.vboOffset_a_Colr0);
  							
// --Enable this assignment of each of these attributes to its' VBO source:
  gl.enableVertexAttribArray(this.a_PosLoc);
  gl.enableVertexAttribArray(this.a_ColrLoc);
}

VBObox0.prototype.isReady = function() {
//==============================================================================
// Returns 'true' if our WebGL rendering context ('gl') is ready to render using
// this objects VBO and shader program; else return false.
// see: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter

var isOK = true;

  if(gl.getParameter(gl.CURRENT_PROGRAM) != this.shaderLoc)  {
    console.log(this.constructor.name + 
    						'.isReady() false: shader program at this.shaderLoc not in use!');
    isOK = false;
  }
  if(gl.getParameter(gl.ARRAY_BUFFER_BINDING) != this.vboLoc) {
      console.log(this.constructor.name + 
  						'.isReady() false: vbo at this.vboLoc not in use!');
    isOK = false;
  }
  return isOK;
}

VBObox0.prototype.adjust = function(g_worldMat) {
//==============================================================================
// Update the GPU to newer, current values we now store for 'uniform' vars on 
// the GPU; and (if needed) update each attribute's stride and offset in VBO.

  // check: was WebGL context set to use our VBO & shader program?
  if(this.isReady()==false) {
        console.log('ERROR! before' + this.constructor.name + 
  						'.adjust() call you needed to call this.switchToMe()!!');
  }  
	// Adjust values for our uniforms,

		this.ModelMat.setIdentity();
// THIS DOESN'T WORK!!  this.ModelMatrix = g_worldMat;
  this.ModelMat.set(g_worldMat);	// use our global, shared camera.
// READY to draw in 'world' coord axes.

	
//  this.ModelMat.rotate(g_angleNow0, 0, 0, 1);	  // rotate drawing axes,
//  this.ModelMat.translate(0.35, 0, 0);							// then translate them.
  //  Transfer new uniforms' values to the GPU:-------------
  // Send  new 'ModelMat' values to the GPU's 'u_ModelMat1' uniform: 
  gl.uniformMatrix4fv(this.u_ModelMatLoc,	// GPU location of the uniform
  										false, 				// use matrix transpose instead?
  										this.ModelMat.elements);	// send data from Javascript.
  // Adjust the attributes' stride and offset (if necessary)
  // (use gl.vertexAttribPointer() calls and gl.enableVertexAttribArray() calls)
}

VBObox0.prototype.draw = function() {
//=============================================================================
// Render current VBObox contents.

  // check: was WebGL context set to use our VBO & shader program?
  if(this.isReady()==false) {
        console.log('ERROR! before' + this.constructor.name + 
  						'.draw() call you needed to call this.switchToMe()!!');
  }  
  // ----------------------------Draw the contents of the currently-bound VBO:
  gl.drawArrays(gl.LINES, 	    // select the drawing primitive to draw,
                  // choices: gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, 
                  //          gl.TRIANGLES, gl.TRIANGLE_STRIP, ...
  								gndStart/floatsPerVertex, 								// location of 1st vertex to draw;
  								gndVerts.length/floatsPerVertex);		// number of vertices to draw on-screen.

  // Draw x,y,z axes
  gl.drawArrays(gl.LINES, axesStart/floatsPerVertex, axesVerts.length/floatsPerVertex);
}

VBObox0.prototype.reload = function() {
//=============================================================================
// Over-write current values in the GPU inside our already-created VBO: use 
// gl.bufferSubData() call to re-transfer some or all of our Float32Array 
// contents to our VBO without changing any GPU memory allocations.

 gl.bufferSubData(gl.ARRAY_BUFFER, 	// GLenum target(same as 'bindBuffer()')
                  0,                  // byte offset to where data replacement
                                      // begins in the VBO.
 					 				this.vboContents);   // the JS source-data array used to fill VBO

}
/*
VBObox0.prototype.empty = function() {
//=============================================================================
// Remove/release all GPU resources used by this VBObox object, including any 
// shader programs, attributes, uniforms, textures, samplers or other claims on 
// GPU memory.  However, make sure this step is reversible by a call to 
// 'restoreMe()': be sure to retain all our Float32Array data, all values for 
// uniforms, all stride and offset values, etc.
//
//
// 		********   YOU WRITE THIS! ********
//
//
//
}

VBObox0.prototype.restore = function() {
//=============================================================================
// Replace/restore all GPU resources used by this VBObox object, including any 
// shader programs, attributes, uniforms, textures, samplers or other claims on 
// GPU memory.  Use our retained Float32Array data, all values for  uniforms, 
// all stride and offset values, etc.
//
//
// 		********   YOU WRITE THIS! ********
//
//
//
}
*/

//=============================================================================
//=============================================================================
function VBObox1() {
//=============================================================================
//=============================================================================
// CONSTRUCTOR for one re-usable 'VBObox1' object that holds all data and fcns
// needed to render vertices from one Vertex Buffer Object (VBO) using one 
// separate shader program (a vertex-shader & fragment-shader pair) and one
// set of 'uniform' variables.

// Constructor goal: 
// Create and set member vars that will ELIMINATE ALL LITERALS (numerical values 
// written into code) in all other VBObox functions. Keeping all these (initial)
// values here, in this one coonstrutor function, ensures we can change them 
// easily WITHOUT disrupting any other code, ever!
	this.VERT_SRC =	//--------------------- VERTEX SHADER source code 
  'precision highp float;\n' +
  'uniform mat4 u_MVPMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'uniform vec4 u_LightPosition;\n' +
  'uniform vec4 u_EyePosition;\n' +
  'uniform float u_LightOn;\n' +
  'uniform vec3 u_IA;\n' +
  'uniform vec3 u_ID;\n' +
  'uniform vec3 u_IS;\n' +
  'uniform vec3 u_KA;\n' +
  'uniform vec3 u_KD;\n' +
  'uniform vec3 u_KS;\n' +
  'uniform vec3 u_KE;\n' +
  'uniform float u_SE;\n' +
  'uniform int u_isBlinn;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec3 a_Color;\n' +
  'attribute vec3 a_Normal;\n' +
  'varying vec4 v_Colr;\n' +

  'void main() {\n' +
  'vec4 transVec = u_NormalMatrix * vec4(a_Normal, 1.0);\n' +
  'vec3 normVec = normalize(transVec.xyz);\n' +
  'vec3 lightVec = normalize((u_LightPosition.xyz) - (u_ModelMatrix * a_Position).xyz);\n' +
  'vec3 eyeVec = normalize((u_EyePosition.xyz) - (u_ModelMatrix * a_Position).xyz);\n' +
  '  gl_Position = u_MVPMatrix * a_Position;\n' +
  '  if (u_isBlinn == 1) {\n' +
  '    vec3 halfVec = normalize(lightVec + eyeVec);\n' +
  '    v_Colr = vec4(0.0*a_Color + u_KE + u_LightOn * (u_IA*u_KA + u_ID*u_KD*max(0.0, dot(normVec,lightVec)) + u_IS*u_KS*pow(max(0.0, dot(normVec, halfVec)), u_SE)), 1.0);\n' +
  //'    v_Colr = vec4(0.3*a_Color + 0.0*u_KA + 0.0*u_KD + 0.0*u_KS + 0.0*u_KE + 0.0*u_IA + 0.0*u_ID + 1.0*u_IS + pow(0.6, u_SE) * u_LightOn * (1.0*dot(normVec,lightVec)+ 0.0*eyeVec), 1.0);\n' +
  '  }\n' +
  '  else {\n' +
  '    vec3 reflectVec = -1.0 * reflect(lightVec, normVec);\n' +
  '    v_Colr = vec4(u_KE + u_LightOn * (u_IA*u_KA + u_ID*u_KD*max(0.0, dot(normVec,lightVec)) + u_IS*u_KS*pow(max(0.0, dot(reflectVec, eyeVec)), u_SE)), 1.0);\n' +
  '  }\n' +
  //'    v_Colr = vec4(0.3*a_Color  + 0.0*u_IA + 1.0*u_ID + 0.0*u_IS + u_LightOn * (1.0*dot(normVec,lightVec)+ 0.0*eyeVec), 1.0);}\n' +
  //'  v_Colr = vec4(0.2*a_Color + 0.8*dot(normVec,lightVec), 1.0);\n' +
  '}\n';

  this.FRAG_SRC = 
  'precision mediump float;\n' +
  'varying vec4 v_Colr;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Colr;\n' +
  '}\n';

 //New Stuff: Make each 3D shape in its own array of vertices:

    // how many floats total needed to store all shapes?
	var mySiz = (gsphVerts.length);

	// How many vertices total?
	var nn = mySiz / (floatsPerVertex+3);
	console.log('nn is', nn, 'mySiz is', mySiz, 'floatsPerVertex is', floatsPerVertex+3);
	// Copy all shapes into one big Float32 array:
  	var colorShapes = new Float32Array(mySiz);
	this.vboContents = new Float32Array(mySiz)
	// Copy them:  remember where to start for each shape:
	gsphStart = 0;							// we stored the cylinder first.
  	for(i=0,j=0; j< gsphVerts.length; i++,j++) {
  		colorShapes[i] = gsphVerts[j];
		}

	this.vboContents = colorShapes;
		

  //Back to Old Stuff:
	/*

	this.vboContents = //---------------------------------------------------------
		new Float32Array ([					// Array of vertex attribute values we will
  															// transfer to GPU's vertex buffer object (VBO)
			// 1 vertex per line: pos1 x,y,z,w;   colr1; r,g,b;   ptSiz1; 
  	-0.3,  0.7,	0.0, 1.0,		0.0, 1.0, 1.0,  17.0,
    -0.3, -0.3, 0.0, 1.0,		1.0, 0.0, 1.0,  20.0,
     0.3, -0.3, 0.0, 1.0,		1.0, 1.0, 0.0,  33.0,
  ]);	*/
  
	this.vboVerts = nn;							// # of vertices held in 'vboContents' array;
	this.FSIZE = this.vboContents.BYTES_PER_ELEMENT;  
	                              // bytes req'd by 1 vboContents array element;
																// (why? used to compute stride and offset 
																// in bytes for vertexAttribPointer() calls)
    this.vboBytes = this.vboContents.length * this.FSIZE;               
                                // (#  of floats in vboContents array) * 
                                // (# of bytes/float).
	this.vboStride = this.vboBytes / this.vboVerts;     
	                              // (== # of bytes to store one complete vertex).
	                              // From any attrib in a given vertex in the VBO, 
	                              // move forward by 'vboStride' bytes to arrive 
	                              // at the same attrib for the next vertex.
	                               
	            //----------------------Attribute sizes
  this.vboFcount_a_Pos1 =  4;    // # of floats in the VBO needed to store the
                                // attribute named a_Pos1. (4: x,y,z,w values)
  this.vboFcount_a_Colr1 = 3;   // # of floats for this attrib (r,g,b values)
  this.vboFcount_a_PtSiz1 = 1;  // # of floats for this attrib (just one!)   
  this.vboFcount_a_Normal = 3;
  console.assert((this.vboFcount_a_Pos1 +     // check the size of each and
                  this.vboFcount_a_Colr1 +
                  this.vboFcount_a_Normal) *   // every attribute in our VBO
                  this.FSIZE == this.vboStride, // for agreeement with'stride'
                  "Uh oh! VBObox1.vboStride disagrees with attribute-size values!");
                  
              //----------------------Attribute offsets
	this.vboOffset_a_Pos1 = 0;    //# of bytes from START of vbo to the START
	                              // of 1st a_Pos1 attrib value in vboContents[]
  this.vboOffset_a_Colr1 = (this.vboFcount_a_Pos1) * this.FSIZE;  
                                // == 4 floats * bytes/float
                                //# of bytes from START of vbo to the START
                                // of 1st a_Colr1 attrib value in vboContents[]
  this.vboOffset_a_Normal =(this.vboFcount_a_Pos1 +
                            this.vboFcount_a_Colr1) * this.FSIZE; 
                                // == 7 floats * bytes/float
                                // # of bytes from START of vbo to the START
                                // of 1st a_PtSize attrib value in vboContents[]

	            //-----------------------GPU memory locations:                                
	this.vboLoc;									// GPU Location for Vertex Buffer Object, 
	                              // returned by gl.createBuffer() function call
	this.shaderLoc;								// GPU Location for compiled Shader-program  
	                            	// set by compile/link of VERT_SRC and FRAG_SRC.
								          //------Attribute locations in our shaders:
	this.a_Pos1Loc;							  // GPU location: shader 'a_Pos1' attribute
	this.a_Colr1Loc;							// GPU location: shader 'a_Colr1' attribute
	this.a_PtSiz1Loc;							// GPU location: shader 'a_PtSiz1' attribute
	this.a_NormalLoc;
	
	            //---------------------- Uniform locations &values in our shaders
	this.MVPMatrix = new Matrix4();
  this.ModelMatrix = new Matrix4();	// Transforms CVV axes to model axes.
	this.NormalMatrix = new Matrix4();
  this.LightPosition = new Vector4();
  this.EyePosition = new Vector4();
  this.LightOn = 1.0;
  this.IA = new Vector3();
  this.ID = new Vector3();
  this.IS = new Vector3();
  this.KA = new Vector3();
  this.KD = new Vector3();
  this.KS = new Vector3();
  this.KE = new Vector3();
  this.isBlinn = 1;
  this.SE = 1.0;
  this.u_MVPMatrixLoc;
	this.u_ModelMatrixLoc;						// GPU location for u_ModelMat uniform
	this.u_NormalMatrixLoc;
  this.u_LightPositionLoc;
  this.u_EyePositionLoc;
  this.u_LightOnLoc;
  this.u_IALoc;
  this.u_IDLoc;
  this.u_ISLoc;
  this.u_KALoc;
  this.u_KDLoc;
  this.u_KSLoc;
  this.u_KELoc;
  this.u_isBlinnLoc;
  this.u_SELoc
};


VBObox1.prototype.init = function() {
//==============================================================================
// Prepare the GPU to use all vertices, GLSL shaders, attributes, & uniforms 
// kept in this VBObox. (This function usually called only once, within main()).
// Specifically:
// a) Create, compile, link our GLSL vertex- and fragment-shaders to form an 
//  executable 'program' stored and ready to use inside the GPU.  
// b) create a new VBO object in GPU memory and fill it by transferring in all
//  the vertex data held in our Float32array member 'VBOcontents'. 
// c) Find & save the GPU location of all our shaders' attribute-variables and 
//  uniform-variables (needed by switchToMe(), adjust(), draw(), reload(), etc.)
// -------------------
// CAREFUL!  before you can draw pictures using this VBObox contents, 
//  you must call this VBObox object's switchToMe() function too!
//--------------------
// a) Compile,link,upload shaders-----------------------------------------------
	this.shaderLoc = createProgram(gl, this.VERT_SRC, this.FRAG_SRC);
	if (!this.shaderLoc) {
    console.log(this.constructor.name + 
    						'.init() failed to create executable Shaders on the GPU. Bye!');
    return;
  }
// CUTE TRICK: let's print the NAME of this VBObox object: tells us which one!
//  else{console.log('You called: '+ this.constructor.name + '.init() fcn!');}

	gl.program = this.shaderLoc;		// (to match cuon-utils.js -- initShaders())

// b) Create VBO on GPU, fill it------------------------------------------------
	this.vboLoc = gl.createBuffer();	
  if (!this.vboLoc) {
    console.log(this.constructor.name + 
    						'.init() failed to create VBO in GPU. Bye!'); 
    return;
  }
  
  // Specify the purpose of our newly-created VBO on the GPU.  Your choices are:
  //	== "gl.ARRAY_BUFFER" : the VBO holds vertices, each made of attributes 
  // (positions, colors, normals, etc), or 
  //	== "gl.ELEMENT_ARRAY_BUFFER" : the VBO holds indices only; integer values 
  // that each select one vertex from a vertex array stored in another VBO.
  gl.bindBuffer(gl.ARRAY_BUFFER,	      // GLenum 'target' for this GPU buffer 
  								this.vboLoc);				  // the ID# the GPU uses for this buffer.
  											
  // Fill the GPU's newly-created VBO object with the vertex data we stored in
  //  our 'vboContents' member (JavaScript Float32Array object).
  //  (Recall gl.bufferData() will evoke GPU's memory allocation & management: 
  //	 use gl.bufferSubData() to modify VBO contents without changing VBO size)
  gl.bufferData(gl.ARRAY_BUFFER, 			  // GLenum target(same as 'bindBuffer()')
 					 				this.vboContents, 		// JavaScript Float32Array
  							 	gl.STATIC_DRAW);			// Usage hint.  
  //	The 'hint' helps GPU allocate its shared memory for best speed & efficiency
  //	(see OpenGL ES specification for more info).  Your choices are:
  //		--STATIC_DRAW is for vertex buffers rendered many times, but whose 
  //				contents rarely or never change.
  //		--DYNAMIC_DRAW is for vertex buffers rendered many times, but whose 
  //				contents may change often as our program runs.
  //		--STREAM_DRAW is for vertex buffers that are rendered a small number of 
  // 			times and then discarded; for rapidly supplied & consumed VBOs.

// c1) Find All Attributes:-----------------------------------------------------
//  Find & save the GPU location of all our shaders' attribute-variables and 
//  uniform-variables (for switchToMe(), adjust(), draw(), reload(), etc.)
  this.a_Pos1Loc = gl.getAttribLocation(this.shaderLoc, 'a_Position');
  if(this.a_Pos1Loc < 0) {
    console.log(this.constructor.name + 
    						'.init() Failed to get GPU location of attribute a_Position');
    return -1;	// error exit.
  }
 	this.a_Colr1Loc = gl.getAttribLocation(this.shaderLoc, 'a_Color');
  if(this.a_Colr1Loc < 0) {
    console.log(this.constructor.name + 
    						'.init() failed to get the GPU location of attribute a_Color');
    return -1;	// error exit.
  }
  /*this.a_PtSiz1Loc = gl.getAttribLocation(this.shaderLoc, 'a_PtSiz1');
  if(this.a_PtSiz1Loc < 0) {
    console.log(this.constructor.name + 
	    					'.init() failed to get the GPU location of attribute a_PtSiz1');
	  return -1;	// error exit.
  }*/
  this.a_NormalLoc = gl.getAttribLocation(this.shaderLoc, 'a_Normal');
  if(this.a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return -1;
  }
  // c2) Find All Uniforms:-----------------------------------------------------
  //Get GPU storage location for each uniform var used in our shader programs: 

  this.u_MVPMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_MVPMatrix');
  if (!this.u_MVPMatrixLoc) { 
    console.log(this.constructor.name + 
                '.init() failed to get GPU location for u_MVPMatrix uniform');
    return;
  }

  this.u_ModelMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_ModelMatrix');
  if (!this.u_ModelMatrixLoc) { 
    console.log(this.constructor.name + 
    						'.init() failed to get GPU location for u_ModelMatrix uniform');
    return;
  }

  this.u_NormalMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_NormalMatrix');	
	if(!this.u_NormalMatrixLoc) {	
		console.log('Failed to get GPU storage location for u_NormalMatrix');	
		return	
	}

  this.u_LightPositionLoc = gl.getUniformLocation(this.shaderLoc, 'u_LightPosition'); 
  if(!this.u_LightPositionLoc) { 
    console.log('Failed to get GPU storage location for u_LightPosition'); 
    return  
  }

  this.u_EyePositionLoc = gl.getUniformLocation(this.shaderLoc, 'u_EyePosition'); 
  if(!this.u_EyePositionLoc) { 
    console.log('Failed to get GPU storage location for u_EyePosition'); 
    return  
  }

  this.u_LightOnLoc = gl.getUniformLocation(this.shaderLoc, 'u_LightOn'); 
  if(!this.u_LightOnLoc) { 
    console.log('Failed to get GPU storage location for u_LightOn'); 
    return  
  }

  this.u_IALoc = gl.getUniformLocation(this.shaderLoc, 'u_IA'); 
  if(!this.u_IALoc) { 
    console.log('Failed to get GPU storage location for u_IA'); 
    return  
  }

  this.u_IDLoc = gl.getUniformLocation(this.shaderLoc, 'u_ID'); 
  if(!this.u_IDLoc) { 
    console.log('Failed to get GPU storage location for u_ID'); 
    return  
  }

  this.u_ISLoc = gl.getUniformLocation(this.shaderLoc, 'u_IS'); 
  if(!this.u_ISLoc) { 
    console.log('Failed to get GPU storage location for u_IS'); 
    return  
  }

  this.u_KALoc = gl.getUniformLocation(this.shaderLoc, 'u_KA'); 
  if(!this.u_KALoc) { 
    console.log('Failed to get GPU storage location for u_KA'); 
    return  
  }

  this.u_KDLoc = gl.getUniformLocation(this.shaderLoc, 'u_KD'); 
  if(!this.u_KDLoc) { 
    console.log('Failed to get GPU storage location for u_KD'); 
    return  
  }

  this.u_KSLoc = gl.getUniformLocation(this.shaderLoc, 'u_KS'); 
  if(!this.u_KSLoc) { 
    console.log('Failed to get GPU storage location for u_KS'); 
    return  
  }

  this.u_KELoc = gl.getUniformLocation(this.shaderLoc, 'u_KE'); 
  if(!this.u_KELoc) { 
    console.log('Failed to get GPU storage location for u_KE'); 
    return  
  }

  this.u_isBlinnLoc = gl.getUniformLocation(this.shaderLoc, 'u_isBlinn'); 
  if(!this.u_isBlinnLoc) { 
    console.log('Failed to get GPU storage location for u_isBlinn'); 
    return  
  }

  this.u_SELoc = gl.getUniformLocation(this.shaderLoc, 'u_SE'); 
  if(!this.u_SELoc) { 
    console.log('Failed to get GPU storage location for u_SE'); 
    return  
  }
}

VBObox1.prototype.switchToMe = function () {
//==============================================================================
// Set GPU to use this VBObox's contents (VBO, shader, attributes, uniforms...)
//
// We only do this AFTER we called the init() function, which does the one-time-
// only setup tasks to put our VBObox contents into GPU memory.  !SURPRISE!
// even then, you are STILL not ready to draw our VBObox's contents onscreen!
// We must also first complete these steps:
//  a) tell the GPU to use our VBObox's shader program (already in GPU memory),
//  b) tell the GPU to use our VBObox's VBO  (already in GPU memory),
//  c) tell the GPU to connect the shader program's attributes to that VBO.

// a) select our shader program:
  gl.useProgram(this.shaderLoc);	
//		Each call to useProgram() selects a shader program from the GPU memory,
// but that's all -- it does nothing else!  Any previously used shader program's 
// connections to attributes and uniforms are now invalid, and thus we must now
// establish new connections between our shader program's attributes and the VBO
// we wish to use.  
  
// b) call bindBuffer to disconnect the GPU from its currently-bound VBO and
//  instead connect to our own already-created-&-filled VBO.  This new VBO can 
//    supply values to use as attributes in our newly-selected shader program:
	gl.bindBuffer(gl.ARRAY_BUFFER,	    // GLenum 'target' for this GPU buffer 
										this.vboLoc);			// the ID# the GPU uses for our VBO.

// c) connect our newly-bound VBO to supply attribute variable values for each
// vertex to our SIMD shader program, using 'vertexAttribPointer()' function.
// this sets up data paths from VBO to our shader units:
  // 	Here's how to use the almost-identical OpenGL version of this function:
	//		http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttribPointer.xml )


  gl.vertexAttribPointer(
		this.a_Pos1Loc,//index == ID# for the attribute var in GLSL shader pgm;
		this.vboFcount_a_Pos1, // # of floats used by this attribute: 1,2,3 or 4?
		gl.FLOAT,		  // type == what data type did we use for those numbers?
		false,				// isNormalized == are these fixed-point values that we need
									//									normalize before use? true or false
		this.vboStride,// Stride == #bytes we must skip in the VBO to move from the
		              // stored attrib for this vertex to the same stored attrib
		              //  for the next vertex in our VBO.  This is usually the 
									// number of bytes used to store one complete vertex.  If set 
									// to zero, the GPU gets attribute values sequentially from 
									// VBO, starting at 'Offset'.	
									// (Our vertex size in bytes: 4 floats for pos + 3 for color)
		this.vboOffset_a_Pos1);						
		              // Offset == how many bytes from START of buffer to the first
  								// value we will actually use?  (we start with position).
  gl.vertexAttribPointer(this.a_Colr1Loc, this.vboFcount_a_Colr1,
                         gl.FLOAT, false, 
  						           this.vboStride,  this.vboOffset_a_Colr1);
  /*gl.vertexAttribPointer(this.a_PtSiz1Loc,this.vboFcount_a_PtSiz1, 
                         gl.FLOAT, false, 
							           this.vboStride,	this.vboOffset_a_PtSiz1);	*/
  gl.vertexAttribPointer(this.a_NormalLoc,this.vboFcount_a_Normal, 
                         gl.FLOAT, false, 
							           this.vboStride,	this.vboOffset_a_Normal);	
  //-- Enable this assignment of the attribute to its' VBO source:
  gl.enableVertexAttribArray(this.a_Pos1Loc);
  gl.enableVertexAttribArray(this.a_Colr1Loc);
  //gl.enableVertexAttribArray(this.a_PtSiz1Loc);
  gl.enableVertexAttribArray(this.a_NormalLoc);


  //NEW port Stuff
  
}

VBObox1.prototype.isReady = function() {
//==============================================================================
// Returns 'true' if our WebGL rendering context ('gl') is ready to render using
// this objects VBO and shader program; else return false.
// see: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter

var isOK = true;

  if(gl.getParameter(gl.CURRENT_PROGRAM) != this.shaderLoc)  {
    console.log(this.constructor.name + 
    						'.isReady() false: shader program at this.shaderLoc not in use!');
    isOK = false;
  }
  if(gl.getParameter(gl.ARRAY_BUFFER_BINDING) != this.vboLoc) {
      console.log(this.constructor.name + 
  						'.isReady() false: vbo at this.vboLoc not in use!');
    isOK = false;
  }
  return isOK;
}

VBObox1.prototype.adjust = function() {
//==============================================================================
// Update the GPU to newer, current values we now store for 'uniform' vars on 
// the GPU; and (if needed) update each attribute's stride and offset in VBO.

  // check: was WebGL context set to use our VBO & shader program?
  if(this.isReady()==false) {
        console.log('ERROR! before' + this.constructor.name + 
  						'.adjust() call you needed to call this.switchToMe()!!');
  }

	// Adjust values for our uniforms,
   this.MVPMatrix.setIdentity();
   this.ModelMatrix.setIdentity();
// THIS DOESN'T WORK!!  this.ModelMatrix = g_worldMat;
  this.MVPMatrix.set(g_worldMat);
  this.MVPMatrix.rotate(g_angleNow0, 0, 0, 1);	// -spin drawing axes,
  this.ModelMatrix.rotate(g_angleNow0, 0, 0, 1);  // -spin drawing axes,

  this.NormalMatrix.setInverseOf(this.ModelMatrix);	
  this.NormalMatrix.transpose();

  // Set Light Position
  this.LightPosition.elements[0] = g_light_x;
  this.LightPosition.elements[1] = g_light_y;
  this.LightPosition.elements[2] = g_light_z;
  this.LightPosition.elements[3] = 0.0;

  // Set Eye Position
  this.EyePosition.elements[0] = eye_position[0];
  this.EyePosition.elements[1] = eye_position[1];
  this.EyePosition.elements[2] = eye_position[2];
  this.EyePosition.elements[3] = 0.0;

  // Set light on or off
  if (g_lightSwitch) {this.LightOn = 1.0;}
  else {this.LightOn = 0.0;}
  
  this.IA.elements[0] = g_IA_r;
  this.IA.elements[1] = g_IA_g;
  this.IA.elements[2] = g_IA_b;

  this.ID.elements[0] = g_ID_r;
  this.ID.elements[1] = g_ID_g;
  this.ID.elements[2] = g_ID_b;
  
  this.IS.elements[0] = g_IS_r;
  this.IS.elements[1] = g_IS_g;
  this.IS.elements[2] = g_IS_b;

  this.KA.elements[0] = g_KA_r;
  this.KA.elements[1] = g_KA_g;
  this.KA.elements[2] = g_KA_b;

  this.KD.elements[0] = g_KD_r;
  this.KD.elements[1] = g_KD_g;
  this.KD.elements[2] = g_KD_b;
  
  this.KS.elements[0] = g_KS_r;
  this.KS.elements[1] = g_KS_g;
  this.KS.elements[2] = g_KS_b;

  this.KE.elements[0] = g_KE_r;
  this.KE.elements[1] = g_KE_g;
  this.KE.elements[2] = g_KE_b;

  this.isBlinn = g_isBlinn;
  this.SE = g_SE;

  //  Transfer new uniforms' values to the GPU:-------------
  // Send  new 'ModelMat' values to the GPU's 'u_ModelMat1' uniform: 
  gl.uniformMatrix4fv(this.u_MVPMatrixLoc, false, this.MVPMatrix.elements);
  gl.uniformMatrix4fv(this.u_ModelMatrixLoc,	// GPU location of the uniform
  										false, 										// use matrix transpose instead?
  										this.ModelMatrix.elements);	// send data from Javascript.

  gl.uniformMatrix4fv(this.u_NormalMatrixLoc, false, this.NormalMatrix.elements);
  gl.uniform4fv(this.u_LightPositionLoc, this.LightPosition.elements);
  gl.uniform4fv(this.u_EyePositionLoc, this.EyePosition.elements);
  gl.uniform1f(this.u_LightOnLoc, this.LightOn);
  gl.uniform3fv(this.u_IALoc, this.IA.elements);
  gl.uniform3fv(this.u_IDLoc, this.ID.elements);
  gl.uniform3fv(this.u_ISLoc, this.IS.elements);
  gl.uniform1f(this.u_LightOnLoc, this.LightOn);
  gl.uniform1i(this.u_isBlinnLoc, this.isBlinn);
  gl.uniform3fv(this.u_KALoc, this.KA.elements);
  gl.uniform3fv(this.u_KDLoc, this.KD.elements);
  gl.uniform3fv(this.u_KSLoc, this.KS.elements);
  gl.uniform3fv(this.u_KELoc, this.KE.elements);
  gl.uniform1f(this.u_SELoc, this.SE);
}

VBObox1.prototype.draw = function() {
//=============================================================================
// Send commands to GPU to select and render current VBObox contents.

  // check: was WebGL context set to use our VBO & shader program?
  if(this.isReady()==false) {
        console.log('ERROR! before' + this.constructor.name + 
  						'.draw() call you needed to call this.switchToMe()!!');
  }
  
  // ----------------------------Draw the contents of the currently-bound VBO:
  gl.drawArrays(gl.TRIANGLE_STRIP,		    // select the drawing primitive to draw:
                  // choices: gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, 
                  //          gl.TRIANGLES, gl.TRIANGLE_STRIP,
  							0, 								// location of 1st vertex to draw;
  							this.vboVerts);		// number of vertices to draw on-screen.
}


VBObox1.prototype.reload = function() {
//=============================================================================
// Over-write current values in the GPU for our already-created VBO: use 
// gl.bufferSubData() call to re-transfer some or all of our Float32Array 
// contents to our VBO without changing any GPU memory allocations.

 gl.bufferSubData(gl.ARRAY_BUFFER, 	// GLenum target(same as 'bindBuffer()')
                  0,                  // byte offset to where data replacement
                                      // begins in the VBO.
 					 				this.vboContents);   // the JS source-data array used to fill VBO
}

/*
VBObox1.prototype.empty = function() {
//=============================================================================
// Remove/release all GPU resources used by this VBObox object, including any 
// shader programs, attributes, uniforms, textures, samplers or other claims on 
// GPU memory.  However, make sure this step is reversible by a call to 
// 'restoreMe()': be sure to retain all our Float32Array data, all values for 
// uniforms, all stride and offset values, etc.
//
//
// 		********   YOU WRITE THIS! ********
//
//
//
}

VBObox1.prototype.restore = function() {
//=============================================================================
// Replace/restore all GPU resources used by this VBObox object, including any 
// shader programs, attributes, uniforms, textures, samplers or other claims on 
// GPU memory.  Use our retained Float32Array data, all values for  uniforms, 
// all stride and offset values, etc.
//
//
// 		********   YOU WRITE THIS! ********
//
//
//
}
*/

function VBObox2() {
//=============================================================================
//=============================================================================
// CONSTRUCTOR for one re-usable 'VBObox2' object that holds all data and fcns
// needed to render vertices from one Vertex Buffer Object (VBO) using one 
// separate shader program (a vertex-shader & fragment-shader pair) and one
// set of 'uniform' variables.

// Constructor goal: 
// Create and set member vars that will ELIMINATE ALL LITERALS (numerical values 
// written into code) in all other VBObox functions. Keeping all these (initial)
// values here, in this one coonstrutor function, ensures we can change them 
// easily WITHOUT disrupting any other code, ever!
  this.VERT_SRC = 
  'uniform mat4 u_MVPMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec3 a_Normal;\n' +
  'varying vec4 v_normVec;\n' +
  'varying vec4 v_Position;\n' +

  //
  'void main() {\n' +
  '  gl_Position = u_MVPMatrix * a_Position;\n' +
  '  v_Position = u_ModelMatrix * a_Position;\n' + 
  '  v_normVec = u_NormalMatrix * vec4(a_Normal, 1.0);\n' + 
  ' }\n';

  this.FRAG_SRC = 
  'precision mediump float;\n' +
  'uniform vec4 u_LightPosition;\n' +
  'uniform vec4 u_EyePosition;\n' +
  'uniform float u_LightOn;\n' +
  'uniform vec3 u_IA;\n' +
  'uniform vec3 u_ID;\n' +
  'uniform vec3 u_IS;\n' +
  'uniform vec3 u_KA;\n' +
  'uniform vec3 u_KD;\n' +
  'uniform vec3 u_KS;\n' +
  'uniform vec3 u_KE;\n' +
  'uniform float u_SE;\n' +
  'uniform int u_isBlinn;\n' +
  'varying vec4 v_normVec;\n' +
  'varying vec4 v_Position;\n' +

  'void main() {\n' +
  'vec3 normVec = normalize(v_normVec.xyz);\n' +
  'vec3 posVec = normalize(v_Position.xyz);\n' +
  'vec3 lightVec = normalize((u_LightPosition.xyz) - posVec);\n' +
  'vec3 eyeVec = normalize((u_EyePosition.xyz) - posVec);\n' +
  '  if (u_isBlinn == 1) {\n' +
  '    vec3 halfVec = normalize(lightVec + eyeVec);\n' +
  '    gl_FragColor = vec4(u_KE + u_LightOn * (u_IA*u_KA + u_ID*u_KD*max(0.0, dot(normVec,lightVec)) + u_IS*u_KS*pow(max(0.0, dot(normVec, halfVec)), u_SE)), 1.0);\n' +
  '  }\n' +
  '  else {\n' +
  '    vec3 reflectVec = -1.0 * reflect(lightVec, normVec);\n' +
  '    gl_FragColor = vec4(u_KE + u_LightOn * (u_IA*u_KA + u_ID*u_KD*max(0.0, dot(normVec,lightVec)) + u_IS*u_KS*pow(max(0.0, dot(reflectVec, eyeVec)), u_SE)), 1.0);\n' +
  '  }\n' +
  '}\n';

 //New Stuff: Make each 3D shape in its own array of vertices:

    // how many floats total needed to store all shapes?
  var mySiz = (gsphVerts.length);

  // How many vertices total?
  var nn = mySiz / (floatsPerVertex+3);
  console.log('nn is', nn, 'mySiz is', mySiz, 'floatsPerVertex is', floatsPerVertex+3);
  // Copy all shapes into one big Float32 array:
    var colorShapes = new Float32Array(mySiz);
  this.vboContents = new Float32Array(mySiz)
  // Copy them:  remember where to start for each shape:
  gsphStart = 0;              // we stored the cylinder first.
    for(i=0,j=0; j< gsphVerts.length; i++,j++) {
      colorShapes[i] = gsphVerts[j];
    }

  this.vboContents = colorShapes;
    

  //Back to Old Stuff:
  /*

  this.vboContents = //---------------------------------------------------------
    new Float32Array ([         // Array of vertex attribute values we will
                                // transfer to GPU's vertex buffer object (VBO)
      // 1 vertex per line: pos1 x,y,z,w;   colr1; r,g,b;   ptSiz1; 
    -0.3,  0.7, 0.0, 1.0,   0.0, 1.0, 1.0,  17.0,
    -0.3, -0.3, 0.0, 1.0,   1.0, 0.0, 1.0,  20.0,
     0.3, -0.3, 0.0, 1.0,   1.0, 1.0, 0.0,  33.0,
  ]); */
  
  this.vboVerts = nn;             // # of vertices held in 'vboContents' array;
  this.FSIZE = this.vboContents.BYTES_PER_ELEMENT;  
                                // bytes req'd by 1 vboContents array element;
                                // (why? used to compute stride and offset 
                                // in bytes for vertexAttribPointer() calls)
    this.vboBytes = this.vboContents.length * this.FSIZE;               
                                // (#  of floats in vboContents array) * 
                                // (# of bytes/float).
  this.vboStride = this.vboBytes / this.vboVerts;     
                                // (== # of bytes to store one complete vertex).
                                // From any attrib in a given vertex in the VBO, 
                                // move forward by 'vboStride' bytes to arrive 
                                // at the same attrib for the next vertex.
                                 
              //----------------------Attribute sizes
  this.vboFcount_a_Pos1 =  4;    // # of floats in the VBO needed to store the
                                // attribute named a_Pos1. (4: x,y,z,w values)
  this.vboFcount_a_Colr1 = 3;   // # of floats for this attrib (r,g,b values)
  this.vboFcount_a_PtSiz1 = 1;  // # of floats for this attrib (just one!)   
  this.vboFcount_a_Normal = 3;
  console.assert((this.vboFcount_a_Pos1 +     // check the size of each and
                  this.vboFcount_a_Colr1 +
                  this.vboFcount_a_Normal) *   // every attribute in our VBO
                  this.FSIZE == this.vboStride, // for agreeement with'stride'
                  "Uh oh! VBObox2.vboStride disagrees with attribute-size values!");
                  
              //----------------------Attribute offsets
  this.vboOffset_a_Pos1 = 0;    //# of bytes from START of vbo to the START
                                // of 1st a_Pos1 attrib value in vboContents[]
  this.vboOffset_a_Colr1 = (this.vboFcount_a_Pos1) * this.FSIZE;  
                                // == 4 floats * bytes/float
                                //# of bytes from START of vbo to the START
                                // of 1st a_Colr1 attrib value in vboContents[]
  this.vboOffset_a_Normal =(this.vboFcount_a_Pos1 +
                            this.vboFcount_a_Colr1) * this.FSIZE; 
                                // == 7 floats * bytes/float
                                // # of bytes from START of vbo to the START
                                // of 1st a_PtSize attrib value in vboContents[]

              //-----------------------GPU memory locations:                                
  this.vboLoc;                  // GPU Location for Vertex Buffer Object, 
                                // returned by gl.createBuffer() function call
  this.shaderLoc;               // GPU Location for compiled Shader-program  
                                // set by compile/link of VERT_SRC and FRAG_SRC.
                          //------Attribute locations in our shaders:
  this.a_Pos1Loc;               // GPU location: shader 'a_Pos1' attribute
  //this.a_Colr1Loc;              // GPU location: shader 'a_Colr1' attribute
  this.a_PtSiz1Loc;             // GPU location: shader 'a_PtSiz1' attribute
  this.a_NormalLoc;
  
              //---------------------- Uniform locations &values in our shaders
  this.MVPMatrix = new Matrix4();
  this.ModelMatrix = new Matrix4(); // Transforms CVV axes to model axes.
  this.NormalMatrix = new Matrix4();
  this.LightPosition = new Vector4();
  this.EyePosition = new Vector4();
  this.LightOn = 1.0;
  this.IA = new Vector3();
  this.ID = new Vector3();
  this.IS = new Vector3();
  this.KA = new Vector3();
  this.KD = new Vector3();
  this.KS = new Vector3();
  this.KE = new Vector3();
  this.isBlinn = 1;
  this.SE = 1.0;
  this.u_MVPMatrixLoc;
  this.u_ModelMatrixLoc;            // GPU location for u_ModelMat uniform
  this.u_NormalMatrixLoc;
  this.u_LightPositionLoc;
  this.u_EyePositionLoc;
  this.u_LightOnLoc;
  this.u_IALoc;
  this.u_IDLoc;
  this.u_ISLoc;
  this.u_KALoc;
  this.u_KDLoc;
  this.u_KSLoc;
  this.u_KELoc;
  this.u_isBlinnLoc;
  this.u_SELoc
};


VBObox2.prototype.init = function() {
//==============================================================================
// Prepare the GPU to use all vertices, GLSL shaders, attributes, & uniforms 
// kept in this VBObox. (This function usually called only once, within main()).
// Specifically:
// a) Create, compile, link our GLSL vertex- and fragment-shaders to form an 
//  executable 'program' stored and ready to use inside the GPU.  
// b) create a new VBO object in GPU memory and fill it by transferring in all
//  the vertex data held in our Float32array member 'VBOcontents'. 
// c) Find & save the GPU location of all our shaders' attribute-variables and 
//  uniform-variables (needed by switchToMe(), adjust(), draw(), reload(), etc.)
// -------------------
// CAREFUL!  before you can draw pictures using this VBObox contents, 
//  you must call this VBObox object's switchToMe() function too!
//--------------------
// a) Compile,link,upload shaders-----------------------------------------------
  this.shaderLoc = createProgram(gl, this.VERT_SRC, this.FRAG_SRC);
  if (!this.shaderLoc) {
    console.log(this.constructor.name + 
                '.init() failed to create executable Shaders on the GPU. Bye!');
    return;
  }
// CUTE TRICK: let's print the NAME of this VBObox object: tells us which one!
//  else{console.log('You called: '+ this.constructor.name + '.init() fcn!');}

  gl.program = this.shaderLoc;    // (to match cuon-utils.js -- initShaders())

// b) Create VBO on GPU, fill it------------------------------------------------
  this.vboLoc = gl.createBuffer();  
  if (!this.vboLoc) {
    console.log(this.constructor.name + 
                '.init() failed to create VBO in GPU. Bye!'); 
    return;
  }
  
  // Specify the purpose of our newly-created VBO on the GPU.  Your choices are:
  //  == "gl.ARRAY_BUFFER" : the VBO holds vertices, each made of attributes 
  // (positions, colors, normals, etc), or 
  //  == "gl.ELEMENT_ARRAY_BUFFER" : the VBO holds indices only; integer values 
  // that each select one vertex from a vertex array stored in another VBO.
  gl.bindBuffer(gl.ARRAY_BUFFER,        // GLenum 'target' for this GPU buffer 
                  this.vboLoc);         // the ID# the GPU uses for this buffer.
                        
  // Fill the GPU's newly-created VBO object with the vertex data we stored in
  //  our 'vboContents' member (JavaScript Float32Array object).
  //  (Recall gl.bufferData() will evoke GPU's memory allocation & management: 
  //   use gl.bufferSubData() to modify VBO contents without changing VBO size)
  gl.bufferData(gl.ARRAY_BUFFER,        // GLenum target(same as 'bindBuffer()')
                  this.vboContents,     // JavaScript Float32Array
                  gl.STATIC_DRAW);      // Usage hint.  
  //  The 'hint' helps GPU allocate its shared memory for best speed & efficiency
  //  (see OpenGL ES specification for more info).  Your choices are:
  //    --STATIC_DRAW is for vertex buffers rendered many times, but whose 
  //        contents rarely or never change.
  //    --DYNAMIC_DRAW is for vertex buffers rendered many times, but whose 
  //        contents may change often as our program runs.
  //    --STREAM_DRAW is for vertex buffers that are rendered a small number of 
  //      times and then discarded; for rapidly supplied & consumed VBOs.

// c1) Find All Attributes:-----------------------------------------------------
//  Find & save the GPU location of all our shaders' attribute-variables and 
//  uniform-variables (for switchToMe(), adjust(), draw(), reload(), etc.)
  this.a_Pos1Loc = gl.getAttribLocation(this.shaderLoc, 'a_Position');
  if(this.a_Pos1Loc < 0) {
    console.log(this.constructor.name + 
                '.init() Failed to get GPU location of attribute a_Position');
    return -1;  // error exit.
  }
  //this.a_Colr1Loc = gl.getAttribLocation(this.shaderLoc, 'a_Color');
  //if(this.a_Colr1Loc < 0) {
    //console.log(this.constructor.name + 
                //'.init() failed to get the GPU location of attribute a_Color');
    //return -1;  // error exit.
  //}
  /*this.a_PtSiz1Loc = gl.getAttribLocation(this.shaderLoc, 'a_PtSiz1');
  if(this.a_PtSiz1Loc < 0) {
    console.log(this.constructor.name + 
                '.init() failed to get the GPU location of attribute a_PtSiz1');
    return -1;  // error exit.
  }*/
  this.a_NormalLoc = gl.getAttribLocation(this.shaderLoc, 'a_Normal');
  if(this.a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return -1;
  }
  // c2) Find All Uniforms:-----------------------------------------------------
  //Get GPU storage location for each uniform var used in our shader programs: 

  this.u_MVPMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_MVPMatrix');
  if (!this.u_MVPMatrixLoc) { 
    console.log(this.constructor.name + 
                '.init() failed to get GPU location for u_MVPMatrix uniform');
    return;
  }

  this.u_ModelMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_ModelMatrix');
  if (!this.u_ModelMatrixLoc) { 
    console.log(this.constructor.name + 
                '.init() failed to get GPU location for u_ModelMatrix uniform');
    return;
  }

  this.u_NormalMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_NormalMatrix'); 
  if(!this.u_NormalMatrixLoc) { 
    console.log('Failed to get GPU storage location for u_NormalMatrix'); 
    return  
  }

  this.u_LightPositionLoc = gl.getUniformLocation(this.shaderLoc, 'u_LightPosition'); 
  if(!this.u_LightPositionLoc) { 
    console.log('Failed to get GPU storage location for u_LightPosition'); 
    return  
  }

  this.u_EyePositionLoc = gl.getUniformLocation(this.shaderLoc, 'u_EyePosition'); 
  if(!this.u_EyePositionLoc) { 
    console.log('Failed to get GPU storage location for u_EyePosition'); 
    return  
  }

  this.u_LightOnLoc = gl.getUniformLocation(this.shaderLoc, 'u_LightOn'); 
  if(!this.u_LightOnLoc) { 
    console.log('Failed to get GPU storage location for u_LightOn'); 
    return  
  }

  this.u_IALoc = gl.getUniformLocation(this.shaderLoc, 'u_IA'); 
  if(!this.u_IALoc) { 
    console.log('Failed to get GPU storage location for u_IA'); 
    return  
  }

  this.u_IDLoc = gl.getUniformLocation(this.shaderLoc, 'u_ID'); 
  if(!this.u_IDLoc) { 
    console.log('Failed to get GPU storage location for u_ID'); 
    return  
  }

  this.u_ISLoc = gl.getUniformLocation(this.shaderLoc, 'u_IS'); 
  if(!this.u_ISLoc) { 
    console.log('Failed to get GPU storage location for u_IS'); 
    return  
  }

  this.u_KALoc = gl.getUniformLocation(this.shaderLoc, 'u_KA'); 
  if(!this.u_KALoc) { 
    console.log('Failed to get GPU storage location for u_KA'); 
    return  
  }

  this.u_KDLoc = gl.getUniformLocation(this.shaderLoc, 'u_KD'); 
  if(!this.u_KDLoc) { 
    console.log('Failed to get GPU storage location for u_KD'); 
    return  
  }

  this.u_KSLoc = gl.getUniformLocation(this.shaderLoc, 'u_KS'); 
  if(!this.u_KSLoc) { 
    console.log('Failed to get GPU storage location for u_KS'); 
    return  
  }

  this.u_KELoc = gl.getUniformLocation(this.shaderLoc, 'u_KE'); 
  if(!this.u_KELoc) { 
    console.log('Failed to get GPU storage location for u_KE'); 
    return  
  }

  this.u_isBlinnLoc = gl.getUniformLocation(this.shaderLoc, 'u_isBlinn'); 
  if(!this.u_isBlinnLoc) { 
    console.log('Failed to get GPU storage location for u_isBlinn'); 
    return  
  }

  this.u_SELoc = gl.getUniformLocation(this.shaderLoc, 'u_SE'); 
  if(!this.u_SELoc) { 
    console.log('Failed to get GPU storage location for u_SE'); 
    return  
  }
}

VBObox2.prototype.switchToMe = function () {
//==============================================================================
// Set GPU to use this VBObox's contents (VBO, shader, attributes, uniforms...)
//
// We only do this AFTER we called the init() function, which does the one-time-
// only setup tasks to put our VBObox contents into GPU memory.  !SURPRISE!
// even then, you are STILL not ready to draw our VBObox's contents onscreen!
// We must also first complete these steps:
//  a) tell the GPU to use our VBObox's shader program (already in GPU memory),
//  b) tell the GPU to use our VBObox's VBO  (already in GPU memory),
//  c) tell the GPU to connect the shader program's attributes to that VBO.

// a) select our shader program:
  gl.useProgram(this.shaderLoc);  
//    Each call to useProgram() selects a shader program from the GPU memory,
// but that's all -- it does nothing else!  Any previously used shader program's 
// connections to attributes and uniforms are now invalid, and thus we must now
// establish new connections between our shader program's attributes and the VBO
// we wish to use.  
  
// b) call bindBuffer to disconnect the GPU from its currently-bound VBO and
//  instead connect to our own already-created-&-filled VBO.  This new VBO can 
//    supply values to use as attributes in our newly-selected shader program:
  gl.bindBuffer(gl.ARRAY_BUFFER,      // GLenum 'target' for this GPU buffer 
                    this.vboLoc);     // the ID# the GPU uses for our VBO.

// c) connect our newly-bound VBO to supply attribute variable values for each
// vertex to our SIMD shader program, using 'vertexAttribPointer()' function.
// this sets up data paths from VBO to our shader units:
  //  Here's how to use the almost-identical OpenGL version of this function:
  //    http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttribPointer.xml )


  gl.vertexAttribPointer(
    this.a_Pos1Loc,//index == ID# for the attribute var in GLSL shader pgm;
    this.vboFcount_a_Pos1, // # of floats used by this attribute: 1,2,3 or 4?
    gl.FLOAT,     // type == what data type did we use for those numbers?
    false,        // isNormalized == are these fixed-point values that we need
                  //                  normalize before use? true or false
    this.vboStride,// Stride == #bytes we must skip in the VBO to move from the
                  // stored attrib for this vertex to the same stored attrib
                  //  for the next vertex in our VBO.  This is usually the 
                  // number of bytes used to store one complete vertex.  If set 
                  // to zero, the GPU gets attribute values sequentially from 
                  // VBO, starting at 'Offset'. 
                  // (Our vertex size in bytes: 4 floats for pos + 3 for color)
    this.vboOffset_a_Pos1);           
                  // Offset == how many bytes from START of buffer to the first
                  // value we will actually use?  (we start with position).
  /*gl.vertexAttribPointer(this.a_Colr1Loc, this.vboFcount_a_Colr1,
                         gl.FLOAT, false, 
                         this.vboStride,  this.vboOffset_a_Colr1);*/
  /*gl.vertexAttribPointer(this.a_PtSiz1Loc,this.vboFcount_a_PtSiz1, 
                         gl.FLOAT, false, 
                         this.vboStride,  this.vboOffset_a_PtSiz1); */
  gl.vertexAttribPointer(this.a_NormalLoc,this.vboFcount_a_Normal, 
                         gl.FLOAT, false, 
                         this.vboStride,  this.vboOffset_a_Normal); 
  //-- Enable this assignment of the attribute to its' VBO source:
  gl.enableVertexAttribArray(this.a_Pos1Loc);
  //gl.enableVertexAttribArray(this.a_Colr1Loc);
  //gl.enableVertexAttribArray(this.a_PtSiz1Loc);
  gl.enableVertexAttribArray(this.a_NormalLoc);


  //NEW port Stuff
  
}

VBObox2.prototype.isReady = function() {
//==============================================================================
// Returns 'true' if our WebGL rendering context ('gl') is ready to render using
// this objects VBO and shader program; else return false.
// see: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter

var isOK = true;

  if(gl.getParameter(gl.CURRENT_PROGRAM) != this.shaderLoc)  {
    console.log(this.constructor.name + 
                '.isReady() false: shader program at this.shaderLoc not in use!');
    isOK = false;
  }
  if(gl.getParameter(gl.ARRAY_BUFFER_BINDING) != this.vboLoc) {
      console.log(this.constructor.name + 
              '.isReady() false: vbo at this.vboLoc not in use!');
    isOK = false;
  }
  return isOK;
}

VBObox2.prototype.adjust = function() {
//==============================================================================
// Update the GPU to newer, current values we now store for 'uniform' vars on 
// the GPU; and (if needed) update each attribute's stride and offset in VBO.

  // check: was WebGL context set to use our VBO & shader program?
  if(this.isReady()==false) {
        console.log('ERROR! before' + this.constructor.name + 
              '.adjust() call you needed to call this.switchToMe()!!');
  }

  // Adjust values for our uniforms,
   this.MVPMatrix.setIdentity();
   this.ModelMatrix.setIdentity();
// THIS DOESN'T WORK!!  this.ModelMatrix = g_worldMat;
  this.MVPMatrix.set(g_worldMat);
  this.MVPMatrix.rotate(g_angleNow0, 0, 0, 1);  // -spin drawing axes,
  this.ModelMatrix.rotate(g_angleNow0, 0, 0, 1);  // -spin drawing axes,

  this.NormalMatrix.setInverseOf(this.ModelMatrix); 
  this.NormalMatrix.transpose();

  // Set Light Position
  this.LightPosition.elements[0] = g_light_x;
  this.LightPosition.elements[1] = g_light_y;
  this.LightPosition.elements[2] = g_light_z;
  this.LightPosition.elements[3] = 0.0;

  // Set Eye Position
  this.EyePosition.elements[0] = eye_position[0];
  this.EyePosition.elements[1] = eye_position[1];
  this.EyePosition.elements[2] = eye_position[2];
  this.EyePosition.elements[3] = 0.0;

  // Set light on or off
  if (g_lightSwitch) {this.LightOn = 1.0;}
  else {this.LightOn = 0.0;}
  
  this.IA.elements[0] = g_IA_r;
  this.IA.elements[1] = g_IA_g;
  this.IA.elements[2] = g_IA_b;

  this.ID.elements[0] = g_ID_r;
  this.ID.elements[1] = g_ID_g;
  this.ID.elements[2] = g_ID_b;
  
  this.IS.elements[0] = g_IS_r;
  this.IS.elements[1] = g_IS_g;
  this.IS.elements[2] = g_IS_b;

  this.KA.elements[0] = g_KA_r;
  this.KA.elements[1] = g_KA_g;
  this.KA.elements[2] = g_KA_b;

  this.KD.elements[0] = g_KD_r;
  this.KD.elements[1] = g_KD_g;
  this.KD.elements[2] = g_KD_b;
  
  this.KS.elements[0] = g_KS_r;
  this.KS.elements[1] = g_KS_g;
  this.KS.elements[2] = g_KS_b;

  this.KE.elements[0] = g_KE_r;
  this.KE.elements[1] = g_KE_g;
  this.KE.elements[2] = g_KE_b;

  this.isBlinn = g_isBlinn;
  this.SE = g_SE;

  //  Transfer new uniforms' values to the GPU:-------------
  // Send  new 'ModelMat' values to the GPU's 'u_ModelMat1' uniform: 
  gl.uniformMatrix4fv(this.u_MVPMatrixLoc, false, this.MVPMatrix.elements);
  gl.uniformMatrix4fv(this.u_ModelMatrixLoc,  // GPU location of the uniform
                      false,                    // use matrix transpose instead?
                      this.ModelMatrix.elements); // send data from Javascript.

  gl.uniformMatrix4fv(this.u_NormalMatrixLoc, false, this.NormalMatrix.elements);
  gl.uniform4fv(this.u_LightPositionLoc, this.LightPosition.elements);
  gl.uniform4fv(this.u_EyePositionLoc, this.EyePosition.elements);
  gl.uniform1f(this.u_LightOnLoc, this.LightOn);
  gl.uniform3fv(this.u_IALoc, this.IA.elements);
  gl.uniform3fv(this.u_IDLoc, this.ID.elements);
  gl.uniform3fv(this.u_ISLoc, this.IS.elements);
  gl.uniform1f(this.u_LightOnLoc, this.LightOn);
  gl.uniform1i(this.u_isBlinnLoc, this.isBlinn);
  gl.uniform3fv(this.u_KALoc, this.KA.elements);
  gl.uniform3fv(this.u_KDLoc, this.KD.elements);
  gl.uniform3fv(this.u_KSLoc, this.KS.elements);
  gl.uniform3fv(this.u_KELoc, this.KE.elements);
  gl.uniform1f(this.u_SELoc, this.SE);
}

VBObox2.prototype.draw = function() {
//=============================================================================
// Send commands to GPU to select and render current VBObox contents.

  // check: was WebGL context set to use our VBO & shader program?
  if(this.isReady()==false) {
        console.log('ERROR! before' + this.constructor.name + 
              '.draw() call you needed to call this.switchToMe()!!');
  }
  
  // ----------------------------Draw the contents of the currently-bound VBO:
  gl.drawArrays(gl.TRIANGLE_STRIP,        // select the drawing primitive to draw:
                  // choices: gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, 
                  //          gl.TRIANGLES, gl.TRIANGLE_STRIP,
                0,                // location of 1st vertex to draw;
                this.vboVerts);   // number of vertices to draw on-screen.
}


VBObox2.prototype.reload = function() {
//=============================================================================
// Over-write current values in the GPU for our already-created VBO: use 
// gl.bufferSubData() call to re-transfer some or all of our Float32Array 
// contents to our VBO without changing any GPU memory allocations.

 gl.bufferSubData(gl.ARRAY_BUFFER,  // GLenum target(same as 'bindBuffer()')
                  0,                  // byte offset to where data replacement
                                      // begins in the VBO.
                  this.vboContents);   // the JS source-data array used to fill VBO
}

/*
VBObox2.prototype.empty = function() {
//=============================================================================
// Remove/release all GPU resources used by this VBObox object, including any 
// shader programs, attributes, uniforms, textures, samplers or other claims on 
// GPU memory.  However, make sure this step is reversible by a call to 
// 'restoreMe()': be sure to retain all our Float32Array data, all values for 
// uniforms, all stride and offset values, etc.
//
//
//    ********   YOU WRITE THIS! ********
//
//
//
}

VBObox2.prototype.restore = function() {
//=============================================================================
// Replace/restore all GPU resources used by this VBObox object, including any 
// shader programs, attributes, uniforms, textures, samplers or other claims on 
// GPU memory.  Use our retained Float32Array data, all values for  uniforms, 
// all stride and offset values, etc.
//
//
//    ********   YOU WRITE THIS! ********
//
//
//
}
*/
// OLD VBObox2
/*
//=============================================================================
//=============================================================================
function VBObox2() {
//=============================================================================
//=============================================================================
// CONSTRUCTOR for one re-usable 'VBObox2' object that holds all data and fcns
// needed to render vertices from one Vertex Buffer Object (VBO) using one 
// separate shader program (a vertex-shader & fragment-shader pair) and one
// set of 'uniform' variables.

// Constructor goal: 
// Create and set member vars that will ELIMINATE ALL LITERALS (numerical values 
// written into code) in all other VBObox functions. Keeping all these (initial)
// values here, in this one coonstrutor function, ensures we can change them 
// easily WITHOUT disrupting any other code, ever!
  
	this.VERT_SRC =	//--------------------- VERTEX SHADER source code 
  'precision highp float;\n' +				// req'd in OpenGL ES if we use 'float'
  //
  'uniform mat4 u_ModelMatrix;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec3 a_Color;\n'+
  'attribute float a_PtSize; \n' +
  'varying vec3 v_Colr;\n' +
  //
  'void main() {\n' +
  '  gl_PointSize = a_PtSize;\n' +
  '  gl_Position = u_ModelMatrix * a_Position;\n' +
  '	 v_Colr = a_Color;\n' + 
  ' }\n';

	this.FRAG_SRC = //---------------------- FRAGMENT SHADER source code 
  'precision mediump float;\n' +
  'varying vec3 v_Colr;\n' +
  'void main() {\n' +
  '  gl_FragColor = vec4(v_Colr, 1.0);\n' +  
  //'gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n' +
  '}\n';

	this.vboContents = //---------------------------------------------------------
		new Float32Array ([					// Array of vertex attribute values we will
  															// transfer to GPU's vertex buffer object (VBO)
			// 1 vertex per line: pos x,y,z,w;   color; r,g,b;   point-size; 
  	-0.3,  0.5,	0.0, 1.0,		1.0, 0.3, 0.3,   7.0,   // (bright red)
    -0.3, -0.3, 0.0, 1.0,		0.3, 1.0, 0.3,  14.0,   // (bright green)
     0.3, -0.3, 0.0, 1.0,		0.3, 0.3, 1.0,  21.0,   // (bright blue)
     0.3,  0.3, 0.0, 1.0,   0.5, 0.5, 0.5,  18.0,   // (gray)
  ]);
	
	this.vboVerts = 4;							// # of vertices held in 'vboContents' array;
	this.FSIZE = this.vboContents.BYTES_PER_ELEMENT;
	                              // bytes req'd by 1 vboContents array element;
																// (why? used to compute stride and offset 
																// in bytes for vertexAttribPointer() calls)
  this.vboBytes = this.vboContents.length * this.FSIZE;               
                                // (#  of floats in vboContents array) * 
                                // (# of bytes/float).
	this.vboStride = this.vboBytes / this.vboVerts;     
	                              // From any attrib in a given vertex, 
	                              // move forward by 'vboStride' bytes to arrive 
	                              // at the same attrib for the next vertex. 
	                              // (== # of bytes used to store one vertex) 
	                              
	            //----------------------Attribute sizes
  this.vboFcount_a_Position = 4;  // # of floats in the VBO needed to store the
                                // attribute named a_Position (4: x,y,z,w values)
  this.vboFcount_a_Color = 3;   // # of floats for this attrib (r,g,b values)
  this.vboFcount_a_PtSize = 1;  // # of floats for this attrib (just one!)
               //----------------------Attribute offsets
	this.vboOffset_a_Position = 0;   
	                              //# of bytes from START of vbo to the START
	                              // of 1st a_Position attrib value in vboContents[]
  this.vboOffset_a_Color = (this.vboFcount_a_Position) * this.FSIZE;  
                                // == 4 floats * bytes/float
                                //# of bytes from START of vbo to the START
                                // of 1st a_Color attrib value in vboContents[]
  this.vboOffset_a_PtSize = (this.vboFcount_a_Position +
                             this.vboFcount_a_Color) * this.FSIZE; 
                                // == 7 floats * bytes/float
                                // # of bytes from START of vbo to the START
                                // of 1st a_PtSize attrib value in vboContents[]
                                
	            //-----------------------GPU memory locations:
	this.vboLoc;									// GPU Location for Vertex Buffer Object, 
	                              // returned by gl.createBuffer() function call
	this.shaderLoc;								// GPU Location for compiled Shader-program  
	                            	// set by compile/link of VERT_SRC and FRAG_SRC.
								          //------Attribute locations in our shaders:
	this.a_PositionLoc;							// GPU location: shader 'a_Position' attribute
	this.a_ColorLoc;								// GPU location: shader 'a_Color' attribute
	this.a_PtSizeLoc;								// GPU location: shader 'a_PtSize' attribute

	
	            //---------------------- Uniform locations &values in our shaders
	this.ModelMatrix = new Matrix4();	// Transforms CVV axes to model axes.
	this.u_ModelMatrixLoc;						// GPU location for u_ModelMat uniform
	this.u_NormalMatrixLoc;
};



VBObox2.prototype.init = function() {
//=============================================================================
// Prepare the GPU to use all vertices, GLSL shaders, attributes, & uniforms 
// kept in this VBObox. (This function usually called only once, within main()).
// Specifically:
// a) Create, compile, link our GLSL vertex- and fragment-shaders to form an 
//  executable 'program' stored and ready to use inside the GPU.  
// b) create a new VBO object in GPU memory and fill it by transferring in all
//  the vertex data held in our Float32array member 'VBOcontents'. 
// c) Find & save the GPU location of all our shaders' attribute-variables and 
//  uniform-variables (needed by switchToMe(), adjust(), draw(), reload(), etc.)
// 
// CAREFUL!  before you can draw pictures using this VBObox contents, 
//  you must call this VBObox object's switchToMe() function too!

  // a) Compile,link,upload shaders---------------------------------------------
	this.shaderLoc = createProgram(gl, this.VERT_SRC, this.FRAG_SRC);
	if (!this.shaderLoc) {
    console.log(this.constructor.name + 
    						'.init() failed to create executable Shaders on the GPU. Bye!');
    return;
  }
  // CUTE TRICK: let's print the NAME of this VBObox object: tells us which one!
  //  else{console.log('You called: '+ this.constructor.name + '.init() fcn!');}

	gl.program = this.shaderLoc;		// (to match cuon-utils.js -- initShaders())

  // b) Create VBO on GPU, fill it----------------------------------------------
	this.vboLoc = gl.createBuffer();	
  if (!this.vboLoc) {
    console.log(this.constructor.name + 
    						'.init() failed to create VBO in GPU. Bye!'); 
    return;
  }
  // Specify the purpose of our newly-created VBO.  Your choices are:
  //	== "gl.ARRAY_BUFFER" : the VBO holds vertices, each made of attributes 
  // (positions, colors, normals, etc), or 
  //	== "gl.ELEMENT_ARRAY_BUFFER" : the VBO holds indices only; integer values 
  // that each select one vertex from a vertex array stored in another VBO.
  gl.bindBuffer(gl.ARRAY_BUFFER,	    // GLenum 'target' for this GPU buffer 
  								this.vboLoc);				// the ID# the GPU uses for this buffer.

  // Fill the GPU's newly-created VBO object with the vertex data we stored in
  //  our 'vboContents' member (JavaScript Float32Array object).
  //  (Recall gl.bufferData() will evoke GPU's memory allocation & managemt: use 
  //		gl.bufferSubData() to modify VBO contents without changing VBO size)
  gl.bufferData(gl.ARRAY_BUFFER, 			  // GLenum target(same as 'bindBuffer()')
 					 				this.vboContents, 		// JavaScript Float32Array
  							 	gl.STATIC_DRAW);			// Usage hint.
  //	The 'hint' helps GPU allocate its shared memory for best speed & efficiency
  //	(see OpenGL ES specification for more info).  Your choices are:
  //		--STATIC_DRAW is for vertex buffers rendered many times, but whose 
  //				contents rarely or never change.
  //		--DYNAMIC_DRAW is for vertex buffers rendered many times, but whose 
  //				contents may change often as our program runs.
  //		--STREAM_DRAW is for vertex buffers that are rendered a small number of 
  // 			times and then discarded; for rapidly supplied & consumed VBOs.

  // c1) Find All Attributes:---------------------------------------------------
  //  Find & save the GPU location of all our shaders' attribute-variables and 
  //  uniform-variables (for switchToMe(), adjust(), draw(), reload(),etc.)
  this.a_PositionLoc = gl.getAttribLocation(this.shaderLoc, 'a_Position');
  if(this.a_PositionLoc < 0) {
    console.log(this.constructor.name + 
    						'.init() Failed to get GPU location of attribute a_Position');
    return -1;	// error exit.
  }
 	this.a_ColorLoc = gl.getAttribLocation(this.shaderLoc, 'a_Color');
  if(this.a_ColorLoc < 0) {
    console.log(this.constructor.name + 
    						'.init() failed to get the GPU location of attribute a_Color');
    return -1;	// error exit.
  }
  this.a_PtSizeLoc = gl.getAttribLocation(this.shaderLoc, 'a_PtSize');
  if(this.a_PtSizeLoc < 0) {
    console.log(this.constructor.name + 
	    					'.init() failed to get the GPU location of attribute a_PtSize');
	  return -1;	// error exit.
  }
  // c2) Find All Uniforms:-----------------------------------------------------
  //Get GPU storage location for each uniform var used in our shader programs: 
 this.u_ModelMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_ModelMatrix');
  if (!this.u_ModelMatrixLoc) { 
    console.log(this.constructor.name + 
    						'.init() failed to get GPU location for u_ModelMatrix uniform');
    return;
  }
}

VBObox2.prototype.switchToMe = function() {
//==============================================================================
// Set GPU to use this VBObox's contents (VBO, shader, attributes, uniforms...)
//
// We only do this AFTER we called the init() function, which does the one-time-
// only setup tasks to put our VBObox contents into GPU memory.  !SURPRISE!
// even then, you are STILL not ready to draw our VBObox's contents onscreen!
// We must also first complete these steps:
//  a) tell the GPU to use our VBObox's shader program (already in GPU memory),
//  b) tell the GPU to use our VBObox's VBO  (already in GPU memory),
//  c) tell the GPU to connect the shader program's attributes to that VBO.

// a) select our shader program:
  gl.useProgram(this.shaderLoc);
//		Each call to useProgram() selects a shader program from the GPU memory,
// but that's all -- it does nothing else!  Any previously used shader program's 
// connections to attributes and uniforms are now invalid, and thus we must now
// establish new connections between our shader program's attributes and the VBO
// we wish to use.  
  
// b) call bindBuffer to disconnect the GPU from its currently-bound VBO and
//  instead connect to our own already-created-&-filled VBO.  This new VBO can 
//    supply values to use as attributes in our newly-selected shader program:
	gl.bindBuffer(gl.ARRAY_BUFFER,	    // GLenum 'target' for this GPU buffer 
										this.vboLoc);			// the ID# the GPU uses for our VBO.

// c) connect our newly-bound VBO to supply attribute variable values for each
// vertex to our SIMD shader program, using 'vertexAttribPointer()' function.
// this sets up data paths from VBO to our shader units:
  // 	Here's how to use the almost-identical OpenGL version of this function:
	//		http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttribPointer.xml )

  var FSIZE = this.vboContents.BYTES_PER_ELEMENT;

  gl.vertexAttribPointer(
		this.a_PositionLoc,//index == ID# for the attribute var in GLSL shader pgm;
		this.vboFcount_a_Position, // # of floats used by this attribute: 1,2,3 or 4?
		gl.FLOAT,		  // type == what data type did we use for those numbers?
		false,				// isNormalized == are these fixed-point values that we need
									//									normalize before use? true or false
		this.vboStride,// Stride == #bytes we must skip in the VBO to move from the
		              // stored attrib for this vertex to the same stored attrib
		              //  for the next vertex in our VBO.  This is usually the 
									// number of bytes used to store one complete vertex.  If set 
									// to zero, the GPU gets attribute values sequentially from 
									// VBO, starting at 'Offset'.	 (Our vertex size in bytes: 
									// 4 floats for Position + 3 for Color + 1 for PtSize = 8).
		this.vboOffset_a_Position);	
		              // Offset == how many bytes from START of buffer to the first
  								// value we will actually use?  (We start with a_Position).
  gl.vertexAttribPointer(this.a_ColorLoc, this.vboFcount_a_Color, 
              gl.FLOAT, false, 
  						this.vboStride, this.vboOffset_a_Color);
  gl.vertexAttribPointer(this.a_PtSizeLoc, this.vboFcount_a_PtSize, 
              gl.FLOAT, false, 
							this.vboStride, this.vboOffset_a_PtSize);
// --Enable this assignment of each of these attributes to its' VBO source:
  gl.enableVertexAttribArray(this.a_PositionLoc);
  gl.enableVertexAttribArray(this.a_ColorLoc);
  gl.enableVertexAttribArray(this.a_PtSizeLoc);
}

VBObox2.prototype.isReady = function() {
//==============================================================================
// Returns 'true' if our WebGL rendering context ('gl') is ready to render using
// this objects VBO and shader program; else return false.
// see: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter

var isOK = true;
  if(gl.getParameter(gl.CURRENT_PROGRAM) != this.shaderLoc)  {
    console.log(this.constructor.name + 
    						'.isReady() false: shader program at this.shaderLoc not in use!');
    isOK = false;
  }
  if(gl.getParameter(gl.ARRAY_BUFFER_BINDING) != this.vboLoc) {
      console.log(this.constructor.name + 
  						'.isReady() false: vbo at this.vboLoc not in use!');
    isOK = false;
  }
  return isOK;
}

VBObox2.prototype.adjust = function() {
//=============================================================================
// Update the GPU to newer, current values we now store for 'uniform' vars on 
// the GPU; and (if needed) update the VBO's contents, and (if needed) each 
// attribute's stride and offset in VBO.

  // check: was WebGL context set to use our VBO & shader program?
  if(this.isReady()==false) {
        console.log('ERROR! before' + this.constructor.name + 
  						'.adjust() call you needed to call this.switchToMe()!!');
  }

	// Adjust values for our uniforms;-------------------------------------------
// THIS DOESN'T WORK!!  this.ModelMatrix = g_worldMat;
  this.ModelMatrix.set(g_worldMat);
	// Ready to draw in World coord axes.

  this.ModelMatrix.translate(-0.3, 0.0, 0.0); //Shift origin leftwards,
  this.ModelMatrix.rotate(g_angleNow2, 0, 0, 1);	// -spin drawing axes,
  //  Transfer new uniforms' values to the GPU:--------------------------------
  // Send  new 'ModelMat' values to the GPU's 'u_ModelMat1' uniform: 
  gl.uniformMatrix4fv(this.u_ModelMatrixLoc,	  // GPU location of the uniform
  										false, 										// use matrix transpose instead?
  										this.ModelMatrix.elements);	// send data from Javascript.
  // Adjust values in VBOcontents array-----------------------------------------
  // Make one dot-size grow/shrink;
  this.vboContents[15] = 15.0*(1.0 + Math.cos(Math.PI * 3.0 * g_angleNow1 / 180.0)); // radians
  // change y-axis value of 1st vertex
  this.vboContents[1] = g_posNow0;
  // Transfer new VBOcontents to GPU-------------------------------------------- 
  this.reload();
}

VBObox2.prototype.draw = function() {
//=============================================================================
// Render current VBObox contents.
  // check: was WebGL context set to use our VBO & shader program?
  if(this.isReady()==false) {
        console.log('ERROR! before' + this.constructor.name + 
  						'.draw() call you needed to call this.switchToMe()!!');
  }
	
  // ----------------------------Draw the contents of the currently-bound VBO:
  gl.drawArrays(gl.POINTS, 		    // select the drawing primitive to draw,
                  // choices: gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, 
                  //          gl.TRIANGLES, gl.TRIANGLE_STRIP, ...
  							0, 								// location of 1st vertex to draw;
  							this.vboVerts);		// number of vertices to draw on-screen.

  gl.drawArrays(gl.LINE_LOOP,     // draw lines between verts too!
                0,
                this.vboVerts);
}

VBObox2.prototype.reload = function() {
//=============================================================================
// Over-write current values in the GPU for our already-created VBO: use 
// gl.bufferSubData() call to re-transfer some or all of our Float32Array 
// 'vboContents' to our VBO, but without changing any GPU memory allocations.
  											
 gl.bufferSubData(gl.ARRAY_BUFFER, 	// GLenum target(same as 'bindBuffer()')
                  0,                  // byte offset to where data replacement
                                      // begins in the VBO.
 					 				this.vboContents);   // the JS source-data array used to fill VBO
}

VBObox2.prototype.empty = function() {
//=============================================================================
// Remove/release all GPU resources used by this VBObox object, including any 
// shader programs, attributes, uniforms, textures, samplers or other claims on 
// GPU memory.  However, make sure this step is reversible by a call to 
// 'restoreMe()': be sure to retain all our Float32Array data, all values for 
// uniforms, all stride and offset values, etc.
//
//
// 		********   YOU WRITE THIS! ********
//
//
//
}

VBObox2.prototype.restore = function() {
//=============================================================================
// Replace/restore all GPU resources used by this VBObox object, including any 
// shader programs, attributes, uniforms, textures, samplers or other claims on 
// GPU memory.  Use our retained Float32Array data, all values for  uniforms, 
// all stride and offset values, etc.
//
//
// 		********   YOU WRITE THIS! ********
//
//
//
}
*/

//=============================================================================
//=============================================================================
//=============================================================================
function makeAxes() {

  axesVerts = new Float32Array([

    0.0, 0.0, 0.0, 1.0,   1.0, 0.0, 0.0,
    3.0, 0.0, 0.0, 1.0,    1.0, 0.0, 0.0,

    0.0,  0.0, 0.0, 1.0,   0.0, 1.0, 0.0,
    0.0,  3.0, 0.0, 1.0,  0.0, 1.0, 0.0,

    0.0, 0.0,  0.0, 1.0,   0.0, 0.0, 1.0,
    0.0, 0.0,  3.0, 1.0,  0.0, 0.0, 1.0,

  ])
}

function makeGroundGrid() {
//==============================================================================
// Create a list of vertices that create a large grid of lines in the x,y plane
// centered at x=y=z=0.  Draw this shape using the GL_LINES primitive.

	var xcount = 100;			// # of lines to draw in x,y to make the grid.
	var ycount = 100;		
	var xymax	= 100.0;			// grid size; extends to cover +/-xymax in x and y.
 	var xColr = new Float32Array([1.0, 1.0, 1.0]);	// bright yellow
 	var yColr = new Float32Array([1.0, 1.0, 1.0]);	// bright green.
 	
	// Create an (global) array to hold this ground-plane's vertices:
	gndVerts = new Float32Array(floatsPerVertex*2*(xcount+ycount));
						// draw a grid made of xcount+ycount lines; 2 vertices per line.
						
	var xgap = 1;		// HALF-spacing between lines in x,y;
	var ygap = 1;		// (why half? because v==(0line number/2))
	
	// First, step thru x values as we make vertical lines of constant-x:
	for(v=0, j=0; v<2*xcount; v++, j+= floatsPerVertex) {
		if(v%2==0) {	// put even-numbered vertices at (xnow, -xymax, 0)
			gndVerts[j  ] = -xymax + (v  )*xgap;	// x
			gndVerts[j+1] = -xymax;								// y
			gndVerts[j+2] = 0.0;									// z
			gndVerts[j+3] = 1.0;									// w.
		}
		else {				// put odd-numbered vertices at (xnow, +xymax, 0).
			gndVerts[j  ] = -xymax + (v-1)*xgap;	// x
			gndVerts[j+1] = xymax;								// y
			gndVerts[j+2] = 0.0;									// z
			gndVerts[j+3] = 1.0;									// w.
		}
		gndVerts[j+4] = xColr[0];			// red
		gndVerts[j+5] = xColr[1];			// grn
		gndVerts[j+6] = xColr[2];			// blu
	}
	// Second, step thru y values as wqe make horizontal lines of constant-y:
	// (don't re-initialize j--we're adding more vertices to the array)
	for(v=0; v<2*ycount; v++, j+= floatsPerVertex) {
		if(v%2==0) {		// put even-numbered vertices at (-xymax, ynow, 0)
			gndVerts[j  ] = -xymax;								// x
			gndVerts[j+1] = -xymax + (v  )*ygap;	// y
			gndVerts[j+2] = 0.0;									// z
			gndVerts[j+3] = 1.0;									// w.
		}
		else {					// put odd-numbered vertices at (+xymax, ynow, 0).
			gndVerts[j  ] = xymax;								// x
			gndVerts[j+1] = -xymax + (v-1)*ygap;	// y
			gndVerts[j+2] = 0.0;									// z
			gndVerts[j+3] = 1.0;									// w.
		}
		gndVerts[j+4] = yColr[0];			// red
		gndVerts[j+5] = yColr[1];			// grn
		gndVerts[j+6] = yColr[2];			// blu
	}
}

function makeSphere() {
//==============================================================================
// Make a sphere from one OpenGL TRIANGLE_STRIP primitive.   Make ring-like 
// equal-lattitude 'slices' of the sphere (bounded by planes of constant z), 
// and connect them as a 'stepped spiral' design (see makeCylinder) to build the
// sphere from one triangle strip.
	var slices = 13;		// # of slices of the sphere along the z axis. >=3 req'd
												// (choose odd # or prime# to avoid accidental symmetry)
	var sliceVerts	= 27;	// # of vertices around the top edge of the slice
												// (same number of vertices on bottom of slice, too)
	var topColr = new Float32Array([0.7, 0.7, 0.7]);	// North Pole: light gray
	var equColr = new Float32Array([0.3, 0.7, 0.3]);	// Equator:    bright green
	var botColr = new Float32Array([0.9, 0.9, 0.9]);	// South Pole: brightest gray.
	var sliceAngle = Math.PI/slices;	// lattitude angle spanned by one slice.

		// Create a (global) array to hold this sphere's vertices:
	sphVerts = new Float32Array(  ((slices * 2* sliceVerts) -2) * floatsPerVertex);
											// # of vertices * # of elements needed to store them. 
											// each slice requires 2*sliceVerts vertices except 1st and
											// last ones, which require only 2*sliceVerts-1.
										
	// Create dome-shaped top slice of sphere at z=+1
	// s counts slices; v counts vertices; 
	// j counts array elements (vertices * elements per vertex)
	var cos0 = 0.0;					// sines,cosines of slice's top, bottom edge.
	var sin0 = 0.0;
	var cos1 = 0.0;
	var sin1 = 0.0;	
	var j = 0;							// initialize our array index
	var isLast = 0;
	var isFirst = 1;
	for(s=0; s<slices; s++) {	// for each slice of the sphere,
		// find sines & cosines for top and bottom of this slice
		if(s==0) {
			isFirst = 1;	// skip 1st vertex of 1st slice.
			cos0 = 1.0; 	// initialize: start at north pole.
			sin0 = 0.0;
		}
		else {					// otherwise, new top edge == old bottom edge
			isFirst = 0;	
			cos0 = cos1;
			sin0 = sin1;
		}								// & compute sine,cosine for new bottom edge.
		cos1 = Math.cos((s+1)*sliceAngle);
		sin1 = Math.sin((s+1)*sliceAngle);
		// go around the entire slice, generating TRIANGLE_STRIP verts
		// (Note we don't initialize j; grows with each new attrib,vertex, and slice)
		if(s==slices-1) isLast=1;	// skip last vertex of last slice.
		for(v=isFirst; v< 2*sliceVerts-isLast; v++, j+=floatsPerVertex) {	
			if(v%2==0)
			{				// put even# vertices at the the slice's top edge
							// (why PI and not 2*PI? because 0 <= v < 2*sliceVerts
							// and thus we can simplify cos(2*PI(v/2*sliceVerts))  
				sphVerts[j  ] = sin0 * Math.cos(Math.PI*(v)/sliceVerts); 	
				sphVerts[j+1] = sin0 * Math.sin(Math.PI*(v)/sliceVerts);	
				sphVerts[j+2] = cos0;		
				sphVerts[j+3] = 1.0;			
			}
			else { 	// put odd# vertices around the slice's lower edge;
							// x,y,z,w == cos(theta),sin(theta), 1.0, 1.0
							// 					theta = 2*PI*((v-1)/2)/capVerts = PI*(v-1)/capVerts
				sphVerts[j  ] = sin1 * Math.cos(Math.PI*(v-1)/sliceVerts);		// x
				sphVerts[j+1] = sin1 * Math.sin(Math.PI*(v-1)/sliceVerts);		// y
				sphVerts[j+2] = cos1;																				// z
				sphVerts[j+3] = 1.0;																				// w.		
			}
			if(s==0) {	// finally, set some interesting colors for vertices:
				sphVerts[j+4]=topColr[0]; 
				sphVerts[j+5]=topColr[1]; 
				sphVerts[j+6]=topColr[2];	
				}
			else if(s==slices-1) {
				sphVerts[j+4]=botColr[0]; 
				sphVerts[j+5]=botColr[1]; 
				sphVerts[j+6]=botColr[2];	
			}
			else {
					sphVerts[j+4]=Math.random();// equColr[0]; 
					sphVerts[j+5]=Math.random();// equColr[1]; 
					sphVerts[j+6]=Math.random();// equColr[2];					
			}
		}
	}
}

function makeGouraudSphere() {
//==============================================================================
// Make a sphere from one OpenGL TRIANGLE_STRIP primitive.   Make ring-like 
// equal-lattitude 'slices' of the sphere (bounded by planes of constant z), 
// and connect them as a 'stepped spiral' design (see makeCylinder) to build the
// sphere from one triangle strip.
	var slices = 13;		// # of slices of the sphere along the z axis. >=3 req'd
												// (choose odd # or prime# to avoid accidental symmetry)
	var sliceVerts	= 27;	// # of vertices around the top edge of the slice
												// (same number of vertices on bottom of slice, too)
	var topColr = new Float32Array([0.7, 0.7, 0.7]);	// North Pole: light gray
	var equColr = new Float32Array([0.3, 0.7, 0.3]);	// Equator:    bright green
	var botColr = new Float32Array([0.9, 0.9, 0.9]);	// South Pole: brightest gray.
  var redColr = new Float32Array([1.0, 0.0, 0.0]);  // North Pole: light gray
	var sliceAngle = Math.PI/slices;	// lattitude angle spanned by one slice.

		// Create a (global) array to hold this sphere's vertices:
	gsphVerts = new Float32Array(  ((slices * 2* sliceVerts) -2) * (floatsPerVertex+3));
											// # of vertices * # of elements needed to store them. 
											// each slice requires 2*sliceVerts vertices except 1st and
											// last ones, which require only 2*sliceVerts-1.
										
	// Create dome-shaped top slice of sphere at z=+1
	// s counts slices; v counts vertices; 
	// j counts array elements (vertices * elements per vertex)
	var cos0 = 0.0;					// sines,cosines of slice's top, bottom edge.
	var sin0 = 0.0;
	var cos1 = 0.0;
	var sin1 = 0.0;	
	var j = 0;							// initialize our array index
	var isLast = 0;
	var isFirst = 1;

	var v1 = [0.0, 0.0, 0.0];
	var v2 = [0.0, 0.0, 0.0];
	var v3 = [0.0, 0.0, 0.0];
	var N = [0.0, 0.0, 0.0];
	var vertex_track = 0;	//0,1,2 if we're on the first, second, or third vertex in a triangle. For the normals


	for(s=0; s<slices; s++) {	// for each slice of the sphere,
		// find sines & cosines for top and bottom of this slice
		if(s==0) {
			isFirst = 1;	// skip 1st vertex of 1st slice.
			cos0 = 1.0; 	// initialize: start at north pole.
			sin0 = 0.0;
		}
		else {					// otherwise, new top edge == old bottom edge
			isFirst = 0;	
			cos0 = cos1;
			sin0 = sin1;
		}								// & compute sine,cosine for new bottom edge.
		cos1 = Math.cos((s+1)*sliceAngle);
		sin1 = Math.sin((s+1)*sliceAngle);
		// go around the entire slice, generating TRIANGLE_STRIP verts
		// (Note we don't initialize j; grows with each new attrib,vertex, and slice)
		if(s==slices-1) isLast=1;	// skip last vertex of last slice.
		for(v=isFirst; v< 2*sliceVerts-isLast; v++, j+=(floatsPerVertex+3)) {	
			if(v%2==0)
			{				// put even# vertices at the the slice's top edge
							// (why PI and not 2*PI? because 0 <= v < 2*sliceVerts
							// and thus we can simplify cos(2*PI(v/2*sliceVerts))  
				gsphVerts[j  ] = sin0 * Math.cos(Math.PI*(v)/sliceVerts); 	
				gsphVerts[j+1] = sin0 * Math.sin(Math.PI*(v)/sliceVerts);	
				gsphVerts[j+2] = cos0;		
				gsphVerts[j+3] = 1.0;			
			}
			else { 	// put odd# vertices around the slice's lower edge;
							// x,y,z,w == cos(theta),sin(theta), 1.0, 1.0
							// 					theta = 2*PI*((v-1)/2)/capVerts = PI*(v-1)/capVerts
				gsphVerts[j  ] = sin1 * Math.cos(Math.PI*(v-1)/sliceVerts);		// x
				gsphVerts[j+1] = sin1 * Math.sin(Math.PI*(v-1)/sliceVerts);		// y
				gsphVerts[j+2] = cos1;																				// z
				gsphVerts[j+3] = 1.0;																				// w.		
			}
			if(s==0) {	// finally, set some interesting colors for vertices:
				gsphVerts[j+4]=topColr[0]; 
				gsphVerts[j+5]=topColr[1]; 
				gsphVerts[j+6]=topColr[2];	
        //gsphVerts[j+4]=redColr[0]; 
        //gsphVerts[j+5]=redColr[1]; 
        //gsphVerts[j+6]=redColr[2];  
				}
			else if(s==slices-1) {
				gsphVerts[j+4]=botColr[0]; 
				gsphVerts[j+5]=botColr[1]; 
				gsphVerts[j+6]=botColr[2];	
        //gsphVerts[j+4]=redColr[0]; 
        //gsphVerts[j+5]=redColr[1]; 
        //gsphVerts[j+6]=redColr[2];  
			}
			else {
					///gsphVerts[j+4]=Math.random();// equColr[0]; 
					///gsphVerts[j+5]=Math.random();// equColr[1]; 
					///gsphVerts[j+6]=Math.random();// equColr[2];					
          gsphVerts[j+4]=redColr[0];
          gsphVerts[j+5]=redColr[1];
          gsphVerts[j+6]=redColr[2];
			}
			
			gsphVerts[j+7] = gsphVerts[j];
			gsphVerts[j+8] = gsphVerts[j+1];
			gsphVerts[j+9] = gsphVerts[j+2];
		}
	}
}

function makeDiamond() {
//==============================================================================
// Make a diamond-like shape from two adjacent tetrahedra, aligned with Z axis.
diamondVerts = new Float32Array([

// Triangle 1: this normal and normals below are unchecked
	0.0, 0.0, 0.0, 1.0,			1.0, 1.0, 1.0,		.125, -.0625, -.125,//Node 1
	0.25, 0.5, 0.0, 1.0,		0.0, 0.0, 1.0,		.125, -.0625, -.125,//Node 2
	0.0, 0.5, -0.25, 1.0,		1.0, 1.0, 0.0,		.125, -.0625, -.125,//Node 5

	// Triangle 2 
	0.0, 0.0, 0.0, 1.0,			1.0, 1.0, 1.0,		-.125, -.0625, -.125,//Node 1
	-0.25, 0.5, 0.0, 1.0,		1.0, 0.0, 0.0,		-.125, -.0625, -.125,//Node 4
	0.0, 0.5, -0.25, 1.0,		1.0, 1.0, 0.0,		-.125, -.0625, -.125,//Node 5

	// Triangle 3
	0.0, 0.0, 0.0, 1.0,			1.0, 1.0, 1.0,		-.125, -.0625, 0.125,//Node 1
	0.0, 0.5, 0.25, 1.0,		0.0, 1.0, 0.0,		-.125, -.0625, 0.125,//Node 3
	-0.25, 0.5, 0.0, 1.0,		1.0, 0.0, 0.0,		-.125, -.0625, 0.125,//Node 4

	// Triangle 4
	0.0, 0.0, 0.0, 1.0,			1.0, 1.0, 1.0,		-.125, -.0625, 0.125,//Node 1
	0.25, 0.5, 0.0, 1.0,		0.0, 0.0, 1.0,		-.125, -.0625, 0.125,//Node 2
	0.0, 0.5, 0.25, 1.0,		0.0, 1.0, 0.0,		-.125, -.0625, 0.125,//Node 3

	// Triangle 5
	0.0, 1.0, 0.0, 1.0,			0.0, 0.0, 0.0,		.125, .0625, -.125,//Node 0
	0.25, 0.5, 0.0, 1.0,		0.0, 0.0, 1.0,		.125, .0625, -.125,//Node 2
	0.0, 0.5, -0.25, 1.0,		1.0, 1.0, 0.0,		.125, .0625, -.125,//Node 5

	// Triangle 6
	0.0, 1.0, 0.0, 1.0,			0.0, 0.0, 0.0,		-.125, .0625, -.125,//Node 0
	-0.25, 0.5, 0.0, 1.0,		1.0, 0.0, 0.0,		-.125, .0625, -.125,//Node 4
	0.0, 0.5, -0.25, 1.0,		1.0, 1.0, 0.0,		-.125, .0625, -.125,//Node 5

	// Triangle 7
	0.0, 1.0, 0.0, 1.0,			0.0, 0.0, 0.0,		-.125, .0625, .125,//Node 0
	0.0, 0.5, 0.25, 1.0,		0.0, 1.0, 0.0,		-.125, .0625, .125,//Node 3
	-0.25, 0.5, 0.0, 1.0,		1.0, 0.0, 0.0,		-.125, .0625, .125,//Node 4

	// Triangle 8
	0.0, 1.0, 0.0, 1.0,			0.0, 0.0, 0.0,		.125, .0625, .125,//Node 0
	0.25, 0.5, 0.0, 1.0,		0.0, 0.0, 1.0,		.125, .0625, .125,//Node 2
	0.0, 0.5, 0.25, 1.0,		0.0, 1.0, 0.0,		.125, .0625, .125,//Node 3

])
	// YOU write this one...
	
}

function makeHouse() {
houseVerts = new Float32Array([ 
	// Triangle 1
     -0.5, -0.5, 0.5,1.0,		0.0, 0.0, 1.0,		0.0, 0.0, 1.0,//Node F
     -0.5, 0.5, 0.5,1.0,		1.0, 0.0, 0.0,		0.0, 0.0, 1.0,//Node A
     0.5, 0.5, 0.5,	1.0,		0.0, 1.0, 0.0,		0.0, 0.0, 1.0,//Node B

     // Triangle 2
     -0.5, -0.5, 0.5,1.0,		0.0, 0.0, 1.0,		0.0, 0.0, 1.0,//Node F
     0.5, -0.5, 0.5,1.0,		1.0, 1.0, 0.0,		0.0, 0.0, 1.0,//Node G
     0.5, 0.5, 0.5,	1.0,		0.0, 1.0, 0.0,		0.0, 0.0, 1.0,//Node B

     // Triangle 3
     -0.5, -0.5, -0.5,1.0,		0.0, 1.0, 0.0,		0.0, 0.0, -1.0,//Node I
     -0.5, 0.5, -0.5,1.0,		1.0, 1.0, 0.0,		0.0, 0.0, -1.0,//Node D
     0.5, 0.5, -0.5,1.0,		0.0, 0.0, 1.0,		0.0, 0.0, -1.0,//Node C

     // Triangle 4
     -0.5, -0.5, -0.5,1.0,		0.0, 1.0, 0.0,		0.0, 0.0, -1.0,//Node I
     0.5, -0.5, -0.5,1.0,		1.0, 0.0, 0.0,		0.0, 0.0, -1.0,//Node H
     0.5, 0.5, -0.5,1.0,		0.0, 0.0, 1.0,		0.0, 0.0, -1.0,//Node C

     // Triangle 5
     -0.5, -0.5, 0.5,1.0,		0.0, 0.0, 1.0,		0.0, -1.0, 0.0,//Node F
     -0.5, -0.5, -0.5,1.0,		0.0, 1.0, 0.0,		0.0, -1.0, 0.0,//Node I
     0.5, -0.5, -0.5,1.0,		1.0, 0.0, 0.0,		0.0, -1.0, 0.0,//Node H

     // Triangle 6
     -0.5, -0.5, 0.5,1.0,		0.0, 0.0, 1.0,		0.0, -1.0, 0.0,//Node F
     0.5, -0.5, 0.5,1.0,		1.0, 1.0, 0.0,		0.0, -1.0, 0.0,//Node G
     0.5, -0.5, -0.5,1.0,		1.0, 0.0, 0.0,		0.0, -1.0, 0.0,//Node H

     // Triangle 7
     -0.5, -0.5, 0.5,1.0,		0.0, 0.0, 1.0,		-1.0, 0.0, 0.0,//Node F
     -0.5, 0.5, 0.5,1.0,		1.0, 0.0, 0.0,		-1.0, 0.0, 0.0,//Node A
     -0.5, 0.5, -0.5,1.0,		1.0, 1.0, 0.0,		-1.0, 0.0, 0.0,//Node D

     // Triangle 8
     -0.5, -0.5, 0.5,1.0,		0.0, 0.0, 1.0,		-1.0, 0.0, 0.0,//Node F
     -0.5, -0.5, -0.5,1.0,		0.0, 1.0, 0.0,		-1.0, 0.0, 0.0,//Node I
     -0.5, 0.5, -0.5,1.0,		1.0, 1.0, 0.0,		-1.0, 0.0, 0.0,//Node D

     // Triangle 9
     0.5, -0.5, 0.5,1.0,		1.0, 1.0, 0.0,		1.0, 0.0, 0.0,//Node G
     0.5, 0.5, 0.5,	1.0,		0.0, 1.0, 0.0,		1.0, 0.0, 0.0,//Node B
     0.5, 0.5, -0.5,1.0,		0.0, 0.0, 1.0,		1.0, 0.0, 0.0,//Node C

     // Triangle 10
     0.5, -0.5, 0.5,1.0,		1.0, 1.0, 0.0,		1.0, 0.0, 0.0,//Node G
     0.5, -0.5, -0.5,1.0,		1.0, 0.0, 0.0,		1.0, 0.0, 0.0,//Node H
     0.5, 0.5, -0.5,1.0,		0.0, 0.0, 1.0,		1.0, 0.0, 0.0,//Node C

     // Triangle 11
     -0.5, 0.5, 0.5,1.0,		1.0, 0.0, 0.0,		-.45, 1.0, .45,//Node A
     0.5, 0.5, 0.5,	1.0,		0.0, 1.0, 0.0,		-.45, 1.0, .45,//Node B
     0.0, 0.95, 0.0,1.0,		1.0, 1.0, 1.0,		-.45, 1.0, .45,//Node E

     // Triangle 12
     0.5, 0.5, 0.5,	1.0,		0.0, 1.0, 0.0,		.45, .5, 0.0,//Node B
     0.5, 0.5, -0.5,1.0,		0.0, 0.0, 1.0,		.45, .5, 0.0,//Node C
     0.0, 0.95, 0.0,1.0,		1.0, 1.0, 1.0,		.45, .5, 0.0,//Node E

     // Triangle 13
     0.5, 0.5, -0.5,1.0,		0.0, 0.0, 1.0,		-0.45, 0.5, -.45,//Node C
     -0.5, 0.5, -0.5,1.0,		1.0, 1.0, 0.0,		-0.45, 0.5, -.45,//Node D
     0.0, 0.95, 0.0,1.0,		1.0, 1.0, 1.0,		-0.45, 0.5, -.45,//Node E

     // Triangle 14
     -0.5, 0.5, -0.5,1.0,		1.0, 1.0, 0.0,		-.45, 0.5, 0.0,//Node D
     -0.5, 0.5, 0.5,1.0,		1.0, 0.0, 0.0,		-.45, 0.5, 0.0,//Node A
     0.0, 0.95, 0.0,1.0,		1.0, 1.0, 1.0,		-.45, 0.5, 0.0,//Node E
])

}


//VBObox3 for an object

function VBObox3() {
//=============================================================================
//=============================================================================
// CONSTRUCTOR for one re-usable 'VBObox1' object that holds all data and fcns
// needed to render vertices from one Vertex Buffer Object (VBO) using one 
// separate shader program (a vertex-shader & fragment-shader pair) and one
// set of 'uniform' variables.

// Constructor goal: 
// Create and set member vars that will ELIMINATE ALL LITERALS (numerical values 
// written into code) in all other VBObox functions. Keeping all these (initial)
// values here, in this one coonstrutor function, ensures we can change them 
// easily WITHOUT disrupting any other code, ever!
  
	this.VERT_SRC =	//--------------------- VERTEX SHADER source code 
  'uniform mat4 u_MVPMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'uniform vec4 u_LightPosition;\n' +
  'uniform vec4 u_EyePosition;\n' +
  'uniform float u_LightOn;\n' +
  'uniform vec3 u_IA;\n' +
  'uniform vec3 u_ID;\n' +
  'uniform vec3 u_IS;\n' +
  'uniform vec3 u_KA;\n' +
  'uniform vec3 u_KD;\n' +
  'uniform vec3 u_KS;\n' +
  'uniform vec3 u_KE;\n' +
  'uniform float u_SE;\n' +
  'uniform int u_isBlinn;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec3 a_Color;\n' +
  'attribute vec3 a_Normal;\n' +
  'varying vec4 v_Colr;\n' +

  'void main() {\n' +
  'vec4 transVec = u_NormalMatrix * vec4(a_Normal, 1.0);\n' +
  'vec3 normVec = normalize(transVec.xyz);\n' +
  'vec3 lightVec = normalize((u_LightPosition.xyz) - (u_ModelMatrix * a_Position).xyz);\n' +
  'vec3 eyeVec = normalize((u_EyePosition.xyz) - (u_ModelMatrix * a_Position).xyz);\n' +
  '  gl_Position = u_MVPMatrix * a_Position;\n' +
  '  if (u_isBlinn == 1) {\n' +
  '    vec3 halfVec = normalize(lightVec + eyeVec);\n' +
  '    v_Colr = vec4(0.0*a_Color + u_KE + u_LightOn * (u_IA*u_KA + u_ID*u_KD*max(0.0, dot(normVec,lightVec)) + u_IS*u_KS*pow(max(0.0, dot(normVec, halfVec)), u_SE)), 1.0);\n' +
  //'    v_Colr = vec4(0.3*a_Color + 0.0*u_KA + 0.0*u_KD + 0.0*u_KS + 0.0*u_KE + 0.0*u_IA + 0.0*u_ID + 1.0*u_IS + pow(0.6, u_SE) * u_LightOn * (1.0*dot(normVec,lightVec)+ 0.0*eyeVec), 1.0);\n' +
  '  }\n' +
  '  else {\n' +
  '    vec3 reflectVec = -1.0 * reflect(lightVec, normVec);\n' +
  '    v_Colr = vec4(u_KE + u_LightOn * (u_IA*u_KA + u_ID*u_KD*max(0.0, dot(normVec,lightVec)) + u_IS*u_KS*pow(max(0.0, dot(reflectVec, eyeVec)), u_SE)), 1.0);\n' +
  '  }\n' +
  //'    v_Colr = vec4(0.3*a_Color  + 0.0*u_IA + 1.0*u_ID + 0.0*u_IS + u_LightOn * (1.0*dot(normVec,lightVec)+ 0.0*eyeVec), 1.0);}\n' +
  //'  v_Colr = vec4(0.2*a_Color + 0.8*dot(normVec,lightVec), 1.0);\n' +
  '}\n';

  this.FRAG_SRC = 
  'precision mediump float;\n' +
  'varying vec4 v_Colr;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Colr;\n' +
  '}\n';


 //New Stuff: Make each 3D shape in its own array of vertices:
 makeDiamond();
 makeHouse();
    // how many floats total needed to store all shapes?
	var mySiz = (diamondVerts.length + houseVerts.length);

	// How many vertices total?
	var nn = mySiz / (floatsPerVertex+3);
	console.log('nn is', nn, 'mySiz is', mySiz, 'floatsPerVertex is', floatsPerVertex+3);
	// Copy all shapes into one big Float32 array:
  	var colorShapes = new Float32Array(mySiz);
	this.vboContents = new Float32Array(mySiz)
	// Copy them:  remember where to start for each shape:
	diamondStart = 0;							// we stored the cylinder first.
  	for(i=0,j=0; j< diamondVerts.length; i++,j++) {
  		colorShapes[i] = diamondVerts[j];
		}

	houseStart = i;							// we stored the cylinder first.
  	for(j=0; j< houseVerts.length; i++,j++) {
  		colorShapes[i] = houseVerts[j];
		}

	this.vboContents = colorShapes;
		

  //Back to Old Stuff:
	/*

	this.vboContents = //---------------------------------------------------------
		new Float32Array ([					// Array of vertex attribute values we will
  															// transfer to GPU's vertex buffer object (VBO)
			// 1 vertex per line: pos1 x,y,z,w;   colr1; r,g,b;   ptSiz1; 
  	-0.3,  0.7,	0.0, 1.0,		0.0, 1.0, 1.0,  17.0,
    -0.3, -0.3, 0.0, 1.0,		1.0, 0.0, 1.0,  20.0,
     0.3, -0.3, 0.0, 1.0,		1.0, 1.0, 0.0,  33.0,
  ]);	*/
  
	this.vboVerts = nn;							// # of vertices held in 'vboContents' array;
	this.FSIZE = this.vboContents.BYTES_PER_ELEMENT;  
	                              // bytes req'd by 1 vboContents array element;
																// (why? used to compute stride and offset 
																// in bytes for vertexAttribPointer() calls)
    this.vboBytes = this.vboContents.length * this.FSIZE;               
                                // (#  of floats in vboContents array) * 
                                // (# of bytes/float).
	this.vboStride = this.vboBytes / this.vboVerts;     
	                              // (== # of bytes to store one complete vertex).
	                              // From any attrib in a given vertex in the VBO, 
	                              // move forward by 'vboStride' bytes to arrive 
	                              // at the same attrib for the next vertex.
	                               
	            //----------------------Attribute sizes
  this.vboFcount_a_Pos1 =  4;    // # of floats in the VBO needed to store the
                                // attribute named a_Pos1. (4: x,y,z,w values)
  this.vboFcount_a_Colr1 = 3;   // # of floats for this attrib (r,g,b values)
  this.vboFcount_a_PtSiz1 = 1;  // # of floats for this attrib (just one!)   
  this.vboFcount_a_Normal = 3;
  console.assert((this.vboFcount_a_Pos1 +     // check the size of each and
                  this.vboFcount_a_Colr1 +
                  this.vboFcount_a_Normal) *   // every attribute in our VBO
                  this.FSIZE == this.vboStride, // for agreeement with'stride'
                  "Uh oh! VBObox3.vboStride disagrees with attribute-size values!");
                  
              //----------------------Attribute offsets
	this.vboOffset_a_Pos1 = 0;    //# of bytes from START of vbo to the START
	                              // of 1st a_Pos1 attrib value in vboContents[]
  this.vboOffset_a_Colr1 = (this.vboFcount_a_Pos1) * this.FSIZE;  
                                // == 4 floats * bytes/float
                                //# of bytes from START of vbo to the START
                                // of 1st a_Colr1 attrib value in vboContents[]
  this.vboOffset_a_Normal =(this.vboFcount_a_Pos1 +
                            this.vboFcount_a_Colr1) * this.FSIZE; 
                                // == 7 floats * bytes/float
                                // # of bytes from START of vbo to the START
                                // of 1st a_PtSize attrib value in vboContents[]

	            //-----------------------GPU memory locations:                                
	this.vboLoc;									// GPU Location for Vertex Buffer Object, 
	                              // returned by gl.createBuffer() function call
	this.shaderLoc;								// GPU Location for compiled Shader-program  
	                            	// set by compile/link of VERT_SRC and FRAG_SRC.
								          //------Attribute locations in our shaders:
	this.a_Pos1Loc;							  // GPU location: shader 'a_Pos1' attribute
	this.a_Colr1Loc;							// GPU location: shader 'a_Colr1' attribute
	this.a_PtSiz1Loc;							// GPU location: shader 'a_PtSiz1' attribute
	this.a_NormalLoc;
	
	            //---------------------- Uniform locations &values in our shaders
	this.MVPMatrix = new Matrix4();
  this.ModelMatrix = new Matrix4();	// Transforms CVV axes to model axes.
	this.NormalMatrix = new Matrix4();
  this.LightPosition = new Vector4();
  this.EyePosition = new Vector4();
  this.LightOn = 1.0;
  this.IA = new Vector3();
  this.ID = new Vector3();
  this.IS = new Vector3();
  this.KA = new Vector3();
  this.KD = new Vector3();
  this.KS = new Vector3();
  this.KE = new Vector3();
  this.isBlinn = 1;
  this.SE = 1.0;
  this.u_MVPMatrixLoc;
	this.u_ModelMatrixLoc;						// GPU location for u_ModelMat uniform
	this.u_NormalMatrixLoc;
  this.u_LightPositionLoc;
  this.u_EyePositionLoc;
  this.u_LightOnLoc;
  this.u_IALoc;
  this.u_IDLoc;
  this.u_ISLoc;
  this.u_KALoc;
  this.u_KDLoc;
  this.u_KSLoc;
  this.u_KELoc;
  this.u_isBlinnLoc;
  this.u_SELoc
};


VBObox3.prototype.init = function() {
//==============================================================================
// Prepare the GPU to use all vertices, GLSL shaders, attributes, & uniforms 
// kept in this VBObox. (This function usually called only once, within main()).
// Specifically:
// a) Create, compile, link our GLSL vertex- and fragment-shaders to form an 
//  executable 'program' stored and ready to use inside the GPU.  
// b) create a new VBO object in GPU memory and fill it by transferring in all
//  the vertex data held in our Float32array member 'VBOcontents'. 
// c) Find & save the GPU location of all our shaders' attribute-variables and 
//  uniform-variables (needed by switchToMe(), adjust(), draw(), reload(), etc.)
// -------------------
// CAREFUL!  before you can draw pictures using this VBObox contents, 
//  you must call this VBObox object's switchToMe() function too!
//--------------------
// a) Compile,link,upload shaders-----------------------------------------------
	this.shaderLoc = createProgram(gl, this.VERT_SRC, this.FRAG_SRC);
	if (!this.shaderLoc) {
    console.log(this.constructor.name + 
    						'.init() failed to create executable Shaders on the GPU. Bye!');
    return;
  }
// CUTE TRICK: let's print the NAME of this VBObox object: tells us which one!
//  else{console.log('You called: '+ this.constructor.name + '.init() fcn!');}

	gl.program = this.shaderLoc;		// (to match cuon-utils.js -- initShaders())

// b) Create VBO on GPU, fill it------------------------------------------------
	this.vboLoc = gl.createBuffer();	
  if (!this.vboLoc) {
    console.log(this.constructor.name + 
    						'.init() failed to create VBO in GPU. Bye!'); 
    return;
  }
  
  // Specify the purpose of our newly-created VBO on the GPU.  Your choices are:
  //	== "gl.ARRAY_BUFFER" : the VBO holds vertices, each made of attributes 
  // (positions, colors, normals, etc), or 
  //	== "gl.ELEMENT_ARRAY_BUFFER" : the VBO holds indices only; integer values 
  // that each select one vertex from a vertex array stored in another VBO.
  gl.bindBuffer(gl.ARRAY_BUFFER,	      // GLenum 'target' for this GPU buffer 
  								this.vboLoc);				  // the ID# the GPU uses for this buffer.
  											
  // Fill the GPU's newly-created VBO object with the vertex data we stored in
  //  our 'vboContents' member (JavaScript Float32Array object).
  //  (Recall gl.bufferData() will evoke GPU's memory allocation & management: 
  //	 use gl.bufferSubData() to modify VBO contents without changing VBO size)
  gl.bufferData(gl.ARRAY_BUFFER, 			  // GLenum target(same as 'bindBuffer()')
 					 				this.vboContents, 		// JavaScript Float32Array
  							 	gl.STATIC_DRAW);			// Usage hint.  
  //	The 'hint' helps GPU allocate its shared memory for best speed & efficiency
  //	(see OpenGL ES specification for more info).  Your choices are:
  //		--STATIC_DRAW is for vertex buffers rendered many times, but whose 
  //				contents rarely or never change.
  //		--DYNAMIC_DRAW is for vertex buffers rendered many times, but whose 
  //				contents may change often as our program runs.
  //		--STREAM_DRAW is for vertex buffers that are rendered a small number of 
  // 			times and then discarded; for rapidly supplied & consumed VBOs.

// c1) Find All Attributes:-----------------------------------------------------
//  Find & save the GPU location of all our shaders' attribute-variables and 
//  uniform-variables (for switchToMe(), adjust(), draw(), reload(), etc.)
  this.a_Pos1Loc = gl.getAttribLocation(this.shaderLoc, 'a_Position');
  if(this.a_Pos1Loc < 0) {
    console.log(this.constructor.name + 
    						'.init() Failed to get GPU location of attribute a_Position');
    return -1;	// error exit.
  }
 	this.a_Colr1Loc = gl.getAttribLocation(this.shaderLoc, 'a_Color');
  if(this.a_Colr1Loc < 0) {
    console.log(this.constructor.name + 
    						'.init() failed to get the GPU location of attribute a_Color');
    return -1;	// error exit.
  }
  /*this.a_PtSiz1Loc = gl.getAttribLocation(this.shaderLoc, 'a_PtSiz1');
  if(this.a_PtSiz1Loc < 0) {
    console.log(this.constructor.name + 
	    					'.init() failed to get the GPU location of attribute a_PtSiz1');
	  return -1;	// error exit.
  }*/
  this.a_NormalLoc = gl.getAttribLocation(this.shaderLoc, 'a_Normal');
  if(this.a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return -1;
  }
  // c2) Find All Uniforms:-----------------------------------------------------
  //Get GPU storage location for each uniform var used in our shader programs: 

  this.u_MVPMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_MVPMatrix');
  if (!this.u_MVPMatrixLoc) { 
    console.log(this.constructor.name + 
                '.init() failed to get GPU location for u_MVPMatrix uniform');
    return;
  }

  this.u_ModelMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_ModelMatrix');
  if (!this.u_ModelMatrixLoc) { 
    console.log(this.constructor.name + 
    						'.init() failed to get GPU location for u_ModelMatrix uniform');
    return;
  }

  this.u_NormalMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_NormalMatrix');	
	if(!this.u_NormalMatrixLoc) {	
		console.log('Failed to get GPU storage location for u_NormalMatrix');	
		return	
	}

  this.u_LightPositionLoc = gl.getUniformLocation(this.shaderLoc, 'u_LightPosition'); 
  if(!this.u_LightPositionLoc) { 
    console.log('Failed to get GPU storage location for u_LightPosition'); 
    return  
  }

  this.u_EyePositionLoc = gl.getUniformLocation(this.shaderLoc, 'u_EyePosition'); 
  if(!this.u_EyePositionLoc) { 
    console.log('Failed to get GPU storage location for u_EyePosition'); 
    return  
  }

  this.u_LightOnLoc = gl.getUniformLocation(this.shaderLoc, 'u_LightOn'); 
  if(!this.u_LightOnLoc) { 
    console.log('Failed to get GPU storage location for u_LightOn'); 
    return  
  }

  this.u_IALoc = gl.getUniformLocation(this.shaderLoc, 'u_IA'); 
  if(!this.u_IALoc) { 
    console.log('Failed to get GPU storage location for u_IA'); 
    return  
  }

  this.u_IDLoc = gl.getUniformLocation(this.shaderLoc, 'u_ID'); 
  if(!this.u_IDLoc) { 
    console.log('Failed to get GPU storage location for u_ID'); 
    return  
  }

  this.u_ISLoc = gl.getUniformLocation(this.shaderLoc, 'u_IS'); 
  if(!this.u_ISLoc) { 
    console.log('Failed to get GPU storage location for u_IS'); 
    return  
  }

  this.u_KALoc = gl.getUniformLocation(this.shaderLoc, 'u_KA'); 
  if(!this.u_KALoc) { 
    console.log('Failed to get GPU storage location for u_KA'); 
    return  
  }

  this.u_KDLoc = gl.getUniformLocation(this.shaderLoc, 'u_KD'); 
  if(!this.u_KDLoc) { 
    console.log('Failed to get GPU storage location for u_KD'); 
    return  
  }

  this.u_KSLoc = gl.getUniformLocation(this.shaderLoc, 'u_KS'); 
  if(!this.u_KSLoc) { 
    console.log('Failed to get GPU storage location for u_KS'); 
    return  
  }

  this.u_KELoc = gl.getUniformLocation(this.shaderLoc, 'u_KE'); 
  if(!this.u_KELoc) { 
    console.log('Failed to get GPU storage location for u_KE'); 
    return  
  }

  this.u_isBlinnLoc = gl.getUniformLocation(this.shaderLoc, 'u_isBlinn'); 
  if(!this.u_isBlinnLoc) { 
    console.log('Failed to get GPU storage location for u_isBlinn'); 
    return  
  }

  this.u_SELoc = gl.getUniformLocation(this.shaderLoc, 'u_SE'); 
  if(!this.u_SELoc) { 
    console.log('Failed to get GPU storage location for u_SE'); 
    return  
  }
}

VBObox3.prototype.switchToMe = function () {
//==============================================================================
// Set GPU to use this VBObox's contents (VBO, shader, attributes, uniforms...)
//
// We only do this AFTER we called the init() function, which does the one-time-
// only setup tasks to put our VBObox contents into GPU memory.  !SURPRISE!
// even then, you are STILL not ready to draw our VBObox's contents onscreen!
// We must also first complete these steps:
//  a) tell the GPU to use our VBObox's shader program (already in GPU memory),
//  b) tell the GPU to use our VBObox's VBO  (already in GPU memory),
//  c) tell the GPU to connect the shader program's attributes to that VBO.

// a) select our shader program:
  gl.useProgram(this.shaderLoc);	
//		Each call to useProgram() selects a shader program from the GPU memory,
// but that's all -- it does nothing else!  Any previously used shader program's 
// connections to attributes and uniforms are now invalid, and thus we must now
// establish new connections between our shader program's attributes and the VBO
// we wish to use.  
  
// b) call bindBuffer to disconnect the GPU from its currently-bound VBO and
//  instead connect to our own already-created-&-filled VBO.  This new VBO can 
//    supply values to use as attributes in our newly-selected shader program:
	gl.bindBuffer(gl.ARRAY_BUFFER,	    // GLenum 'target' for this GPU buffer 
										this.vboLoc);			// the ID# the GPU uses for our VBO.

// c) connect our newly-bound VBO to supply attribute variable values for each
// vertex to our SIMD shader program, using 'vertexAttribPointer()' function.
// this sets up data paths from VBO to our shader units:
  // 	Here's how to use the almost-identical OpenGL version of this function:
	//		http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttribPointer.xml )


  gl.vertexAttribPointer(
		this.a_Pos1Loc,//index == ID# for the attribute var in GLSL shader pgm;
		this.vboFcount_a_Pos1, // # of floats used by this attribute: 1,2,3 or 4?
		gl.FLOAT,		  // type == what data type did we use for those numbers?
		false,				// isNormalized == are these fixed-point values that we need
									//									normalize before use? true or false
		this.vboStride,// Stride == #bytes we must skip in the VBO to move from the
		              // stored attrib for this vertex to the same stored attrib
		              //  for the next vertex in our VBO.  This is usually the 
									// number of bytes used to store one complete vertex.  If set 
									// to zero, the GPU gets attribute values sequentially from 
									// VBO, starting at 'Offset'.	
									// (Our vertex size in bytes: 4 floats for pos + 3 for color)
		this.vboOffset_a_Pos1);						
		              // Offset == how many bytes from START of buffer to the first
  								// value we will actually use?  (we start with position).
  gl.vertexAttribPointer(this.a_Colr1Loc, this.vboFcount_a_Colr1,
                         gl.FLOAT, false, 
  						           this.vboStride,  this.vboOffset_a_Colr1);
  /*gl.vertexAttribPointer(this.a_PtSiz1Loc,this.vboFcount_a_PtSiz1, 
                         gl.FLOAT, false, 
							           this.vboStride,	this.vboOffset_a_PtSiz1);	*/
  gl.vertexAttribPointer(this.a_NormalLoc,this.vboFcount_a_Normal, 
                         gl.FLOAT, false, 
							           this.vboStride,	this.vboOffset_a_Normal);	
  //-- Enable this assignment of the attribute to its' VBO source:
  gl.enableVertexAttribArray(this.a_Pos1Loc);
  gl.enableVertexAttribArray(this.a_Colr1Loc);
  //gl.enableVertexAttribArray(this.a_PtSiz1Loc);
  gl.enableVertexAttribArray(this.a_NormalLoc);


  //NEW port Stuff
  
}

VBObox3.prototype.isReady = function() {
//==============================================================================
// Returns 'true' if our WebGL rendering context ('gl') is ready to render using
// this objects VBO and shader program; else return false.
// see: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter

var isOK = true;

  if(gl.getParameter(gl.CURRENT_PROGRAM) != this.shaderLoc)  {
    console.log(this.constructor.name + 
    						'.isReady() false: shader program at this.shaderLoc not in use!');
    isOK = false;
  }
  if(gl.getParameter(gl.ARRAY_BUFFER_BINDING) != this.vboLoc) {
      console.log(this.constructor.name + 
  						'.isReady() false: vbo at this.vboLoc not in use!');
    isOK = false;
  }
  return isOK;
}

VBObox3.prototype.adjust = function() {
//==============================================================================
// Update the GPU to newer, current values we now store for 'uniform' vars on 
// the GPU; and (if needed) update each attribute's stride and offset in VBO.

  // check: was WebGL context set to use our VBO & shader program?
  if(this.isReady()==false) {
        console.log('ERROR! before' + this.constructor.name + 
  						'.adjust() call you needed to call this.switchToMe()!!');
  }

	// Adjust values for our uniforms,
   this.MVPMatrix.setIdentity();
   this.ModelMatrix.setIdentity();
// THIS DOESN'T WORK!!  this.ModelMatrix = g_worldMat;
  this.MVPMatrix.set(g_worldMat);
  //this.MVPMatrix.translate(-3.5, 0, 0, 1);
  //this.ModelMatrix.translate(-3.5, 0, 0, 1)

  //this.MVPMatrix.rotate(90, 1, 0, 0);
  //this.ModelMatrix.rotate(90, 1, 0, 0);

  //this.MVPMatrix

  //this.NormalMatrix.setInverseOf(this.ModelMatrix);	
  //this.NormalMatrix.transpose();

  // Set Light Position
  this.LightPosition.elements[0] = g_light_x;
  this.LightPosition.elements[1] = g_light_y;
  this.LightPosition.elements[2] = g_light_z;
  this.LightPosition.elements[3] = 0.0;

  // Set Eye Position
  this.EyePosition.elements[0] = eye_position[0];
  this.EyePosition.elements[1] = eye_position[1];
  this.EyePosition.elements[2] = eye_position[2];
  this.EyePosition.elements[3] = 0.0;

  // Set light on or off
  if (g_lightSwitch) {this.LightOn = 1.0;}
  else {this.LightOn = 0.0;}
  
  this.IA.elements[0] = g_IA_r;
  this.IA.elements[1] = g_IA_g;
  this.IA.elements[2] = g_IA_b;

  this.ID.elements[0] = g_ID_r;
  this.ID.elements[1] = g_ID_g;
  this.ID.elements[2] = g_ID_b;
  
  this.IS.elements[0] = g_IS_r;
  this.IS.elements[1] = g_IS_g;
  this.IS.elements[2] = g_IS_b;

  this.KA.elements[0] = .135;
  this.KA.elements[1] = .22;
  this.KA.elements[2] = .16;

  this.KD.elements[0] = .54;
  this.KD.elements[1] = .89;
  this.KD.elements[2] = .63;
  
  this.KS.elements[0] = .32;
  this.KS.elements[1] = .32;
  this.KS.elements[2] = .32;

  this.KE.elements[0] = 0.0;
  this.KE.elements[1] = 0.0;
  this.KE.elements[2] = 0.0;

  this.isBlinn = 0;
  this.SE = 12.8;

  //  Transfer new uniforms' values to the GPU:-------------
  // Send  new 'ModelMat' values to the GPU's 'u_ModelMat1' uniform: 

  /*gl.uniformMatrix4fv(this.u_MVPMatrixLoc, false, this.MVPMatrix.elements);
  gl.uniformMatrix4fv(this.u_ModelMatrixLoc,	// GPU location of the uniform
  										false, 										// use matrix transpose instead?
  										this.ModelMatrix.elements);	// send data from Javascript.

  gl.uniformMatrix4fv(this.u_NormalMatrixLoc, false, this.NormalMatrix.elements);*/
  gl.uniform4fv(this.u_LightPositionLoc, this.LightPosition.elements);
  gl.uniform4fv(this.u_EyePositionLoc, this.EyePosition.elements);
  gl.uniform1f(this.u_LightOnLoc, this.LightOn);
  gl.uniform3fv(this.u_IALoc, this.IA.elements);
  gl.uniform3fv(this.u_IDLoc, this.ID.elements);
  gl.uniform3fv(this.u_ISLoc, this.IS.elements);
  gl.uniform1f(this.u_LightOnLoc, this.LightOn);
  gl.uniform1i(this.u_isBlinnLoc, this.isBlinn);
  gl.uniform3fv(this.u_KALoc, this.KA.elements);
  gl.uniform3fv(this.u_KDLoc, this.KD.elements);
  gl.uniform3fv(this.u_KSLoc, this.KS.elements);
  gl.uniform3fv(this.u_KELoc, this.KE.elements);
  gl.uniform1f(this.u_SELoc, this.SE);
}

VBObox3.prototype.draw = function() {
//=============================================================================
// Send commands to GPU to select and render current VBObox contents.

  // check: was WebGL context set to use our VBO & shader program?
  if(this.isReady()==false) {
        console.log('ERROR! before' + this.constructor.name + 
  						'.draw() call you needed to call this.switchToMe()!!');
  }

  this.MVPMatrix.translate(-3.5, 0, 0, 1);
  this.ModelMatrix.translate(-3.5, 0, 0, 1)

  this.MVPMatrix.rotate(90, 1, 0, 0);
  this.ModelMatrix.rotate(90, 1, 0, 0);

  this.NormalMatrix.setInverseOf(this.ModelMatrix); 
  this.NormalMatrix.transpose();

  gl.uniformMatrix4fv(this.u_MVPMatrixLoc, false, this.MVPMatrix.elements);
  gl.uniformMatrix4fv(this.u_ModelMatrixLoc,  // GPU location of the uniform
                      false,                    // use matrix transpose instead?
                      this.ModelMatrix.elements); // send data from Javascript.

  gl.uniformMatrix4fv(this.u_NormalMatrixLoc, false, this.NormalMatrix.elements);
  
  // ----------------------------Draw the contents of the currently-bound VBO:
  gl.drawArrays(gl.TRIANGLES,		    // select the drawing primitive to draw:
                  // choices: gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, 
                  //          gl.TRIANGLES, gl.TRIANGLE_STRIP,
  							houseStart/(floatsPerVertex+3), 								// location of 1st vertex to draw;
  							houseVerts.length/(floatsPerVertex+3));		// number of vertices to draw on-screen.

this.MVPMatrix.translate(0.0, 0.95, 0.0);
this.ModelMatrix.translate(0.0, 0.95, 0.0);
  this.MVPMatrix.rotate(g_angleNow1, 0, 1, 0);
  this.ModelMatrix.rotate(g_angleNow1, 0, 1, 0);

  //update stuff
  this.NormalMatrix.setInverseOf(this.ModelMatrix);	
  this.NormalMatrix.transpose();
  gl.uniformMatrix4fv(this.u_MVPMatrixLoc, false, this.MVPMatrix.elements);
  gl.uniformMatrix4fv(this.u_ModelMatrixLoc,	// GPU location of the uniform
  										false, 										// use matrix transpose instead?
  										this.ModelMatrix.elements);	// send data from Javascript.
  gl.uniformMatrix4fv(this.u_NormalMatrixLoc, false, this.NormalMatrix.elements);


  // ----------------------------Draw the contents of the currently-bound VBO:
  gl.drawArrays(gl.TRIANGLES,		    // select the drawing primitive to draw:
                  // choices: gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, 
                  //          gl.TRIANGLES, gl.TRIANGLE_STRIP,
  							diamondStart/(floatsPerVertex+3), 								// location of 1st vertex to draw;
  							diamondVerts.length/(floatsPerVertex+3));		// number of vertices to draw on-screen.


}


VBObox3.prototype.reload = function() {
//=============================================================================
// Over-write current values in the GPU for our already-created VBO: use 
// gl.bufferSubData() call to re-transfer some or all of our Float32Array 
// contents to our VBO without changing any GPU memory allocations.

 gl.bufferSubData(gl.ARRAY_BUFFER, 	// GLenum target(same as 'bindBuffer()')
                  0,                  // byte offset to where data replacement
                                      // begins in the VBO.
 					 				this.vboContents);   // the JS source-data array used to fill VBO
}

/*
VBObox1.prototype.empty = function() {
//=============================================================================
// Remove/release all GPU resources used by this VBObox object, including any 
// shader programs, attributes, uniforms, textures, samplers or other claims on 
// GPU memory.  However, make sure this step is reversible by a call to 
// 'restoreMe()': be sure to retain all our Float32Array data, all values for 
// uniforms, all stride and offset values, etc.
//
//
// 		********   YOU WRITE THIS! ********
//
//
//
}

VBObox1.prototype.restore = function() {
//=============================================================================
// Replace/restore all GPU resources used by this VBObox object, including any 
// shader programs, attributes, uniforms, textures, samplers or other claims on 
// GPU memory.  Use our retained Float32Array data, all values for  uniforms, 
// all stride and offset values, etc.
//
//
// 		********   YOU WRITE THIS! ********
//
//
//
}
*/

function VBObox4() {
//=============================================================================
//=============================================================================
// CONSTRUCTOR for one re-usable 'VBObox1' object that holds all data and fcns
// needed to render vertices from one Vertex Buffer Object (VBO) using one 
// separate shader program (a vertex-shader & fragment-shader pair) and one
// set of 'uniform' variables.

// Constructor goal: 
// Create and set member vars that will ELIMINATE ALL LITERALS (numerical values 
// written into code) in all other VBObox functions. Keeping all these (initial)
// values here, in this one coonstrutor function, ensures we can change them 
// easily WITHOUT disrupting any other code, ever!
  
	this.VERT_SRC =	//--------------------- VERTEX SHADER source code 
  'uniform mat4 u_MVPMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'uniform vec4 u_LightPosition;\n' +
  'uniform vec4 u_EyePosition;\n' +
  'uniform float u_LightOn;\n' +
  'uniform vec3 u_IA;\n' +
  'uniform vec3 u_ID;\n' +
  'uniform vec3 u_IS;\n' +
  'uniform vec3 u_KA;\n' +
  'uniform vec3 u_KD;\n' +
  'uniform vec3 u_KS;\n' +
  'uniform vec3 u_KE;\n' +
  'uniform float u_SE;\n' +
  'uniform int u_isBlinn;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec3 a_Color;\n' +
  'attribute vec3 a_Normal;\n' +
  'varying vec4 v_Colr;\n' +

  'void main() {\n' +
  'vec4 transVec = u_NormalMatrix * vec4(a_Normal, 1.0);\n' +
  'vec3 normVec = normalize(transVec.xyz);\n' +
  'vec3 lightVec = normalize((u_LightPosition.xyz) - (u_ModelMatrix * a_Position).xyz);\n' +
  'vec3 eyeVec = normalize((u_EyePosition.xyz) - (u_ModelMatrix * a_Position).xyz);\n' +
  '  gl_Position = u_MVPMatrix * a_Position;\n' +
  '  if (u_isBlinn == 1) {\n' +
  '    vec3 halfVec = normalize(lightVec + eyeVec);\n' +
  '    v_Colr = vec4(0.0*a_Color + u_KE + u_LightOn * (u_IA*u_KA + u_ID*u_KD*max(0.0, dot(normVec,lightVec)) + u_IS*u_KS*pow(max(0.0, dot(normVec, halfVec)), u_SE)), 1.0);\n' +
  //'    v_Colr = vec4(0.3*a_Color + 0.0*u_KA + 0.0*u_KD + 0.0*u_KS + 0.0*u_KE + 0.0*u_IA + 0.0*u_ID + 1.0*u_IS + pow(0.6, u_SE) * u_LightOn * (1.0*dot(normVec,lightVec)+ 0.0*eyeVec), 1.0);\n' +
  '  }\n' +
  '  else {\n' +
  '    vec3 reflectVec = -1.0 * reflect(lightVec, normVec);\n' +
  '    v_Colr = vec4(u_KE + u_LightOn * (u_IA*u_KA + u_ID*u_KD*max(0.0, dot(normVec,lightVec)) + u_IS*u_KS*pow(max(0.0, dot(reflectVec, eyeVec)), u_SE)), 1.0);\n' +
  '  }\n' +
  //'    v_Colr = vec4(0.3*a_Color  + 0.0*u_IA + 1.0*u_ID + 0.0*u_IS + u_LightOn * (1.0*dot(normVec,lightVec)+ 0.0*eyeVec), 1.0);}\n' +
  //'  v_Colr = vec4(0.2*a_Color + 0.8*dot(normVec,lightVec), 1.0);\n' +
  '}\n';

  this.FRAG_SRC = 
  'precision mediump float;\n' +
  'varying vec4 v_Colr;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Colr;\n' +
  '}\n';


 //New Stuff: Make each 3D shape in its own array of vertices:
 makeDiamond();
 makeHouse();
    // how many floats total needed to store all shapes?
	var mySiz = (diamondVerts.length + houseVerts.length);

	// How many vertices total?
	var nn = mySiz / (floatsPerVertex+3);
	console.log('nn is', nn, 'mySiz is', mySiz, 'floatsPerVertex is', floatsPerVertex+3);
	// Copy all shapes into one big Float32 array:
  	var colorShapes = new Float32Array(mySiz);
	this.vboContents = new Float32Array(mySiz)
	// Copy them:  remember where to start for each shape:
	diamondStart = 0;							// we stored the cylinder first.
  	for(i=0,j=0; j< diamondVerts.length; i++,j++) {
  		colorShapes[i] = diamondVerts[j];
		}

	houseStart = i;							// we stored the cylinder first.
  	for(j=0; j< houseVerts.length; i++,j++) {
  		colorShapes[i] = houseVerts[j];
		}

	this.vboContents = colorShapes;
		

  //Back to Old Stuff:
	/*

	this.vboContents = //---------------------------------------------------------
		new Float32Array ([					// Array of vertex attribute values we will
  															// transfer to GPU's vertex buffer object (VBO)
			// 1 vertex per line: pos1 x,y,z,w;   colr1; r,g,b;   ptSiz1; 
  	-0.3,  0.7,	0.0, 1.0,		0.0, 1.0, 1.0,  17.0,
    -0.3, -0.3, 0.0, 1.0,		1.0, 0.0, 1.0,  20.0,
     0.3, -0.3, 0.0, 1.0,		1.0, 1.0, 0.0,  33.0,
  ]);	*/
  
	this.vboVerts = nn;							// # of vertices held in 'vboContents' array;
	this.FSIZE = this.vboContents.BYTES_PER_ELEMENT;  
	                              // bytes req'd by 1 vboContents array element;
																// (why? used to compute stride and offset 
																// in bytes for vertexAttribPointer() calls)
    this.vboBytes = this.vboContents.length * this.FSIZE;               
                                // (#  of floats in vboContents array) * 
                                // (# of bytes/float).
	this.vboStride = this.vboBytes / this.vboVerts;     
	                              // (== # of bytes to store one complete vertex).
	                              // From any attrib in a given vertex in the VBO, 
	                              // move forward by 'vboStride' bytes to arrive 
	                              // at the same attrib for the next vertex.
	                               
	            //----------------------Attribute sizes
  this.vboFcount_a_Pos1 =  4;    // # of floats in the VBO needed to store the
                                // attribute named a_Pos1. (4: x,y,z,w values)
  this.vboFcount_a_Colr1 = 3;   // # of floats for this attrib (r,g,b values)
  this.vboFcount_a_PtSiz1 = 1;  // # of floats for this attrib (just one!)   
  this.vboFcount_a_Normal = 3;
  console.assert((this.vboFcount_a_Pos1 +     // check the size of each and
                  this.vboFcount_a_Colr1 +
                  this.vboFcount_a_Normal) *   // every attribute in our VBO
                  this.FSIZE == this.vboStride, // for agreeement with'stride'
                  "Uh oh! VBObox3.vboStride disagrees with attribute-size values!");
                  
              //----------------------Attribute offsets
	this.vboOffset_a_Pos1 = 0;    //# of bytes from START of vbo to the START
	                              // of 1st a_Pos1 attrib value in vboContents[]
  this.vboOffset_a_Colr1 = (this.vboFcount_a_Pos1) * this.FSIZE;  
                                // == 4 floats * bytes/float
                                //# of bytes from START of vbo to the START
                                // of 1st a_Colr1 attrib value in vboContents[]
  this.vboOffset_a_Normal =(this.vboFcount_a_Pos1 +
                            this.vboFcount_a_Colr1) * this.FSIZE; 
                                // == 7 floats * bytes/float
                                // # of bytes from START of vbo to the START
                                // of 1st a_PtSize attrib value in vboContents[]

	            //-----------------------GPU memory locations:                                
	this.vboLoc;									// GPU Location for Vertex Buffer Object, 
	                              // returned by gl.createBuffer() function call
	this.shaderLoc;								// GPU Location for compiled Shader-program  
	                            	// set by compile/link of VERT_SRC and FRAG_SRC.
								          //------Attribute locations in our shaders:
	this.a_Pos1Loc;							  // GPU location: shader 'a_Pos1' attribute
	this.a_Colr1Loc;							// GPU location: shader 'a_Colr1' attribute
	this.a_PtSiz1Loc;							// GPU location: shader 'a_PtSiz1' attribute
	this.a_NormalLoc;
	
	            //---------------------- Uniform locations &values in our shaders
	this.MVPMatrix = new Matrix4();
  this.ModelMatrix = new Matrix4();	// Transforms CVV axes to model axes.
	this.NormalMatrix = new Matrix4();
  this.LightPosition = new Vector4();
  this.EyePosition = new Vector4();
  this.LightOn = 1.0;
  this.IA = new Vector3();
  this.ID = new Vector3();
  this.IS = new Vector3();
  this.KA = new Vector3();
  this.KD = new Vector3();
  this.KS = new Vector3();
  this.KE = new Vector3();
  this.isBlinn = 1;
  this.SE = 1.0;
  this.u_MVPMatrixLoc;
	this.u_ModelMatrixLoc;						// GPU location for u_ModelMat uniform
	this.u_NormalMatrixLoc;
  this.u_LightPositionLoc;
  this.u_EyePositionLoc;
  this.u_LightOnLoc;
  this.u_IALoc;
  this.u_IDLoc;
  this.u_ISLoc;
  this.u_KALoc;
  this.u_KDLoc;
  this.u_KSLoc;
  this.u_KELoc;
  this.u_isBlinnLoc;
  this.u_SELoc
};


VBObox4.prototype.init = function() {
//==============================================================================
// Prepare the GPU to use all vertices, GLSL shaders, attributes, & uniforms 
// kept in this VBObox. (This function usually called only once, within main()).
// Specifically:
// a) Create, compile, link our GLSL vertex- and fragment-shaders to form an 
//  executable 'program' stored and ready to use inside the GPU.  
// b) create a new VBO object in GPU memory and fill it by transferring in all
//  the vertex data held in our Float32array member 'VBOcontents'. 
// c) Find & save the GPU location of all our shaders' attribute-variables and 
//  uniform-variables (needed by switchToMe(), adjust(), draw(), reload(), etc.)
// -------------------
// CAREFUL!  before you can draw pictures using this VBObox contents, 
//  you must call this VBObox object's switchToMe() function too!
//--------------------
// a) Compile,link,upload shaders-----------------------------------------------
	this.shaderLoc = createProgram(gl, this.VERT_SRC, this.FRAG_SRC);
	if (!this.shaderLoc) {
    console.log(this.constructor.name + 
    						'.init() failed to create executable Shaders on the GPU. Bye!');
    return;
  }
// CUTE TRICK: let's print the NAME of this VBObox object: tells us which one!
//  else{console.log('You called: '+ this.constructor.name + '.init() fcn!');}

	gl.program = this.shaderLoc;		// (to match cuon-utils.js -- initShaders())

// b) Create VBO on GPU, fill it------------------------------------------------
	this.vboLoc = gl.createBuffer();	
  if (!this.vboLoc) {
    console.log(this.constructor.name + 
    						'.init() failed to create VBO in GPU. Bye!'); 
    return;
  }
  
  // Specify the purpose of our newly-created VBO on the GPU.  Your choices are:
  //	== "gl.ARRAY_BUFFER" : the VBO holds vertices, each made of attributes 
  // (positions, colors, normals, etc), or 
  //	== "gl.ELEMENT_ARRAY_BUFFER" : the VBO holds indices only; integer values 
  // that each select one vertex from a vertex array stored in another VBO.
  gl.bindBuffer(gl.ARRAY_BUFFER,	      // GLenum 'target' for this GPU buffer 
  								this.vboLoc);				  // the ID# the GPU uses for this buffer.
  											
  // Fill the GPU's newly-created VBO object with the vertex data we stored in
  //  our 'vboContents' member (JavaScript Float32Array object).
  //  (Recall gl.bufferData() will evoke GPU's memory allocation & management: 
  //	 use gl.bufferSubData() to modify VBO contents without changing VBO size)
  gl.bufferData(gl.ARRAY_BUFFER, 			  // GLenum target(same as 'bindBuffer()')
 					 				this.vboContents, 		// JavaScript Float32Array
  							 	gl.STATIC_DRAW);			// Usage hint.  
  //	The 'hint' helps GPU allocate its shared memory for best speed & efficiency
  //	(see OpenGL ES specification for more info).  Your choices are:
  //		--STATIC_DRAW is for vertex buffers rendered many times, but whose 
  //				contents rarely or never change.
  //		--DYNAMIC_DRAW is for vertex buffers rendered many times, but whose 
  //				contents may change often as our program runs.
  //		--STREAM_DRAW is for vertex buffers that are rendered a small number of 
  // 			times and then discarded; for rapidly supplied & consumed VBOs.

// c1) Find All Attributes:-----------------------------------------------------
//  Find & save the GPU location of all our shaders' attribute-variables and 
//  uniform-variables (for switchToMe(), adjust(), draw(), reload(), etc.)
  this.a_Pos1Loc = gl.getAttribLocation(this.shaderLoc, 'a_Position');
  if(this.a_Pos1Loc < 0) {
    console.log(this.constructor.name + 
    						'.init() Failed to get GPU location of attribute a_Position');
    return -1;	// error exit.
  }
 	this.a_Colr1Loc = gl.getAttribLocation(this.shaderLoc, 'a_Color');
  if(this.a_Colr1Loc < 0) {
    console.log(this.constructor.name + 
    						'.init() failed to get the GPU location of attribute a_Color');
    return -1;	// error exit.
  }
  /*this.a_PtSiz1Loc = gl.getAttribLocation(this.shaderLoc, 'a_PtSiz1');
  if(this.a_PtSiz1Loc < 0) {
    console.log(this.constructor.name + 
	    					'.init() failed to get the GPU location of attribute a_PtSiz1');
	  return -1;	// error exit.
  }*/
  this.a_NormalLoc = gl.getAttribLocation(this.shaderLoc, 'a_Normal');
  if(this.a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return -1;
  }
  // c2) Find All Uniforms:-----------------------------------------------------
  //Get GPU storage location for each uniform var used in our shader programs: 

  this.u_MVPMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_MVPMatrix');
  if (!this.u_MVPMatrixLoc) { 
    console.log(this.constructor.name + 
                '.init() failed to get GPU location for u_MVPMatrix uniform');
    return;
  }

  this.u_ModelMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_ModelMatrix');
  if (!this.u_ModelMatrixLoc) { 
    console.log(this.constructor.name + 
    						'.init() failed to get GPU location for u_ModelMatrix uniform');
    return;
  }

  this.u_NormalMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_NormalMatrix');	
	if(!this.u_NormalMatrixLoc) {	
		console.log('Failed to get GPU storage location for u_NormalMatrix');	
		return	
	}

  this.u_LightPositionLoc = gl.getUniformLocation(this.shaderLoc, 'u_LightPosition'); 
  if(!this.u_LightPositionLoc) { 
    console.log('Failed to get GPU storage location for u_LightPosition'); 
    return  
  }

  this.u_EyePositionLoc = gl.getUniformLocation(this.shaderLoc, 'u_EyePosition'); 
  if(!this.u_EyePositionLoc) { 
    console.log('Failed to get GPU storage location for u_EyePosition'); 
    return  
  }

  this.u_LightOnLoc = gl.getUniformLocation(this.shaderLoc, 'u_LightOn'); 
  if(!this.u_LightOnLoc) { 
    console.log('Failed to get GPU storage location for u_LightOn'); 
    return  
  }

  this.u_IALoc = gl.getUniformLocation(this.shaderLoc, 'u_IA'); 
  if(!this.u_IALoc) { 
    console.log('Failed to get GPU storage location for u_IA'); 
    return  
  }

  this.u_IDLoc = gl.getUniformLocation(this.shaderLoc, 'u_ID'); 
  if(!this.u_IDLoc) { 
    console.log('Failed to get GPU storage location for u_ID'); 
    return  
  }

  this.u_ISLoc = gl.getUniformLocation(this.shaderLoc, 'u_IS'); 
  if(!this.u_ISLoc) { 
    console.log('Failed to get GPU storage location for u_IS'); 
    return  
  }

  this.u_KALoc = gl.getUniformLocation(this.shaderLoc, 'u_KA'); 
  if(!this.u_KALoc) { 
    console.log('Failed to get GPU storage location for u_KA'); 
    return  
  }

  this.u_KDLoc = gl.getUniformLocation(this.shaderLoc, 'u_KD'); 
  if(!this.u_KDLoc) { 
    console.log('Failed to get GPU storage location for u_KD'); 
    return  
  }

  this.u_KSLoc = gl.getUniformLocation(this.shaderLoc, 'u_KS'); 
  if(!this.u_KSLoc) { 
    console.log('Failed to get GPU storage location for u_KS'); 
    return  
  }

  this.u_KELoc = gl.getUniformLocation(this.shaderLoc, 'u_KE'); 
  if(!this.u_KELoc) { 
    console.log('Failed to get GPU storage location for u_KE'); 
    return  
  }

  this.u_isBlinnLoc = gl.getUniformLocation(this.shaderLoc, 'u_isBlinn'); 
  if(!this.u_isBlinnLoc) { 
    console.log('Failed to get GPU storage location for u_isBlinn'); 
    return  
  }

  this.u_SELoc = gl.getUniformLocation(this.shaderLoc, 'u_SE'); 
  if(!this.u_SELoc) { 
    console.log('Failed to get GPU storage location for u_SE'); 
    return  
  }
}

VBObox4.prototype.switchToMe = function () {
//==============================================================================
// Set GPU to use this VBObox's contents (VBO, shader, attributes, uniforms...)
//
// We only do this AFTER we called the init() function, which does the one-time-
// only setup tasks to put our VBObox contents into GPU memory.  !SURPRISE!
// even then, you are STILL not ready to draw our VBObox's contents onscreen!
// We must also first complete these steps:
//  a) tell the GPU to use our VBObox's shader program (already in GPU memory),
//  b) tell the GPU to use our VBObox's VBO  (already in GPU memory),
//  c) tell the GPU to connect the shader program's attributes to that VBO.

// a) select our shader program:
  gl.useProgram(this.shaderLoc);	
//		Each call to useProgram() selects a shader program from the GPU memory,
// but that's all -- it does nothing else!  Any previously used shader program's 
// connections to attributes and uniforms are now invalid, and thus we must now
// establish new connections between our shader program's attributes and the VBO
// we wish to use.  
  
// b) call bindBuffer to disconnect the GPU from its currently-bound VBO and
//  instead connect to our own already-created-&-filled VBO.  This new VBO can 
//    supply values to use as attributes in our newly-selected shader program:
	gl.bindBuffer(gl.ARRAY_BUFFER,	    // GLenum 'target' for this GPU buffer 
										this.vboLoc);			// the ID# the GPU uses for our VBO.

// c) connect our newly-bound VBO to supply attribute variable values for each
// vertex to our SIMD shader program, using 'vertexAttribPointer()' function.
// this sets up data paths from VBO to our shader units:
  // 	Here's how to use the almost-identical OpenGL version of this function:
	//		http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttribPointer.xml )


  gl.vertexAttribPointer(
		this.a_Pos1Loc,//index == ID# for the attribute var in GLSL shader pgm;
		this.vboFcount_a_Pos1, // # of floats used by this attribute: 1,2,3 or 4?
		gl.FLOAT,		  // type == what data type did we use for those numbers?
		false,				// isNormalized == are these fixed-point values that we need
									//									normalize before use? true or false
		this.vboStride,// Stride == #bytes we must skip in the VBO to move from the
		              // stored attrib for this vertex to the same stored attrib
		              //  for the next vertex in our VBO.  This is usually the 
									// number of bytes used to store one complete vertex.  If set 
									// to zero, the GPU gets attribute values sequentially from 
									// VBO, starting at 'Offset'.	
									// (Our vertex size in bytes: 4 floats for pos + 3 for color)
		this.vboOffset_a_Pos1);						
		              // Offset == how many bytes from START of buffer to the first
  								// value we will actually use?  (we start with position).
  gl.vertexAttribPointer(this.a_Colr1Loc, this.vboFcount_a_Colr1,
                         gl.FLOAT, false, 
  						           this.vboStride,  this.vboOffset_a_Colr1);
  /*gl.vertexAttribPointer(this.a_PtSiz1Loc,this.vboFcount_a_PtSiz1, 
                         gl.FLOAT, false, 
							           this.vboStride,	this.vboOffset_a_PtSiz1);	*/
  gl.vertexAttribPointer(this.a_NormalLoc,this.vboFcount_a_Normal, 
                         gl.FLOAT, false, 
							           this.vboStride,	this.vboOffset_a_Normal);	
  //-- Enable this assignment of the attribute to its' VBO source:
  gl.enableVertexAttribArray(this.a_Pos1Loc);
  gl.enableVertexAttribArray(this.a_Colr1Loc);
  //gl.enableVertexAttribArray(this.a_PtSiz1Loc);
  gl.enableVertexAttribArray(this.a_NormalLoc);


  //NEW port Stuff
  
}

VBObox4.prototype.isReady = function() {
//==============================================================================
// Returns 'true' if our WebGL rendering context ('gl') is ready to render using
// this objects VBO and shader program; else return false.
// see: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter

var isOK = true;

  if(gl.getParameter(gl.CURRENT_PROGRAM) != this.shaderLoc)  {
    console.log(this.constructor.name + 
    						'.isReady() false: shader program at this.shaderLoc not in use!');
    isOK = false;
  }
  if(gl.getParameter(gl.ARRAY_BUFFER_BINDING) != this.vboLoc) {
      console.log(this.constructor.name + 
  						'.isReady() false: vbo at this.vboLoc not in use!');
    isOK = false;
  }
  return isOK;
}

VBObox4.prototype.adjust = function() {
//==============================================================================
// Update the GPU to newer, current values we now store for 'uniform' vars on 
// the GPU; and (if needed) update each attribute's stride and offset in VBO.

  // check: was WebGL context set to use our VBO & shader program?
  if(this.isReady()==false) {
        console.log('ERROR! before' + this.constructor.name + 
  						'.adjust() call you needed to call this.switchToMe()!!');
  }

	// Adjust values for our uniforms,
   this.MVPMatrix.setIdentity();
   this.ModelMatrix.setIdentity();
// THIS DOESN'T WORK!!  this.ModelMatrix = g_worldMat;
  this.MVPMatrix.set(g_worldMat);
  //this.MVPMatrix.translate(5.5, 0, 0, 1);
  //this.ModelMatrix.translate(5.5, 0, 0, 1);

  //this.MVPMatrix.rotate(90, 1, 0, 0);
  //this.ModelMatrix.rotate(90, 1, 0, 0);

  //this.NormalMatrix.setInverseOf(this.ModelMatrix);	
  //this.NormalMatrix.transpose();

  // Set Light Position
  this.LightPosition.elements[0] = g_light_x;
  this.LightPosition.elements[1] = g_light_y;
  this.LightPosition.elements[2] = g_light_z;
  this.LightPosition.elements[3] = 0.0;

  // Set Eye Position
  this.EyePosition.elements[0] = eye_position[0];
  this.EyePosition.elements[1] = eye_position[1];
  this.EyePosition.elements[2] = eye_position[2];
  this.EyePosition.elements[3] = 0.0;

  // Set light on or off
  if (g_lightSwitch) {this.LightOn = 1.0;}
  else {this.LightOn = 0.0;}
  
  this.IA.elements[0] = g_IA_r;
  this.IA.elements[1] = g_IA_g;
  this.IA.elements[2] = g_IA_b;

  this.ID.elements[0] = g_ID_r;
  this.ID.elements[1] = g_ID_g;
  this.ID.elements[2] = g_ID_b;
  
  this.IS.elements[0] = g_IS_r;
  this.IS.elements[1] = g_IS_g;
  this.IS.elements[2] = g_IS_b;

  this.KA.elements[0] =.25;
  this.KA.elements[1] = .148;
  this.KA.elements[2] = .06475;

  this.KD.elements[0] = .4;
  this.KD.elements[1] = .2368;
  this.KD.elements[2] = .1036;
  
  this.KS.elements[0] = .77;
  this.KS.elements[1] = .46;
  this.KS.elements[2] = .20;

  this.KE.elements[0] = 0.0;
  this.KE.elements[1] = 0.0;
  this.KE.elements[2] = 0.0;
  this.isBlinn = 0;
  this.SE = 76.8;

  //  Transfer new uniforms' values to the GPU:-------------
  // Send  new 'ModelMat' values to the GPU's 'u_ModelMat1' uniform: 

  /*gl.uniformMatrix4fv(this.u_MVPMatrixLoc, false, this.MVPMatrix.elements);
  gl.uniformMatrix4fv(this.u_ModelMatrixLoc,	// GPU location of the uniform
  										false, 										// use matrix transpose instead?
  										this.ModelMatrix.elements);	// send data from Javascript.

  gl.uniformMatrix4fv(this.u_NormalMatrixLoc, false, this.NormalMatrix.elements);*/
  gl.uniform4fv(this.u_LightPositionLoc, this.LightPosition.elements);
  gl.uniform4fv(this.u_EyePositionLoc, this.EyePosition.elements);
  gl.uniform1f(this.u_LightOnLoc, this.LightOn);
  gl.uniform3fv(this.u_IALoc, this.IA.elements);
  gl.uniform3fv(this.u_IDLoc, this.ID.elements);
  gl.uniform3fv(this.u_ISLoc, this.IS.elements);
  gl.uniform1f(this.u_LightOnLoc, this.LightOn);
  gl.uniform1i(this.u_isBlinnLoc, this.isBlinn);
  gl.uniform3fv(this.u_KALoc, this.KA.elements);
  gl.uniform3fv(this.u_KDLoc, this.KD.elements);
  gl.uniform3fv(this.u_KSLoc, this.KS.elements);
  gl.uniform3fv(this.u_KELoc, this.KE.elements);
  gl.uniform1f(this.u_SELoc, this.SE);
}

VBObox4.prototype.draw = function() {
//=============================================================================
// Send commands to GPU to select and render current VBObox contents.

  // check: was WebGL context set to use our VBO & shader program?
  if(this.isReady()==false) {
        console.log('ERROR! before' + this.constructor.name + 
  						'.draw() call you needed to call this.switchToMe()!!');
  }
  
  this.MVPMatrix.translate(5.5, 0, 0, 1);
  this.ModelMatrix.translate(5.5, 0, 0, 1);

  this.MVPMatrix.rotate(90, 1, 0, 0);
  this.ModelMatrix.rotate(90, 1, 0, 0);

  this.NormalMatrix.setInverseOf(this.ModelMatrix); 
  this.NormalMatrix.transpose();

  gl.uniformMatrix4fv(this.u_MVPMatrixLoc, false, this.MVPMatrix.elements);
  gl.uniformMatrix4fv(this.u_ModelMatrixLoc,  // GPU location of the uniform
                      false,                    // use matrix transpose instead?
                      this.ModelMatrix.elements); // send data from Javascript.

  gl.uniformMatrix4fv(this.u_NormalMatrixLoc, false, this.NormalMatrix.elements);

  // ----------------------------Draw the contents of the currently-bound VBO:
  gl.drawArrays(gl.TRIANGLES,		    // select the drawing primitive to draw:
                  // choices: gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, 
                  //          gl.TRIANGLES, gl.TRIANGLE_STRIP,
  							diamondStart/(floatsPerVertex+3), 								// location of 1st vertex to draw;
  							diamondVerts.length/(floatsPerVertex+3));		// number of vertices to draw on-screen.

this.MVPMatrix.translate(0.0, 1, 0.0);
this.ModelMatrix.translate(0.0, 1, 0.0);
  this.MVPMatrix.rotate(g_angleNow1, 0, 1, 0);
  this.ModelMatrix.rotate(g_angleNow1, 0, 1, 0);

  //update stuff
  this.NormalMatrix.setInverseOf(this.ModelMatrix);	
  this.NormalMatrix.transpose();
  gl.uniformMatrix4fv(this.u_MVPMatrixLoc, false, this.MVPMatrix.elements);
  gl.uniformMatrix4fv(this.u_ModelMatrixLoc,	// GPU location of the uniform
  										false, 										// use matrix transpose instead?
  										this.ModelMatrix.elements);	// send data from Javascript.
  gl.uniformMatrix4fv(this.u_NormalMatrixLoc, false, this.NormalMatrix.elements);


  // ----------------------------Draw the contents of the currently-bound VBO:
  gl.drawArrays(gl.TRIANGLES,		    // select the drawing primitive to draw:
                  // choices: gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, 
                  //          gl.TRIANGLES, gl.TRIANGLE_STRIP,
  							diamondStart/(floatsPerVertex+3), 								// location of 1st vertex to draw;
  							diamondVerts.length/(floatsPerVertex+3));		// number of vertices to draw on-screen.
  
  this.MVPMatrix.translate(0.0, 1, 0.0);
  this.ModelMatrix.translate(0.0, 1, 0.0);
  this.MVPMatrix.rotate(g_angleNow0, 1, 0, 1);
  this.ModelMatrix.rotate(g_angleNow0, -1, 0, -1);

  //update stuff
  this.NormalMatrix.setInverseOf(this.ModelMatrix);	
  this.NormalMatrix.transpose();
  gl.uniformMatrix4fv(this.u_MVPMatrixLoc, false, this.MVPMatrix.elements);
  gl.uniformMatrix4fv(this.u_ModelMatrixLoc,	// GPU location of the uniform
  										false, 										// use matrix transpose instead?
  										this.ModelMatrix.elements);	// send data from Javascript.
  gl.uniformMatrix4fv(this.u_NormalMatrixLoc, false, this.NormalMatrix.elements);


  // ----------------------------Draw the contents of the currently-bound VBO:
  gl.drawArrays(gl.TRIANGLES,		    // select the drawing primitive to draw:
                  // choices: gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, 
                  //          gl.TRIANGLES, gl.TRIANGLE_STRIP,
  							diamondStart/(floatsPerVertex+3), 								// location of 1st vertex to draw;
  							diamondVerts.length/(floatsPerVertex+3));		// number of vertices to draw on-screen.

}


VBObox4.prototype.reload = function() {
//=============================================================================
// Over-write current values in the GPU for our already-created VBO: use 
// gl.bufferSubData() call to re-transfer some or all of our Float32Array 
// contents to our VBO without changing any GPU memory allocations.

 gl.bufferSubData(gl.ARRAY_BUFFER, 	// GLenum target(same as 'bindBuffer()')
                  0,                  // byte offset to where data replacement
                                      // begins in the VBO.
 					 				this.vboContents);   // the JS source-data array used to fill VBO
}

/*
VBObox1.prototype.empty = function() {
//=============================================================================
// Remove/release all GPU resources used by this VBObox object, including any 
// shader programs, attributes, uniforms, textures, samplers or other claims on 
// GPU memory.  However, make sure this step is reversible by a call to 
// 'restoreMe()': be sure to retain all our Float32Array data, all values for 
// uniforms, all stride and offset values, etc.
//
//
// 		********   YOU WRITE THIS! ********
//
//
//
}

VBObox1.prototype.restore = function() {
//=============================================================================
// Replace/restore all GPU resources used by this VBObox object, including any 
// shader programs, attributes, uniforms, textures, samplers or other claims on 
// GPU memory.  Use our retained Float32Array data, all values for  uniforms, 
// all stride and offset values, etc.
//
//
// 		********   YOU WRITE THIS! ********
//
//
//
}
*/

function VBObox5() {
//=============================================================================
//=============================================================================
// CONSTRUCTOR for one re-usable 'VBObox1' object that holds all data and fcns
// needed to render vertices from one Vertex Buffer Object (VBO) using one 
// separate shader program (a vertex-shader & fragment-shader pair) and one
// set of 'uniform' variables.

// Constructor goal: 
// Create and set member vars that will ELIMINATE ALL LITERALS (numerical values 
// written into code) in all other VBObox functions. Keeping all these (initial)
// values here, in this one coonstrutor function, ensures we can change them 
// easily WITHOUT disrupting any other code, ever!
  
	this.VERT_SRC =	//--------------------- VERTEX SHADER source code 
  'uniform mat4 u_MVPMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'uniform vec4 u_LightPosition;\n' +
  'uniform vec4 u_EyePosition;\n' +
  'uniform float u_LightOn;\n' +
  'uniform vec3 u_IA;\n' +
  'uniform vec3 u_ID;\n' +
  'uniform vec3 u_IS;\n' +
  'uniform vec3 u_KA;\n' +
  'uniform vec3 u_KD;\n' +
  'uniform vec3 u_KS;\n' +
  'uniform vec3 u_KE;\n' +
  'uniform float u_SE;\n' +
  'uniform int u_isBlinn;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec3 a_Color;\n' +
  'attribute vec3 a_Normal;\n' +
  'varying vec4 v_Colr;\n' +

  'void main() {\n' +
  'vec4 transVec = u_NormalMatrix * vec4(a_Normal, 1.0);\n' +
  'vec3 normVec = normalize(transVec.xyz);\n' +
  'vec3 lightVec = normalize((u_LightPosition.xyz) - (u_ModelMatrix * a_Position).xyz);\n' +
  'vec3 eyeVec = normalize((u_EyePosition.xyz) - (u_ModelMatrix * a_Position).xyz);\n' +
  '  gl_Position = u_MVPMatrix * a_Position;\n' +
  '  if (u_isBlinn == 1) {\n' +
  '    vec3 halfVec = normalize(lightVec + eyeVec);\n' +
  '    v_Colr = vec4(0.0*a_Color + u_KE + u_LightOn * (u_IA*u_KA + u_ID*u_KD*max(0.0, dot(normVec,lightVec)) + u_IS*u_KS*pow(max(0.0, dot(normVec, halfVec)), u_SE)), 1.0);\n' +
  //'    v_Colr = vec4(0.3*a_Color + 0.0*u_KA + 0.0*u_KD + 0.0*u_KS + 0.0*u_KE + 0.0*u_IA + 0.0*u_ID + 1.0*u_IS + pow(0.6, u_SE) * u_LightOn * (1.0*dot(normVec,lightVec)+ 0.0*eyeVec), 1.0);\n' +
  '  }\n' +
  '  else {\n' +
  '    vec3 reflectVec = -1.0 * reflect(lightVec, normVec);\n' +
  '    v_Colr = vec4(u_KE + u_LightOn * (u_IA*u_KA + u_ID*u_KD*max(0.0, dot(normVec,lightVec)) + u_IS*u_KS*pow(max(0.0, dot(reflectVec, eyeVec)), u_SE)), 1.0);\n' +
  '  }\n' +
  //'    v_Colr = vec4(0.3*a_Color  + 0.0*u_IA + 1.0*u_ID + 0.0*u_IS + u_LightOn * (1.0*dot(normVec,lightVec)+ 0.0*eyeVec), 1.0);}\n' +
  //'  v_Colr = vec4(0.2*a_Color + 0.8*dot(normVec,lightVec), 1.0);\n' +
  '}\n';

  this.FRAG_SRC = 
  'precision mediump float;\n' +
  'varying vec4 v_Colr;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Colr;\n' +
  '}\n';


 //New Stuff: Make each 3D shape in its own array of vertices:
 makeDiamond();
 makeHouse();
    // how many floats total needed to store all shapes?
	var mySiz = (diamondVerts.length + houseVerts.length);

	// How many vertices total?
	var nn = mySiz / (floatsPerVertex+3);
	console.log('nn is', nn, 'mySiz is', mySiz, 'floatsPerVertex is', floatsPerVertex+3);
	// Copy all shapes into one big Float32 array:
  	var colorShapes = new Float32Array(mySiz);
	this.vboContents = new Float32Array(mySiz)
	// Copy them:  remember where to start for each shape:
	diamondStart = 0;							// we stored the cylinder first.
  	for(i=0,j=0; j< diamondVerts.length; i++,j++) {
  		colorShapes[i] = diamondVerts[j];
		}

	houseStart = i;							// we stored the cylinder first.
  	for(j=0; j< houseVerts.length; i++,j++) {
  		colorShapes[i] = houseVerts[j];
		}

	this.vboContents = colorShapes;
		

  //Back to Old Stuff:
	/*

	this.vboContents = //---------------------------------------------------------
		new Float32Array ([					// Array of vertex attribute values we will
  															// transfer to GPU's vertex buffer object (VBO)
			// 1 vertex per line: pos1 x,y,z,w;   colr1; r,g,b;   ptSiz1; 
  	-0.3,  0.7,	0.0, 1.0,		0.0, 1.0, 1.0,  17.0,
    -0.3, -0.3, 0.0, 1.0,		1.0, 0.0, 1.0,  20.0,
     0.3, -0.3, 0.0, 1.0,		1.0, 1.0, 0.0,  33.0,
  ]);	*/
  
	this.vboVerts = nn;							// # of vertices held in 'vboContents' array;
	this.FSIZE = this.vboContents.BYTES_PER_ELEMENT;  
	                              // bytes req'd by 1 vboContents array element;
																// (why? used to compute stride and offset 
																// in bytes for vertexAttribPointer() calls)
    this.vboBytes = this.vboContents.length * this.FSIZE;               
                                // (#  of floats in vboContents array) * 
                                // (# of bytes/float).
	this.vboStride = this.vboBytes / this.vboVerts;     
	                              // (== # of bytes to store one complete vertex).
	                              // From any attrib in a given vertex in the VBO, 
	                              // move forward by 'vboStride' bytes to arrive 
	                              // at the same attrib for the next vertex.
	                               
	            //----------------------Attribute sizes
  this.vboFcount_a_Pos1 =  4;    // # of floats in the VBO needed to store the
                                // attribute named a_Pos1. (4: x,y,z,w values)
  this.vboFcount_a_Colr1 = 3;   // # of floats for this attrib (r,g,b values)
  this.vboFcount_a_PtSiz1 = 1;  // # of floats for this attrib (just one!)   
  this.vboFcount_a_Normal = 3;
  console.assert((this.vboFcount_a_Pos1 +     // check the size of each and
                  this.vboFcount_a_Colr1 +
                  this.vboFcount_a_Normal) *   // every attribute in our VBO
                  this.FSIZE == this.vboStride, // for agreeement with'stride'
                  "Uh oh! VBObox3.vboStride disagrees with attribute-size values!");
                  
              //----------------------Attribute offsets
	this.vboOffset_a_Pos1 = 0;    //# of bytes from START of vbo to the START
	                              // of 1st a_Pos1 attrib value in vboContents[]
  this.vboOffset_a_Colr1 = (this.vboFcount_a_Pos1) * this.FSIZE;  
                                // == 4 floats * bytes/float
                                //# of bytes from START of vbo to the START
                                // of 1st a_Colr1 attrib value in vboContents[]
  this.vboOffset_a_Normal =(this.vboFcount_a_Pos1 +
                            this.vboFcount_a_Colr1) * this.FSIZE; 
                                // == 7 floats * bytes/float
                                // # of bytes from START of vbo to the START
                                // of 1st a_PtSize attrib value in vboContents[]

	            //-----------------------GPU memory locations:                                
	this.vboLoc;									// GPU Location for Vertex Buffer Object, 
	                              // returned by gl.createBuffer() function call
	this.shaderLoc;								// GPU Location for compiled Shader-program  
	                            	// set by compile/link of VERT_SRC and FRAG_SRC.
								          //------Attribute locations in our shaders:
	this.a_Pos1Loc;							  // GPU location: shader 'a_Pos1' attribute
	this.a_Colr1Loc;							// GPU location: shader 'a_Colr1' attribute
	this.a_PtSiz1Loc;							// GPU location: shader 'a_PtSiz1' attribute
	this.a_NormalLoc;
	
	            //---------------------- Uniform locations &values in our shaders
	this.MVPMatrix = new Matrix4();
  this.ModelMatrix = new Matrix4();	// Transforms CVV axes to model axes.
	this.NormalMatrix = new Matrix4();
  this.LightPosition = new Vector4();
  this.EyePosition = new Vector4();
  this.LightOn = 1.0;
  this.IA = new Vector3();
  this.ID = new Vector3();
  this.IS = new Vector3();
  this.KA = new Vector3();
  this.KD = new Vector3();
  this.KS = new Vector3();
  this.KE = new Vector3();
  this.isBlinn = 1;
  this.SE = 1.0;
  this.u_MVPMatrixLoc;
	this.u_ModelMatrixLoc;						// GPU location for u_ModelMat uniform
	this.u_NormalMatrixLoc;
  this.u_LightPositionLoc;
  this.u_EyePositionLoc;
  this.u_LightOnLoc;
  this.u_IALoc;
  this.u_IDLoc;
  this.u_ISLoc;
  this.u_KALoc;
  this.u_KDLoc;
  this.u_KSLoc;
  this.u_KELoc;
  this.u_isBlinnLoc;
  this.u_SELoc
};


VBObox5.prototype.init = function() {
//==============================================================================
// Prepare the GPU to use all vertices, GLSL shaders, attributes, & uniforms 
// kept in this VBObox. (This function usually called only once, within main()).
// Specifically:
// a) Create, compile, link our GLSL vertex- and fragment-shaders to form an 
//  executable 'program' stored and ready to use inside the GPU.  
// b) create a new VBO object in GPU memory and fill it by transferring in all
//  the vertex data held in our Float32array member 'VBOcontents'. 
// c) Find & save the GPU location of all our shaders' attribute-variables and 
//  uniform-variables (needed by switchToMe(), adjust(), draw(), reload(), etc.)
// -------------------
// CAREFUL!  before you can draw pictures using this VBObox contents, 
//  you must call this VBObox object's switchToMe() function too!
//--------------------
// a) Compile,link,upload shaders-----------------------------------------------
	this.shaderLoc = createProgram(gl, this.VERT_SRC, this.FRAG_SRC);
	if (!this.shaderLoc) {
    console.log(this.constructor.name + 
    						'.init() failed to create executable Shaders on the GPU. Bye!');
    return;
  }
// CUTE TRICK: let's print the NAME of this VBObox object: tells us which one!
//  else{console.log('You called: '+ this.constructor.name + '.init() fcn!');}

	gl.program = this.shaderLoc;		// (to match cuon-utils.js -- initShaders())

// b) Create VBO on GPU, fill it------------------------------------------------
	this.vboLoc = gl.createBuffer();	
  if (!this.vboLoc) {
    console.log(this.constructor.name + 
    						'.init() failed to create VBO in GPU. Bye!'); 
    return;
  }
  
  // Specify the purpose of our newly-created VBO on the GPU.  Your choices are:
  //	== "gl.ARRAY_BUFFER" : the VBO holds vertices, each made of attributes 
  // (positions, colors, normals, etc), or 
  //	== "gl.ELEMENT_ARRAY_BUFFER" : the VBO holds indices only; integer values 
  // that each select one vertex from a vertex array stored in another VBO.
  gl.bindBuffer(gl.ARRAY_BUFFER,	      // GLenum 'target' for this GPU buffer 
  								this.vboLoc);				  // the ID# the GPU uses for this buffer.
  											
  // Fill the GPU's newly-created VBO object with the vertex data we stored in
  //  our 'vboContents' member (JavaScript Float32Array object).
  //  (Recall gl.bufferData() will evoke GPU's memory allocation & management: 
  //	 use gl.bufferSubData() to modify VBO contents without changing VBO size)
  gl.bufferData(gl.ARRAY_BUFFER, 			  // GLenum target(same as 'bindBuffer()')
 					 				this.vboContents, 		// JavaScript Float32Array
  							 	gl.STATIC_DRAW);			// Usage hint.  
  //	The 'hint' helps GPU allocate its shared memory for best speed & efficiency
  //	(see OpenGL ES specification for more info).  Your choices are:
  //		--STATIC_DRAW is for vertex buffers rendered many times, but whose 
  //				contents rarely or never change.
  //		--DYNAMIC_DRAW is for vertex buffers rendered many times, but whose 
  //				contents may change often as our program runs.
  //		--STREAM_DRAW is for vertex buffers that are rendered a small number of 
  // 			times and then discarded; for rapidly supplied & consumed VBOs.

// c1) Find All Attributes:-----------------------------------------------------
//  Find & save the GPU location of all our shaders' attribute-variables and 
//  uniform-variables (for switchToMe(), adjust(), draw(), reload(), etc.)
  this.a_Pos1Loc = gl.getAttribLocation(this.shaderLoc, 'a_Position');
  if(this.a_Pos1Loc < 0) {
    console.log(this.constructor.name + 
    						'.init() Failed to get GPU location of attribute a_Position');
    return -1;	// error exit.
  }
 	this.a_Colr1Loc = gl.getAttribLocation(this.shaderLoc, 'a_Color');
  if(this.a_Colr1Loc < 0) {
    console.log(this.constructor.name + 
    						'.init() failed to get the GPU location of attribute a_Color');
    return -1;	// error exit.
  }
  /*this.a_PtSiz1Loc = gl.getAttribLocation(this.shaderLoc, 'a_PtSiz1');
  if(this.a_PtSiz1Loc < 0) {
    console.log(this.constructor.name + 
	    					'.init() failed to get the GPU location of attribute a_PtSiz1');
	  return -1;	// error exit.
  }*/
  this.a_NormalLoc = gl.getAttribLocation(this.shaderLoc, 'a_Normal');
  if(this.a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return -1;
  }
  // c2) Find All Uniforms:-----------------------------------------------------
  //Get GPU storage location for each uniform var used in our shader programs: 

  this.u_MVPMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_MVPMatrix');
  if (!this.u_MVPMatrixLoc) { 
    console.log(this.constructor.name + 
                '.init() failed to get GPU location for u_MVPMatrix uniform');
    return;
  }

  this.u_ModelMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_ModelMatrix');
  if (!this.u_ModelMatrixLoc) { 
    console.log(this.constructor.name + 
    						'.init() failed to get GPU location for u_ModelMatrix uniform');
    return;
  }

  this.u_NormalMatrixLoc = gl.getUniformLocation(this.shaderLoc, 'u_NormalMatrix');	
	if(!this.u_NormalMatrixLoc) {	
		console.log('Failed to get GPU storage location for u_NormalMatrix');	
		return	
	}

  this.u_LightPositionLoc = gl.getUniformLocation(this.shaderLoc, 'u_LightPosition'); 
  if(!this.u_LightPositionLoc) { 
    console.log('Failed to get GPU storage location for u_LightPosition'); 
    return  
  }

  this.u_EyePositionLoc = gl.getUniformLocation(this.shaderLoc, 'u_EyePosition'); 
  if(!this.u_EyePositionLoc) { 
    console.log('Failed to get GPU storage location for u_EyePosition'); 
    return  
  }

  this.u_LightOnLoc = gl.getUniformLocation(this.shaderLoc, 'u_LightOn'); 
  if(!this.u_LightOnLoc) { 
    console.log('Failed to get GPU storage location for u_LightOn'); 
    return  
  }

  this.u_IALoc = gl.getUniformLocation(this.shaderLoc, 'u_IA'); 
  if(!this.u_IALoc) { 
    console.log('Failed to get GPU storage location for u_IA'); 
    return  
  }

  this.u_IDLoc = gl.getUniformLocation(this.shaderLoc, 'u_ID'); 
  if(!this.u_IDLoc) { 
    console.log('Failed to get GPU storage location for u_ID'); 
    return  
  }

  this.u_ISLoc = gl.getUniformLocation(this.shaderLoc, 'u_IS'); 
  if(!this.u_ISLoc) { 
    console.log('Failed to get GPU storage location for u_IS'); 
    return  
  }

  this.u_KALoc = gl.getUniformLocation(this.shaderLoc, 'u_KA'); 
  if(!this.u_KALoc) { 
    console.log('Failed to get GPU storage location for u_KA'); 
    return  
  }

  this.u_KDLoc = gl.getUniformLocation(this.shaderLoc, 'u_KD'); 
  if(!this.u_KDLoc) { 
    console.log('Failed to get GPU storage location for u_KD'); 
    return  
  }

  this.u_KSLoc = gl.getUniformLocation(this.shaderLoc, 'u_KS'); 
  if(!this.u_KSLoc) { 
    console.log('Failed to get GPU storage location for u_KS'); 
    return  
  }

  this.u_KELoc = gl.getUniformLocation(this.shaderLoc, 'u_KE'); 
  if(!this.u_KELoc) { 
    console.log('Failed to get GPU storage location for u_KE'); 
    return  
  }

  this.u_isBlinnLoc = gl.getUniformLocation(this.shaderLoc, 'u_isBlinn'); 
  if(!this.u_isBlinnLoc) { 
    console.log('Failed to get GPU storage location for u_isBlinn'); 
    return  
  }

  this.u_SELoc = gl.getUniformLocation(this.shaderLoc, 'u_SE'); 
  if(!this.u_SELoc) { 
    console.log('Failed to get GPU storage location for u_SE'); 
    return  
  }
}

VBObox5.prototype.switchToMe = function () {
//==============================================================================
// Set GPU to use this VBObox's contents (VBO, shader, attributes, uniforms...)
//
// We only do this AFTER we called the init() function, which does the one-time-
// only setup tasks to put our VBObox contents into GPU memory.  !SURPRISE!
// even then, you are STILL not ready to draw our VBObox's contents onscreen!
// We must also first complete these steps:
//  a) tell the GPU to use our VBObox's shader program (already in GPU memory),
//  b) tell the GPU to use our VBObox's VBO  (already in GPU memory),
//  c) tell the GPU to connect the shader program's attributes to that VBO.

// a) select our shader program:
  gl.useProgram(this.shaderLoc);	
//		Each call to useProgram() selects a shader program from the GPU memory,
// but that's all -- it does nothing else!  Any previously used shader program's 
// connections to attributes and uniforms are now invalid, and thus we must now
// establish new connections between our shader program's attributes and the VBO
// we wish to use.  
  
// b) call bindBuffer to disconnect the GPU from its currently-bound VBO and
//  instead connect to our own already-created-&-filled VBO.  This new VBO can 
//    supply values to use as attributes in our newly-selected shader program:
	gl.bindBuffer(gl.ARRAY_BUFFER,	    // GLenum 'target' for this GPU buffer 
										this.vboLoc);			// the ID# the GPU uses for our VBO.

// c) connect our newly-bound VBO to supply attribute variable values for each
// vertex to our SIMD shader program, using 'vertexAttribPointer()' function.
// this sets up data paths from VBO to our shader units:
  // 	Here's how to use the almost-identical OpenGL version of this function:
	//		http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttribPointer.xml )


  gl.vertexAttribPointer(
		this.a_Pos1Loc,//index == ID# for the attribute var in GLSL shader pgm;
		this.vboFcount_a_Pos1, // # of floats used by this attribute: 1,2,3 or 4?
		gl.FLOAT,		  // type == what data type did we use for those numbers?
		false,				// isNormalized == are these fixed-point values that we need
									//									normalize before use? true or false
		this.vboStride,// Stride == #bytes we must skip in the VBO to move from the
		              // stored attrib for this vertex to the same stored attrib
		              //  for the next vertex in our VBO.  This is usually the 
									// number of bytes used to store one complete vertex.  If set 
									// to zero, the GPU gets attribute values sequentially from 
									// VBO, starting at 'Offset'.	
									// (Our vertex size in bytes: 4 floats for pos + 3 for color)
		this.vboOffset_a_Pos1);						
		              // Offset == how many bytes from START of buffer to the first
  								// value we will actually use?  (we start with position).
  gl.vertexAttribPointer(this.a_Colr1Loc, this.vboFcount_a_Colr1,
                         gl.FLOAT, false, 
  						           this.vboStride,  this.vboOffset_a_Colr1);
  /*gl.vertexAttribPointer(this.a_PtSiz1Loc,this.vboFcount_a_PtSiz1, 
                         gl.FLOAT, false, 
							           this.vboStride,	this.vboOffset_a_PtSiz1);	*/
  gl.vertexAttribPointer(this.a_NormalLoc,this.vboFcount_a_Normal, 
                         gl.FLOAT, false, 
							           this.vboStride,	this.vboOffset_a_Normal);	
  //-- Enable this assignment of the attribute to its' VBO source:
  gl.enableVertexAttribArray(this.a_Pos1Loc);
  gl.enableVertexAttribArray(this.a_Colr1Loc);
  //gl.enableVertexAttribArray(this.a_PtSiz1Loc);
  gl.enableVertexAttribArray(this.a_NormalLoc);


  //NEW port Stuff
  
}

VBObox5.prototype.isReady = function() {
//==============================================================================
// Returns 'true' if our WebGL rendering context ('gl') is ready to render using
// this objects VBO and shader program; else return false.
// see: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter

var isOK = true;

  if(gl.getParameter(gl.CURRENT_PROGRAM) != this.shaderLoc)  {
    console.log(this.constructor.name + 
    						'.isReady() false: shader program at this.shaderLoc not in use!');
    isOK = false;
  }
  if(gl.getParameter(gl.ARRAY_BUFFER_BINDING) != this.vboLoc) {
      console.log(this.constructor.name + 
  						'.isReady() false: vbo at this.vboLoc not in use!');
    isOK = false;
  }
  return isOK;
}

VBObox5.prototype.adjust = function() {
//==============================================================================
// Update the GPU to newer, current values we now store for 'uniform' vars on 
// the GPU; and (if needed) update each attribute's stride and offset in VBO.

  // check: was WebGL context set to use our VBO & shader program?
  if(this.isReady()==false) {
        console.log('ERROR! before' + this.constructor.name + 
  						'.adjust() call you needed to call this.switchToMe()!!');
  }

	// Adjust values for our uniforms,
   this.MVPMatrix.setIdentity();
   this.ModelMatrix.setIdentity();
// THIS DOESN'T WORK!!  this.ModelMatrix = g_worldMat;
  this.MVPMatrix.set(g_worldMat);
  /*this.MVPMatrix.translate(2.5, 5, 0, 1);
  this.ModelMatrix.translate(2.5, 5, 0, 1);

   this.MVPMatrix.rotate(90, 1, 0, 0);
  this.ModelMatrix.rotate(90, 1, 0, 0);

  this.MVPMatrix.rotate(g_angleNow0, 0, 1, 0);
  this.ModelMatrix.rotate(g_angleNow0, 0, 1, 0);

  this.NormalMatrix.setInverseOf(this.ModelMatrix);	
  this.NormalMatrix.transpose();*/

  // Set Light Position
  this.LightPosition.elements[0] = g_light_x;
  this.LightPosition.elements[1] = g_light_y;
  this.LightPosition.elements[2] = g_light_z;
  this.LightPosition.elements[3] = 0.0;

  // Set Eye Position
  this.EyePosition.elements[0] = eye_position[0];
  this.EyePosition.elements[1] = eye_position[1];
  this.EyePosition.elements[2] = eye_position[2];
  this.EyePosition.elements[3] = 0.0;

  // Set light on or off
  if (g_lightSwitch) {this.LightOn = 1.0;}
  else {this.LightOn = 0.0;}
  
  this.IA.elements[0] = g_IA_r;
  this.IA.elements[1] = g_IA_g;
  this.IA.elements[2] = g_IA_b;

  this.ID.elements[0] = g_ID_r;
  this.ID.elements[1] = g_ID_g;
  this.ID.elements[2] = g_ID_b;
  
  this.IS.elements[0] = g_IS_r;
  this.IS.elements[1] = g_IS_g;
  this.IS.elements[2] = g_IS_b;

  this.KA.elements[0] = .23;
  this.KA.elements[1] = .23;
  this.KA.elements[2] = .23;

  this.KD.elements[0] = .28;
  this.KD.elements[1] = .28;
  this.KD.elements[2] = .28;
  
  this.KS.elements[0] = .77;
  this.KS.elements[1] = .77;
  this.KS.elements[2] = .77;

  this.KE.elements[0] = 0.0;
  this.KE.elements[1] = 0.0;
  this.KE.elements[2] = 0.0;

  this.isBlinn = 0;
  this.SE = 89.6;

  //  Transfer new uniforms' values to the GPU:-------------
  // Send  new 'ModelMat' values to the GPU's 'u_ModelMat1' uniform: 
  /*gl.uniformMatrix4fv(this.u_MVPMatrixLoc, false, this.MVPMatrix.elements);
  gl.uniformMatrix4fv(this.u_ModelMatrixLoc,	// GPU location of the uniform
  										false, 										// use matrix transpose instead?
  										this.ModelMatrix.elements);	// send data from Javascript.

  gl.uniformMatrix4fv(this.u_NormalMatrixLoc, false, this.NormalMatrix.elements);*/
  gl.uniform4fv(this.u_LightPositionLoc, this.LightPosition.elements);
  gl.uniform4fv(this.u_EyePositionLoc, this.EyePosition.elements);
  gl.uniform1f(this.u_LightOnLoc, this.LightOn);
  gl.uniform3fv(this.u_IALoc, this.IA.elements);
  gl.uniform3fv(this.u_IDLoc, this.ID.elements);
  gl.uniform3fv(this.u_ISLoc, this.IS.elements);
  gl.uniform1f(this.u_LightOnLoc, this.LightOn);
  gl.uniform1i(this.u_isBlinnLoc, this.isBlinn);
  gl.uniform3fv(this.u_KALoc, this.KA.elements);
  gl.uniform3fv(this.u_KDLoc, this.KD.elements);
  gl.uniform3fv(this.u_KSLoc, this.KS.elements);
  gl.uniform3fv(this.u_KELoc, this.KE.elements);
  gl.uniform1f(this.u_SELoc, this.SE);
}

VBObox5.prototype.draw = function() {
//=============================================================================
// Send commands to GPU to select and render current VBObox contents.

  // check: was WebGL context set to use our VBO & shader program?
  if(this.isReady()==false) {
        console.log('ERROR! before' + this.constructor.name + 
  						'.draw() call you needed to call this.switchToMe()!!');
  }
  
  this.MVPMatrix.translate(2.5, 5, 0, 1);
  this.ModelMatrix.translate(2.5, 5, 0, 1);

   this.MVPMatrix.rotate(90, 1, 0, 0);
  this.ModelMatrix.rotate(90, 1, 0, 0);

  this.MVPMatrix.rotate(g_angleNow0, 0, 1, 0);
  this.ModelMatrix.rotate(g_angleNow0, 0, 1, 0);

  this.NormalMatrix.setInverseOf(this.ModelMatrix); 
  this.NormalMatrix.transpose();

  gl.uniformMatrix4fv(this.u_MVPMatrixLoc, false, this.MVPMatrix.elements);
  gl.uniformMatrix4fv(this.u_ModelMatrixLoc,  // GPU location of the uniform
                      false,                    // use matrix transpose instead?
                      this.ModelMatrix.elements); // send data from Javascript.

  gl.uniformMatrix4fv(this.u_NormalMatrixLoc, false, this.NormalMatrix.elements);
  
  // ----------------------------Draw the contents of the currently-bound VBO:
  gl.drawArrays(gl.TRIANGLES,		    // select the drawing primitive to draw:
                  // choices: gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, 
                  //          gl.TRIANGLES, gl.TRIANGLE_STRIP,
  							diamondStart/(floatsPerVertex+3), 								// location of 1st vertex to draw;
  							diamondVerts.length/(floatsPerVertex+3));		// number of vertices to draw on-screen.

this.MVPMatrix.translate(0.0, 1, 0.0);
this.ModelMatrix.translate(0.0, 1, 0.0);
  this.MVPMatrix.rotate(g_angleNow1, 1, 0, 0);
  this.ModelMatrix.rotate(g_angleNow1, 1, 0, 0);

  //update stuff
  this.NormalMatrix.setInverseOf(this.ModelMatrix);	
  this.NormalMatrix.transpose();
  gl.uniformMatrix4fv(this.u_MVPMatrixLoc, false, this.MVPMatrix.elements);
  gl.uniformMatrix4fv(this.u_ModelMatrixLoc,	// GPU location of the uniform
  										false, 										// use matrix transpose instead?
  										this.ModelMatrix.elements);	// send data from Javascript.
  gl.uniformMatrix4fv(this.u_NormalMatrixLoc, false, this.NormalMatrix.elements);


  // ----------------------------Draw the contents of the currently-bound VBO:
  gl.drawArrays(gl.TRIANGLES,		    // select the drawing primitive to draw:
                  // choices: gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, 
                  //          gl.TRIANGLES, gl.TRIANGLE_STRIP,
  							diamondStart/(floatsPerVertex+3), 								// location of 1st vertex to draw;
  							diamondVerts.length/(floatsPerVertex+3));		// number of vertices to draw on-screen.
  
  this.MVPMatrix.translate(0.0, 1, 0.0);
  this.ModelMatrix.translate(0.0, 1, 0.0);
  this.MVPMatrix.rotate(g_angleNow1, 1, 0, 1);
  this.ModelMatrix.rotate(g_angleNow1, -1, 0, -1);

  //update stuff
  this.NormalMatrix.setInverseOf(this.ModelMatrix);	
  this.NormalMatrix.transpose();
  gl.uniformMatrix4fv(this.u_MVPMatrixLoc, false, this.MVPMatrix.elements);
  gl.uniformMatrix4fv(this.u_ModelMatrixLoc,	// GPU location of the uniform
  										false, 										// use matrix transpose instead?
  										this.ModelMatrix.elements);	// send data from Javascript.
  gl.uniformMatrix4fv(this.u_NormalMatrixLoc, false, this.NormalMatrix.elements);


  // ----------------------------Draw the contents of the currently-bound VBO:
  gl.drawArrays(gl.TRIANGLES,		    // select the drawing primitive to draw:
                  // choices: gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, 
                  //          gl.TRIANGLES, gl.TRIANGLE_STRIP,
  							diamondStart/(floatsPerVertex+3), 								// location of 1st vertex to draw;
  							diamondVerts.length/(floatsPerVertex+3));		// number of vertices to draw on-screen.

}


VBObox5.prototype.reload = function() {
//=============================================================================
// Over-write current values in the GPU for our already-created VBO: use 
// gl.bufferSubData() call to re-transfer some or all of our Float32Array 
// contents to our VBO without changing any GPU memory allocations.

 gl.bufferSubData(gl.ARRAY_BUFFER, 	// GLenum target(same as 'bindBuffer()')
                  0,                  // byte offset to where data replacement
                                      // begins in the VBO.
 					 				this.vboContents);   // the JS source-data array used to fill VBO
}

/*
VBObox1.prototype.empty = function() {
//=============================================================================
// Remove/release all GPU resources used by this VBObox object, including any 
// shader programs, attributes, uniforms, textures, samplers or other claims on 
// GPU memory.  However, make sure this step is reversible by a call to 
// 'restoreMe()': be sure to retain all our Float32Array data, all values for 
// uniforms, all stride and offset values, etc.
//
//
// 		********   YOU WRITE THIS! ********
//
//
//
}

VBObox1.prototype.restore = function() {
//=============================================================================
// Replace/restore all GPU resources used by this VBObox object, including any 
// shader programs, attributes, uniforms, textures, samplers or other claims on 
// GPU memory.  Use our retained Float32Array data, all values for  uniforms, 
// all stride and offset values, etc.
//
//
// 		********   YOU WRITE THIS! ********
//
//
//
}
*/