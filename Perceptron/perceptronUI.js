// perceptronUI.js
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

function vml_PerceptronUI() {
    this.oDataGen = undefined;
    this.oModel = undefined;

    this.lDecBound = [];
    this.lErrorOverTime = [];
    this.iTime = -1;

    this.Init = function() {
        try {
            // Init
            this.oDataGen = oDataGen;
            this.oModel = new vml_Perceptron();

            // Register eventhandler
            document.getElementById( "trainBtn" ).addEventListener( "click", this.Train.bind( this ), false);
            document.getElementById( "resetModelBtn" ).addEventListener( "click", this.Reset.bind( this ), false);
            document.getElementById( "evalBtn" ).addEventListener( "click", this.Evaluate.bind( this ), false );
            document.getElementById( "trainCurveBtn" ).addEventListener( "click", this.TrainCurve.bind( this ), false );
        }
        catch( ex ) {
            alert( "Fatal error: Can not initialize!\n" + ex );
        }
    };

    this.Plot = function() {
        var lData = this.oDataGen.lData;  // Extend plotting data from dataGen
        lData.push( {label: "Decision boundary", data: this.lDecBound, lines: {show: true}} );

        $.plot( "#plotArea", lData, this.oDataGen.oPlotSettings );  // Draw plot

        lData.splice( lData.length - 1, 2 ); // Remove current decision boundary!
    };

    this.Evaluate = function() {
        try {
            // Evaluate model
            var lLabels = this.oModel.lLabels.map( function( x ){ return x == -1 ? 1 : 0; } );
            var oEvaluation = new vml_ClassifierEvaluation( this.oModel.lData, lLabels, this.oModel, 2 ).AllMetrics();

            // Show evaluation
            var oEvalDlg = new vml_EvaluationDlg();
            oEvalDlg.Init( false, oEvaluation );
            oEvalDlg.Show();
        }
        catch( ex ) {
            alert( "Error: " + ex );
        }
  } ;

    this.TrainCurve = function() {
        try {
            var oDlg = new vml_TrainingCurvePlotDlg();
            oDlg.Init( "Training curve", this.lErrorOverTime, {min: 0, max: this.iTime}, {min: this.lErrorOverTime[ this.iTime - 1 ][ 1 ] - 10, max: this.lErrorOverTime[ 0 ][ 1 ]}, "Error", undefined, "ne" );
            oDlg.Show();
        }
        catch( ex ) {
            alert( "Error: " + ex );
        }
    };

    this.ComputeDecisionBoundary = function() {
        // Clear decision boundary
        this.lDecBound = [];

        // Recompute decision boundary
        // Compute params of linear function
        var w = this.oModel.lWeights.valueOf();
        var m=-1*(w[0]/w[1]);
        var b = w[2]/w[1];

        // Collect points on this line (discriminant)
        for( var i=-5; i <=5; i += 0.05 ) {
            this.lDecBound.push( [i, m*i - b] );
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

    this.Reset = function() {
        try {
            // Init/Reset perceptron
            this.oModel.Init( this.oDataGen.oClassA.Data, this.oDataGen.oClassB.Data );

            // Recompute decision boundary
            this.ComputeDecisionBoundary();

            // Refresh plot
            this.Plot();

            // Reset training curve
            this.lErrorOverTime = [];
            this.iTime = 0;
        }
        catch( ex ) {
            alert( "Error: " + ex );
        }
    };

    this.Train = function() {
        try {
            // Run training iterations
            for( var i=0; i != this.GetNumberOfIterations(); i++ ) {
                this.oModel.FitStep( this.GetLearningRate() );

                var fError = this.oModel.ComputeError();
                this.lErrorOverTime.push( [ this.iTime, fError ] );
                this.iTime++;
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
}