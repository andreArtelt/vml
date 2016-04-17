// softmaxRegression.js
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
* Implementation of softmax regression (in the case of two classes it reduces to logistic regression).
* @class vml_SoftmaxRegression
* @constructor
*/
function vml_SoftmaxRegression() {
  // Vars
  this.lData = [];
  this.lLabels = [];  // Are expected to be {0, 1, 2, 3, ...}
  this.iNumClasses = 0;
  this.lParams = [];
  this.iDim = 0;
  this.bReady = false;

  /**
  * Initialize model.
  * @method Init
  * @param {Matrix} lData Data set.
  * @param {Vector} lLabels Labels of each data point.
  * @param {Integer} iDim Dimension of data.
  * @param {Integer} iNumClasses Number of classes/labels.
  */
  this.Init = function( lData, lLabels, iDim, iNumClasses ) {
    if( lLabels instanceof Array == false ) {
      throw "lLabels has to be a vector (Array)"
    }
    if( typeof( iDim ) != "number" ) {
      throw "iDim has to be a number"
    }
    if( typeof( iNumClasses ) != "number" ) {
      throw "iNumClasses has to be a number"
    }

    this.lData = lData;
    this.lLabels = lLabels;
    this.iNumClasses = iNumClasses;
    this.iDim = iDim;

    this.ResetWeights();

    this.bReady = true;
  };

  /**
  * Checks if the model has been initialized or not.
  * @method IsReady
  * @return {boolean} true if it has been initialized, false otherwise.
  */
  this.IsReady = function() {
    return this.bReady;
  };

  /**
  * Initialize weights with random values.
  * @method ResetWeihts
  */
  this.ResetWeights = function() {
    this.lParams = [];
    for( var i=0; i != this.iNumClasses - 1; i++ ) {
      this.lParams.push( vml_utils.CreateRandMatrix( [this.iDim] ) );
    }
  };

  /**
  * Perform one step of training/fitting using gd (gd = gradient descent).
  * @method TrainStep
  * @param {Double} fLambda Learning rate (stepsize).
  * @param {Double} fL2 "Strength" of L2 regularization.
  * @return {Double} Current log likelihood.
  */
  this.TrainStep = function( fLambda, fL2 ) {
     if( typeof( fLambda ) != "number" ) {
       throw "fLambda has to be a number"
     }
     if( typeof( fL2 ) != "number" ) {
       throw "fL2 has to be a number"
     }

     var fLogLikelihood = 0.0;

     // Compute predictions
     var lPreds = [];
     for( var i=0; i != this.lData.length; i++ ) {
       lPreds.push( this.Predict( this.lData[i] ) );
     }

     for( var i=0; i != this.lParams.length; i++ ) {
       var vecGrad = undefined;       

       // Compute gradient
       for( var j=0; j != this.lData.length; j++ ) {
         var tmp = undefined
         if( i == this.lLabels[j] ) {
           tmp = vml_math.MultiplyScalar( this.lData[j], (1.0 - lPreds[j][i]) );
         }
         else {
           tmp = vml_math.MultiplyScalar( this.lData[j], (0.0 - lPreds[j][i]) );
         }

         if( vecGrad == undefined ) {
           vecGrad = tmp;
         }
         else {
           vecGrad = math.add( vecGrad, tmp );
         }
       }
       vecGrad = vml_math.MultiplyScalar( vecGrad, -1.0 / this.lData.length );
       vecGrad = math.add( vecGrad, vml_math.MultiplyScalar( this.lParams[i], fL2 ) );  // L2 regularization

       // Update param
       this.lParams[i] = math.subtract( this.lParams[i], vml_math.MultiplyScalar( vecGrad, fLambda ) );
     }

     return fLogLikelihood;
  };

  /**
  * Compute the log likelihood of the training data.
  * @method LogLikelihood
  * @return {Double} Log likelihood.
  */
  this.LogLikelihood = function() {
    var fCost = 0.0;

    for( var i=0; i != this.lData.length; i++ ) {
      var x = this.lData[i];
      var t = this.lLabels[i];
      var pred = this.Predict( x );

      fCost += math.log( pred[ t ] );
    }

    return fCost;
  };

  /**
  * Compute predicted class probabilities for a given point.
  * @method Predict
  * @param {Vector} vecPoint Point to be classified/labeled.
  * @return {Vector} Class probabilities.
  */
  this.Predict = function( vecPoint ) {
    if( vecPoint instanceof Array == false ) {
      throw "vecPoint has to be a vector (Array)"
    }

    var lResult = []

    var fNorm = 0.0;
    for( var i=0; i != this.lParams.length; i++ ) {
      var fScore = math.exp( -1.0 * math.dot( this.lParams[i], vecPoint ) );
     
      lResult.push( fScore )
      fNorm += fScore;
    }

    if( this.lParams.length > 1 ) {
      fNorm = 1.0 / fNorm;
      for( var i=0; i != this.lParams.length; i++ ) {
        lResult[i] *= fNorm;
      }
    }
    else {  // Special case: 2 classes => Logistic regression
      lResult[0] = 1.0 / (1.0 + lResult[0]);
      lResult.push( 1.0 - lResult[0] );
    }

    return lResult;
  };

  this.Evaluate = function() {
    var oResult = [];

    for( var i=0; i != this.lData.length; i++ ) {
       var pred = this.Predict( this.lData[ i ] );
       var label = this.lLabels[ i ];

       oResult.push( {predT: pred, t: label} );
    }

    return oResult;
  };
}
