// datagen.js
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

// Will be filled by base64-arraybuffer.js
var exports = {};

/**
* Implementation of simple data generation/administration model.
* @class vml_DataGen
* @constructor
*/
function vml_DataGen() {
  this.oClassA = {Data: [], Symbol: "circle", Label: "Class A", Color: "#FF0000"};
  this.oClassB = {Data: [], Symbol: "circle", Label: "Class B", Color: "#000000"};
  this.bSingleDataType = false;

  this.Base64ArrayBuffer = undefined;

  this.rangeX = {min: -5, max: 5};  // Settings for grid/axis
  this.rangeY = {min: -5, max: 5};
  this.bShowAxis = false;

  this.strPlotDiv = "plotArea";   // Container for plot

  // Plot settings
  this.lData = [{label: this.oClassA.Label, color: this.oClassA.Color, data: this.oClassA.Data, points: {show: true, symbol: this.oClassA.Symbol}},
                {label: this.oClassB.Label, color: this.oClassB.Color, data: this.oClassB.Data, points: {show: true, symbol: this.oClassB.Symbol}}];
  this.oPlotSettings = {xaxis: this.rangeX, yaxis: this.rangeY, grid: {show: false, clickable: true}};

  /**
  * Initialization.
  * @method Init
  * @param {String} a_strPlotDiv Id of placeholder (div) for plot.
  * @param {Boolean} a_bSingleDataType Specify whether to use two or one different classes of data points.
  */
  this.Init = function( strPlotDiv, bSingleDataType ) {
     // Register dialog stuff
     dialogPolyfill.registerDialog( document.getElementById( 'exportDlg' ) );
     dialogPolyfill.registerDialog( document.getElementById( 'importDlg' ) );

     // Register eventhandler
     document.getElementById( "resetBtn").addEventListener( "click", this.Reset.bind( this ), false );
     document.getElementById( "btnExportToJSON" ).addEventListener( "click", this.ExportJSON.bind( this ), false );
     document.getElementById( "btnExportToCSV" ).addEventListener( "click", this.ExportCSV.bind( this ), false );
     document.getElementById( "btnExportToMAT" ).addEventListener( "click", this.ExportMAT.bind( this ), false );
     document.getElementById( "btnImportFromJSON" ).addEventListener( "click", this.ImportJSON.bind( this ), false );
     document.getElementById( "btnImportFromCSV" ).addEventListener( "click", this.ImportCSV.bind( this ), false );
     document.getElementById( "btnImportFromMAT" ).addEventListener( "change", this.ImportMAT.bind( this ), false );
     document.getElementById( "importCloseBtn" ).addEventListener( "click", this.ImportClose.bind( this ), false );
     document.getElementById( "importUpload" ).addEventListener( "change", this.ImportUpload.bind( this ), false );

     // Single datapoint type or multiple?
     if( bSingleDataType == true ) {
        this.bSingleDataType = true;
     }
     else {
        this.bSingleDataType = false;
     }

     // Container for plot specified?
     if( strPlotDiv != undefined ) {
        this.strPlotDiv = strPlotDiv;
     }

     // Init plot (register plot specific eventhandler)
     this.Plot();
     $( "#"+this.strPlotDiv).bind( "plotclick", this.PlotClickEvent.bind( this ) );

     // Import exports from base64-arraybuffer.js
     this.Base64ArrayBuffer = exports;
  };

  /**
  * Plot current set of samples.
  * @method Plot
  */
  this.Plot = function() {
     this.lData = [{label: this.oClassA.Label, color: this.oClassA.Color, data: this.oClassA.Data, points: {show: true, symbol: this.oClassA.Symbol}}];
     if(this.bSingleDataType == false) {
       this.lData.push( {label: this.oClassB.Label, color: this.oClassB.Color, data: this.oClassB.Data, points: {show: true, symbol: this.oClassB.Symbol}} );
     }

     $.plot( "#"+this.strPlotDiv, this.lData, this.oPlotSettings);
  };

  this.PlotClickEvent = function( oEvent, vecPos, oItem ) {
     // Insert/Create new data point
     this.InsertNewDataPoint( [ vecPos.x, vecPos.y ], document.getElementById( "genClassA" ).checked );

     // Refresh plot
     this.Plot();
  };

  /**
  * Insert/Add a new sample.
  * @method InsertNewDataPoint
  * @param {Vector} vecPoint New sample/point.
  * @param {Boolean} bClassA Label (true or false) of new sample.
  */
  this.InsertNewDataPoint = function( vecPoint, bClassA ) {
    // Store new point
    if( bClassA == true ) {  // Class A
       this.oClassA.Data.push( vecPoint );
    }
    else {  // Class B
       this.oClassB.Data.push( vecPoint );
    }
  };

  /**
  * Export data to a json string.
  * @method ExportDataToJSON
  * @return {String} Exported data in json format.
  */
  this.ExportDataToJSON = function() {
    var lData = this.oClassA.Data.concat( this.oClassB.Data );
    var lLabels = vml_utils.FillList( this.oClassA.Data.length, 0 ).concat( vml_utils.FillList( this.oClassB.Data.length, 1 ) );

    return vml_JsonHelper.Export( lData, lLabels );
  };

  /**
  * Import data from a given json string.
  * @method ImportDataFromJSON
  * @param {String} strImport Json data to be imported.
  */
  this.ImportDataFromJSON = function( strImport ) {
     // Clean
     this.oClassA.Data = [];
     this.oClassB.Data = [];

     // Import
     var [ lData, lLabels ] = vml_JsonHelper.Import( strImport );
     for( var i=0; i != lData.length; i++ ) {
       if( lLabels[ i ] == 0 ) {
         this.oClassA.Data.push( lData[ i ] );
       }
       else {
         this.oClassB.Data.push( lData[ i ] );
       }
     }  
  };

  /**
  * Export data to a csv string.
  * @method ExportDataToCSV
  * @return {String} Exported data in csv format.
  */
  this.ExportDataToCSV = function() {
     var lData = this.oClassA.Data.concat( this.oClassB.Data );
     var lLabels = vml_utils.FillList( this.oClassA.Data.length, 0 ).concat( vml_utils.FillList( this.oClassB.Data.length, 1 ) );

     return vml_CsvHelper.Export( lData, lLabels );
  };

  /**
  * Import data from a given csv string.
  * @method ImportDataFromCSV
  * @param {String} strImport CSV data to be imported.
  */
  this.ImportDataFromCSV = function( strImport ) {
     // Clean
     this.oClassA.Data = [];
     this.oClassB.Data = [];

     // Import
     var [ lData, lLabels ] = vml_CsvHelper.Import( strImport );
     for( var i=0; i != lData.length; i++ ) {
       if( lLabels[ i ] == 0 ) {
         this.oClassA.Data.push( lData[ i ] );
       }
       else {
         this.oClassB.Data.push( lData[ i ] );
       }
     }
  };

  this.ExportMAT = function() {
     // Collect data
     var lLabels = vml_utils.FillList( this.oClassA.Data.length, 0 );
     lLabels = lLabels.concat( vml_utils.FillList( this.oClassB.Data.length, 1 ) );
     var lData = this.oClassA.Data.concat( this.oClassB.Data );

     // Export
     var oMatBuffer = new vml_MatFileHelper().Export( lData, lLabels );
     
     // Write to file
     vml_FileHelper.WriteFile( "data.mat", this.Base64ArrayBuffer.encode( oMatBuffer ) );

     /*var oParsedMatBuffer = new vml_MatFileHelper().Import( oMatBuffer );
     console.log( oParsedMatBuffer );
     console.log( {lData: lData, lLabels: lLabels} );*/
  };

  this.ImportMAT = function( evt ) {
     if( evt.target.files.length != 1 ) {
        return;
     }

    // Read buffer from file
    vml_FileHelper.ReadFileAsArrayBufferAsync( evt.target.files[0], function( oBuffer ) {    
      // Clean
      this.oClassA.Data = [];
      this.oClassB.Data = [];

      // Parse
      var oParsedMatBuffer = new vml_MatFileHelper().Import( oBuffer );

      for( var i=0; i != oParsedMatBuffer.Data.length; i++ ) {
        if( oParsedMatBuffer.Labels[ i ] == 0 ) {
          this.oClassA.Data.push( oParsedMatBuffer.Data[ i ] );
        }
        else {
          this.oClassB.Data.push( oParsedMatBuffer.Data[ i ] );
        }
      }

      // Refresh plot
      this.Plot();
    }.bind( this ) );
  };

  this.ExportJSON = function() {
     // Export data
     var strExportData = this.ExportDataToJSON();
     document.getElementById( "exportData" ).value = strExportData
     document.getElementById( "exportDownloadBtn" ).setAttribute( 'href', 'data:text/plain;charset=utf-8,' + encodeURIComponent( strExportData ) );
     document.getElementById( "exportDownloadBtn" ).setAttribute( 'download', 'data.json' );

     // Open/Show dialog
     document.getElementById( "exportDlg" ).showModal();
  };

  this.ExportCSV = function() {
     // Export data
     var strExportData = this.ExportDataToCSV();
     document.getElementById( "exportData" ).value = strExportData;
     document.getElementById( "exportDownloadBtn" ).setAttribute( 'href', 'data:text/plain;charset=utf-8,' + encodeURIComponent( strExportData ) );
     document.getElementById( "exportDownloadBtn" ).setAttribute( 'download', 'data.csv' );

     // Open/Show dialog
     document.getElementById( "exportDlg" ).showModal();
  };

  this.ImportClose = function() {
     // Remove all event listener
     document.getElementById( "importDataBtn" ).removeEventListener( "click", this.funcImportEvent, false );
  };

  this.ImportJSON = function() {
     // Register eventhandler
     this.funcImportEvent = this.ImportDataJsonBtn.bind( this );
     document.getElementById( "importDataBtn" ).addEventListener( "click", this.funcImportEvent, false );

     // Clean up
     document.getElementById( "importData" ).value = "";

     // Open/Show dialog
     document.getElementById( "importDlg" ).showModal();
  };

  this.ImportCSV = function() {
     // Register eventhandler
     this.funcImportEvent = this.ImportDataCsvBtn.bind( this );
     document.getElementById( "importDataBtn" ).addEventListener( "click", this.funcImportEvent, false );

     // Clean up
     document.getElementById( "importData" ).value = "";

     // Open/Show dialog
     document.getElementById( "importDlg" ).showModal();
  };

  this.ImportUpload = function( evt ) {
     // Read file
     if( evt.target.files.length != 1 ) {
        return;
     }
     vml_FileHelper.ReadFileAsStringAsync( evt.target.files[0], function( strContent ) {
       // Import
       document.getElementById( "importData" ).value = strContent;
       this.funcImportEvent();

       // Close dialog
       document.getElementById( "importDlg" ).close();
     }.bind( this ) );
  };

  this.ImportDataJsonBtn = function() {
     // Get data for import
     var strData = document.getElementById( "importData" ).value;

     // Try to import data
     this.ImportDataFromJSON( strData );

     // Refresh plot
     this.Plot();
     
     // Close
     this.ImportClose();
  };

  this.ImportDataCsvBtn = function() {
     // Get data for import
     var strData = document.getElementById( "importData" ).value;

     // Try to import data
     this.ImportDataFromCSV( strData );

     // Refresh plot
     this.Plot();

     // Close
     this.ImportClose();
  };

  /**
  * Reset (remove all samples).
  * @method Reset
  */
  this.Reset = function() {
    // Remove all points
    this.oClassA.Data = [];
    this.oClassB.Data = [];

    // Refresh plot
    this.Plot();
  };
}
