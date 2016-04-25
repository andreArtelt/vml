// csvHelper.js
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
* Implementation of csv import/export of labled data sets.
* @class vml_CsvHelper
* @constructor
* @static
*/
function vml_CsvHelper() {
}

  /**
  * Import data points and labels from a given csv string.
  * @method Import
  * @param {String} strData
  * @return
  */
  vml_CsvHelper.Import = function( strData ) {
    var lData = [];
    var lLabels = [];

    var lRows = strData.split( "\n" );
    for( var i=1;  i < lRows.length; i++ ) {
      if( lRows[ i ] == "" ) {  // Skip empty rows
        continue;
      }

      var tmp = lRows[ i ].split( "," );

      // Convert to list of float
      var data = tmp[ 0 ].split( " " );
      for( var j=0; j != data.length; j++ ) {
        data[ j ] = parseFloat( data[ j ] );
      }

      lData.push( data );
      lLabels.push( tmp[ 1 ] );
    }

    return [ lData, lLabels ];
  }

  /**
  * Export a given set of data points + labels into a csv string.
  * @method Export
  * @param {} lData
  * @param {} lLabels
  * @return
  */
  vml_CsvHelper.Export = function( lData, lLabels) {
    var strResult = "x,t\r\n";    

    for( var i=0; i != lData.length; i++ ) {
      strResult += lData[ i ].toString().replace( ",", " " ) + "," + lLabels[ i ] + "\r\n";
    }

    return strResult;
  }
