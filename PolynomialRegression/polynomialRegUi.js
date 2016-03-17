// polynomregui.js
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

function vml_PolynomialRegressionUI() {
  this.oDataGen = null;  // Stuff from datagen.js (sth. like a parent class)
  this.oAlgo = null;    // Model

  this.lCurve = [];
  this.lGrid = [];

  // Init
  this.Init = function() {
     // Init stuff from data generation
     this.oDataGen = new vml_DataGen();
     this.oDataGen.Init( undefined, true );

     // Init model
     this.oAlgo = new vml_PolynomialRegression();

     // Register eventhandler
     document.getElementById( "trainBtn" ).addEventListener( "click", this.Train.bind( this ), false );
     document.getElementById( "resetModel" ).addEventListener( "click", this.ResetModel.bind( this ), false );
     document.getElementById( "fitBtn" ).addEventListener( "click", this.Fit.bind( this ), false );   

     // Disable/Enable buttons
     document.getElementById("stopBtn").disabled = true;

     // Init params
     this.InitGrid();
  };

  this.Plot = function() {
     var lData = this.oDataGen.lData;
     lData.push( { label: "Regression curve", data: this.lCurve, lines: {show: true} } );

     $.plot( "#"+this.oDataGen.strPlotDiv, lData, this.oDataGen.oPlotSettings );

     lData.splice( lData.length - 1, 1 ); // Remove current regression curve
  };

  this.Train = function() {
     // Run training iterations
     for( var i=0; i != this.GetNumberOfIterations(); i++ ) {
	// Update weights
        this.oAlgo.UpdateWeights( this.GetLearningRate(), this.GetRegularizationRate() );
     }

     // Recompute curve
     this.ComputeRegressionCurve();

     // Refresh plot
     this.Plot();
  };

  this.Fit = function() {
    // Init model
    this.oAlgo.Init( this.GetPolynomDegree(), this.oDataGen.oClassA.Data );

    // Fit model
    this.oAlgo.Fit( this.GetRegularizationRate() );

    // Recompute regression curve
    this.ComputeRegressionCurve();

    // Refresh plot
    this.Plot();
  };

  this.ComputeRegressionCurve = function() {
     this.lCurve = []; // Reset current curve

     // Compute predicited output for each point
     for( var i=0; i != this.lGrid.length; i++ ) {
        var x = this.lGrid[ i ];
        this.lCurve.push( [ x, this.oAlgo.Predict( x ) ] );
     };
  };

  this.ResetModel = function() {
     // Init weights with random values
     this.oAlgo.Init( this.GetPolynomDegree(), this.oDataGen.oClassA.Data );

     // Recompute decision boundary
     this.ComputeRegressionCurve();

     // Refresh plot
     this.Plot();
  };

  this.InitGrid = function() {
      // Compute 1d range over x-axis
      this.lGrid = vml_utils.BuildGrid1d( -5, 5 );
  };

  this.IsAnimated = function() {
     return document.getElementById( "showAnimation" ).checked;
  };

  this.GetPolynomDegree = function() {
     var iResult = document.getElementById( "polynomDegree" ).value;
     if( iResult == "" || iResult == undefined ) {
        return 1;
     }
     else {
        return parseInt( iResult );
     }
  };

  this.GetLearningRate = function() {
     var fResult = document.getElementById( "learningRate" ).value;
     if( fResult == "" || fResult == undefined ) {
        return 1.0;
     }
     else {
        return parseFloat( fResult );
     }
  };

  this.GetNumberOfIterations = function() {
     var iResult = document.getElementById( "numTrainItr" ).value;
     if( iResult == "" || iResult == undefined ) {
        return 0;
     }
     else {
        return parseInt( iResult );
     }
  };

  this.GetRegularizationRate = function() {
     var fResult = document.getElementById( "regulRate" ).value;
     if( fResult == "" || fResult == undefined ) {
        return 0.0;
     }
     else {
        return parseFloat( fResult );
     }
  };
}
