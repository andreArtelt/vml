// perceptron.js
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

function vml_Perceptron() {
  this.m_weights = undefined;   // Perceptron params
  this.m_lData = [];
  this.m_lLabels = [];

  // Init
  this.Init = function(a_lClassA, a_lClassB) {
    // Convert dataset
    this.ConvertData(a_lClassA, a_lClassB);

    // Init params
    this.InitWeightsRand();   
  };

  // Init weights with random values
  this.InitWeightsRand = function() {
     // Fill weight matrix (including bias) with random values
     this.m_weights = math.random([3], -1, 1);
  };

  // Make given data suiteable for training (bias 1 has to be included into samples)
  this.ConvertData = function(a_lClassA, a_lClassB) {
     this.m_lData = [];
     this.m_lLabels = [];     
 
     // Create list of vectors of shape (x, y, 1)  (1 is the "hidden" bias)
     for(var i=0; i != a_lClassA.length; i++) {
        var point = a_lClassA[i];

        this.m_lData.push(math.matrix([point[0], point[1], 1]));
        this.m_lLabels.push(1);
     }
     for(var i=0; i != a_lClassB.length; i++) {
        var point = a_lClassB[i];

        this.m_lData.push(math.matrix([point[0], point[1], 1]));
        this.m_lLabels.push(-1);
     }
  };

  // Update weights (perform one step of fitting/training)
  this.UpdateWeights = function(a_fLambda) {
     // Select random sample
     var iIndex = Math.floor(Math.random() * this.m_lData.length);
     var input = this.m_lData[iIndex];
     var label = this.m_lLabels[iIndex];

     // Already correctly classified? 
     var predLabel = math.sign(math.multiply(math.transpose(this.m_weights), input));
     if(predLabel == label) {
        return;
     }

     // Apply sgd (stochastic gradient descent)
     this.m_weights = math.add(this.m_weights, vml_math.MultiplyScalar(input, label * a_fLambda));
  }
}
