// utils.js
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

function vml_utils() {
}

// Create a matrix (with given dimension) and fill it with random values
vml_utils.CreateRandMatrix = function(a_Dim) {
  return math.random(a_Dim);
};

// Build 2d grid/mesh
vml_utils.BuildGrid = function(x1, x2, y1, y2, stepsize) {
      // Create grid/mesh for drawing/evaluating the decision boundary
      var steps = stepsize !== undefined ? stepsize : 0.02;
      var lX = math.range(x1, x2, steps);
      var lY = math.range(y1, y2, steps);
      var lResult = []

      lX.forEach(function (x_value, x_index, x_m) {
	 lY.forEach(function(y_value, y_index, y_m) {
	   lResult.push([x_value, y_value, 1]);}.bind(this));
      }.bind(this));

      return lResult;
};

// Build 1d grid/mesh
vml_utils.BuildGrid1d = function(x1, x2, stepsize) {
      // Create grid/mesh for drawing/evaluating the decision boundary
      var steps = stepsize !== undefined ? stepsize : 0.02;
      var lX = math.range(x1, x2, steps);
      var lResult = []

      lX.forEach(function (x_value, x_index, x_m) {
	   lResult.push(x_value);
      }.bind(this));

      return lResult;
};

// Fill list/array with a number of a given default value
vml_utils.FillList = function(a_iLen, a_Value) {
   lResult = [];

   for(var i=0; i != a_iLen; i++) {
      lResult.push(a_Value);
   }

   return lResult;
}
