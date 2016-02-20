// kmeansui.js
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

function vml_kmeansui() {
  // Stuff from datagen.js (sth. like a parent class)
  this.m_oDataGen = null;

  // Algorithm
  this.m_oAlgo = new vml_kmeans();

  this.Init = function() {
     // Init stuff from data generation
     this.m_oDataGen = new vml_DataGen();
     this.m_oDataGen.Init(undefined, true);

     // Register eventhandler
     document.getElementById("trainBtn").addEventListener("click", this.Train.bind(this), false);
     document.getElementById("resetModel").addEventListener("click", this.ResetModel.bind(this), false);
  };

  this.Plot = function() {
     var lData = this.m_oDataGen.m_lData;
     lData.push({label: "Cluster center", data: this.m_oAlgo.m_lCenters, color:this.m_oDataGen.m_strColorB, points: {show: true}});
     $.plot("#"+this.m_oDataGen.m_strPlotDiv, lData, this.m_oDataGen.m_lPlotSettings);
     lData.splice(lData.length - 1, 1); // Remove current centers
  };

  this.Train = function() {
     // Run training iterations
     for(var i=0; i != this.GetNumberOfIterations(); i++) {
	// Update weights
        this.m_oAlgo.FitStep();

	// Update centers (animation)
        if(this.IsAnimated()) {

        }
     }

     // Refresh plot
     this.Plot();
  };

  this.ResetModel = function() {
     this.m_oAlgo.Init(this.m_oDataGen.m_lClassA, this.GetNumClusters());
     this.Plot();
  };

  this.IsAnimated = function() {
     return document.getElementById("showAnimation").checked;
  };

  this.GetNumberOfIterations = function() {
     var iResult = document.getElementById("numTrainItr").value;
     if(iResult == "") {
        return 0;
     }
     else {
        return parseInt(iResult);
     }
  };

  this.GetNumClusters = function() {
     var iResult = document.getElementById("numCluster").value;
     if(iResult == "") {
        return 1;
     }
     else {
        return parseInt(iResult);
     }
  };
}
