// evaluation.js
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
*
* @class vml_EvaluationDlg
* @constructor
*/
function vml_EvaluationDlg() {
  this.strDlg = undefined;

  /**
  *
  * @method Init
  * @param {}
  * @param {}
  */
  this.Init = function( bRegression, oEvaluation ) {
    this.strDlg = bRegression == true ? "evaluationRegressionDlg" : "evaluationClassifierDlg";

    if( bRegression == true ) {
       document.getElementById( "EVAL_RMSE" ).innerHTML = Math.round( oEvaluation.RMSE * 10000 ) / 10000;
       document.getElementById( "EVAL_MAPE" ).innerHTML = Math.round( oEvaluation.MAPE * 10000 ) / 10000;
       document.getElementById( "EVAL_ACP" ).innerHTML = Math.round( oEvaluation.ACP * 10000 ) / 10000;
    }
    else {
      document.getElementById( "EVAL_ACC" ).innerHTML = Math.round( oEvaluation.Acc * 10000 ) / 10000;
      document.getElementById( "EVAL_AVGACCPERCLASS" ).innerHTML = Math.round( oEvaluation.AvgClassAcc * 10000 ) / 10000;
      document.getElementById( "EVAL_PERCLASSACC" ).innerHTML = "<table class=\"evalTable\"><tr class=\"evalTr\"><td class=\"evalTd\">" + oEvaluation.PerClassAcc.map( function( x ){ return Math.round( x * 10000 ) / 10000; } ).toString().replace( ",", "</td><td class=\"evalTd\">" ) + "</td></tr>";
      document.getElementById( "EVAL_CONFMAT_TP" ).innerHTML = oEvaluation.ConfusionMat.TP;
      document.getElementById( "EVAL_CONFMAT_FP" ).innerHTML = oEvaluation.ConfusionMat.FP;
      document.getElementById( "EVAL_CONFMAT_TN" ).innerHTML = oEvaluation.ConfusionMat.TN;
      document.getElementById( "EVAL_CONFMAT_FN" ).innerHTML = oEvaluation.ConfusionMat.FN;
      document.getElementById( "EVAL_PRECISION" ).innerHTML = Math.round( oEvaluation.Precision * 10000 ) / 10000;
      document.getElementById( "EVAL_RECALL" ).innerHTML = Math.round( oEvaluation.Recall * 10000 ) / 10000;
      document.getElementById( "EVAL_F1SCORE" ).innerHTML = Math.round( oEvaluation.F1 * 10000 ) / 10000;
      document.getElementById( "EVAL_FALLOUT" ).innerHTML = Math.round( oEvaluation.FallOut * 10000 ) / 10000;
      document.getElementById( "EVAL_LOGLOSS" ).innerHTML = Math.round( oEvaluation.LogLoss * 10000 ) / 10000;
    }
  };

  /**
  * Show the dialog.
  * @method Show
  */
  this.Show = function() {
    document.getElementById( this.strDlg ).showModal();
  };
}
