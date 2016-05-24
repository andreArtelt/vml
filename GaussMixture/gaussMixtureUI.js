// gaussMixtureUI.js
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

function vml_GaussMixtureUI() {
    this.oDataGen = null;
    this.oModel = null;

    this.lGrid = [];
    this.lHeatData = [];
    this.lErrorOverTime = [];
    this.iTime = -1;

    this.Init = function() {
        try {
            // Init
            this.oDataGen = oDataGen;
            this.oDataGen.SetSingleDataTypeOnly( true );

            this.oModel = new vml_GaussMixture();

            // Register eventhandler
            document.getElementById( "trainBtn" ).addEventListener( "click", this.Train.bind( this ), false );
            document.getElementById( "resetModel" ).addEventListener( "click", this.Reset.bind( this ), false );
            document.getElementById( "trainCurveBtn" ).addEventListener( "click", this.TrainCurve.bind( this ), false );

            // Build grid (used for computing the heatmap of probabilitiy distribution)
            this.lGrid = vml_Utils.BuildGridWithoutBias( -5, 5, -5, 5, 0.05 );
        }
        catch( ex ) {
            alert( "Fatal error: Can not initialize!\n" + ex );
        }
    };

    this.Plot = function() {
        var oPlotHelper = new vml_PlotHelper();
        oPlotHelper.CreateHeatmapScatterPlot( this.lHeatData, [ {lData: this.oDataGen.oClassA.Data, name: "Class A", color: "red", size: 3.5, symbol: "circle"}], "plotArea", 0.05 );
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
            if( this.oModel.IsReady() == false ) {
                this.Reset();
            }

            // Training/Fitting
            var iNumTrainItr = this.GetNumberOfTrainItr();
            for( var i=0; i != iNumTrainItr; i++ ) {
                this.oModel.FitStep();

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

            // Compute "decision boundary"
            this.ComputeDecisionBoundary();

            // Plot probability distribution
            this.Plot();
        }
        catch( ex ) {
            alert( "Error: " + ex );
        }
    };

    this.ComputeDecisionBoundary = function() {
        this.lHeatData = [];
        for( var i=0; i != this.lGrid.length; i++ ) {
            var vecPoint = this.lGrid[ i ];
            var fLabel = this.oModel.Predict( vecPoint );

            this.lHeatData.push( vecPoint.concat( [ fLabel ] ) );
        }
    };

    this.Reset = function() {
        try {
            // Reset model
            this.oModel.Init( this.oDataGen.oClassA.Data, this.GetNumberOfClusters() );

            // Update plot
            this.ComputeDecisionBoundary();
            this.Plot();

            // Reset training curve
            this.lErrorOverTime = [];
            this.iTime = 0;
            this.bNeedFixInfinity = false;
        }
        catch( ex ) {
            alert( "Error: " + ex );
        }
    };

    this.GetNumberOfTrainItr = function() {
        var iResult = document.getElementById( "numTrainItr" ).value;
        if( iResult == "" || iResult == undefined ) {
            return 1;
        }
        else {
            return parseInt( iResult );
        }
    };

    this.GetNumberOfClusters = function() {
        var iResult = document.getElementById( "numCluster" ).value;
        if( iResult == "" || iResult == undefined ) {
            return 1;
        }
        else {
            return parseInt( iResult );
        }
    };
}