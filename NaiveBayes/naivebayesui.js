// naivebayesui.js
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


function vml_NaiveBayesUI() {
  this.m_oDataGen = undefined;  // DataGen
  this.m_oAlgo = undefined;  // NaiveBayes classifier

  this.m_lGrid = [];
  this.m_lDecBound = [];

  // Init
  this.Init = function() {
     // Register eventhandler
     document.getElementById("fitBtn").addEventListener("click", this.Fit.bind(this), false);

    // Init stuff from data generation
    this.m_oDataGen = new vml_DataGen();
    this.m_oDataGen.Init();

     // Init stuff from naiveBayes classifier
     this.m_oAlgo = new vml_NaiveBayes();

     // Init grid (needed for computing the decision boundary)
     this.m_lGrid = vml_utils.BuildGrid(-5, 5, -5, 5, 0.04);
  };

  // Plot
  this.Plot = function() {
     var lData = this.m_oDataGen.m_lData;  // Extend plotting data from dataGen
     lData.push({label: "Decision boundary", data: this.m_lDecBound, lines: {show: true}});
     
     $.plot("#plotArea", lData, this.m_oDataGen.m_lPlotSettings);  // Draw plot

     lData.splice(lData.length - 1, 1); // Remove current decision boundary!
  };

  // Compute the decision boundary of the classifier
  this.ComputeDecisionBoundary = function() {
      // Clear decision boundary
      this.m_lDecBound = [];

      // Recompute decision boundary
      // => Find all values where p(c1|x) = 0.5 (for two classes)
      for(var i=0; i != this.m_lGrid.length; i++) {
        var myPoint = this.m_lGrid[i];

        result = this.m_oAlgo.Predict(myPoint); 
        result = math.round(result, 1);  // Round to one decimal point

        if(result[0] == 0.5) {  // Unsure prediction?
          this.m_lDecBound.push([myPoint[0], myPoint[1]]);
        }
      }
  };

  // Fit/"Train" the classifier
  this.Fit = function() {
     // Fit classifier
     this.m_oAlgo.Fit(this.m_oDataGen.m_lClassA, this.m_oDataGen.m_lClassB);

     // Compute decision boundary
     this.ComputeDecisionBoundary();

     // Refresh plot
     this.Plot();
  };
}
