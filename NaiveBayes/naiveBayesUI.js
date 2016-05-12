// naiveBayesUI.js
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


function vml_NaiveBayesUI() {
    this.oDataGen = undefined;
    this.oModel = undefined;

    this.lGrid = [];
    this.lHeatData = [];

    this.Init = function() {
        try {
            // Init stuff from data generation
            this.oDataGen = oDataGen;
            this.oModel = new vml_NaiveBayes();

            // Init grid (needed for computing the decision boundary)
            this.lGrid = vml_Utils.BuildGridWithoutBias( -5, 5, -5, 5, 0.05 );

            // Register eventhandler
            document.getElementById( "fitBtn" ).addEventListener( "click", this.Fit.bind( this ), false );
            document.getElementById( "evalBtn" ).addEventListener( "click", this.Evaluate.bind( this ), false );
        }
        catch( ex ) {
            alert( "Fatal error: Can not initialize!\n" + ex );
        }
    };

    this.Plot = function() {
        var oPlotHelper = new vml_PlotHelper();
        oPlotHelper.CreateHeatmapScatterPlot( this.lHeatData, [ { lData: this.oDataGen.oClassA.Data, name: "Class A", color: "red", size: 3.5, symbol: "circle" }, { lData: this.oDataGen.oClassB.Data, name: "Class B", color: "black", size: 3.5, symbol: "circle" } ], "plotArea", 0.05 );
    };

    this.ComputeDecisionBoundary = function() {
        this.lHeatData = [];
        for( var i=0; i != this.lGrid.length; i++ ) {
            var vecPoint = this.lGrid[ i ];
            var fLabel = this.oModel.Predict( vecPoint )[0];

            this.lHeatData.push( vecPoint.concat( [ fLabel ] ) );
        }
    };

    this.Evaluate = function() {
        try {
            // Evaluate model
            var lData = this.oDataGen.oClassA.Data.concat( this.oDataGen.oClassB.Data );
            var lLabels = vml_Utils.FillList( this.oDataGen.oClassA.Data.length, 0 ).concat( vml_Utils.FillList( this.oDataGen.oClassB.Data.length, 1 ) );
            var oEvaluation = new vml_ClassifierEvaluation( lData, lLabels, this.oModel, 2 ).AllMetrics();

            // Show evaluation
            var oEvalDlg = new vml_EvaluationDlg();
            oEvalDlg.Init( false, oEvaluation );
            oEvalDlg.Show();
        }
        catch( ex ) {
            alert( "Error: " + ex );
        }
    };

    this.Fit = function() {
        try {
            // Fit classifier
            this.oModel.Fit( this.oDataGen.oClassA.Data, this.oDataGen.oClassB.Data );

            // Compute decision boundary
            this.ComputeDecisionBoundary();

            // Refresh plot
            this.Plot();
        }
        catch( ex ) {
            alert( "Error: " + ex );
        }
    };
}