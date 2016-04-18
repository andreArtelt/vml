// utils.js
// VML - Visualization Machine Learning
// Copyright <c> André Artelt
// The MIT License (MIT)
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in all
//  copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//  SOFTWARE.

/**
* Implementation of various utils (general usefull functions which does not fit into any other class).
* @class
* @static
* @constructor
*/
function vml_utils() {
}

/**
* Implementation of gradient clipping.
* @method GradientClipping
* @static
* @param grad Gradient.
* @param {Float} fThreshold Threshold of gradient norm/size.
* @return (Clipped/Scaled) gradient
*/
vml_utils.GradientClipping = function( grad, fThreshold ) {
  var fNorm = math.norm( grad, 2 );

  if( fNorm > fThreshold ) {
    return vml_math.MultiplyScalar( grad, fThreshold / fNorm );
  }

  return grad;
}

/**
* .
* @method
* @static
* @param {Matrix}
* @param {Integer} Dimension of a data point.
* @param {Integer} Degree of polynomial.
* @return
*/
vml_utils.PolynomFeatureTransform = function(lData, iDim, iDegree) {
  var matBigPhi = [];

  // Create list of vectors of shape (phi(x))  phi(x)=(1, x, x^2, x^3, ...)(1 is the "hidden" bias)
  for(var i=0; i != lData.length; i++) {
    var point = lData[i];
    var phi = [];

    for(var j=0; j != iDim; j++) {
      phi = phi.concat( vml_utils.ComputePolynomPhi( point[j], iDegree ) );
    }

    matBigPhi.push( phi );
  }

  return matBigPhi;
};

/*
* Transform a given value using a polynomial. phi(x)=(1, x, x^2, x^3, ...)(1 is the "hidden" bias)
* @method ComputePolynomPhi
* @static
* @param {Double} x Value to be transformed. 
* @param {Integer} Degree of polynomial.
* @return {Vector} Transformed value.
*/
vml_utils.ComputePolynomPhi = function( x, iDegree ) {
   var phi = [];

   for( var j=0; j != iDegree + 1; j++ ) {
      phi.push( Math.pow( x, j ) );
   }

   return phi;
};

/**
* Create a matrix (with given dimension) and fill it with random values.
* @method CreateRandMatrix
* @static
* @param {[Int]} lDim Dimension of the matrix.
* @return Matrix with random values.
*/
vml_utils.CreateRandMatrix = function( lDim ) {
  return math.random( lDim );
};

/**
* Build 2d grid/mesh (includes a 'hidden' bias for each point).
* @method BuildGrid
* @static
* @param {Double} x1 X coordinate of upper left corner.
* @param {Double} x2 X coordinate of lower right corner.
* @param {Double} y1 Y coordinate of upper left corner.
* @param {Double} y2 Y coordinate of lower right corner.
* @param {Double} stepsize "Size" of a cell (if not specified 0.02 units).
* @return Grid as one 'big' list (of vectors).
*/
vml_utils.BuildGrid = function( x1, x2, y1, y2, stepsize ) {
      // Create grid/mesh for drawing/evaluating the decision boundary
      var steps = stepsize !== undefined ? stepsize : 0.02;
      var lX = math.range( x1, x2, steps );
      var lY = math.range( y1, y2, steps );
      var lResult = []

      lX.forEach(function( x_value, x_index, x_m ) {
	 lY.forEach(function( y_value, y_index, y_m ) {
	   lResult.push( [ x_value, y_value, 1 ] ); }.bind( this ) );
      }.bind( this ) );

      return lResult;
};

/**
* Build 2d grid/mesh (without a 'hidden' bias).
* @method BuildGridWithoutBias
* @static
* @param {Double} x1 X coordinate of upper left corner.
* @param {Double} x2 X coordinate of lower right corner.
* @param {Double} y1 Y coordinate of upper left corner.
* @param {Double} y2 Y coordinate of lower right corner.
* @param {Double} stepsize "Size" of a cell (if not specified 0.02 units).
* @return Grid as one big list (of vectors).
*/
vml_utils.BuildGridWithoutBias = function( x1, x2, y1, y2, stepsize ) {
      // Create grid/mesh for drawing/evaluating the decision boundary
      var steps = stepsize !== undefined ? stepsize : 0.02;
      var lX = math.range( x1, x2, steps );
      var lY = math.range( y1, y2, steps );
      var lResult = []

      lX.forEach( function ( x_value, x_index, x_m ) {
	 lY.forEach( function( y_value, y_index, y_m ) {
	   lResult.push( [ x_value, y_value ] ); }.bind( this ) );
      }.bind( this ) );

      return lResult;
};

/**
* Build 1d grid/mesh (without a 'hidden' bias).
* @method BuildGrid1d
* @static
* @param {Double} x1 Left corner.
* @param {Double} x2 Right corner
* @param {Double} stepsize "Size" of a cell (if not specified 0.02 units).
* @return Grid as one big list (of vectors).
*/
vml_utils.BuildGrid1d = function( x1, x2, stepsize ) {
      // Create grid/mesh for drawing/evaluating the decision boundary
      var steps = stepsize !== undefined ? stepsize : 0.02;
      var lX = math.range( x1, x2, steps );
      var lResult = []

      lX.forEach(function ( x_value, x_index, x_m ) {
	   lResult.push( x_value );
      }.bind( this ) );

      return lResult;
};

/**
* Fill list/array with a given default value.
* @method FillList
* @static
* @param {Int} iLen Length of list/array.
* @param _Value Default value (can be of any type).
* @return Filled list (with given length and default value).
*/
vml_utils.FillList = function( iLen, _Value ) {
   lResult = [];

   for( var i=0; i != iLen; i++ ) {
      lResult.push( _Value );
   }

   return lResult;
}
