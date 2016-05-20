// bayesLinearRegression.js
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
* @classdesc Gaussian bayesian linear regression.
* @class vml_BayesianLinearRegression
* @constructor
*/
function vml_BayesianLinearRegression() {
    this.bReady = false;

    this.lData = undefined;
    this.lLabels = undefined;
    this.bigPhi = undefined;
    this.fAlpha = undefined;
    this.fBeta = undefined;
    this.vecPredMean_T = undefined;
    this.matPredCov = undefined;
    this.mapWeights_T = undefined;

    /**
    * Compute the multivariate gaussian distribution over a given point and parameters.
    * @method GaussDistMultiDim
    * @memberof vml_BayesianLinearRegression
    * @instance
    * @param {Vector} vecX Point used as input of gaussian distribution.
    * @param {Vector} vecMean Mean of gaussian distribution.
    * @param {Matrix} matCov Covariance matrix of gaussian distribution.
    * @return {Double} Probability of the given point.
    */
    this.GaussDistMultiDim = function( vecX, vecMean, matCov ) {
        var vecDiff = math.subtract( vecX, vecMean );
        var matCovDet = math.det( matCov );
        if( matCovDet == 0 ) {
            return 0.0;
        }
        var matCovInv = math.inv( matCov );
        var vecDiffT = math.transpose( vecDiff );

        return Math.pow( 2*math.pi, -0.5 ) * Math.pow( matCovDet, -0.5 ) * math.exp( -0.5 * math.multiply( vecDiffT, math.multiply( matCovInv, vecDiff ) ) );
    };

    /**
    *
    * @method PredDist
    * @memberof vml_BayesianLinearRegression
    * @instance
    */
    this.PredDist = function( vecPoint, lRange ) {
        // Compute probabilities over the given range
        var vecMean = math.multiply( this.vecPredMean_T, vecPoint );
        var temp = math.multiply( math.transpose( vecPoint ), math.multiply( this.matPredCov, vecPoint ) );
        var matCov = math.add( math.multiply( math.transpose( vecPoint ), math.multiply( this.matPredCov, vecPoint ) ), (1.0 / this.fBeta) );

        return lRange.map( function(x){ return this.GaussDistMultiDim( x, vecMean, matCov ); }, this );
    };

    /**
    *
    * @method PredMap
    * @memberof vml_BayesianLinearRegression
    * @instance
    */
    this.PredMap = function( vecPoint ) {
        return math.multiply( this.mapWeights_T, vecPoint );
    };

    /**
    *
    * @method
    * @memberof vml_BayesianLinearRegression
    * @instance
    * @param {} vecPoint
    * @return
    */
    this.Predict = function( vecPoint ) {
        return this.PredMap( vecPoint );
    };

    /**
    *
    * @method LogPosteriorDist
    * @memberof vml_BayesianLinearRegression
    * @instance
    */
    this.LogPosteriorDist = function( vecWeights ) {
        return this.LogLikelihood( vecWeights ) - ( (this.fAlpha / 2) * math.dot( math.transpose( vecWeights ), vecWeights ) );
    };

    /**
    *
    * @method LogLikelihood
    * @memberof vml_BayesianLinearRegression
    * @instance
    */
    this.LogLikelihood = function( vecWeights ) {
        var fResult = 0.0;
        var vecWeights_T = math.transpose( vecWeights );

        for( var i=0; i != this.lData.length; i++ ) {
        fResut += this.lLabels[ i ] - math.dot( vecWeights_T, this.lData[ i ] );
        }
        fResult *= -0.5 * this.fBeta;

        return fResult;
    };
 
    /**
    *
    * @method Fit
    * @memberof vml_BayesianLinearRegression
    * @instance
    * @param {Matrix} lData Transformed data.
    *
    */
    this.Fit = function( lData, lLabels, fAlpha, fBeta ) {
        this.lData = lData;
        this.lLabels = lLabels;
        this.fAlpha = fAlpha;
        this.fBeta = fBeta;
        this.bigPhi = math.matrix( this.lData );
        this.y = math.matrix( this.lLabels );

        this.FitPredictiveDist();

        this.MaxPosteriorDist( fAlpha / fBeta );

        this.bReady = true;
    };

    /**
    *
    * @method FitPredictiveDist
    * @memberof vml_BayesianLinearRegression
    * @instance
    */
    this.FitPredictiveDist = function() {
        this.matPredCov = math.inv( math.add( math.diag( vml_Utils.FillList( this.lData[0].length, this.fAlpha ) ), vml_Math.MultiplyScalar( math.multiply( math.transpose( this.bigPhi ), this.bigPhi ), this.fBeta ) ) );
        this.vecPredMean_T = math.transpose( vml_Math.MultiplyScalar( math.multiply( this.matPredCov ,math.multiply( math.transpose( this.bigPhi ), this.y ) ), this.fBeta ) );
    };

    /**
    *
    * @method MaxPosteriorDist
    * @memberof vml_BayesianLinearRegression
    * @instance
    */
    this.MaxPosteriorDist = function( fLambda ) {
        // Least Square:
        // w=(X^T * X + lambda*I)^-1 * X^T * y   where X is the design matrix big phi
        var bigPhi_T = math.transpose( this.bigPhi );
        var d = this.lData[0].length;
        var regI = math.eye( d, d );
        var matReg = vml_Math.MultiplyScalar( regI, fLambda );

        this.mapWeights_T = math.transpose( math.multiply( math.multiply( math.inv( math.add( matReg , math.multiply( bigPhi_T, this.bigPhi ) ) ), bigPhi_T ), this.y ) );
    };

    /**
    * Checks if the model has been initialized or not.
    * @method IsReady
    * @memberof vml_BayesianLinearRegression
    * @instance
    * @return {boolean} true if it has been initialized, false otherwise.
    */
    this.IsReady = function() {
        return this.bReady;
    };
}
