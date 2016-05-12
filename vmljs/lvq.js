// lvq.js
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
* @classdesc Implementation of LVQ1 algorithm.
* @class vml_LVQ1
* @constructor
*/
function vml_LVQ1() {
    this.lData = [];
    this.lLabels = [];  // Are expected to be {0, 1, 2, 3, ...}
    this.iNumClasses = 0;
    this.lPrototypes = [];
    this.lPrototypesLabel = [];
    this.iNumPrototypes = 0;
    this.iDim = 0;
    this.iPdist = 2;
    this.bReady = false;

    /**
    * Initialize model.
    * @method Init
    * @memberof vml_LVQ1
    * @instance
    * @param {Matrix} lData Data set.
    * @param {Vector} lLabels Labels of each data point.
    * @param {Integer} iDim Dimension of data.
    * @param {Integer} iNumClasses Number of classes/labels.
    * @param {Integer} iNumPrototypes Number of prototypes.
    */
    this.Init = function( lData, lLabels, iDim, iNumClasses, iNumPrototypes ) {
        if( lLabels instanceof Array == false ) {
            throw "lLabels has to be a vector (Array)";
        }
        if( typeof( iDim ) != "number" ) {
            throw "iDim has to be a number";
        }
        if( typeof( iNumClasses ) != "number" ) {
            throw "iNumClasses has to be a number";
        }
        if( typeof( iNumPrototypes ) != "number" ) {
            throw "iNumPrototypes has to be a number";
        }

        this.lData = lData;
        this.lLabels = lLabels;
        this.iNumClasses = iNumClasses;
        this.iDim = iDim;
        this.iNumPrototypes = iNumPrototypes;

        this.Reset();

        this.bReady = true;
    };

    /**
    * Reset model.
    * @method Reset
    * @memberof vml_LVQ1
    * @instance
    */
    this.Reset = function() {
        this.lPrototypes = [];
        this.lPrototypesLabel = [];

        for( var i=0; i != this.iNumClasses; i++ ) {
            for( var j=0; j != this.iNumPrototypes; j++ ) {
                this.lPrototypes.push( math.squeeze( math.random( [ this.iDim, 1 ], -5, 5 ) ) );
                this.lPrototypesLabel.push( i );
            }
        }
    };

    /**
    * Find the closest prototype to a given point.
    * @method FindWinner
    * @memberof vml_LVQ1
    * @instance
    * @param {Vector} vecPoint
    * @return {Integer} Index of closes prototype.
    */
    this.FindWinner = function( vecPoint ) {
        var iIndex=0;
        var fDist = Infinity;

        for( var j=0; j != this.lPrototypes.length; j++ ) {
            var d = math.distance( vecPoint, this.lPrototypes[ j ] );

            if( d < fDist ) {
                iIndex = j;
                fDist = d;
            }
        }

        return iIndex;
    };

    /**
    * Perform one step of training/fitting.
    * @method FitStep
    * @memberof vml_LVQ1
    * @instance
    * @param {Double} fLambda Learning rate (stepsize).
    */
    this.FitStep = function( fLambda ) {
        // Select random sample
        var iIndex = Math.floor( Math.random() * this.lData.length );
        var input = this.lData[ iIndex ];
        var label = this.lLabels[ iIndex ];

        // Predict label
        var i = this.FindWinner( input );
        var pred = this.lPrototypesLabel[ i ];

        // Update weights
        var delta = vml_Math.MultiplyScalar( math.subtract( input, this.lPrototypes[ i ] ), fLambda );
        if( pred != label ) {
            delta = vml_Math.MultiplyScalar( delta, -1.0 );
        }
        this.lPrototypes[ i ] = math.add( this.lPrototypes[ i ], delta );
    };

    /**
    * Compute predicted class probabilities for a given point.
    * @method Predict
    * @memberof vml_LVQ1
    * @instance
    * @param {Vector} vecPoint Point to be classified/labeled.
    * @return {Vector} Class probabilities.
    */
    this.Predict = function( vecPoint ) {
        var iIndex = this.FindWinner( vecPoint );
        var lPred = vml_Utils.FillList( this.iNumClasses, 0 );
        lPred[ this.lPrototypesLabel[ iIndex ] ] = 1;

        return lPred;
    };
}
