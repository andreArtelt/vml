// knnui.js
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

function vml_KnnUi() {
  this.oDataGen = null;  // Stuff from datagen.js (sth. like a parent class)
  this.oAlgo = null;     // Algorithm
  this.lGrid = [];
  this.lCurve = [];
  this.lDecBound = [];

  this.Init = function() {
     // Init
     this.oDataGen = new vml_DataGen();
     this.oDataGen.Init( undefined, false );
     this.oAlgo = new vml_knn();

     // Register eventhandler
     document.getElementById( "fitBtn" ).addEventListener( "click", this.Fit.bind( this ), false );
  };

  this.PlotRegressionCurve = function() {
     var lData = [ this.oDataGen.lData[ 0 ] ];
     lData.push( {label: "Regression curve", data: this.lCurve, lines: {show: true}} );

     $.plot( "#"+this.oDataGen.strPlotDiv, lData, this.oDataGen.oPlotSettings );

     lData.splice( lData.length - 1, 1 ); // Remove current regression curve
  };

  this.PlotDecisionBoundary = function() {
     // TODO
  };

  this.Fit = function() {
    // Only points of one class used => Regression
    if( this.oDataGen.oClassA.Data.length > 0 && this.oDataGen.oClassB.Data.length == 0 ) {
      this.FitRegression();
    }
    else {  // Classification otherwise
      this.FitClassification();
    }
  };

  this.FitClassification = function() {
     // Multiple classes are used
     this.oDataGen.bSingleDataType = false;

     // Init grid
     this.lGrid = vml_utils.BuildGridWithoutBias( -5, 5, -5, 5 );

     // Preprocess the data
     var lRawDataA = this.oDataGen.oClassA.Data;
     var lRawDataB = this.oDataGen.oClassB.Data;
     var lData = [];
     var lLabels = [];

     for( var i=0; i != lRawDataA.length; i++ ) {
       lData.push( lRawDataA[i] );
       lLabels.push( -1 );
     }
     for( var i=0; i != lRawDataB.length; i++ ) {
       lData.push( lRawDataB[i] );
       lLabels.push( 1 );
     }

     // Init model
     this.oAlgo.Init(lData, lLabels, this.GetNumberOfNeighbours());

     // Compute regression curve (no real training/fitting needed due to "lazy learning") and refresh plot
     this.ComputeDecisionBoundary();
     this.PlotDecisionBoundary();

     this.oDataGen.bSingleDataType = false;  // Reset temporary settings (otherwise user has to reload the page in order to perform regresssion)
  };

  this.FitRegression = function() {
     // Only one class is used
     this.oDataGen.bSingleDataType = true;

     // Init grid
     this.lGrid = vml_utils.BuildGrid1d( -5, 5 );

     // Preprocess the data
     var lRawData = this.oDataGen.oClassA.Data;
     var lData = [];
     var lLabels = [];

     for( var i=0; i != lRawData.length; i++ ) {
       lData.push( [ lRawData[i][0] ] );
       lLabels.push( lRawData[i][1] );
     }

     // Init model
     this.oAlgo.Init( lData, lLabels, this.GetNumberOfNeighbours() );

     // Compute regression curve (no real training/fitting needed due to "lazy learning") and refresh plot
     this.ComputeRegressionCurve();
     this.PlotRegressionCurve();
     
     this.oDataGen.bSingleDataType = false;  // Reset temporary settings (otherwise user has to reload the page in order to perform classification)
  };

  this.ComputeDecisionBoundary = function() {
     this.lDecBound = {x: [], y: [], z: []};  // Reset current boundary
     
     // Compute predicited output for each point
     for( var i=0; i != this.lGrid.length; i++ ) {
        var x = this.lGrid[ i ];

        this.lDecBound.x.push( x[0] );
        this.lDecBound.y.push( x[1] );
        this.lDecBound.z.push( this.oAlgo.PredictClassification( x ) );
     };
  };

  this.ComputeRegressionCurve = function() {
     this.lCurve = []; // Reset current curve

     // Compute predicited output for each point
     for( var i=0; i != this.lGrid.length; i++ ) {
        var x = this.lGrid[ i ];
        this.lCurve.push( [ x, this.oAlgo.PredictRegression( [x] ) ] );
     };
  };

  this.GetNumberOfNeighbours = function() {
     var iResult = document.getElementById( "k" ).value;
     if( iResult == "" || iResult == undefined ) {
        return 1;
     }
     else {
        return parseInt( iResult );
     }
  };
}
