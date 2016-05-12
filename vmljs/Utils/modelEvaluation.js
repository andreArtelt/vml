// ModelEvaluation.js
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
* @classdesc Implementation of evaluation metrics for regression models.
* @class vml_RegressionEvaluation
* @constructor
* @param {Matrix} lData - Data set.
* @param {Vector} lLabels - Labels of data set.
* @param {Object} oModel - Model to evaluate (needs to provide a Predict(x) function).
*/
function vml_RegressionEvaluation( lData, lLabels, oModel ) {
    this.lData = lData;
    this.lLabels = lLabels;
    this.oModel = oModel;

    /**
    * Compute all metrics.
    * @method AllMetrics
    * @memberof vml_RegressionEvaluation
    * @instance
    * @return {Object} Object containing the scores of all metrics.
    */
    this.AllMetrics = function() {
         return { RMSE: this.RMSE(), MAPE: this.MAPE(), ACP: this.ACP(  0.1) };
    };

    /**
    * Compute the Root Mean Square Error (RMSE)
    * @method RMSE
    * @memberof vml_RegressionEvaluation
    * @instance
    * @return {Double} Score.
    */
    this.RMSE = function() {
        var fResult = 0.0;

        for( var i=0; i != this.lData.length; i++ ) {
            fResult += Math.pow( this.oModel.Predict( this.lData[ i ] ) - this.lLabels[ i ], 2 );
        }
        fResult *= 1.0 / this.lData.length;
        fResult = Math.sqrt( fResult );

        return fResult;
    };

    /**
    * Compute the Mean Absolute Percentage Error (MAPE).
    * @method MAPE
    * @memberof vml_RegressionEvaluation
    * @instance
    * @return {Double} Score.
    */
    this.MAPE = function() {
         var fResult = 0.0;

        for( var i=0; i != this.lData.length; i++ ) {
            var fLabel = this.lLabels[ i ];
            var fPred = this.oModel.Predict( this.lData[ i ] );

            if( fLabel == 0.0 ) {  // Prevent division by zero!
                console.log( "Divison by zero!" );
                return -1;
            }

            fResult += Math.abs( ( fLabel - fPred ) / fLabel );
        }
        fResult *= 1.0 / this.lData.length;

        return fResult;
    };

    /**
    * Compute the "almost correct" predictions using a given percentage threshold.
    * @method ACP
    * @memberof vml_RegressionEvaluation
    * @instance
    * @param {Double} fPercThreshold - Threshold for estimations.
    * @return {Double} Score.
    */
    this.ACP = function( fPercThreshold ) {
        var fResult = 0.0;

        for( var i=0; i != this.lData.length; i++ ) {
            var fLabel = this.lLabels[ i ];
            var fPred = this.oModel.Predict( this.lData[ i ] );

            if( Math.abs( ( fLabel - fPred ) / fLabel ) < fPercThreshold ) {
                fResult += 1.0;
            }
        }
        fResult /= 1.0 * this.lData.length;

        return fResult;
    };
}


