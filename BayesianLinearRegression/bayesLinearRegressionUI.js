// bayesLinearRegressionUI.js
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

function vml_BayesianLinearRegressionUI() {
    this.oDataGen = undefined;
    this.oModel = undefined;

    this.lData = undefined;
    this.lLabels = undefined;

    this.lGrid = undefined;
    this.lGridTransformed = undefined;
    this.lRange = undefined;
    this.lPredDist = undefined;
    this.lCurve = undefined;

    this.Init = function() {
        try {
            // Init
            this.oDataGen = oDataGen;
            this.oDataGen.SetSingleDataTypeOnly( true );

            this.oModel = new vml_BayesianLinearRegression();

            // Register eventhandler
            document.getElementById( "fitBtn" ).addEventListener( "click", this.Fit.bind( this ), false );
            document.getElementById( "evalBtn" ).addEventListener( "click", this.Evaluate.bind( this ), false );
            document.getElementById( "showCurve" ).addEventListener( "change", this.Plot.bind( this ), false );
            document.getElementById( "showPredDist" ).addEventListener( "change", this.Plot.bind( this ), false );
        }
        catch( ex ) {
            alert( "Fatal error: Can not initialize!" + ex );
        }
    };

    this.Plot = function() {
        if( this.lCurve == undefined || this.lPredDist == undefined ) {
            return;
        }

        var oPlotHelper = new vml_PlotHelper();
        var lScatterData = [];
        var lPredDist = [];

        if( this.ShowPredDist() == true ) {
	        lPredDist = this.lPredDist;
        }
        if( this.ShowMapCurve() == true ) {
	        lScatterData.push( {lData: this.lCurve, name: "MAP", color: "green", size: 3.5, symbol: "line"} );
        }
        lScatterData.push( {lData: this.oDataGen.oClassA.Data, name: "Class A", color: "red", size: 3.5, symbol: "circle"} );

        oPlotHelper.CreateHeatmapScatterPlot( lPredDist, lScatterData, "plotArea", 0.1 );
    };

    this.ComputePredDist = function() {
        this.lPredDist = [];

        for( var i=0; i != this.lGrid.length; i++ ) {
            var x = this.lGrid[ i ];
            var phi = this.lGridTransformed[ i ][ 0 ];
      
            var lDist = this.oModel.PredDist( phi, this.lRange );
            for( var j=0; j != lDist.length; j++ ) {
                var fColor = lDist[ j ] * 5;
                if( fColor > 1 ) {
                    fColor = 1;
                }
                this.lPredDist.push( [x].concat( [ this.lRange[ j ], fColor ] ) );
            }
        }
    };

    this.ComputeCurve = function() {
        this.lCurve = [];

        for( var i=0; i != this.lGrid.length; i++ ) {
            var x = this.lGrid[ i ];
            var phi = this.lGridTransformed[ i ][0];

            this.lCurve.push( [ x, this.oModel.PredMap( phi ) ] );
        }
    };

    this.Fit = function() {
        try {
            // Init grid
            this.lGrid = vml_Utils.BuildGrid1d( -5, 5, 0.1 );
            this.lGridTransformed = vml_Utils.PolynomFeatureTransform( vml_Utils.BuildGrid1d( -5, 5, 0.1 ), 1, this.GetPolynomDegree() );
            this.lRange = vml_Utils.BuildGrid1d( -5, 5, 0.1 );

            // Fit model
            this.ConvertData( this.oDataGen.oClassA.Data );
  
            this.oModel.Fit( this.lData, this.lLabels, this.GetAlpha(), this.GetBeta() );

            // Recompute predictive distribution and regression curve
            this.ComputePredDist();
            this.ComputeCurve();

            // Refresh plot
            this.Plot();
        }
        catch( ex ) {
            alert( "Error: " + ex );
        }
    };

    this.ConvertData = function( lData ) {
        // Perform feature transformation
	    this.lData = [];
        this.lLabels = [];

        // Create list of vectors of shape (phi(x))  phi(x)=(1, x, x^2, x^3, ...)(1 is the "hidden" bias)
        for( var i=0; i != lData.length; i++ ) {
            var point = lData[ i ];
       
            var phi = vml_Utils.ComputePolynomPhi( point[ 0 ], this.GetPolynomDegree() );

            this.lData.push( math.matrix( phi ) );
            this.lLabels.push( point[ 1 ] );
        }
    };

    this.Evaluate = function() {
        try {
            if( this.oModel.IsReady() == false ) {
                return;
            }

            var oEvaluation = new vml_RegressionEvaluation( this.lData, this.lLabels, this.oModel ).AllMetrics();
            var oEvalDlg = new vml_EvaluationDlg();
            oEvalDlg.Init( true, oEvaluation );
            oEvalDlg.Show();
        }
        catch( ex ) {
            alert( "Error: " + ex );
        }
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

    this.GetAlpha = function() {
        var fResult = document.getElementById( "alpha" ).value;
        if( fResult == "" || fResult == undefined ) {
            return 1.0;
        }
        else {
            return parseFloat( fResult );
        }
    };

    this.GetBeta = function() {
        var fResult = document.getElementById( "beta" ).value;
        if( fResult == "" || fResult == undefined ) {
            return 1.0;
        }
        else {
            return parseFloat( fResult );
        }
    };

    this.ShowPredDist = function() {
        return document.getElementById( "showPredDist" ).checked;
    };

    this.ShowMapCurve = function() {
        return document.getElementById( "showCurve" ).checked;
    };
}
