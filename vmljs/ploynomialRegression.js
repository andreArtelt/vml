// polynomregression.js
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
* Implementation of polynomial regression.
* @class vml_PolynomialRegression
* @constructor
*/
function vml_PolynomialRegression() {
  this.lWeights = null;
  this.lData = [];
  this.lLabels = [];
  this.BigPhi = null;
  this.iDegree = 0;
  this.bReady = false;

  /**
  * Initialize the model.
  * @method Init
  * @param {Integer} iDegree Degree of polynomial.
  * @param {Matrix} lData Complete data set used in this model.
  */
  this.Init = function( iDegree, lData ) {
    if( typeof( iDegree ) != "number" ) {
      throw "iDegree has to be number"
    }

    this.iDegree = iDegree;

    this.ConvertData( lData );

     // Fill weight matrix (including bias) with random values
     this.lWeights = math.random( [ this.iDegree + 1 ], -5, 5 );

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
  * Transform a given value using a polynomial.
  * @method ComputePhi
  * @param {Double} x Value/Feature to be transformed.
  * @return {Vector} Transformed value.
  */
  this.ComputePhi = function( x ) {
     return vml_utils.ComputePolynomPhi( x, this.iDegree );
  };

  /**
  * Convert a given set of data (add hidden bias + perform polynomial feature transformation)
  * @method ConvertData
  * @param {Matrix} lData All samples (data set).
  */
  this.ConvertData = function( lData ) {
     this.lData = [];
     this.lLabels = [];
     this.BigPhi = [];

     // Create list of vectors of shape (phi(x))  phi(x)=(1, x, x^2, x^3, ...)(1 is the "hidden" bias)
     for( var i=0; i != lData.length; i++ ) {
        var point = lData[ i ];
       
        var phi = this.ComputePhi( point[ 0 ] );

        this.BigPhi.push( phi );
        this.lData.push( math.matrix( phi ) );
        this.lLabels.push( point[ 1 ] );
     }
     this.BigPhi = math.matrix( this.BigPhi );
  };

  /**
  * Compute the RSS (Residual Sum of Squares).
  * @method ComputeRSS
  * @return {Double} RSS of current data and weights.
  */
  this.ComputeError = function() {
     var fResult = 0.0;

     var weights_t = math.transpose( this.lWeights );  // Transpose weight matrix
     for( var i=0; i != this.lData.length; i++ ) {
       var input = this.lData[ i ];
       var label = this.lLabels[ i ];

       fResult += Math.pow( label - math.multiply( weights_t, input ), 2 );
     }
     fResult *= 0.5;

     return fResult;
  };

  /**
  * Fit the model using Least-Square.
  * @method Fit
  * @param {Double} fReg Regularization rate.
  */
  this.Fit = function( fReg ) {
    if( typeof( fReg ) != "number" ) {
      throw "fReg has to be number"
    }

    // Least Square:
    // w=(X^T * X + lambda*I)^-1 * X^T * y   where X is the design matrix big phi
    var bigPhi_t = math.transpose( this.BigPhi );
    var d = this.iDegree + 1;
    var regI = math.eye( d, d );
    var y = math.matrix( this.lLabels );
    var fLambda = fReg;
    var matReg = vml_math.MultiplyScalar( regI, fLambda );

    this.lWeights = math.multiply( math.multiply( math.inv( math.add( matReg , math.multiply( bigPhi_t, this.BigPhi ) ) ), bigPhi_t ), y );
    if( d == 1 ) {  // Note: If result is 1d, mathjs does not return a matrix but a single float
      this.lWeights = math.matrix( [ this.lWeights ] );
    }
  };

  /**
  * Update weights using gradient descent.
  * @method UpdateWeights
  * @param {Double} fLambda Learning rate.
  * @param {Double} fReg Regularization rate.
  */
  this.UpdateWeights = function( fLambda, fReg ) {
     if( typeof( fLambda ) != "number" ) {
       throw "fLambda has to be a number"
     }
     if( typeof( fReg ) != "number" ) {
       throw "fReg has to be number"
     }

     // Apply gradient descent
     var myGrad = undefined;
     var weights_t = math.transpose( this.lWeights );

     var reg = vml_math.MultiplyScalar( math.abs( this.lWeights ), fReg );  // Regularization

     for( var i=0; i != this.lData.length; i++ ) {  // Full batch
       var input = this.lData[ i ];
       var label = this.lLabels[ i ];
	     
       var grad = vml_math.MultiplyScalar( input, label - math.multiply( weights_t, input ) );
       //console.log( math.norm( grad, 2 ) );     

       if( myGrad == undefined ) {
         myGrad = grad
       }
       else {
         myGrad = math.add( myGrad, grad );
       }
     }
     myGrad = vml_math.MultiplyScalar( myGrad, -1.0 / this.lData.length );
     //console.log( math.norm( myGrad, 2 ) );     

     myGrad = vml_utils.GradientClipping( myGrad, 10 );   // Apply gradient clipping to avoid exploding gradient

     var gradCost = math.add( myGrad, reg );  // Cost: RSS + Reg
     this.lWeights = math.subtract( this.lWeights, vml_math.MultiplyScalar( gradCost, fLambda ) );
  };

  /**
  * Predict the value of a given point.
  * @method Predict
  * @param {Float} vecPoint Data point used for prediction.
  * @return {Double} Predicted value.
  */
  this.Predict = function( vecPoint ) {
    if( typeof( vecPoint ) != "number" ) {
      throw "vecPoint has to be a number"
    }

    return math.multiply( math.transpose( this.lWeights ), math.matrix( this.ComputePhi( vecPoint ) ) );
  };
}
