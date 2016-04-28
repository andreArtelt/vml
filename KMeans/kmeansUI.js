// kmeansUI.js
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

function vml_KMeansUI() {
  this.oDataGen = null;
  this.oModel = null;

  this.Init = function() {
     try {
       // Init
       this.oDataGen = oDataGen;
       this.oDataGen.SetSingleDataTypeOnly( true );

       this.oModel = new vml_KMeans();

       // Register eventhandler
       document.getElementById( "trainBtn" ).addEventListener( "click", this.Train.bind( this ), false );
       document.getElementById( "resetModelBtn" ).addEventListener( "click", this.Reset.bind( this ), false );
     }
     catch( ex ) {
       alert( "Fatal error: Can not initialize!\n" + ex );
     }
  };

  this.Plot = function() {
     var lData = this.oDataGen.lData;
     lData.push( { label: "Cluster center", data: this.oModel.lCenters, color: this.oDataGen.oClassB.Color, points: { show: true, symbol: "circle", fillColor: this.oDataGen.oClassB.Color } } );

     $.plot( "#"+this.oDataGen.strPlotDiv, lData, this.oDataGen.oPlotSettings );

     lData.splice( lData.length - 1, 1 ); // Remove current centers
  };

  this.Train = function() {
     try {
       // Run training iterations
       for( var i=0; i != this.GetNumberOfIterations(); i++ ) {
          this.oModel.FitStep();
       }

       // Refresh plot
       this.Plot();
     }
     catch( ex ) {
       alert( "Error: " + ex );
     }
  };

  this.Reset = function() {
     try {
       this.oModel.Init( this.oDataGen.oClassA.Data, this.GetNumClusters() );
       this.Plot();
     }
     catch( ex ) {
       alert( "Error: " + ex );
     }
  };

  this.GetNumberOfIterations = function() {
     var iResult = document.getElementById( "numTrainItr" ).value;
     if( iResult == "" ) {
        return 0;
     }
     else {
        return parseInt( iResult );
     }
  };

  this.GetNumClusters = function() {
     var iResult = document.getElementById( "numCluster" ).value;
     if( iResult == "" ) {
        return 1;
     }
     else {
        return parseInt( iResult );
     }
  };
}
