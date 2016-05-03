// logisticRegressionUI.js
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

function vml_LogisticRegressionUI() {
    this.oDataGen = null;
    this.oModel = null;

    this.lGrid = [];
    this.lGridTransformed = [];
    this.lDecBound = [];
    this.lErrorOverTime = [];
    this.iTime = -1;

    this.Init = function() {
        try {
            // Init
            this.oDataGen = oDataGen;
            this.oModel = new vml_SoftmaxRegression();

            // Register eventhandler
            document.getElementById( "resetModelBtn" ).addEventListener( "click", this.Reset.bind( this ), false );
            document.getElementById( "trainBtn" ).addEventListener( "click", this.Train.bind( this ), false );
            document.getElementById( "evalBtn" ).addEventListener( "click", this.Evaluate.bind( this ), false );
            document.getElementById( "trainCurveBtn" ).addEventListener( "click", this.TrainCurve.bind( this ), false );
        }
        catch( ex ) {
            alert( "Fatal error: Can not initialize!" + ex );
        }
    };

    this.Plot = function() {
        var oPlotHelper = new vml_PlotHelper();
        oPlotHelper.CreateHeatmapScatterPlot( this.lDecBound, [ {lData: this.oDataGen.oClassA.Data, name: "Class A", color: "red", size: 3.5, symbol: "circle"}, {lData: this.oDataGen.oClassB.Data, name: "Class B", color: "black", size: 3.5, symbol: "circle"}], "plotArea", 0.05 );
    };

    this.ComputeDecisionBoundary = function() {
        this.lDecBound = [];  // Reset current decision boundary

        for( var i=0; i != this.lGrid.length; i++ ) {
            var vecPointTransformed = this.lGridTransformed[ i ];
            var vecPoint = this.lGrid[ i ];
            var fLabel = this.oModel.Predict( vecPointTransformed )[0];

            this.lDecBound.push( vecPoint.concat( [ fLabel ] ) );
        }
    };

    this.Evaluate = function() {
        try {
            var lData = this.oDataGen.oClassA.Data;
            lData = lData.concat( this.oDataGen.oClassB.Data );
            var lLabels = vml_Utils.FillList( this.oDataGen.oClassA.Data.length, [0] ).concat( vml_Utils.FillList( this.oDataGen.oClassB.Data.length, [1] ) );
            var X = vml_Utils.PolynomFeatureTransform( lData, 2, this.GetPolynomDegree() );

            var oEval = new vml_ClassifierEvaluation( X, lLabels, this.oModel, 2 );
            var oModelEvaluation = oEval.AllMetrics();

            var oDlg = new vml_EvaluationDlg()
            oDlg.Init( false, oModelEvaluation );
            oDlg.Show();
        }
        catch( ex ) {
            alert( "Error: " + ex );
        }
    };

    this.TrainCurve = function() {
        try {
            var oDlg = new vml_TrainingCurvePlotDlg();
            oDlg.Init( "Training curve", this.lErrorOverTime, {min: 0, max: this.iTime}, {min: this.lErrorOverTime[ 0 ][ 1 ], max: 0}, "LogLikelihood" );
            oDlg.Show();
        }
        catch( ex ) {
            alert( "Error: " + ex );
        }
    };

    this.Train = function() {
        try {
            // Training/Fitting
            for(var i=0; i != this.GetNumTrainItr(); i++) {
                this.oModel.TrainStep( this.GetLearningRate(), this.GetL2Regularization(), this.UseGradientClipping() );

                var fLogLikelihood = this.oModel.LogLikelihood();
                if( fLogLikelihood == -Infinity ) {
                    this.bNeedFixInfinity = true;
                }
                else if( this.bNeedFixInfinity == true ) {
                    this.bNeedFixInfinity = false;
                    for( var j=0; j != this.lErrorOverTime.length; j++ ) {
                        this.lErrorOverTime[ j ][ 1 ] = fLogLikelihood - 10;
                    }
                }

                this.lErrorOverTime.push( [ this.iTime, fLogLikelihood ] );
                this.iTime++;
            }

            // Compute decision boundary
            this.ComputeDecisionBoundary();

            // Plot boundary
            this.Plot();
        }
        catch( ex ) {
            alert( "Error: " + ex );
        }
    };

    this.Reset = function() {
        try {
            // Get data
            var lData = this.oDataGen.oClassA.Data;
            lData = lData.concat( this.oDataGen.oClassB.Data );

            var lLabels = vml_Utils.FillList( this.oDataGen.oClassA.Data.length, 0 ).concat( vml_Utils.FillList( this.oDataGen.oClassB.Data.length, 1 ) );

            // Perform feature transformation
            var X = vml_Utils.PolynomFeatureTransform( lData, 2, this.GetPolynomDegree() );

            // Init grid
            this.lGrid = vml_Utils.BuildGridWithoutBias( -5, 5, -5, 5, 0.05 );
            this.lGridTransformed = vml_Utils.PolynomFeatureTransform( this.lGrid, 2, this.GetPolynomDegree() );

            // Init model
            this.oModel.Init( X, lLabels, (this.GetPolynomDegree() + 1) * 2, 2 );

            // Reset training curve
            this.lErrorOverTime = [];
            this.iTime = 0;
            this.bNeedFixInfinity = false;

            // Compute decision boundary + refresh plot
            this.ComputeDecisionBoundary();
            this.Plot();
        }
        catch( ex ) {
            alert( "Error: " + ex );
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

    this.GetNumTrainItr = function() {
        var iResult = document.getElementById( "numTrainItr" ).value;
        if( iResult == "" || iResult == undefined ) {
            return 1;
        }
        else {
            return parseInt( iResult );
        }
    };

    this.GetL2Regularization = function() {
         var fResult = document.getElementById( "regulRate" ).value;
        if( fResult == "" || fResult == undefined ) {
            return 1.0;
        }
        else {
            return parseFloat( fResult );
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

    this.UseGradientClipping = function() {
        return document.getElementById( "gradientClipping" ).checked;
    };
}