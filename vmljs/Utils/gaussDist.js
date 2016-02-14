// gaussDist.js
// VML - Visualization Machine Learning
// Copyright <c> Andre Artelt
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

function vml_GaussDist() {
  // Vars
  this.m_fMean = 0.0;
  this.m_fSigma = 0.0;

  // Fit a gaussian distribution to to a given data set
  this.Fit = function(a_lData) {
     // Compute mean
     this.m_fMean = math.sum(a_lData) * (1.0 / a_lData.length);

     // Compute sigma
     for(var i=0; i != a_lData.length; i++) {
       this.m_fSigma += Math.pow(a_lData[i] - this.m_fMean, 2);
     }
     this.m_fSigma *= 1.0 / (a_lData.length - 1)
  };

  // Compute "probability" of a given point
  this.Prob = function(a_point) {
     return (1.0 / math.sqrt(2*math.pi*this.m_fSigma) * math.exp(-1 * (Math.pow(a_point - this.m_fMean, 2) / this.m_fSigma)))
  };
}
