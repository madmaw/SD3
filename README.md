SD3
===

Basic 3D engine that uses SVG as the renderer. 

Specifically targets resource-constrained mobile devices and browsers that don't have WebGL support. 

Why SVG?
* Native browser support for basic matrix operations (rotate, skew, scale, etc...)
* Trivial to create textured surfaces
* Supported on all(?) modern browsers
* In-browser templating languages (e.g. XSL, Mustache, Handlebars) and other SVG tools can be used to create and manipulate SVG surfaces 

Constraints
* Because SD3 uses 2D transformations to give a 3D effect, you cannot rotate objects on the x or y axis (only the z axis)
* You can tilt the viewing angle on the x axis, however you should probably limit it to between 0 and 90 degrees
* SMIL animations on 3D surfaces work inconsistently and should be avoided 
* No translation of Y coordinates to screen/SVG coordinates occurs, so everything is upside down
