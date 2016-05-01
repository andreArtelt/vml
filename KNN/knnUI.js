// knnUI.js
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

function vml_KnnUI() {
  this.oDataGen = null;
  this.oModel = null;

  this.lData = [];
  this.lLabels = [];
  this.lGrid = [];
  this.lCurve = [];
  this.lDecBound = [];

  this.Init = function() {
     try {
       // Init
       this.oDataGen = oDataGen;
       this.oModel = new vml_KNN();

       // Register eventhandler
       document.getElementById( "fitBtn" ).addEventListener( "click", this.Fit.bind( this ), false );
       document.getElementById( "evalBtn" ).addEventListener( "click", this.Evaluate.bind( this ), false );
     }
     catch( ex ) {
       alert( "Fatal error: Can not initialize!\n" + ex );
     }
  };

  this.PlotRegressionCurve = function() {
     var lData = this.oDataGen.oClassA.Data.length != 0 ? [ this.oDataGen.lData[ 0 ] ] : [ this.oDataGen.lData[1] ];
     lData.push( {label: "Regression curve", data: this.lCurve, lines: {show: true}} );

     $.plot( "#"+this.oDataGen.strPlotDiv, lData, this.oDataGen.oPlotSettings );

     lData.splice( lData.length - 1, 1 ); // Remove current regression curve
  };

  this.PlotDecisionBoundary = function() {
    var oPlotHelper = new vml_PlotHelper();
    oPlotHelper.CreateHeatmapScatterPlot( this.lDecBound, [ { lData: this.oDataGen.oClassA.Data, name: "Class A", color: "red", size: 3.5, symbol: "circle" }, { lData: this.oDataGen.oClassB.Data, name: "Class B", color: "black", size: 3.5, symbol: "circle" } ], "plotArea", 0.05 );
  };

  this.Evaluate = function() {
    try {
      if( this.oDataGen.oClassA.Data.length > 0 && this.oDataGen.oClassB.Data.length == 0 ) {
        this.EvaluateRegression();
      }
      else {
        this.EvaluateClassifier();
      }
    }
    catch( ex ) {
      alert( "Error: " + ex );
    }
  };

  this.EvaluateRegression = function() {
    // Evaluate model
    var oEvaluation = new vml_RegressionEvaluation( this.lData, this.lLabels, this.oModel ).AllMetrics();

    // Show evaluation
    var oEvalDlg = new vml_EvaluationDlg();
    oEvalDlg.Init( true, oEvaluation );
    oEvalDlg.Show();
  };

  this.EvaluateClassifier = function() {
    // Evaluate model
    var lLabels = this.lLabels.map(function(x){ return x==-1 ? 0 : x })
    var oEvaluation = new vml_ClassifierEvaluation( this.lData, lLabels, this.oModel, 2 ).AllMetrics();

    // Show evaluation
    var oEvalDlg = new vml_EvaluationDlg();
    oEvalDlg.Init( false, oEvaluation );
    oEvalDlg.Show();
  };

  this.Fit = function() {
    try {
      // Only points of one class used => Regression
      if( ( this.oDataGen.oClassA.Data.length > 0 && this.oDataGen.oClassB.Data.length == 0 ) || ( this.oDataGen.oClassA.Data.length == 0 && this.oDataGen.oClassB.Data.length != 0 ) ) {
        this.FitRegression();
      }
      else {  // Classification otherwise
        this.FitClassification();
      }
    }
    catch( ex ) {
      alert( "Error: " + ex );
    }
  };

  this.FitClassification = function() {
     // Multiple classes are used
     this.oDataGen.bSingleDataType = false;

     // Init grid (needed for computing the decision boundary)
     this.lGrid = vml_utils.BuildGridWithoutBias( -5, 5, -5, 5, 0.05 );

     // Preprocess the data
     var lRawDataA = this.oDataGen.oClassA.Data;
     var lRawDataB = this.oDataGen.oClassB.Data;
     this.lData = [];
     this.lLabels = [];

     for( var i=0; i != lRawDataA.length; i++ ) {
       this.lData.push( lRawDataA[i] );
       this.lLabels.push( -1 );
     }
     for( var i=0; i != lRawDataB.length; i++ ) {
       this.lData.push( lRawDataB[i] );
       this.lLabels.push( 1 );
     }

     // Init model
     this.oModel.Init( this.lData, this.lLabels, this.GetNumberOfNeighbours() );

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
     var lRawData = this.oDataGen.oClassA.Data.length != 0 ? this.oDataGen.oClassA.Data : this.oDataGen.oClassB.Data;
     this.lData = [];
     this.lLabels = [];

     for( var i=0; i != lRawData.length; i++ ) {
       this.lData.push( [ lRawData[i][0] ] );
       this.lLabels.push( lRawData[i][1] );
     }

     // Init model
     this.oModel.Init( this.lData, this.lLabels, this.GetNumberOfNeighbours() );

     // Compute regression curve (no real training/fitting needed due to "lazy learning") and refresh plot
     this.ComputeRegressionCurve();
     this.PlotRegressionCurve();
     
     this.oDataGen.bSingleDataType = false;  // Reset temporary settings (otherwise user has to reload the page in order to perform classification)
  };

  this.ComputeDecisionBoundary = function() {
     this.lDecBound = [];  // Reset current boundary
     
     // Compute predicited output for each point
      for( var i=0; i != this.lGrid.length; i++ ) {
        var vecPoint = this.lGrid[ i ];
        var fLabel = this.oModel.PredictClassification( vecPoint )[0];

        this.lDecBound.push( vecPoint.concat( [ fLabel ] ) );
    }
  };

  this.ComputeRegressionCurve = function() {
     this.lCurve = []; // Reset current curve

     // Compute predicited output for each point
     for( var i=0; i != this.lGrid.length; i++ ) {
        var x = this.lGrid[ i ];
        this.lCurve.push( [ x, this.oModel.PredictRegression( [x] ) ] );
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
