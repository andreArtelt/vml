// jsonHelper.js
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
* @classdesc Implementation of json import/export of labled data sets.
* @class vml_JsonHelper
* @constructor
* @static
*/
function vml_JsonHelper() {
}

/**
* Import data points + labels from a given json string.
* @method Import
* @memberof vml_JsonHelper
* @param {String} strData - Json data.
* @return {Array} Array (first entry: Data matrix, second entry: Labels vector).
*/
vml_JsonHelper.Import = function( strData ) {
  var oData = JSON.parse( strData );
  if( oData.Data == undefined || oData.Labels == undefined ) {
    throw "Invalid format";
  }

  return [ oData.Data, oData.Labels ];
}

/**
* Export a given set of data points + labels to a json string.
* @method
* @param {Matrix} lData - Data (List of vectors).
* @param {Vector} lLabel - Labels of each data point.
* @return {String} Json data.
*/
vml_JsonHelper.Export = function( lData, lLabels ) {
  return JSON.stringify( { Data: lData, Labels: lLabels } );
}
