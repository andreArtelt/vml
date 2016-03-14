// gaussDist.js
// VML - Visualization Machine Learning
// Copyright <c> Andre Artelt
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
* Implementation of the gaussian probability distribution.
* @class vml_GaussDist
* @constructor
*/
function vml_GaussDist() {
  // Vars
  this.fMean = 0.0;
  this.fSigma = 0.0;

  /**
  * Fit a gaussian distribution to to a given data set.
  * @method Fit
  * @param {Matrix} lData Data set (points are vectors, vectors are written in a matrix) for fitting.
  */
  this.Fit = function( lData ) {
     // Compute mean
     this.fMean = math.sum( lData ) * (1.0 / lData.length);

     // Compute sigma
     for( var i=0; i != lData.length; i++ ) {
       this.fSigma += Math.pow( lData[i] - this.fMean, 2 );
     }
     this.fSigma *= 1.0 / (lData.length - 1)
  };

  /**
  * Compute "probability" of a given sample (assuming it was generated by the gaussian distribution).
  * @param {Vector} vecPoint Point used for prediction.
  */
  this.Prob = function( vecPoint ) {
     return ( 1.0 / math.sqrt( 2*math.pi*this.fSigma ) * math.exp( -1 * ( Math.pow( vecPoint - this.fMean, 2 ) / this.fSigma ) ) )
  };
}
