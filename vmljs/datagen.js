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

function vml_DataGen() {
  this.m_lClassA = [];  // List of data points of class A
  this.m_strSymbolA = "circle";
  this.m_strLabelA = "Class A";
  this.m_strColorA = "#FF0000";
  this.m_lClassB = [];  // List of data points of class B
  this.m_strSymbolB = "circle";
  this.m_strLabelB = "Class B";
  this.m_strColorB = "#000000";
  this.m_bSingleDataType = false;

  this.m_rangeX = {min: -5, max: 5};  // Settings for grid/axis
  this.m_rangeY = {min: -5, max: 5};
  this.m_bShowAxis = false;

  this.m_strPlotDiv = "plotArea";   // Container for plot

  // Plot settings
  this.m_lData = [{label: this.m_strLabelA, color: this.m_strColorA, data: this.m_lClassA, points: {show: true, symbol: this.m_strSymbolA}}, {label: this.m_strLabelB, color: this.m_strColorB, data: this.m_lClassB, points: {show: true, symbol: this.m_strSymbolB}}];
  this.m_lPlotSettings = {xaxis: this.m_rangeX, yaxis: this.m_rangeY, grid: {show: false, clickable: true}};

  // Init
  this.Init = function(a_strPlotDiv, a_bSingleDataType) {
     // Register eventhandler
     document.getElementById("resetBtn").addEventListener("click", this.Reset.bind(this), false);
     document.getElementById("btnExportToJSON").addEventListener("click", this.ExportJSON.bind(this), false);
     document.getElementById("btnExportToCSV").addEventListener("click", this.ExportCSV.bind(this), false);
     document.getElementById("btnImportFromJSON").addEventListener("click", this.ImportJSON.bind(this), false);
     document.getElementById("btnImportFromCSV").addEventListener("click", this.ImportCSV.bind(this), false);
     document.getElementById("importCloseBtn").addEventListener("click", this.ImportClose.bind(this), false);;

     // Single datapoint type or multiple?
     if(a_bSingleDataType == true) {
        this.m_bSingleDataType = true;
     }
     else {
        this.m_bSingleDataType = false;
     }

     // Container for plot specified?
     if(a_strPlotDiv != undefined) {
        this.m_strPlotDiv = a_strPlotDiv;
     }

     // Init plot (register plot specific eventhandler)
     this.Plot();
     $("#"+this.m_strPlotDiv).bind("plotclick", this.PlotClickEvent.bind(this));
  };

  // Memberfunctions

  this.Plot = function() {
     this.m_lData = [{label: this.m_strLabelA, color: this.m_strColorA, data: this.m_lClassA, points: {show: true, symbol: this.m_strSymbolA}}];
     if(this.m_bSingleDataType == false) {
       this.m_lData.push({label: this.m_strLabelB, color: this.m_strColorB, data: this.m_lClassB, points: {show: true, symbol: this.m_strSymbolB}});
     }
     $.plot("#"+this.m_strPlotDiv, this.m_lData, this.m_lPlotSettings);
  };

  this.PlotClickEvent = function(a_event, a_pos, a_item) {
     // Insert/Create new data point
     this.InsertNewDataPoint([a_pos.x, a_pos.y]);

     // Refresh plot
     this.Plot();
  };

  this.InsertNewDataPoint = function(a_point) {
    // Get class of new data point
    var bClassA = document.getElementById("genClassA").checked;

    // Store new point
    if(bClassA == true) {  // Class A
       this.m_lClassA.push(a_point);
    }
    else {  // Class B
       this.m_lClassB.push(a_point);
    }
  };

  this.ExportDataToJSON = function() {
    return JSON.stringify([this.m_lClassA, this.m_lClassB]);
  };

  this.ImportDataFromJSON = function(a_strImport) {
     // Parse import
     var importData = JSON.parse(a_strImport);

     // Import data
     this.m_lClassA = importData[0];
     this.m_lClassB = importData[1];
  };

  this.ExportDataToCSV = function() {
     // Build header
     var strHdr = "x, y, t\r\n";
     var strBody = "";

     // Process both classes
     for(var i = 0; i != this.m_lClassA.length; i++) {
        strBody += this.m_lClassA[i][0] + "," + this.m_lClassA[i][1] + ",0\r\n";
     }
     for(var i=0; i != this.m_lClassB.length; i++) {
        strBody += this.m_lClassB[i][0] + "," + this.m_lClassB[i][1] + ",1\r\n";
     }

     return strHdr+strBody;
  };

  this.ImportDataFromCSV = function(a_strImport) {
     // Clean
     this.m_lClassA = [];
     this.m_lClassB = [];

     // Break string into rows
     var lRows = a_strImport.split("\n");

     for(var i=1; i != lRows.length; i++) {   // Ignore first row
        if(lRows[i] == "") {  // Skip empty rows
           continue;
        }        

        // Split line into data
        var lData = lRows[i].split(",");

        // Add data
        if(lData[2] == "0") {  // Class A
           this.m_lClassA.push([lData[0], lData[1]]);
        }
        else if(lData[2] == "1") {  // Class B
           this.m_lClassB.push([lData[0], lData[1]]);
        }
     }
  };

  this.ExportJSON = function() {
     // Export data
     document.getElementById("exportData").value = this.ExportDataToJSON();

     // Open/Show dialog
     document.getElementById("exportDlg").showModal();
  };

  this.ExportCSV = function() {
     // Export data
     document.getElementById("exportData").value = this.ExportDataToCSV();

     // Open/Show dialog
     document.getElementById("exportDlg").showModal();
  };

  this.ImportClose = function() {
     // Remove all event listener
     document.getElementById("importDataBtn").removeEventListener("click", this.funcImportEvent, false);
  };

  this.ImportJSON = function() {
     // Register eventhandler
     this.funcImportEvent = this.ImportDataJsonBtn.bind(this);
     document.getElementById("importDataBtn").addEventListener("click", this.funcImportEvent, false);

     // Clean up
     document.getElementById("importData").value = "";

     // Open/Show dialog
     document.getElementById("importDlg").showModal();
  };

  this.ImportCSV = function() {
     // Register eventhandler
     this.funcImportEvent = this.ImportDataCsvBtn.bind(this);
     document.getElementById("importDataBtn").addEventListener("click", this.funcImportEvent, false);

     // Clean up
     document.getElementById("importData").value = "";

     // Open/Show dialog
     document.getElementById("importDlg").showModal();
  };

  this.ImportDataJsonBtn = function() {
     // Get data for import
     var strData = document.getElementById("importData").value;

     // Try to import data
     this.ImportDataFromJSON(strData);

     // Refresh plot
     this.Plot();
     
     // Close
     this.ImportClose();
  };

  this.ImportDataCsvBtn = function() {
     // Get data for import
     var strData = document.getElementById("importData").value;

     // Try to import data
     this.ImportDataFromCSV(strData);

     // Refresh plot
     this.Plot();

     // Close
     this.ImportClose();
  };

  this.Reset = function() {
    // Remove all points
    this.m_lClassA = [];
    this.m_lClassB = [];

    // Refresh plot
    this.Plot();
  };
}
