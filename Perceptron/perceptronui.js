// perceptronui.js
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

function vml_PerceptronUI() {
  this.m_oDataGen = undefined;  // DataGen
  this.m_oAlgo = undefined;   // Perceptron

  this.m_lGrid = [];
  this.m_lDecBound = [];
  this.m_iRoundOff = 500;  // Toleration of rounding errors when computing the decision boundary

  this.m_oTrainTimer = undefined;
  this.m_iAnimationTime = 1000;  // Time between each animation step in training animation

  // Init
  this.Init = function() {
    // Init stuff from data generation
    this.m_oDataGen = new vml_DataGen();
    this.m_oDataGen.Init();

    // Init stuff from perceptron
    this.m_oAlgo = new vml_Perceptron();

    // Register eventhandler
    document.getElementById("trainBtn").addEventListener("click", this.Train.bind(this), false);
    document.getElementById("stopBtn").addEventListener("click", this.Stop.bind(this), false);
    document.getElementById("resetPerceptron").addEventListener("click", this.ResetPerceptron.bind(this), false);

    // Disable/Enable buttons
    document.getElementById("stopBtn").disabled = true;

    // Init grid (needed for computing the decision boundary)
    this.m_lGrid = vml_utils.BuildGrid(-5, 5, -5, 5);
  };

  // Plot
  this.Plot = function() {
     var lData = this.m_oDataGen.m_lData;  // Extend plotting data from dataGen
     lData.push({label: "Decision boundary", data: this.m_lDecBound, lines: {show: true}});
     
     $.plot("#plotArea", lData, this.m_oDataGen.m_lPlotSettings);  // Draw plot

     lData.splice(lData.length - 1, 1); // Remove current decision boundary!
  };

  // Compute decision boundary
  this.ComputeDecisionBoundary = function() {
      // Clear decision boundary
      this.m_lDecBound = [];

      // Recompute decision boundary
      // => Find all values where w^t*x = 0
      var myWeights = math.transpose(this.m_oAlgo.m_weights);
      for(var i=0; i != this.m_lGrid.length; i++) {
        var myPoint = this.m_lGrid[i];
        
        var result = math.multiply(myWeights, math.matrix(myPoint));
        result = math.round(result*this.m_iRoundOff);  // Hack: Round precision away ;)

        if(result == 0) {
          this.m_lDecBound.push([myPoint[0], myPoint[1]]);
        }
      }
  };

  this.GetLearningRate = function() {
     var fResult = document.getElementById("learningRate").value;
     if(fResult == "") {
        return 1.0;
     }
     else {
        return fResult;
     }
  };

  this.GetNumberOfIterations = function() {
     var iResult = document.getElementById("numTrainItr").value;
     if(iResult == "") {
        return 0;
     }
     else {
        return iResult;
     }
  };

  this.IsAnimated = function() {
     return document.getElementById("showAnimation").checked;
  };

  // Reset model (and refresh plot)
  this.ResetPerceptron = function() {
     // Init/Reset perceptron
     this.m_oAlgo.Init(this.m_oDataGen.m_lClassA, this.m_oDataGen.m_lClassB);

     // Recompute decision boundary
     this.ComputeDecisionBoundary();

     // Refresh plot
     this.Plot();
  };

  this.Stop = function() {
     // Stop/Kill timer for training
     clearInterval(this.m_oTrainTimer);

     // Disable/Enable buttons
     document.getElementById("stopBtn").disabled = true;
     document.getElementById("trainBtn").disabled = false;
  };

  this.Train = function() {
     if(this.IsAnimated()) {  // Animation of training
       // Disbale/Enable buttons
       document.getElementById("stopBtn").disabled = false;
       document.getElementById("trainBtn").disabled = true;

       // Reset counter for number of animations
       this.TrainAnimateCounter = this.GetNumberOfIterations();
       
       // Run one animation
       this.TrainingAnimate();

       // Setup timer for animations
       this.m_oTrainTimer = setInterval(this.TrainingAnimate.bind(this), this.m_iAnimationTime);
     }
     else {  // No animation of training
       // Run training iterations
       for(var i=0; i != this.GetNumberOfIterations(); i++) {
	  // Update weights
          this.m_oAlgo.UpdateWeights(this.GetLearningRate());
       }

       // Recompute decision boundary
       this.ComputeDecisionBoundary();

       // Refresh plot
       this.Plot();
     }
  };

  this.TrainingAnimate = function() {
     if(this.TrainAnimateCounter == 0) {  // Finished?
        // Stop/Kill timer
        clearInterval(this.m_oTrainTimer);

        // Disable/Enable buttons
        document.getElementById("stopBtn").disabled = true;
        document.getElementById("trainBtn").disabled = false;
     }
     else {
       // Perform one step of training
       this.m_oAlgo.UpdateWeights(this.GetLearningRate());

       // Recompute decision boundary
       this.ComputeDecisionBoundary();

       // Refresh plot
       this.Plot();

       // Decrease counter of training steps to be performed
       this.TrainAnimateCounter--;
     }
  };
}
