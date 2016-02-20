// kmeans.js
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

function vml_kmeans() {
  // Vars
  this.m_iNumCenter = 1;
  this.m_lCenters = [];
  this.m_lData = [];
  this.m_lLabels = [];
  this.m_lTempMean = [];
  this.m_lTempLabelCount = [];

  // Init
  this.Init = function(a_lData, a_iNumCluster) {
     this.m_lCenters = [];
     this.m_iNumCenter = a_iNumCluster;
     this.m_lData = a_lData;
     this.m_iDim = 2;

     for(var i=0; i != this.m_iNumCenter; i++) {
        this.m_lTempMean.push(vml_utils.FillList(this.m_iDim, 0.0));
        this.m_lTempLabelCount.push(0);

        this.m_lCenters.push(math.random([this.m_iDim], -5, 5));
     }
  };

  // Perform one step of the fitting/training function.
  this.FitStep = function() {
     // Expectation step
     for(var i=0; i != this.m_lData.length; i++) {
         this.m_lLabels[i] = this.Predict(this.m_lData[i]);
         
         this.m_lTempMean[this.m_lLabels[i]] = math.add(this.m_lTempMean[this.m_lLabels[i]], this.m_lData[i]);
         this.m_lTempLabelCount[this.m_lLabels[i]] += 1;
     }

     // Maximization step
     for(var i=0; i != this.m_iNumCenter; i++) {
        this.m_lCenters[i] = vml_math.MultiplyScalar(this.m_lTempMean[i], (1.0 / this.m_lTempLabelCount[i]));
        
        this.m_lTempMean[i] = vml_utils.FillList(this.m_iDim, 0.0);
        this.m_lTempLabelCount[i] = 0;
     }
  };

  // Predict the cluster of a given point.
  this.Predict = function(a_Point) {
      var iCurBest = 0;
      var fCurDist = -1;

      for(var i=0; i != this.m_iNumCenter; i++) {
          fDist = math.distance(this.m_lCenters[i], a_Point);
          if(fDist < fCurDist || fCurDist == -1) {
             iCurBest = i;
             fCurDist = fDist;
          }
      }

      return iCurBest;
  };
}
