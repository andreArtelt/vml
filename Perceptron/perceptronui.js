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
  this.oDataGen = undefined;  // DataGen
  this.oAlgo = undefined;   // Perceptron

  this.lDecBound = [];
  this.oTrainTimer = undefined;
  this.iAnimationTime = 100;  // Time between each animation step in training animation

  // Init
  this.Init = function() {
    // Init stuff from data generation
    this.oDataGen = new vml_DataGen();
    this.oDataGen.Init();

    // Init stuff from perceptron
    this.oAlgo = new vml_Perceptron();

    // Register eventhandler
    document.getElementById( "trainBtn" ).addEventListener( "click", this.Train.bind( this ), false);
    document.getElementById( "stopBtn" ).addEventListener( "click", this.Stop.bind( this ), false);
    document.getElementById( "resetPerceptron" ).addEventListener( "click", this.ResetPerceptron.bind( this ), false);

    // Disable/Enable buttons
    document.getElementById( "stopBtn" ).disabled = true;
  };

  // Plot
  this.Plot = function() {
     var lData = this.oDataGen.lData;  // Extend plotting data from dataGen
     lData.push( {label: "Decision boundary", data: this.lDecBound, lines: {show: true}} );

     $.plot( "#plotArea", lData, this.oDataGen.oPlotSettings );  // Draw plot

     lData.splice( lData.length - 2, 2 ); // Remove current decision boundary!
  };

  // Compute decision boundary
  this.ComputeDecisionBoundary = function() {
      // Clear decision boundary
      this.lDecBound = [];

      // Recompute decision boundary
      // Compute params of linear function
      var w = this.oAlgo.lWeights.valueOf();
      var m=-1*(w[0]/w[1]);
      var b = w[2]/w[1];

      // Collect points on this line (discriminant)
      for( var i=-5; i <=5; i += 0.05 ) {
        this.lDecBound.push( [i, m*i - b] );
      }
  };

  this.GetLearningRate = function() {
     var fResult = document.getElementById( "learningRate" ).value;
     if( fResult == "" ) {
        return 1.0;
     }
     else {
        return fResult;
     }
  };

  this.GetNumberOfIterations = function() {
     var iResult = document.getElementById( "numTrainItr" ).value;
     if( iResult == "" ) {
        return 0;
     }
     else {
        return iResult;
     }
  };

  this.IsAnimated = function() {
     return document.getElementById( "showAnimation" ).checked;
  };

  // Reset model (and refresh plot)
  this.ResetPerceptron = function() {
     // Init/Reset perceptron
     this.oAlgo.Init( this.oDataGen.oClassA.Data, this.oDataGen.oClassB.Data );

     // Recompute decision boundary
     this.ComputeDecisionBoundary();

     // Refresh plot
     this.Plot();
  };

  this.Stop = function() {
     // Stop/Kill timer for training
     clearInterval( this.oTrainTimer );

     // Disable/Enable buttons
     document.getElementById( "stopBtn" ).disabled = true;
     document.getElementById( "trainBtn" ).disabled = false;
  };

  this.Train = function() {
     if(this.IsAnimated()) {  // Animation of training
       // Disbale/Enable buttons
       document.getElementById( "stopBtn" ).disabled = false;
       document.getElementById( "trainBtn" ).disabled = true;

       // Reset counter for number of animations
       this.TrainAnimateCounter = this.GetNumberOfIterations();
       
       // Run one animation
       this.TrainingAnimate();

       // Setup timer for animations
       this.oTrainTimer = setInterval( this.TrainingAnimate.bind( this ), this.iAnimationTime );
     }
     else {  // No animation of training
       // Run training iterations
       for( var i=0; i != this.GetNumberOfIterations(); i++ ) {
	  // Update weights
          this.oAlgo.UpdateWeights( this.GetLearningRate() );
       }

       // Recompute decision boundary
       this.ComputeDecisionBoundary();

       // Refresh plot
       this.Plot();
     }
  };

  this.TrainingAnimate = function() {
     if( this.TrainAnimateCounter == 0 ) {  // Finished?
        // Stop/Kill timer
        clearInterval( this.oTrainTimer );

        // Disable/Enable buttons
        document.getElementById( "stopBtn" ).disabled = true;
        document.getElementById( "trainBtn" ).disabled = false;
     }
     else {
       // Perform one step of training
       this.oAlgo.UpdateWeights( this.GetLearningRate() );

       // Recompute decision boundary
       this.ComputeDecisionBoundary();

       // Refresh plot
       this.Plot();

       // Decrease counter of training steps to be performed
       this.TrainAnimateCounter--;
     }
  };
}
