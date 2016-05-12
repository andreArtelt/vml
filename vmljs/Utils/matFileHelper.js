// MatFileHelper.js
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
* @classdesc Implementation of methods for reading/writing 1.0 MAT-File format (see https://www.mathworks.com/help/pdf_doc/matlab/matfile_format.pdf).
* @class vml_MatFileHelper
* @constructor
*/
function vml_MatFileHelper() {
    /**
    * @classdesc Header of a matrix in .mat file format (v.1.0).
    * @memberof vml_MatFileHelper
    * @class SMatrixHdr
    * @constructor
    */
    function SMatrixHdr() {
        this.iType = 0;
        this.iRows = 0;
        this.iCols = 0;
        this.iImagFlag = 0;
        this.iNameLen = 0;

        /**
        * Read header from a given buffer.
        * @method Read
        * @memberof vml_MatFileHelper.SMatrixHdr
        * @instance
        * @param {DataView} oData - Access to buffer through DataView object.
        * @param {Integer} iStart - Position/Offset in buffer.
        * @return {Integer} Updated position after reading data.
        */
        this.Read = function( oData, iStart ) {
            this.iType = oData.getInt32( iStart );  iStart += 4;
            this.iRows = oData.getInt32( iStart );  iStart += 4;
            this.iCols = oData.getInt32( iStart );  iStart += 4;
            this.iImagFlag = oData.getInt32( iStart );  iStart += 4;
            this.iNameLen = oData.getInt32( iStart );  iStart += 4;

            return iStart;
        };

        /**
        * Write the header into a given buffer.
        * @method Write
        * @memberof vml_MatFileHelper.SMatrixHdr
        * @instance
        * @param {DataView} oData - Access to buffer through DataView object.
        * @param {Integer} iStart - Position/Offset in buffer.
        * @return {Integer} Updated position after writing data.
        */
        this.Write = function( oData, iStart ) {
            oData.setInt32( iStart, this.iType );  iStart += 4;
            oData.setInt32( iStart, this.iRows );  iStart += 4;
            oData.setInt32( iStart, this.iCols );  iStart += 4;
            oData.setInt32( iStart, this.iImagFlag );  iStart += 4;
            oData.setInt32( iStart, this.iNameLen );  iStart += 4;

            return iStart;
        };
    };

    /**
    * Flatten a given matrix into a 1d array.
    * @method flattenMatrix
    * @memberof vml_MatFileHelper
    * @instance
    * @param {Matrix} lData - Matrix to be flattened.
    * @return {Array} Array containing rows +  columns of the matrix.
    */
    this.flattenMatrix = function( lData ) {
        if( lData.length == 0 ) {
            return [];
        }

        var iDim = lData[0].length;
        var lCols = vml_Utils.FillList( iDim, [] );

        for( var i=0; i != lData.length; i++ ) {
            for( var j=0; j != iDim; j++ ) {
                lCols[ j ] = lCols[ j ].concat( lData[ i ][ j ] );
            }
        }

        var lResult = [];
        for( var i=0; i != iDim; i++ ) {
            lResult = lResult.concat( lCols[ i ] );
        }

        return lResult;
    };

    /**
    * Reshape a given array into a matrix.
    * @method reshapeToMatrix
    * @memberof vml_MatFileHelper
    * instance
    * @param {Array} lData - 1d data set.
    * @param {Integer} iRows - Number of rows in result.
    * @param {Integer} iCols - Number of columns in result.
    * @return Reshaped array.
    */
    this.reshapeToMatrix = function( lData, iRows, iCols ) {
         var lResult = [];

        for( var i=0; i != iRows; i++ ) {
            var lVec = [];

            for( var j=0; j != iCols; j++ ) {
                lVec.push( lData[ i + (j * iRows) ] );
            }
    
            lResult.push( lVec );
        }

        return lResult;
    };

    /**
    * Export a given set of data points + labels into .mat file format buffer.
    * @method Export
    * @memberof vml_MatFileHelper
    * @instance
    * @param {Matrix} lData - Set of data points.
    * @param {List} lLabels - Labels of all data points.
    * @return {ArrayBuffer} Buffer of .mat file.
    */
    this.Export = function( lData, lLabels ) {
        if( lData.length == 0 || lLabels.length == 0 ) {
            throw "Empty data";
        }

        // Compute total size of buffer (content of .mat file)
        var iTotalSize = 0;
        iTotalSize += 40;  // 2 * MatHdr
        iTotalSize += 4;   // 2 * "?" names of matricies.
        iTotalSize += 4 * lLabels.length;  // 4 bytes (int32) for each label
        iTotalSize += 8 * lData.length * lData[0].length;    // 8 bytes (float64) for each data point.

        // Alloc memory
        var oBuffer = new ArrayBuffer( iTotalSize );
        var oData = new DataView( oBuffer );
        var iPos = 0;

        // Write data
        // Write matrix header
        var matHdr1 = new SMatrixHdr();
        matHdr1.iType = 1000;
        matHdr1.iRows = lData.length;
        matHdr1.iCols = lData[0].length;
        matHdr1.iImagFlag = 0;
        matHdr1.iNameLen = 2;

        iPos = matHdr1.Write( oData, iPos );

        // Write name of matrix
        oData.setUint8( iPos, 'X'.charCodeAt(0) ); iPos++;
        oData.setUint8( iPos, 0 ); iPos++;

        // Write content of matrix
        var lFlattenData = this.flattenMatrix( lData );
        for( var i=0; i != lFlattenData.length; i++ ) {
            oData.setFloat64( iPos, lFlattenData[i] ); iPos += 8;
        }

        // Write labels
        // Write matrix header
        var matHdr2 = new SMatrixHdr()
        matHdr2.iType = 1020;
        matHdr2.iRows = lLabels.length;
        matHdr2.iCols = 1;
        matHdr2.iImagFlag = 0;
        matHdr2.iNameLen = 2;
     
        iPos = matHdr2.Write( oData, iPos );

        // Write name of matrix
        oData.setUint8( iPos, 'Y'.charCodeAt(0) ); iPos++;
        oData.setUint8( iPos, 0 ); iPos++;

        // Write content of matrix
        for( var i=0; i != lLabels.length; i++ ) {
            oData.setUint32( iPos, lLabels[i] ); iPos += 4;
        }

        return oBuffer;
    };

    /**
    * Import data points + labels from a .mat file format buffer.
    * @method Import
    * @memberof vml_MatFileHelper
    * @instance
    * @param {ArrayBuffer} oBuffer - Binary content of .mat file.
    * @return Object containing data and labels.
    */
    this.Import = function( oBuffer ) {
        var oResult = { Data: [], Labels: [] };
        var iPos = 0;
        var oData = new DataView( oBuffer );

        // Read data matrix X
        var matHdr = new SMatrixHdr();
        iPos = matHdr.Read( oData, iPos );
        if( matHdr.iType != 1000 || matHdr.iImagFlag != 0  ) {  // Check if file is "valid" (supported)
            throw "Invalid format";
        }

        iPos += matHdr.iNameLen;  // Skip name
        var lData = [];
        for( var i=0; i != matHdr.iRows * matHdr.iCols; i++ ) {  // Note: Matrix is stored column wise!
            lData.push( oData.getFloat64( iPos ) ); iPos += 8;
        }
        oResult.Data = this.reshapeToMatrix( lData, matHdr.iRows, matHdr.iCols);

        // Read labels
        var matHdr2 = new SMatrixHdr();
        iPos = matHdr2.Read( oData, iPos );
        if( matHdr2.iType != 1020 || matHdr2.iCols != 1 || matHdr2.iImagFlag != 0  ) {  // Check if file is "valid" (supported)
            throw "Invalid format";
        }

        iPos += matHdr2.iNameLen;  // Skip name
        for( var i=0; i != matHdr2.iRows * matHdr2.iCols; i++ ) {
            oResult.Labels.push( oData.getInt32( iPos ) ); iPos += 4;
        }

        return oResult;
    };
}
