// utils.js
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
* @classdesc Implementation of various utils (general usefull functions which does not fit into any other class).
* @class vml_utils
* @static
* @constructor
*/
function vml_utils() {
}

/**
* Scale a given 2d dataset to a given range.
* @method ScaleData
* @memberof vml_utils
* @param {Double} minX - Min. x value of given data.
* @param {Double} maxX - Max. x value of given data.
* @param {Double} minY - Min. y value of given data.
* @param {Double} maxY - Max. y value of given data.
* @param {Array} data - Array/List of 2d data points.
* @param {Array} xRange - Range (first entry: minimum, second entry: maximum) of x axis.
* @param {Array} yRange - Range (first entry: minimum, second entry: maximum) of y axis.
* @return {Array} Scaled data.
*/
vml_utils.ScaleData = function( minX, maxX, minY, maxY, data, xRange, yRange ) {
  xRange = xRange == undefined ? [ -5, 5 ] : xRange;
  yRange = yRange == undefined ? [ -5, 5 ] : yRange;

  var scaleX = d3.scale.linear( )
     .domain( [ minVal, maxVal ] )
     .rangeRound( [ -5, 5 ] );
  var scaleY = d3.scale.linear( )
     .domain( [ minY, maxY ] )
     .rangeRound( [ -5, 5 ] );

  return data.map( function( item ) { return [ scaleX( item[0] ), scaleY( item[1] ) ]; } );
}

/**
* Implementation of gradient clipping/scaling.
* @method GradientClipping
* @memberof vml_utils
* @param {Matrix} grad - Gradient.
* @param {Float} fThreshold - Threshold of gradient norm/size.
* @return {Matrix} (Clipped/Scaled) gradient
*/
vml_utils.GradientClipping = function( grad, fThreshold ) {
  var fNorm = math.norm( grad, 2 );

  if( fNorm > fThreshold ) {
    return vml_math.MultiplyScalar( grad, fThreshold / fNorm );
  }

  return grad;
}

/**
* Transform a given dataset using a polynomial.
* @method
* @memberof vml_utils
* @param {Matrix} lData - 
* @param {Integer} iDim Dimension of a data point.
* @param {Integer} iDegree Degree of polynomial.
* @return {Matrix} Transformed data.
*/
vml_utils.PolynomFeatureTransform = function(lData, iDim, iDegree) {
  var matBigPhi = [];

  // Create list of vectors of shape (phi(x))  phi(x)=(1, x, x^2, x^3, ...)(1 is the "hidden" bias)
  for(var i=0; i != lData.length; i++) {
    var point = lData[i];
    var phi = [];

    for(var j=0; j != iDim; j++) {
      phi = phi.concat( vml_utils.ComputePolynomPhi( point[j], iDegree ) );
    }

    matBigPhi.push( phi );
  }

  return matBigPhi;
};

/*
* Transform a given value using a polynomial. phi(x)=(1, x, x^2, x^3, ...)(1 is the "hidden" bias)
* @method ComputePolynomPhi
* @memberof vml_utils
* @param {Double} x - Value to be transformed. 
* @param {Integer} - Degree of polynomial.
* @return {Vector} Transformed value.
*/
vml_utils.ComputePolynomPhi = function( x, iDegree ) {
   var phi = [];

   for( var j=0; j != iDegree + 1; j++ ) {
      phi.push( Math.pow( x, j ) );
   }

   return phi;
};

/**
* Create a matrix (with given dimension) and fill it with random values.
* @method CreateRandMatrix
* @memberof vml_utils
* @param {Array} lDim - Array of dimensions (integer) of the matrix.
* @return {Matrix} Matrix with random values.
*/
vml_utils.CreateRandMatrix = function( lDim ) {
  return math.random( lDim );
};

