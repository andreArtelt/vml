// naivebayes.js
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

function vml_NaiveBayes() {
  // Probability distributions for all features of both classes
  this.m_lProbDistA = [];
  this.m_lProbDistB = [];
  
  // Prior probabilities
  this.m_fProbA = 0.5;
  this.m_fProbB = 0.5;

  // Init
  this.Fit = function(a_lClassA, a_lClassB, a_iNumFeatures) {
     if(a_iNumFeatures == undefined) {  // If no number of features has been specified, assume 2 (because of 2d)
       a_iNumFeatures = 2;
     }

     // Extract features
     var lFeatureX_A = []; var lFeatureX_B = [];
     var lFeatureY_A = []; var lFeatureY_B = [];
    
     for(var i = 0; i != a_lClassA.length; i++) {
       //for(var j=0; j != a_iNumFeature; j++) {
       lFeatureX_A.push(a_lClassA[i][0]);
       lFeatureY_A.push(a_lClassA[i][1]);
     }
     for(var i = 0; i != a_lClassB.length; i++) {
       lFeatureX_B.push(a_lClassB[i][0]);
       lFeatureY_B.push(a_lClassB[i][1]);
     }

     // Fit probability distributions (gaussian) for each feature
     this.m_lProbDistA = [];
     var distX_A = new vml_GaussDist(); var distY_A = new vml_GaussDist();
     distX_A.Fit(lFeatureX_A); distY_A.Fit(lFeatureY_A);
     this.m_lProbDistA.push(distX_A); this.m_lProbDistA.push(distY_A);

     this.m_lProbDistB = [];
     var distX_B = new vml_GaussDist(); var distY_B = new vml_GaussDist();
     distX_B.Fit(lFeatureX_B); distY_B.Fit(lFeatureY_B);
     this.m_lProbDistB.push(distX_B); this.m_lProbDistB.push(distY_B);
  };

  // Predict the class of a given input
  this.Predict = function(a_point) {
     var fA = this.m_fProbA;
     var fB = this.m_fProbB;

     for(var i=0; i != this.m_lProbDistA.length; i++) {
        fA *= this.m_lProbDistA[i].Prob(a_point[i]);
        fB *= this.m_lProbDistB[i].Prob(a_point[i]);
     }

     var fScoreA = fA / (fA + fB);
     var fScoreB = fB / (fA + fB);

     return [fScoreA, fScoreB];
  };
};
