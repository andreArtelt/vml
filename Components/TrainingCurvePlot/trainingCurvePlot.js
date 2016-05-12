// trainingCurvePlot.js
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
* @classdesc vml_TrainingCurvePlotDlg
* @class vml_TrainingCurvePlotDlg
* @constructor
*/
function vml_TrainingCurvePlotDlg() {
    this.lData = [];
    this.oPlotSettings = undefined;

    /**
    * Initialize plot.
    * @method Init
    * @memberof vml_TrainingCurvePlotDlg
    * @instance
    * @param {String} strTitle -
    * @param {Array} lScoreTime -
    * @param {Object} rangeX -
    * @param {Object} rangeY -
    * @param {String} strLabel -
    * @param {String} strColor -
    */
    this.Init = function( strTitle, lScoreTime, rangeX, rangeY, strLabel, strColor, strLegendPos ) {
        strLabel = strLabel == undefined ? "" : strLabel;
        strColor = strColor == undefined ? "#0000FF" : strColor;
        strLegendPos = strLegendPos == undefined ? "se" : strLegendPos;

        this.lData = [ { label: strLabel, color: strColor, data: lScoreTime, lines: {show: true } } ];
        this.oPlotSettings = { legend: {position: strLegendPos}, xaxis: rangeX, yaxis: rangeY, grid: { borderWidth: 0, aboveData: false, margin: { left: 50, right: 50 } } };

        document.getElementById( "trainCurveDlgTitle" ).innerHTML = strTitle;
    };

    /**
    * Show the dialog.
    * @method Show
    * @memberof vml_TrainingCurvePlotDlg
    * @instance
    */
    this.Show = function() {
        $.plot( "#trainCurveDlgPlotArea", this.lData, this.oPlotSettings );

        document.getElementById( "trainCurveDlg" ).showModal();
    };
}