/**
* @classdesc Implementation of evaluation metrics for classification models.
* @class vml_ClassifierEvaluation
* @constructor
* @param {Matrix} lData - Data set.
* @param {Vector} lLabels - Labels of data set.
* @param {Integer} iNumClass - Number of different classes/labels.
* @param {Object} oModel - Model to evaluate (needs to provide a "probabilistic" Predict(x) function).
*/
function vml_ClassifierEvaluation( lData, lLabels, oModel, iNumClass ) {
    this.lData = lData;
    this.lLabels = lLabels;
    this.oModel = oModel;
    this.iNumClass = iNumClass

    /**
    * Compute all metrics.
    * @method AllMetrics
    * @memberof vml_ClassifierEvaluation
    * @instance
    * @return {Object} Object containing the scores of all metrics.
    */
    this.AllMetrics = function() {
        return { Acc: this.Accuracy(), AvgClassAcc: this.AvgPerClassAccuracy(), PerClassAcc: this.PerClassAccuracy(),
                ConfusionMat: this.ConfusionMatrix(), Precision: this.Precision(), Recall: this.Recall(), LogLoss: this.LogLoss(),
                FallOut: this.FallOut(), F1: this.F1Score(), AUROC: this.AUROC() };
    };

    /**
    * Compute the total accuracy.
    * @method Accuracy
    * @memberof vml_ClassifierEvaluation
    * @instance
    * @return {Double} Accuracy.
    */
    this.Accuracy = function() {
        var fResult = 0.0;

        for( var i=0; i != this.lData.length; i++ ) {
            lPred = this.oModel.Predict( this.lData[ i ] );
            iPred = vml_Utils.ArgMax( lPred );
            iLabel = this.lLabels[ i ];

            if( iLabel == iPred ) {
                fResult += 1.0;
            }
        }
        fResult /= this.lData.length;

        return fResult;
    };

    /**
    * Compute the average per class accuracy.
    * @method AvgPerClassAccuracy
    * @memberof vml_ClassifierEvaluation
    * @instance
    * @return {Double} Average per class accuracy.
    */
    this.AvgPerClassAccuracy = function() {
        var lPerClassAcc = this.PerClassAccuracy();

        var fResult = 0.0;
        for( var i=0; i != lPerClassAcc.length; i++ ) {
            fResult += lPerClassAcc[ i ];
        }
        fResult /= lPerClassAcc.length;

        return fResult;
    };

    /**
    * Compute the accuracy of each class.
    * @method PerClassAccuracy
    * @memberof vml_ClassifierEvaluation
    * @instance
    * @return {Array} Accuracy of each class (double).
    */
    this.PerClassAccuracy = function() {
        var lResult = vml_Utils.FillList( this.iNumClass, 0.0 );
        var lNorm = vml_Utils.FillList( this.iNumClass, 0 );
     
        for( var i=0; i != this.lData.length; i++ ) {
            var iLabel = this.lLabels[ i ];
            var lPred =  this.oModel.Predict( this.lData[ i ] );
            var iPred = vml_Utils.ArgMax( lPred );

            if( iPred == iLabel ) {
                lResult[ iLabel ] += 1.0;
            }

            lNorm[ iLabel ] += 1;
        }
        lResult = math.dotDivide( lResult, lNorm );

        return lResult.reverse();
    };

    /**
    * Compute the confusion matrix (only works for binary labels).
    * @method ConfusionMatrix
    * @memberof vml_ClassifierEvaluation
    * @instance
    * @return {Object} Confusion matrix as an object.
    */
    this.ConfusionMatrix = function() {
        if( this.iNumClass != 2 ) {
            throw "Confusion matrix on binary labels only";
        }

        var oResult = { TP: 0, FN: 0, FP: 0, TN: 0 };

        for( var i=0; i != this.lData.length; i++ ) {
            var iPred = vml_Utils.ArgMax( this.oModel.Predict( this.lData[ i ] ) );
            var iLabel = this.lLabels[ i ];

            if( iPred == iLabel ) {
                if( iLabel == 1 ) {
                    oResult.TP += 1;
                }
                else {
                    oResult.TN += 1;
                }
            }
            else {
                if( iPred == 0 && iLabel == 1 ) {
                    oResult.FN += 1;
                }
                else {
                    oResult.FP += 1;
                }
            }
        }

        return oResult;
    };

    /**
    * Compute the logarithmitic loss.
    * @method LogLoss
    * @memberof vml_ClassifierEvaluation
    * @instance
    * @return {Double} Logarithmitic loss.
    */
    this.LogLoss = function() {
        var fResult = 0.0;

        for( var i=0; i != this.lData.length; i++ ) {
            var lPred = this.oModel.Predict( this.lData[ i ] );
            var iLabel = this.lLabels[ i ];
            var fPred = lPred[ iLabel ];

            fResult += math.log( fPred );
        };

        return fResult;
    };

    /**
    * Compute the precision.
    * @method Precision
    * @memberof vml_ClassifierEvaluation
    * @instance
    * @return {Double} Precision.
    */
    this.Precision = function() {
        var oConfMat = this.ConfusionMatrix();
 
        return ( 1.0 * oConfMat.TP / ( oConfMat.TP + oConfMat.FP ) );
    };

    /**
    * Compute the recall.
    * @method Recall
    * @memberof vml_ClassifierEvaluation
    * @instance
    * @return {Double} Recall.
    */
    this.Recall = function() {
        var oConfMat = this.ConfusionMatrix();

        return ( 1.0 * oConfMat.TP / ( oConfMat.TP + oConfMat.FN ) );
    };

    /**
    * Compute the fall-out.
    * @method FallOut
    * @memberof vml_ClassifierEvaluation
    * @instance
    * @return {Double} Fall-out.
    */
    this.FallOut = function() {
        var oConfMat = this.ConfusionMatrix();

        return ( 1.0 * oConfMat.FP / ( oConfMat.FP + oConfMat.TN ) );
    };

    /**
    * Compute the F1 score.
    * @method F1Score
    * @memberof vml_ClassifierEvaluation
    * @instance
    * @return {Double} F1 score.
    */
    this.F1Score = function() {
        var fPrecision = this.Precision();
        var fRecall = this.Recall();

        return 2.0 * ( ( fPrecision * fRecall ) / ( fPrecision + fRecall ) );
    };

    /**
    * Compute the approx. area under curve (AUC) using ROC.
    * @method AUROC
    * @memberof vml_ClassifierEvaluation
    * @instance
    * @return {Double} AUC.
    */
    this.AUROC = function() {
        var fResult = 0.0;

        for( var i=0.0; i <= 1.0; i += 0.01 ) {
            // TODO
        }

        return fResult;
    };
}
