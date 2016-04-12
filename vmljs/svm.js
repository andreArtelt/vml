// svm.js
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
* Implementation if SVM (Support Vector Machine)
*/
function vml_SVM() {
  this.kernel = undefined;
  this.lAlphas = [];
  this.iC = undefined;
  this.lSuppVecs = [];
  this.lSuppVecsLabels = [];
  this.lSuppVecsAlphas = [];

  this.lData = [];
  this.lLabels = [];

  // Init
  this.Init = function( lData, lLabels, iC ) {
     this.lData = lData;
     this.lLabels = lLabels;
     this.iC = iC;

     this.InitAlphas();
  };

  this.InitAlphas = function() {
     this.lAlphas = vml_utils.FillList( this.lData.length, 0 );
  };

  this.GetSupportVectors = function() {
     this.lSuppVecs = [];
     this.lSuppVecsLabels = [];
     this.lSuppVecsAlphas = [];

     // Find all points with alpha=0 (these points are the so called "support vectors")
     for(var i=0; i != this.lAlphas.length; i++) {
        if( this.lAlphas[i] != 0 ) {
           this.lSuppVecs.push( this.lData[ i ] );
           this.lSuppVecsLabels.push( this.lLabels[ i ] );
           this.lSuppVecsAlphas.push( this.lAlphas[ i ] );
        }
     }
  };

  /**
  *
  */
  this.Predict = function(a_point) {
     // Make sure support vectors are available
     this.GetSupportVectors();

     var fSum = 0.0;

     // Only the "support vectors" are needed (because the alphas of all other points are zero)
     for( var i=0; i != this.lSuppVecs.length; i++ ) {
        fSum += this.lSuppVecsLabels[ i ] * this.lSuppVecsAlphas[ i ] * this.kernel(this.lSuppVecs[ i ], a_point );
     }

     return [math.sign(fSum), fSum];
  };

  /**
  *
  */
  this.FitStep = function( fLambda ) {
     // Select random sample
     var iIndex = Math.floor( Math.random() * this.lData.length );
     var input = this.lData[ iIndex ];
     var label = this.lLabels[ iIndex ];
     var alpha = this.lAlphas[ iIndex ];

     // Apply SVM learning rule
     var fSum = 0.0;
     for( var i=0; i != this.lData.length; i++ ) {
        fSum += this.lAlphas[ i ] * this.lLabels[ i ] * this.kernel( input, this.lData[ i ] );
     }

     this.lAlphas[iIndex] = alpha + fLambda * (1 - label * fSum);
     this.lAlphas[iIndex] = math.max( 0, this.lAlphas[ iIndex ] );
     this.lAlphas[iIndex] = math.min( this.iC, this.lAlphas[ iIndex ] );
  };
}
