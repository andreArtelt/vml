// kmeans.js
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
* Implementation of the k-means clustering algorithm.
* @class vml_kmeans
* @constructor 
*/
function vml_KMeans() {
  // Vars
  this.iNumCenter = 1;
  this.lCenters = [];
  this.lData = [];
  this.lLabels = [];
  this.lTempMean = [];
  this.lTempLabelCount = [];
  this.bReady = false;

  /**
  * Initialization.
  * @method Init
  * @param {Matrix} lData List/Set of two dimensional data points.
  * @param {Integer} iNumCluster Number of clusters the algorithm should compute.
  */
  this.Init = function( lData, iNumCluster ) {
     this.lCenters = [];
     this.iNumCenter = iNumCluster;
     this.lData = lData;
     this.iDim = 2;

     for( var i=0; i != this.iNumCenter; i++ ) {
        this.lTempMean.push( vml_utils.FillList( this.iDim, 0.0 ) );
        this.lTempLabelCount.push( 0 );

        this.lCenters.push( math.random( [ this.iDim ], -5, 5 ) );
     }

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
  * Perform one step of fitting/training.
  * @method FitStep
  */
  this.FitStep = function() {
     // Expectation step
     for( var i=0; i != this.lData.length; i++ ) {
         this.lLabels[i] = this.Predict( this.lData[i] );
         
         this.lTempMean[ this.lLabels[i] ] = math.add( this.lTempMean[ this.lLabels[i] ], this.lData[i] );
         this.lTempLabelCount[ this.lLabels[i] ] += 1;
     }

     // Maximization step
     for( var i=0; i != this.iNumCenter; i++ ) {
        this.lCenters[i] = vml_math.MultiplyScalar( this.lTempMean[i], ( 1.0 / this.lTempLabelCount[i] ) );
        
        this.lTempMean[i] = vml_utils.FillList( this.iDim, 0.0 );
        this.lTempLabelCount[i] = 0;
     }
  };

  /**
  * Predict the cluster of a given point.
  * @method Predict
  * @param {Vector} vecPoint Point to be assigned to a cluster.
  */
  this.Predict = function( vecPoint ) {
      var iCurBest = 0;
      var fCurDist = -1;

      for( var i=0; i != this.iNumCenter; i++ ) {
          fDist = math.distance( this.lCenters[i], vecPoint );
          if( fDist < fCurDist || fCurDist == -1 ) {
             iCurBest = i;
             fCurDist = fDist;
          }
      }

      return iCurBest;
  };
}
