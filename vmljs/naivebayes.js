// naivebayes.js
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
* Implementation of gaussian naive bayes classification.
* @class vml_NaiveBayes
* @constructor
*/
function vml_NaiveBayes() {
  this.bReady = false;

  // Probability distributions for all features of both classes
  this.ProbDistA = [];
  this.ProbDistB = [];
  
  // Prior probabilities
  this.fProbA = 0.5;
  this.fProbB = 0.5;

  /**
  * Initialization of the classifier (including fitting/training).
  * @method Fit
  * @param {Matrix} lClassA All samples of class A.
  * @param {Matrix} lClassB All samples of class B.
  * @param {Integer} iNumFeatures Number of features/dimension of a data point (if not specified it's set to 2).
  */
  this.Fit = function( lClassA, lClassB, iNumFeatures ) {
     if( iNumFeatures == undefined ) {  // If number of features has not been specified, assume 2 (because of 2d)
       iNumFeatures = 2;
     }

     // Extract features
     var lFeatureX_A = []; var lFeatureX_B = [];
     var lFeatureY_A = []; var lFeatureY_B = [];
    
     for( var i = 0; i != lClassA.length; i++ ) {
       lFeatureX_A.push( lClassA[i][0] );
       lFeatureY_A.push( lClassA[i][1] );
     }
     for( var i = 0; i != lClassB.length; i++ ) {
       lFeatureX_B.push( lClassB[i][0] );
       lFeatureY_B.push( lClassB[i][1] );
     }

     // Fit probability distributions (gaussian) for each feature
     this.lProbDistA = [];
     var distX_A = new vml_GaussDist(); var distY_A = new vml_GaussDist();
     distX_A.Fit( lFeatureX_A ); distY_A.Fit( lFeatureY_A );
     this.lProbDistA.push( distX_A ); this.lProbDistA.push( distY_A );

     this.lProbDistB = [];
     var distX_B = new vml_GaussDist(); var distY_B = new vml_GaussDist();
     distX_B.Fit( lFeatureX_B ); distY_B.Fit( lFeatureY_B );
     this.lProbDistB.push( distX_B ); this.lProbDistB.push( distY_B );

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
  * Predict the class of a given sample.
  * @method Predict
  * @param {Vector} vecPoint Point to be classified.
  * @return Score/Probability for each class label (a list with two values).
  */
  this.Predict = function( vecPoint ) {
     var fA = this.fProbA;
     var fB = this.fProbB;

     for( var i=0; i != this.lProbDistA.length; i++ ) {
        fA *= this.lProbDistA[i].Prob( vecPoint[i] );
        fB *= this.lProbDistB[i].Prob( vecPoint[i] );
     }

     var fScoreA = fA / (fA + fB);
     var fScoreB = fB / (fA + fB);

     return [fScoreA, fScoreB];
  };
};
