// knn.js
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
* @classdesc Implementation of the k-nearest-neighbor algorithm.
* @class vml_knn
* @constructor 
* @requires mathjs
*/
function vml_knn() {
  // Vars
  this.iK = 1;
  this.lData = [];
  this.lLabel = [];
  this.Predict = undefined;
  this.bReady = false;

  /**
  * Init the model.
  * @memberof vml_knn
  * @instance
  * @method Init
  * @param {Matrix} lData - Data (List of vectors).
  * @param {Vector} lLabel - Labels of each data point (assume binary label: -1 or 1).
  * @param {Integer} iK - Size of neighborhood used for predictions.
  */
  this.Init = function( lData, lLabel, iK ) {
     if( lLabel instanceof Array == false ) {
       throw "lLabel has to be a vector (Array)"
     }
     if( typeof( iK ) != "number" ) {
       throw "iK has to be a number"
     }

     this.iK = iK;
     this.lData = lData;
     this.lLabel = lLabel;
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

  this.myDistance = function( a, b ) {
    if( a.length == 1 ) {  // Note: mathjs can not compute distance of 1d points!
      return math.abs( a[0] - b[0] )
    }
    else {
       return math.distance( a, b );
    }
  };

  /**
  * Find the k nearest neighbors (including their labels) of a given point.
  * @memberof vml_knn
  * @instance
  * @method FindKnn
  * @param {Vector} vecPoint - Point used to compute neighborhood.
  * @returns {Object} List of knn (each entry is an object like {x: vecPoint, t: label, d: distance} where vecPoint,label and distance are replaced by values)
  */
  this.FindKnn = function( vecPoint ) {
     var lKnn = [];

     for( var i=0; i != this.lData.length; i++ ) {
        this.insert( lKnn, this.lData[ i ], this.lLabel[ i ], this.myDistance( vecPoint, this.lData[ i ] ) );
     }

     return lKnn;
  };

  this.insert = function( lKnn, x1, t1, fDist ) {
    for( var i=0; i != lKnn.length; i++ ) {
       if( lKnn[ i ].d >= fDist ) {
         lKnn.splice( i, 0, {x: x1, t: t1, d: fDist} );
         if( lKnn.length > this.iK ) {
           lKnn.pop();
         }         

         return;
       }
    }

    if( lKnn.length < this.iK ) {
      lKnn.push( {x: x1, t: t1, d: fDist} );
    }
  }

  /**
  * Predict the value (regression) of a given point.
  * @memberof vml_knn
  * @instance
  * @method PredictRegression
  * @param {Vector} vecPoint - Input of model.
  * @returns {Double} Predicted value.
  */
  this.PredictRegression = function( vecPoint ) {
     if( vecPoint instanceof Array == false ) {
       throw "vecPoint has to be a vector (Array)"
     }

    this.Predict = this.PredictRegression;

    // Find k nearest neighbors
    lKnn = this.FindKnn( vecPoint );

    // Compute predicted value as mean over knn.
    var dPred = 0.0;
    for( var i=0; i != lKnn.length; i++ ) {
      dPred += lKnn[ i ].t;
    }
    dPred /= this.iK;

    return dPred;
  };

  /**
  * Predict the label/class of a given point.
  * @memberof vml_knn
  * @instance
  * @method PredictClassification
  * @param {Vector} - vecPoint Point to label (input of model).
  * @returns {Array} Predicted class labels (probabilities) for each class.
  */
  this.PredictClassification = function( vecPoint ) {
     if( vecPoint instanceof Array == false ) {
       throw "vecPoint has to be a vector (Array)"
     }

    this.Predict = this.PredictClassification;

    // Find k nearest neighbors
    lKnn = this.FindKnn( vecPoint );

    // Compute predicited class label based on knn (assume -1 and 1 as labels)
    var pred = 0;
    for( var i=0; i != lKnn.length; i++ ) {
      pred += lKnn[ i ].t;
    }
    if( pred < 0 ) {
      pred = [ 1, 0 ];
    }
    else if( pred == 0 ) {
      pred = [ 0.5, 0.5 ];
    }
    else {
      pred = [ 0, 1 ];
    }

    return pred;
  };
}
