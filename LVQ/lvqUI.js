// lvqUi.js
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

function vml_LVQUI() {
    this.oDataGen = null;
    this.oModel = null;

    this.lData = [];
    this.lLabels = [];
    this.lDecBound = [];
    this.lErrorOverTime = [];
    this.iTime = -1;
    this.lGrid = undefined;

    this.Init = function() {
        try {
            // Init
            this.oDataGen = oDataGen;
            this.oModel = new vml_LVQ1();
            this.oModel.Reset();
            this.InitGrid();

            // Register eventhandler
            document.getElementById( "trainBtn" ).addEventListener( "click", this.Train.bind( this ), false );
            document.getElementById( "resetModelBtn" ).addEventListener( "click", this.Reset.bind( this ), false );
            document.getElementById( "evalBtn" ).addEventListener( "click", this.Evaluation.bind( this ), false );
            document.getElementById( "trainCurveBtn" ).addEventListener( "click", this.TrainCurve.bind( this ), false );
            document.getElementById( "showPrototypes" ).addEventListener( "change", this.Plot.bind( this ), false );
        }
        catch( ex ) {
            alert( "Fatal error: Can not initialize!\n" + ex );
        }
    };

    this.Plot = function() {
        var oPlotHelper = new vml_PlotHelper();

        var lData = [ { lData: this.oDataGen.oClassA.Data, name: "Class A", color: "red", size: 3.5, symbol: "circle" }, { lData: this.oDataGen.oClassB.Data, name: "Class B", color: "black", size: 3.5, symbol: "circle" } ];
        if( this.ShowPrototypes() == true ) {
            var lPrototypes = [ { lData: [], name: "Prototypes A", color: "red", symbol: "cross" }, { lData: [], name: "Prototypes B", color: "black", symbol: "cross" } ];

            for( var i=0; i != this.oModel.lPrototypes.length; i++ ) {
                if( this.oModel.lPrototypesLabel[ i ] == 0 ) {
                    lPrototypes[ 0 ].lData.push( this.oModel.lPrototypes[ i ].valueOf() );
                }
                else if( this.oModel.lPrototypesLabel[ i ] == 1 ) {
                    lPrototypes[ 1 ].lData.push( this.oModel.lPrototypes[ i ].valueOf() );
                }
            }

            lData = lData.concat( lPrototypes );
        }

        oPlotHelper.CreateHeatmapScatterPlot( this.lDecBound, lData, "plotArea", 0.05 );
    };

    this.Train = function() {
        try {
            if( this.oModel.IsReady() == false ) {
                this.Reset();
            }

            var fLambda = this.GetLearningRate();

            // Run training iterations
            for( var i=0; i != this.GetNumberOfIterations(); i++ ) {
                this.oModel.FitStep( fLambda );

                //var fError = this.oModel.ComputeError();
                //this.lErrorOverTime.push( [ this.iTime, fError ] );
                //this.iTime++;
            }

            // Recompute decision boundary
            this.ComputeDecisionBoundary();

            // Refresh plot
            this.Plot();
        }
        catch( ex ) {
            alert( "Error: " + ex );
        }
    };

    this.Evaluation = function() {
        try {
            if( this.oModel.IsReady() == false ) {
                return;
            }

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

    this.TrainCurve = function() {
        try {
            // TODO
        }
        catch( ex ) {
            alert( "Error: " + ex );
        }
    };

    this.Reset = function() {
        try {
            // Init model
            this.ConvertDataPoints( this.oDataGen.oClassA.Data, this.oDataGen.oClassB.Data );

            this.oModel.Init( this.lData, this.lLabels, 2, 2, this.GetNumberOfPrototypes() );

            // Recompute decision boundary
            this.ComputeDecisionBoundary();

            // Refresh plot
            this.Plot();

            // Reset error
            this.lDecBound = [];
            this.lErrorOverTime = [];
            this.iTime = 0;
        }
        catch( ex ) {
            alert( "Error: " + ex );
        }
    };

    this.ComputeDecisionBoundary = function() {
        // Reset decision boundary
        this.lDecBound = [];

        for(var i=0; i != this.lGrid.length; i++) {
            var vecPoint = this.lGrid[ i ];
            var pred = this.oModel.Predict( vecPoint )[0];

            this.lDecBound.push( vecPoint.concat( [ pred ] ) );
        }
    };

    this.ConvertDataPoints = function( lClassA, lClassB ) {
        this.lData = [];
        this.lLabels = [];

        // Create list of vectors of shape (x, y)
        for( var i=0; i != lClassA.length; i++) {
            var point = lClassA[i];

            this.lData.push( math.matrix( [ point[0], point[1] ] ) );
            this.lLabels.push( 0 );
        }
        for( var i=0; i != lClassB.length; i++ ) {
            var point = lClassB[ i ];

            this.lData.push( math.matrix( [ point[0], point[1] ] ) );
            this.lLabels.push( 1 );
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

    this.GetNumberOfPrototypes = function() {
        var iResult = document.getElementById( "numPrototypes" ).value;
        if( iResult == "" || iResult == undefined ) {
            return 1;
        }
        else {
            return parseInt( iResult );
        }
    };

    this.ShowPrototypes = function() {
        return document.getElementById( "showPrototypes" ).checked;
    };

    this.InitGrid = function() {
          this.lGrid = vml_Utils.BuildGridWithoutBias( -5, 5, -5, 5, 0.05 );
    };
}
