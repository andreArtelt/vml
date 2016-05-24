// polynomialRegUI.js
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
    this.oDataGen = null;
    this.oModel = null;

    this.lCurve = [];
    this.lGrid = [];
    this.lErrorOverTime = [];
    this.iTime = -1;
    this.fMinError, this.fMaxError;

    this.Init = function() {
        try {
            // Init
            this.oDataGen = oDataGen;
            this.oDataGen.SetSingleDataTypeOnly( true );

            this.oModel = new vml_PolynomialRegression();

            // Register eventhandler
            document.getElementById( "trainBtn" ).addEventListener( "click", this.Train.bind( this ), false );
            document.getElementById( "resetModel" ).addEventListener( "click", this.Reset.bind( this ), false );
            document.getElementById( "fitBtn" ).addEventListener( "click", this.Fit.bind( this ), false );
            document.getElementById( "evalBtn" ).addEventListener( "click", this.Evaluation.bind( this ), false );
            document.getElementById( "trainCurveBtn" ).addEventListener( "click", this.TrainCurve.bind( this ), false );
            document.getElementById( "gradientClipping" ).addEventListener( "change", this.GradClippingChange.bind( this ), false );

            // Init grid
            this.InitGrid();
            
            // Init state of controls
            this.GradClippingChange();
        }
        catch( ex ) {
            alert( "Fatal error: Can not initialize!\n" + ex );
        }
    };

    this.Plot = function() {
        var lData = this.oDataGen.lData;
        lData.push( { label: "Regression curve", data: this.lCurve, lines: {show: true} } );

        $.plot( "#"+this.oDataGen.strPlotDiv, lData, this.oDataGen.oPlotSettings );

        lData.splice( lData.length - 1, 1 ); // Remove current regression curve
    };

    this.GradClippingChange = function() {
        if( this.UseGradientClipping() == true ) {
            document.getElementById( "gradClipThresholdCtrl" ).style.display = "block";
        }
        else {
            document.getElementById( "gradClipThresholdCtrl" ).style.display = "none";
        }
    };

    this.Evaluation = function() {
        try {
            var lData = [];
            var lLabels = [];
            for( var i=0; i != this.oDataGen.oClassA.Data.length; i++ ) {
                lData.push( this.oDataGen.oClassA.Data[i][0] );
                lLabels.push( this.oDataGen.oClassA.Data[i][1] );
            }

            var oEvaluation = new vml_RegressionEvaluation( lData, lLabels, this.oModel ).AllMetrics();
            var oEvalDlg = new vml_EvaluationDlg();
            oEvalDlg.Init( true, oEvaluation );
            oEvalDlg.Show();
        }
        catch( ex ) {
            alert( "Error: " + ex );
        }
    };

    this.TrainCurve = function() {
        try {
            var oDlg = new vml_TrainingCurvePlotDlg();
            oDlg.Init( "Training curve", this.lErrorOverTime, {min: 0, max: this.iTime}, {min: 0, max: this.fMaxError}, "Error", undefined, "ne" );
            oDlg.Show();
        }
        catch( ex ) {
            alert( "Error: " + ex );
        }
    };

    this.Train = function() {
        try {
            if( this.oModel.IsReady() == false ) {
                this.Reset();
            }

            // Run training iterations
            for( var i=0; i != this.GetNumberOfIterations(); i++ ) {
                this.oModel.UpdateWeights( this.GetLearningRate(), this.GetRegularizationRate(), this.UseGradientClipping(), this.GetGradientClippingThreshold() );
        
                var fError = this.oModel.ComputeError();
                this.lErrorOverTime.push( [this.iTime, fError] );
                this.iTime++;

                if( fError < this.fMinError || this.fMinError == undefined ) {
                    this.fMinError = fError;
                }
                if( fError > this.fMaxError || this.fMaxError == undefined ) {
                    this.fMaxError = fError;
                }
            }

            // Recompute curve
            this.ComputeRegressionCurve();

            // Refresh plot
            this.Plot();
        }
        catch( ex ) {
            alert( "Error: " + ex );
        }
    };

    this.Fit = function() {
        try {
            // Init model
            this.oModel.Init( this.GetPolynomDegree(), this.oDataGen.oClassA.Data );

            // Fit model
            this.oModel.Fit( this.GetRegularizationRate() );

            // Recompute regression curve
            this.ComputeRegressionCurve();

            // Refresh plot
            this.Plot();
        }
        catch( ex ) {
            alert( "Error: " + ex );
        }
    };

    this.ComputeRegressionCurve = function() {
        this.lCurve = []; // Reset current curve

        // Compute predicited output for each point
        for( var i=0; i != this.lGrid.length; i++ ) {
            var x = this.lGrid[ i ];
            this.lCurve.push( [ x, this.oModel.Predict( x ) ] );
        };
    };

    this.Reset = function() {
        try {
            // Init weights with random values
            this.oModel.Init( this.GetPolynomDegree(), this.oDataGen.oClassA.Data );

            // Recompute decision boundary
            this.ComputeRegressionCurve();

            // Refresh plot
            this.Plot();

            // Reset training curve
            this.lErrorOverTime = [];
            this.iTime = 0;
            this.fMinError = undefined;
            this.fMaxError = undefined;
        }
        catch( ex ) {
            alert( "Error: " + ex );
        }
    };

    this.InitGrid = function() {
        this.lGrid = vml_Utils.BuildGrid1d( -5, 5, 0.05 );
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

    this.GetGradientClippingThreshold = function() {
        var fResult = document.getElementById( "gradClippingThreshold" ).value;
        if( fResult == "" || fResult == undefined ) {
            return 1.0;
        }
        else {
            return parseInt( fResult );
        }
    };

    this.UseGradientClipping = function() {
        return document.getElementById( "gradientClipping" ).checked;
    };
}
