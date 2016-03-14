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
  this.oDataGen = null;

  // Algorithm
  this.oAlgo = new vml_kmeans();

  this.oTrainTimer = undefined;
  this.iAnimationTime = 100;  // Time between each animation step in training animation

  this.Init = function() {
     // Init stuff from data generation
     this.oDataGen = new vml_DataGen();
     this.oDataGen.Init( undefined, true );

     // Register eventhandler
     document.getElementById( "trainBtn" ).addEventListener( "click", this.Train.bind( this ), false );
     document.getElementById( "stopBtn" ).addEventListener( "click", this.Stop.bind( this ), false );
     document.getElementById( "resetModel" ).addEventListener( "click", this.ResetModel.bind( this ), false );

     // Disable/Enable buttons
     document.getElementById( "stopBtn" ).disabled = true;
  };

  this.Plot = function() {
     var lData = this.oDataGen.lData;
     lData.push( {label: "Cluster center", data: this.oAlgo.lCenters, color:this.oDataGen.oClassB.Color, points: {show: true}} );

     $.plot( "#"+this.oDataGen.strPlotDiv, lData, this.oDataGen.oPlotSettings );

     lData.splice( lData.length - 1, 1 ); // Remove current centers
  };

  this.Stop = function() {
     // Stop/Kill timer for training
     clearInterval(this.oTrainTimer);

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
     else {
       // Run training iterations
       for( var i=0; i != this.GetNumberOfIterations(); i++ ) {
	  // Update weights
          this.oAlgo.FitStep();
       }
     }

     // Refresh plot
     this.Plot();
  };

  this.TrainingAnimate = function() {
     if(this.TrainAnimateCounter == 0) {  // Finished?
        // Stop/Kill timer
        clearInterval( this.oTrainTimer );

        // Disable/Enable buttons
        document.getElementById( "stopBtn" ).disabled = true;
        document.getElementById( "trainBtn" ).disabled = false;
     }
     else {
       // Perform one step of training
       this.oAlgo.FitStep();

       // Refresh plot
       this.Plot();

       // Decrease counter of training steps to be performed
       this.TrainAnimateCounter--;
     }
  };

  this.ResetModel = function() {
     this.oAlgo.Init( this.oDataGen.oClassA.Data, this.GetNumClusters() );
     this.Plot();
  };

  this.IsAnimated = function() {
     return document.getElementById( "showAnimation" ).checked;
  };

  this.GetNumberOfIterations = function() {
     var iResult = document.getElementById( "numTrainItr" ).value;
     if( iResult == "" ) {
        return 0;
     }
     else {
        return parseInt( iResult );
     }
  };

  this.GetNumClusters = function() {
     var iResult = document.getElementById( "numCluster" ).value;
     if( iResult == "" ) {
        return 1;
     }
     else {
        return parseInt( iResult );
     }
  };
}
