// perceptron.js
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
* Implementation of the perceptron.
* @class vml_Perceptron
* @constructor
*/
function vml_Perceptron() {
  this.lWeights = undefined;   // Perceptron params
  this.lData = [];
  this.lLabels = [];

  /**
  * Inititalization.
  * @method Init
  * @param {Matrix} lClassA All samples of class A.
  * @param {Matrix} lClassB All samples of class B.
  */
  this.Init = function( lClassA, lClassB ) {
    // Convert dataset
    this.convertData( lClassA, lClassB );

    // Init params
    this.InitWeightsRand();   
  };

  /**
  * Init weights with random values.
  * @method InitWeightRand
  */
  this.InitWeightsRand = function() {
     // Fill weight matrix (including bias) with random values
     this.lWeights = math.matrix( math.random( [3], -1, 1 ) );
  };

  /**
  * Convert Make given data suiteable for training (bias 1 has to be included into samples).
  * @method convertData
  * @private
  * @param {Matrix} lClassA All samples of class A.
  * @param {Matrix} lClassB All samples of class B.
  */
  this.convertData = function( lClassA, lClassB ) {
     this.lData = [];
     this.lLabels = [];     
 
     // Create list of vectors of shape (x, y, 1)  (1 is the "hidden" bias)
     for( var i=0; i != lClassA.length; i++ ) {
        var point = lClassA[i];

        this.lData.push( math.matrix( [ point[0], point[1], 1 ] ) );
        this.lLabels.push( 1 );
     }
     for( var i=0; i != lClassB.length; i++ ) {
        var point = lClassB[i];

        this.lData.push( math.matrix( [ point[0], point[1], 1 ] ) );
        this.lLabels.push( -1 );
     }
  };

  /**
  * Update weights using the perceptron learing rule (perform one step of fitting/training).
  * @method FitStep
  * @param {Double} fLambda Learning rate (if not specified it's set to 1).
  */
  this.FitStep = function( fLambda ) {
     // Select random sample
     var iIndex = Math.floor( Math.random() * this.m_lData.length );
     var input = this.m_lData[ iIndex ];
     var label = this.m_lLabels[ iIndex ];

     // Already classified correctly? 
     var predLabel = math.sign( math.multiply( math.transpose( this.lWeights ), input ) );
     if( predLabel == label ) {
        return;
     }

     // Apply sgd (stochastic gradient descent)
     this.lWeights = math.add( this.lWeights, vml_math.MultiplyScalar( input, label * fLambda ) );
  }
}