/**
* Build 2d grid/mesh (includes a 'hidden' bias for each point).
* @method BuildGrid
* @memberof vml_utils
* @param {Double} x1 - X coordinate of upper left corner.
* @param {Double} x2 - X coordinate of lower right corner.
* @param {Double} y1 - Y coordinate of upper left corner.
* @param {Double} y2 - Y coordinate of lower right corner.
* @param {Double} stepsize - "Size" of a cell (if not specified 0.02 units).
* @return {Array} Grid as one 'big' list (of vectors).
*/
vml_utils.BuildGrid = function( x1, x2, y1, y2, stepsize ) {
      // Create grid/mesh for drawing/evaluating the decision boundary
      var steps = stepsize !== undefined ? stepsize : 0.02;
      var lX = math.range( x1, x2, steps );
      var lY = math.range( y1, y2, steps );
      var lResult = []

      lX.forEach(function( x_value, x_index, x_m ) {
	 lY.forEach(function( y_value, y_index, y_m ) {
	   lResult.push( [ x_value, y_value, 1 ] ); }.bind( this ) );
      }.bind( this ) );

      return lResult;
};

/**
* Build 2d grid/mesh (without a 'hidden' bias).
* @method BuildGridWithoutBias
* @memberof vml_utils
* @param {Double} x1 - X coordinate of upper left corner.
* @param {Double} x2 - X coordinate of lower right corner.
* @param {Double} y1 - Y coordinate of upper left corner.
* @param {Double} y2 - Y coordinate of lower right corner.
* @param {Double} stepsize - "Size" of a cell (if not specified 0.02 units).
* @return {Array} Grid as one big list (of vectors).
*/
vml_utils.BuildGridWithoutBias = function( x1, x2, y1, y2, stepsize ) {
      // Create grid/mesh for drawing/evaluating the decision boundary
      var steps = stepsize !== undefined ? stepsize : 0.02;
      var lX = math.range( x1, x2, steps );
      var lY = math.range( y1, y2, steps );
      var lResult = []

      lX.forEach( function ( x_value, x_index, x_m ) {
	 lY.forEach( function( y_value, y_index, y_m ) {
	   lResult.push( [ x_value, y_value ] ); }.bind( this ) );
      }.bind( this ) );

      return lResult;
};

/**
* Build 1d grid/mesh (without a 'hidden' bias).
* @method BuildGrid1d
* @memberof vml_utils
* @param {Double} x1 - Left corner.
* @param {Double} x2 - Right corner
* @param {Double} stepsize - "Size" of a cell (if not specified 0.02 units).
* @return {Array} Grid as one big list (of vectors).
*/
vml_utils.BuildGrid1d = function( x1, x2, stepsize ) {
      // Create grid/mesh for drawing/evaluating the decision boundary
      var steps = stepsize !== undefined ? stepsize : 0.02;
      var lX = math.range( x1, x2, steps );
      var lResult = []

      lX.forEach(function ( x_value, x_index, x_m ) {
	   lResult.push( x_value );
      }.bind( this ) );

      return lResult;
};

/**
* Find the index at which the largest number of a given array occurs.
* @method ArgMax
* @memberof vml_utils
* @param {Array} lData - List of numbers.
* @return {Integer} Index of largest number.
*/
vml_utils.ArgMax = function( lData ) {
  if( lData.length == 0 ) {
    throw "Empty list";
  }

  var iResult = 0;
  var oItem = lData[ 0 ];

  for( var i=1; i < lData.length; i++ ) {
    if( oItem < lData[ i ] ) {
      iResult = i;
      oItem = lData[ i ];
    }
  }

  return iResult;
};

/**
* Choose a random item from a given array.
* @method PickRandom
* @memberof vml_utils
* @param {Array} lData - Array/List of objects.
* @return {Object} Randomly choosen item.
*/
vml_utils.PickRandom = function( lData ) {
  var iIndex = Math.floor( Math.random() * lData.length );

  return lData[ iIndex ];
};

/**
* Fill list/array with a given default value.
* @method FillList
* @memberof vml_utils
* @param {Int} iLen - Length of list/array.
* @param _Value - Default value (can be of any type).
* @return {Array} Filled list (with given length and default value).
*/
vml_utils.FillList = function( iLen, _Value ) {
   lResult = [];

   for( var i=0; i != iLen; i++ ) {
      lResult.push( _Value );
   }

   return lResult;
}
