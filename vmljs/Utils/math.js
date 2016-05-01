// math.js
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
* @classdesc Collection of various math functions.
* @class vml_math
* @static
* @constructor
*/
function vml_math() {
}

/**
* Matrix-Scalar multiplication (for math.js matricies only!).
* @method MultiplyScalar
* @memberof vml_math
* @param {Matrix} matA - Matrix for multiplication.
* @param {Double} dScalar - Scalar for multiplication.
* @return {Matrix} matA * dScalar
*/
vml_math.MultiplyScalar = function( matA, dScalar ) {
  return matA.map( function( value, index, matrix ) {
    return value * dScalar;
  } );
}

/**
* Compute the outerproduct of two given matricies/vectors.
* @method Outer
* @memberof vml_math
* @param {Matrix} matA - Matrix/Vector A.
* @param {Matrix} matB - Same matrix/vector as matA.
* @param {Integer} iDimA - Dimension of A.
* @return {Matrix} matA * matA (where * is the outer product operator).
*/
vml_math.Outer = function( matA, matB, iDim ) {
  var _matA = matA;
  for( var i=0; i != iDim - 1; i++ ) {
    _matA = math.concat( _matA, matA, 0 );
  }
  var _matB = math.transpose( _matA );

  return math.dotMultiply( _matA, _matB );
};

/**
* Compute the outerproduct of two given matricies/vectors.
* @method OuterEx
* @memberof vml_math
* @param {Matrix} matA - Matrix/Vector A.
* @param {Matrix} matB - Matrix/Vector B.
* @param {Integer} iDimA - Dimension of A.
* @param {Integer} iDimB - Dimension of B
* @return {Matrix} matA * matB (where * is the outer product operator).
*/
vml_math.OuterEx = function( matA, matB, iDimA, iDimB ) {
  var _matA = matA;
  var _matB = matB;

  for( var i=0; i != iDimB - 1; i++ ) {
    _matA = math.concat( _matA, matA, 0 );
  }
  for( var i=0; i != iDimA - 1; i++ ) {
    _matB = math.concat( _matB, matB, 0 );
  }
  _matB = math.transpose( _matB );

  return math.transpose( math.dotMultiply( _matA, _matB ) );
};

/**
* Gaussian kernel.
* @method Kernel_Gaussian
* @memberof vml_math
* @param {Vector} x1 - First data point.
* @param {Vector} x2 - Second data point.
* @param {Double} sigma - Sigma of gauss curve.
* @return {Double} k(x1, x2) where k is the gaussian kernel.
*/
vml_math.Kernel_Gaussian = function( x1, x2, sigma ) {
  return math.exp( -1 * Math.pow( math.distance( x1, x2 ), 2 ) / Math.pow( sigma, 2 ) );
};

/**
* Linear kernel.
* @method Kernel_Linear
* @memberof vml_math
* @param {Vector} x1 - First data point.
* @param {Vector} x2 - Second data point.
* @param {Double} b - Bias.
* @return {Double} k(x1, x2) where k is the linear kernel.
*/
vml_math.Kernel_Linear = function( x1, x2, b ) {
  return vml_math.Kernel_Polynomial( x1, x2, 1, b );
};

/**
* Polynomial kernel.
* @method Kernel_Polynomial
* @memberof vml_math
* @param {Vector} x1 - First data point.
* @param {Vector} x2 - Second data point.
* @param {Int} d - Degree of polynomial.
* @param {Double} b - Bias.
* @return {Double} k(x1, x2) where k is the polynomial kernel.
*/
vml_math.Kernel_Polynomial = function( x1, x2, d, b ) {
  return math.dotPow( ( math.multiply(math.transpose( x1 ), x2 ) + b ), d );
};
