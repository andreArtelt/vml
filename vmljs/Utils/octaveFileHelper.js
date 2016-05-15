// octaveFileHelper.js
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
*
*
*/
function vml_OctaveFileHelper() {
    /**
     *
     * @method Export
     * @memberof vml_OctaveFileHelper
     * @instance
     * @param lData
     * @param lLabels
     * @returns {String}
     */
    this.Export = function( lData, lLabels ) {
        var strResult = "";

	    // Write global header
	    strResult += "# Created by VML (https://github.com/andreArtelt/vml)\n";

	    // Export data
	    var iColumns = lData[ 0 ].length;
	    strResult += "# name: X\n";
	    strResult += "# type: matrix\n";
	    strResult += "# rows: " + lData.length + "\n";
	    strResult += "# columns: " + iColumns + "\n";

	    for( var i=0; i != lData.length; i++ ) {
	        strResult += " " + lData[ i ][ 0 ];
	        for( var j=1; j < iColumns; j++ ) {
	            strResult += " " + lData[ i ][ j ];
            }
	        strResult += "\n";
	    }

	    strResult += "\n\n";

	    // Export labels
	    strResult += "# name: Y\n";
	    strResult += "# type: matrix\n";
	    strResult += "# rows: " + lLabels.length + "\n";
	    strResult += "# columns: 1\n";

	    for( var i=0; i != lLabels.length; i++ ) {
	        strResult += " " + lLabels[ i ] + "\n";
	    }

	    strResult += "\n\n";

	    // Finished
	    return strResult;
    };

    /**
     * 
     * @method Import
     * @memberof vml_OctaveFileHelper
     * @instance
     * @param {String} strData
     * @returns {{Data: *, Labels: *}}
     */
    this.Import = function( strData ) {
        // Tokenize data string
        var lTokens = strData.split( "\n" );

        // Parsing
        var iIndex = -1;
        var lResult = [ [], [] ];
        for( var i=0; i != lTokens.length; i++ ) {
            if( lTokens[ i ] == "" ) {
                continue;
            }

            if( lTokens[ i ].startsWith( "# " ) ) {	// Header
                var strHdr = lTokens[ i ].substr( 2 );
                var oKeyValuePair = strHdr.split( ": " );
                if( oKeyValuePair.length != 2 ) {
                    continue;
                }
                if( oKeyValuePair[ 0 ] == "name" ) {
                }
                else if( oKeyValuePair[ 0 ] == "type" ) {
                    if( oKeyValuePair[ 1 ] != "matrix" ) {
                        throw "Invalid value of type";
                    }
                }
                else if( oKeyValuePair[ 0 ] == "rows" ) {
                }
                else if( oKeyValuePair[ 0 ] == "columns" ) {
                    var iValue = parseInt( oKeyValuePair[ 1 ] );

                    if( iValue == 1 ) {
                        iIndex = 1;
                    }
                    else {
                        iIndex = 0;
                    }
                }
            }
            else {	// Data
                var lData = lTokens[ i ].split( " " );
                var lPoint = [];

                for( var j=0; j != lData.length; j++ ) {
                    if( lData[ j ] == "" ) {
                        continue;
                    }

                    lPoint.push( parseFloat( lData[ j ] ) );
                }

                lResult[ iIndex ].push( lPoint );
            }
        }

        return { Data: lResult[ 0 ], Labels: lResult[ 1 ] };
    };
}
