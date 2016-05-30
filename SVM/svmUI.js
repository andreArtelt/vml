// svmui.js
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

function vml_SvmUI() {
    this.oDataGen = null;
    this.oModel = null;

    this.lDecBound = [];
    this.lData = [];
    this.lLabels = [];
    this.lGrid = [];
    this.lDecBound = [];
    this.lErrorOverTime = [];
    this.iTime = -1;

    // Init
    this.Init = function() {
        try {
            // Init
            this.oDataGen = oDataGen;
            this.oModel = new vml_SVM();
            this.InitGrid();
            this.GetKernel();

            // Register eventhandler
            document.getElementById( "trainBtn" ).addEventListener( "click", this.Train.bind( this ), false );
            document.getElementById( "resetModelBtn" ).addEventListener( "click", this.Reset.bind( this ), false );
            document.getElementById( "evalBtn" ).addEventListener( "click", this.Evaluation.bind( this ), false );
            document.getElementById( "trainCurveBtn" ).addEventListener( "click", this.TrainCurve.bind( this ), false );
            document.getElementById( "kernelSelect" ).addEventListener( "change", this.GetKernel.bind( this ), false );
            document.getElementById( "showSuppVecs" ).addEventListener( "change", this.Plot.bind( this ), false );
        }
        catch( ex ) {
            alert( "Fatal error: Can not initialize!\n" + ex );
        }
    };

    this.Plot = function() {
        var oPlotHelper = new vml_PlotHelper();

        var lData = [ { lData: this.oDataGen.oClassA.Data, name: "Class A", color: "red", size: 3.5, symbol: "circle" }, { lData: this.oDataGen.oClassB.Data, name: "Class B", color: "black", size: 3.5, symbol: "circle" } ];

        if( this.ShowSupportVectors() == true ) {
            var lSupportVectors = [ { lData: [], name: "SuppVec A", color: "red", symbol: "cross" }, { lData: [], name: "SuppVec B", color: "black", symbol: "cross" } ];

            for( var i=0; i != this.oModel.lSuppVecs.length; i++ ) {
                if( this.oModel.lSuppVecsLabels[ i ] == -1 ) {
                    lSupportVectors[ 1 ].lData.push( this.oModel.lSuppVecs[ i ].valueOf() );
                }
                else {
                    lSupportVectors[ 0 ].lData.push( this.oModel.lSuppVecs[ i ].valueOf() );
                }
            }

            lData = lData.concat( lSupportVectors );
        }

        oPlotHelper.CreateHeatmapScatterPlot( this.lDecBound, lData, "plotArea", 0.05 );
    };

    this.Evaluation = function() {
        try {
            if( this.oModel.IsReady() == false ) {
                return;
            }

            // Evaluate model
            var lLabels = this.lLabels.map( function( x ){ return x == -1 ? 1 : 0; } );
            var oEvaluation = new vml_ClassifierEvaluation( this.lData, lLabels, this.oModel, 2 ).AllMetrics();

            console.log(this.oModel.lAlphas);  // TEMP ONLY!

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
            var oDlg = new vml_TrainingCurvePlotDlg();
            oDlg.Init( "Training curve", this.lErrorOverTime, {min: 0, max: this.iTime}, {min: this.lErrorOverTime[ 0 ][ 1 ], max: this.lErrorOverTime[ this.lErrorOverTime.length - 1 ][ 1 ]}, "Error" );
            oDlg.Show();
        }
        catch( ex ) {
            alert( "Error: " + ex );
        }
    };

    this.GetKernel = function() {
        var strKernel = this.KernelSelected();

        if( strKernel == "linear" ) {
            var bias = this.GetBias();
            this.oModel.kernel = function(a, b){return vml_Math.Kernel_Linear(a, b, bias);};
            document.getElementById( "degreeCtrl" ).style.display = "none";
            document.getElementById( "sigmaCtrl" ).style.display = "none";
        }
        else if( strKernel == "polynomial" ) {
            var bias = this.GetBias();
            var degree = this.GetDegree();
            this.oModel.kernel = function(a, b){return vml_Math.Kernel_Polynomial(a, b, degree, bias);};
            document.getElementById( "degreeCtrl" ).style.display = "block";
            document.getElementById( "sigmaCtrl" ).style.display = "none";
        }
        else if( strKernel == "gauss" ) {
            var sigma = this.GetSigma();
            this.oModel.kernel = function(a, b){return vml_Math.Kernel_Gaussian(a, b, sigma);};
            document.getElementById( "degreeCtrl" ).style.display = "none";
            document.getElementById( "sigmaCtrl" ).style.display = "block";
        }
    };

    this.GetBias = function() {
        var iResult = document.getElementById( "bias" ).value;
        if( iResult == "" || iResult == undefined ) {
            return 0;
        }
        else {
            return parseInt( iResult );
        }
    };

    this.GetSigma = function() {
        var fResult = document.getElementById( "sigma" ).value;
        if( fResult == "" || fResult == undefined ) {
            return 0.0;
        }
        else {
            return parseFloat( fResult );
        }
    };

    this.GetDegree = function() {
        var iResult = document.getElementById( "degree" ).value;
        if( iResult == "" || iResult == undefined) {
            return 0;
        }
        else {
            return parseInt( iResult );
        }
    };

    this.GetSlackPenalty = function() {
        var iResult = document.getElementById( "slackPenalty" ).value;
        if( iResult == "" || iResult == undefined ) {
            return 0;
        }
        else {
            return parseFloat( iResult );
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

    this.ShowSupportVectors = function() {
        return document.getElementById( "showSuppVecs" ).checked;
    };

    this.InitGrid = function() {
        this.lGrid = vml_Utils.BuildGridWithoutBias( -5, 5, -5, 5, 0.05 );
    };

    this.KernelSelected = function() {
        return document.getElementById( "kernelSelect" ).value;
    };

    this.Reset = function() {
        try {
            // Make sure data is converted
            this.ConvertDataPoints( this.oDataGen.oClassA.Data, this.oDataGen.oClassB.Data );

            // Reset model
            this.oModel.Init( this.lData, this.lLabels, this.GetSlackPenalty() );

            // Get current kernel
            this.GetKernel();

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

    this.ConvertDataPoints = function( lClassA, lClassB ) {
        this.lData = [];
        this.lLabels = [];

        // Create list of vectors of shape (x, y)
        for( var i=0; i != lClassA.length; i++) {
            var point = lClassA[i];

            this.lData.push( math.matrix( [ point[0], point[1] ] ) );
            this.lLabels.push( 1 );
        }
        for( var i=0; i != lClassB.length; i++ ) {
            var point = lClassB[ i ];

            this.lData.push( math.matrix( [ point[0], point[1] ] ) );
            this.lLabels.push( -1 );
        }
    };

    this.ComputeDecisionBoundary = function() {
        // Reset decision boundary
        this.lDecBound = [];

        this.oModel.GetSupportVectors();  // Recompute support vectors

        for(var i=0; i != this.lGrid.length; i++) {
            var vecPoint = this.lGrid[ i ];
            var pred = this.oModel.Predict( vecPoint, false )[0];

            this.lDecBound.push( vecPoint.concat( [ pred ] ) );
        }
    };

    this.Train = function() {
        try {
            if( this.oModel.IsReady() == false ) {
                this.Reset();
            }

            var fLambda = this.GetLearningRate();

            if( this.iTime == 0 ) {
                var fError = this.oModel.ComputeError();
                this.lErrorOverTime.push( [ this.iTime, fError ] );
            }

            // Run training iterations
            for( var i=0; i != this.GetNumberOfIterations(); i++ ) {
                this.oModel.FitStep( fLambda );
            }

            // Compute current error
            this.iTime += this.GetNumberOfIterations();
            var fError = this.oModel.ComputeError();
            this.lErrorOverTime.push( [ this.iTime, fError ] );

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
