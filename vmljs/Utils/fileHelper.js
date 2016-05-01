// fileHelper.js
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
* @classdesc Implementation of some helper functions concerning file access.
* @class vml_FileHelper
* @static
* @constructor
*/
function vml_FileHelper() {
}

/**
* Write a given string to a specific file (will trigger download dialog).
* @method WriteFile
* @memberof vml_FileHelper
* @param {String} strFilename - Filename.
* @param {String} strData - Base64 encoded file content.
*/
vml_FileHelper.WriteFile = function( strFilename, strData ) {
  // Create invisible link
  var oLink = document.createElement( 'a' );
  oLink.setAttribute( 'href', 'data:application/octet-stream;charset=utf-16le;base64,' + strData );
  oLink.setAttribute( 'download', strFilename );
  oLink.style.display = 'none';

  // Trigger link
  document.body.appendChild( oLink );
  oLink.click();

  // Remove link
  document.body.removeChild( oLink );
}

/**
* Read the content (as a string) of a given file.
* @method ReadFileAsStringAsync
* @memberof vml_FileHelper
* @param {File} oFile - File reference.
* @param {function} funcCallback Callback which is called with the content of the file.
*/
vml_FileHelper.ReadFileAsStringAsync = function( oFile, funcCallback ) {
  var oFileReader = new FileReader();

  oFileReader.onload = function( evt ) { funcCallback( evt.target.result ) };

  oFileReader.readAsText( oFile );
}

/**
* Read the content (as an ArrayBuffer) of a given file.
* @method ReadFileAsArrayBufferAsync
* @memberof vml_FileHelper
* @param {File} oFile - File reference.
* @param {function} funcCallback Callback which is called with the content of the file.
*/
vml_FileHelper.ReadFileAsArrayBufferAsync = function( oFile, funcCallback ) {
  var oFileReader = new FileReader();

  oFileReader.onload = function( evt ) { funcCallback( evt.target.result ) };

  oFileReader.readAsArrayBuffer( oFile );
}
