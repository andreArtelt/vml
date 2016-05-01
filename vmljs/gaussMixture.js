// gaussmixture.js
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
* @classdesc Implementation of the gaussian mixture model.
* @class vml_GaussMixture
* @constructor
*/
function vml_GaussMixture() {
  // Vars
  this.lDistParams = [];
  this.lData = [];  
  this.iDim = 1;
  this.lDim = [];
  this.bReady = false;

  /**
  * Initialization.
  * @method Init
  * @memberof vml_GaussMixture
  * @instance
  * @param {Matrix} lData - Set of all data points used for fitting (List of vectors).
  * @param {Integer} iNumDist - Number of gaussian distributions used in mixture.
  */
  this.Init = function( lData, iNumDist ) {
     if( typeof( iNumDist ) != "number" ) {
       throw "iNumDist has to be a number"
     }

     this.lData = lData;
     this.iDim = this.lData[0].length;
     this.lDim = vml_utils.FillList( this.iDim, this.iDim );

     var bInit = false;
     while( bInit == false ) {
       bInit = true;

       this.lDistParams = [];
       for( var i=0; i != iNumDist; i++ ) {
         this.lDistParams.push( { alpha: 1.0 / iNumDist, mean: vml_utils.PickRandom( this.lData ), cov: math.zeros( this.iDim, this.iDim ) } );
       }

       // Iterate over all data points and estimate the convariance matrix of each distribution (assuming "nearest center gaussian distribution")
       var lNumData = vml_utils.FillList( iNumDist, 0 );
       for( var i=0; i != this.lData.length; i++ ) {
         // Find nearest center
         var j=0;
         var fBestDist = math.distance( this.lData[ i ], this.lDistParams[ j ].mean );
         for( var k=1; k != iNumDist; k++ ) {
           var fDist = math.distance( this.lData[ i ], this.lDistParams[ k ].mean );

           if( fBestDist > fDist ) {
             j = k;
             fBestDist = fDist;
           }
         }

         // Upate estimation of covariance matrix
         var vecX = math.matrix( math.subtract( math.matrix( [ this.lData[ i ] ] ), math.matrix( [ this.lDistParams[ j ].mean ] ) ) );
         var matCov = vml_math.OuterEx( vecX, vecX, this.iDim, this.iDim );
         this.lDistParams[ j ].cov = math.add( this.lDistParams[ j ].cov, matCov );
         lNumData[ j ]++;
       }
       for( var i=0; i != iNumDist; i++ ) {
          this.lDistParams[ i ].mean = vml_math.MultiplyScalar( this.lDistParams[ i ].mean, 1.0 / lNumData[ i ] );
          this.lDistParams[ i ].cov = vml_math.MultiplyScalar( this.lDistParams[ i ].cov, 1.0 / lNumData[ i ] );

          if( math.det( this.lDistParams[ i ].cov ) == 0 ) {
            bInit = false;
          }
       }
     }

     this.bReady = true;
  };

  /**
  * Checks if the model has been initialized or not.
  * @method IsReady
  * @memberof vml_GaussMixture
  * @instance
  * @return {Boolean} true if it has been initialized, false otherwise.
  */
  this.IsReady = function() {
    return this.bReady;
  };

  /**
  * Perform one step of fitting using the EM algorithm (expectation-maximization algorithm).
  * @method FitStep
  * @memberof vml_GaussMixture
  * @instance
  */
  this.FitStep = function() {
    // Expectation
    var lAlphaRes = [];
    for( var i = 0; i != this.lDistParams.length; i++ ) {
      lAlphaRes.push( this.ComputeAlphaRes( i ) );
    }

    // Maximization
    for( var i=0; i != this.lDistParams.length; i++ ) {
      var fN = 0.0;
      var vecMean = math.matrix( vml_utils.FillList( this.iDim, 0 ) );
      var matCov = math.zeros( this.lDim );

      for( var j=0; j != this.lData.length; j++ ) {
        fN += lAlphaRes[ i ][ j ];

        // New mean
        vecMean = math.add( vecMean, vml_math.MultiplyScalar( math.matrix( this.lData[ j ] ), lAlphaRes[ i ][ j ] ) );
      }
      this.lDistParams[ i ].mean = vml_math.MultiplyScalar( vecMean, 1.0 / fN );

      for( var j=0; j != this.lData.length; j++ ) {
        // New covariance
        var vecDiff = math.matrix( [ math.subtract( this.lData[ j ], this.lDistParams[ i ].mean ) ] );
        var matTemp = vml_math.Outer( vecDiff, vecDiff, 2 );
        matCov = math.add( matCov, vml_math.MultiplyScalar( matTemp, lAlphaRes[ i ][ j ] ) );
      }      
      this.lDistParams[ i ].cov = vml_math.MultiplyScalar( matCov, 1.0 / fN );

      // New alpha
      this.lDistParams[ i ].alpha =  fN / this.lData.length;
    }
  };

  /**
  * Compute the pobability of observing a given point.
  * @method Predict
  * @memberof vml_GaussMixture
  * @instance
  * @param {Vector} vecPoint - Point to be observed.
  * @return {Double} Probability of the given point under the gaussian mixture distribution.
  */
  this.Predict = function( vecPoint ) {
     if( vecPoint instanceof Array == false ) {
       throw "vecPoint has to be a vector (Array)"
     }

     var fResult = 0.0;
     for( var i = 0; i != this.lDistParams.length; i++ ) {
       var oDistParams = this.lDistParams[ i ];
       fResult += oDistParams.alpha * this.GaussDistMultiDim( vecPoint, oDistParams.mean, oDistParams.cov );
     }

     return Math.min(fResult * 10, 1);  // Scale things a little bit
  };

  /**
  * Compute the loglikelihood of data set.
  * @method LogLikelihood
  * @memberof vml_GaussMixture
  * @instance
  * @return {Double} Loglikelihood.
  */
  this.LogLikelihood = function() {
     var fResult = 0.0;

     for( var i=0; i != this.lData.length; i++ ) {
       fResult += math.log( this.Predict( this.lData[ i ] ) );
     }

     return fResult;
  };

  this.ComputeAlphaRes = function( iIndex ) {
     var lResult = [];

     var oDistParams = this.lDistParams[ iIndex ];

     for( var i = 0; i != this.lData.length; i++ ) {
        var fVal = oDistParams.alpha * this.GaussDistMultiDim( this.lData[ i ], oDistParams.mean, oDistParams.cov );

        var fNorm = fVal;
        for( var j = 0; j != this.lDistParams.length; j++ ) {
          if( j == iIndex ) {
            continue;
          }

          var oDistParams2 = this.lDistParams[ j ];
          fNorm += oDistParams2.alpha * this.GaussDistMultiDim( this.lData[ i ], oDistParams2.mean, oDistParams2.cov );
        }

        lResult.push( fVal / fNorm );
     }

     return lResult;
  };

  /**
  * Compute the multivariate gaussian distribution over a given point and parameters.
  * @method GaussDistMultiDim
  * @memberof vml_GaussMixture
  * @instance
  * @param {Vector} vecX - Point used as input of gaussian distribution.
  * @param {Vector} vecMean - Mean of gaussian distribution.
  * @param {Matrix} matCov - Covariance matrix of gaussian distribution.
  * @return {Double} Probability of the given point.
  */
  this.GaussDistMultiDim = function( vecX, vecMean, matCov ) {
     var vecDiff = math.subtract( vecX, vecMean );
     var matCovInv = math.inv( matCov );
     var matCovDet = math.det( matCov );
     var vecDiffT = math.transpose( vecDiff );

     return Math.pow( 2*math.pi, -0.5 * vecX.length ) * Math.pow( matCovDet, -0.5 ) * math.exp( -0.5 * math.multiply( vecDiffT, math.multiply( matCovInv, vecDiff ) ) ); 
  };
}
