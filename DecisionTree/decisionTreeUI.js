// decisionTreeUI.js
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

function vml_DecisionTreeUI() {
  this.oDataGen = null;
  this.oModel = null;

  this.lGrid = [];
  this.lDecBound = [];

  this.Init = function() {
    try {
      // Init
      this.oDataGen = oDataGen;

      this.InitGrid();

      // Register eventhandler
      document.getElementById( "fitBtn" ).addEventListener( "click", this.Fit.bind( this ), false );
      document.getElementById( "evalBtn" ).addEventListener( "click", this.Evaluate.bind( this ), false );
    }
    catch( ex ) {
      alert( "Fatal error: Can not initialize!\n" + err );
    }
  };

  this.Fit = function() {
    try {
      // Get/Convert data
      this.ConvertData( this.oDataGen.oClassA.Data, this.oDataGen.oClassB.Data );

      // Create/Fit model
      this.oModel = new vml_DecisionTree();
      this.oModel.Fit( this.lData, this.lLabels, this.GetDepth(), 2, 2 );

      // Compute decision boundary and update plot
      this.ComputeDecisionBoundary();
      this.Plot();
    }
    catch( ex ) {
      alert( "Error: " + ex );
    }
  };

  this.Evaluate = function() {
    try {
      // Evaluate model
      var oEvaluation = new vml_ClassifierEvaluation( this.lData, this.lLabels, this.oModel, 2 ).AllMetrics();

      // Show evaluation
      var oEvalDlg = new vml_EvaluationDlg();
      oEvalDlg.Init( false, oEvaluation );
      oEvalDlg.Show();
    }
    catch( ex ) {
      alert( "Error: " + ex );
    }
  };

  this.Plot = function() {
     var oPlotHelper = new vml_PlotHelper();

     var lData = [ { lData: this.oDataGen.oClassA.Data, name: "Class A", color: "red", size: 3.5, symbol: "circle" }, { lData: this.oDataGen.oClassB.Data, name: "Class B", color: "black", size: 3.5, symbol: "circle" } ];

     oPlotHelper.CreateHeatmapScatterPlot( this.lDecBound, lData, "plotArea", 0.05 );
  };

  this.ConvertData = function( lClassA, lClassB ) {
     this.lData = lClassA.concat( lClassB );
     this.lLabels = vml_utils.FillList( lClassA.length, 0 ).concat( vml_utils.FillList( lClassB.length, 1 ) );
  };

  this.ComputeDecisionBoundary = function() {
    this.lDecBound = [];

    for( var i=0; i != this.lGrid.length; i++ ) {
       var vecPoint = this.lGrid[ i ];
       var fPred = this.oModel.Predict( vecPoint )[0];

       this.lDecBound.push( vecPoint.concat( [ fPred ] ) );
    }
  };

  this.GetDepth = function() {
     var iResult = document.getElementById( "treeDepth" ).value;
     if( iResult == "" || iResult == undefined ) {
        return 1;
     }
     else {
        return parseInt( iResult );
     }
  };

  this.InitGrid = function() {
      this.lGrid = vml_utils.BuildGridWithoutBias( -5, 5, -5, 5, 0.05 );
  };
}
