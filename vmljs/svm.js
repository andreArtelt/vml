// svm.js
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

/**
* @classdesc Implementation of SVM (Support Vector Machine)
* @class vml_SVM
* @constructor
*/
function vml_SVM() {
    this.kernel = undefined;
    this.lAlphas = [];
    this.iC = undefined;
    this.lSuppVecs = [];
    this.lSuppVecsLabels = [];
    this.lSuppVecsAlphas = [];
    this.bReady = false;

    this.lData = [];
    this.lLabels = [];

    /**
    * Initilalize model.
    * @method Init
    * @memberof vml_SVM
    * @instance
    * @param {Matrix} lData - Data set.
    * @param {Vector} lLabels - Labels of each data point.
    * @param {Integer} iC - Slack penalty.
    */
    this.Init = function( lData, lLabels, iC ) {
        if( lLabels instanceof Array == false ) {
            throw "lLabels has to be a vector (Array)"
        }
        if( typeof( iC ) != "number" ) {
            throw "iC has to be number"
        }

        this.lData = lData;
        this.lLabels = lLabels;
        this.iC = iC;

        this.InitAlphas();

        this.bReady = true;
    };

    /**
    * Checks if the model has been initialized or not.
    * @method IsReady
    * @memberof vml_SVM
    * @instance
    * @return {Boolean} true if it has been initialized, false otherwise.
    */
    this.IsReady = function() {
        return this.bReady;
    };

    /**
    * Initalize all alphas with 0.
    * @method InitAlphas
    * @memberof vml_SVM
    * @instance
    */
    this.InitAlphas = function() {
        this.lAlphas = vml_Utils.FillList( this.lData.length, 0 );
    };

    /**
    * Determine all support vectors (vector with alpha != 0).
    * @method GetSupportVectors
    * @memberof vml_SVM
    * @instance
    */
    this.GetSupportVectors = function() {
        this.lSuppVecs = [];
        this.lSuppVecsLabels = [];
        this.lSuppVecsAlphas = [];

        // Find all points with alpha=0 (these points are the so called "support vectors")
        for(var i=0; i != this.lAlphas.length; i++) {
            if( this.lAlphas[i] != 0 ) {
                this.lSuppVecs.push( this.lData[ i ] );
                this.lSuppVecsLabels.push( this.lLabels[ i ] );
                this.lSuppVecsAlphas.push( this.lAlphas[ i ] );
            }
        }
    };

    /**
    * Compute the current error on the dataset (value of the cost function for the current parameters)
    * @method ComputeError
    * @memberof vml_SVM
    * @instance
    * @return {Double} Error.
    */
    this.ComputeError = function() {
        var fError = 0.0;

        var fAlphas = 0.0;
        for( var i=0; i != this.lData.length; i++ ) {
            fAlphas += this.lAlphas[ i ];

            for( var j=0; j != this.lData.length; j++ ) {
                fError += this.lAlphas[ i ] * this.lAlphas[ j ] * this.lLabels[ i ] * this.lLabels[ j ] * this.kernel( this.lData[ i ], this.lData[ j ] );
            }
        }
        fError *= -0.5;
        fError += fAlphas;

        return fError;
    };

    /**
    * Compute predicted class probabilities for a given point.
    * @method Predict
    * @memberof vml_SVM
    * @instance
    * @param {Vector} vecPoint - Point to be classified/labeled.
    * @param {Boolean} bComputeSuppVecs - true if support vectors should be computed/determined again, false otherwise.
    * @return {Vector} Probabilities for each class.
    */
    this.Predict = function( vecPoint, bRecomputeSuppVecs ) {
        if( vecPoint instanceof Array == false && vecPoint._data == undefined ) {
            throw "vecPoint has to be a vector (Array or math.matrix)"
        }

        // Make sure support vectors are available
        if( bRecomputeSuppVecs == undefined || bRecomputeSuppVecs == true ) {
            this.GetSupportVectors();
        }

        var fSum = 0.0;

        // Only the "support vectors" are needed (because the alphas of all other points are zero)
        for( var i=0; i != this.lSuppVecs.length; i++ ) {
            fSum += this.lSuppVecsLabels[ i ] * this.lSuppVecsAlphas[ i ] * this.kernel( this.lSuppVecs[ i ], vecPoint );
        }

        if( fSum < 0 ) {
            return [ 0.0, 1.0 ];
        }
        else if( fSum > 0 ) {
            return [ 1.0, 0.0 ];
        }
        else {
            return [ 0.5, 0.5 ];
        }
    };

    /**
    * Perform one step of fitting/training.
    * @method FitStep
    * @memberof vml_SVM
    * @instance
    * @param {Double} fLambda - Learning rate (step size).
    */
    this.FitStep = function( fLambda ) {
        // Select random sample
        var iIndex = Math.floor( Math.random() * this.lData.length );
        var input = this.lData[ iIndex ];
        var label = this.lLabels[ iIndex ];
        var alpha = this.lAlphas[ iIndex ];

        // Apply SVM learning rule
        var fSum = 0.0;
        for( var i=0; i != this.lData.length; i++ ) {
            fSum += this.lAlphas[ i ] * this.lLabels[ i ] * this.kernel( input, this.lData[ i ] );
        }

        this.lAlphas[iIndex] = alpha + fLambda * (1 - label * fSum);
        this.lAlphas[iIndex] = math.max( 0, this.lAlphas[ iIndex ] );
        this.lAlphas[iIndex] = math.min( this.iC, this.lAlphas[ iIndex ] );
    };
}