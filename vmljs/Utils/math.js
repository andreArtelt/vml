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
* Collection of various math functions.
* @class vml_math
* @static
* @constructor
*/
function vml_math() {
}

/**
* Matrix-Scalar multiplication (for math.js matricies only!).
* @method MultiplyScalar
* @static
* @param {Matrix} matA Matrix for multiplication.
* @param {Double} dScalar Scalar for multiplication.
* @return {Matrix} matA * dScalar
*/
vml_math.MultiplyScalar = function( matA, dScalar ) { // TODO: Replace with math.dotMultiply(x, y)?
  return matA.map( function( value, index, matrix ) {
    return value * dScalar;
  } );
}

/**
* Gaussian kernel.
* @method Kernel_Gaussian
* @static
* @param {Vector} x1 First data point.
* @param {Vector} x2 Second data point.
* @param {Double} sigma Sigma of gauss curve.
* @return {Double} k(x1, x2) where k is the gaussian kernel.
*/
vml_math.Kernel_Gaussian = function( x1, x2, sigma ) {
  return math.exp( -1 * Math.pow( math.distance( x1, x2 ), 2 ) / Math.pow( sigma, 2 ) );
};

/**
* Linear kernel.
* @method Kernel_Linear
* @static
* @param {Vector} x1 First data point.
* @param {Vector} x2 Second data point.
* @param {Double} b Bias.
* @return {Double} k(x1, x2) where k is the linear kernel.
*/
vml_math.Kernel_Linear = function( x1, x2, b ) {
  return vml_math.Kernel_Polynomial( x1, x2, 1, b );
};

/**
* Polynomial kernel.
* @method Kernel_Polynomial
* @static
* @param {Vector} x1 First data point.
* @param {Vector} x2 Second data point.
* @param {Int} d Degree of polynomial.
* @param {Double} b Bias.
* @return {Double} k(x1, x2) where k is the polynomial kernel.
*/
vml_math.Kernel_Polynomial = function( x1, x2, d, b ) {
  return Math.pow( ( math.multiply(math.transpose( x1 ), x2 ) + b ), d );
};

/**
* ELM kernel.
* @method Kernel_ELM
* @static
* @param {Vector} x1 First data point.
* @param {Vector} x2 Second data point.
* @param {Double} s TODO
* @return {Double} k(x1, x2) where k is the elm kernel.
*/
vml_math.Kernel_ELM = function( x1, x2, s ) {
  var A = math.multiply( math.transpose( x1 ), x2 );
  var B = math.multiply( math.transpose( x1 ), x1 );
  var C = math.multiply( math.transpose( x2 ), x2 );
  var D = 1.0 / Math.pow( 2*s, 2 );

  return ( 2.0 / math.pi ) * math.asin( ( 1 + A ) / math.sqrt( ( D + 1 + B ) * ( D + 1 + C ) ) );
}

/**
* Sigmoid kernel.
* @method Kernel_Sigmoid
* @static
* @param {Vector} x1 First data point.
* @param {Vector} x2 Second data point.
* @param {Double} a TODO
* @param {Double} b TODO
* @return {Double} k(x1, x2) where k is the sigmoid kernel.
*/
vml_math.Kernel_Sigmoid = function( x1, x2, a, b ) {
  return math.tanh( a * ( math.transpose( x1 )*x2 ) + b );
}
