// decisionTree.js
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

/**
* Implementation of an learning algorithm for decision trees.
* @class vml_DecisionTree
* @constructor
*/
function vml_DecisionTree() {
  this.iNumClasses = 0;
  this.iNumFeature = 0;
  this.bReady = false;
  this.oTreeRoot = undefined;  // Root node of decision tree.

  /**
  * Node of a decision tree.
  * @class TreeNode
  * @constructor
  * @param {Boolean} True if node is a leaf, False otherwise.
  * @param {Array} Array of predictions (probabilities) for each class (NOTE: Only specified if this node is a leaf).
  * @param {TreeNode} oLeftTree Left child/tree of this node (NOTE: Only specified if this node if NOT a leaf).
  * @param {TreeNode} oRightTree Right child/tree of this node (NOTE: Only specified if this node if NOT a leaf).
  * @param {Integer} iFeatureIndex Index of feature to split data (NOTE: Only specified if this node if NOT a leaf).
  * @param {Float} Threshold used for splitting (NOTE: Only specified if this node is NOT a leaf).
  */
  function TreeNode( bIsLeaf, lPred, oLeftTree, oRightTree, iFeatureIndex, fThreshold ) {
    this.bIsLeaf = bIsLeaf;
    this.lPrediction = lPred;
    this.oLeftTree = oLeftTree;
    this.oRightTree = oRightTree;
    this.iFeatureIndex = iFeatureIndex;
    this.fThreshold = fThreshold;
  };

  /**
  * Fit a decision tree for some given data.
  * @method Fit
  * @param {Matrix} lData List of data points.
  * @param {Vector} Labels for each data point (Assuming labels as: 0, 1, 2, ...).
  * @param {Integer} Max depth of tree.
  * @param {Integer} Number of different labels/classes.
  */
  this.Fit = function( lData, lLabels, iDepth, iNumClasses, iNumFeature ) {
     if( lLabels instanceof Array == false ) {
       throw "lLabels has to be a vector (Array)"
     }
     if( typeof( iDepth ) != "number" ) {
       throw "iDepth has to be a number"
     }
     if( typeof( iNumClasses ) != "number" ) {
       throw "iNumClass has to be a number"
     }
     if( typeof( iNumFeature ) != "number" ) {
       throw "iNumFeature has to be a number"
     }

     this.iNumClasses = iNumClasses;
     this.iNumFeature = iNumFeature;

     // Build tree
     this.oTreeRoot = this.buildTree( lData, lLabels, iDepth );
     this.bReady = true;
  };

  /**
  * Checks if the model has been initialized or not.
  * @method IsReady
  * @return {boolean} true if it has been initialized, false otherwise.
  */
  this.IsReady = function() {
    return this.bReady;
  };

  /**
  * Predict the label of a give data point.
  * @method Predict
  * @param {Vector} Data point.
  * @return {Array} Array of predictions (probabilities) for each class.
  */
  this.Predict = function( vecPoint ) {
     if( vecPoint instanceof Array  == false ) {
       throw "vecPoint has to be a vector (Array)"
     }

     // Check if tree has been initialized
     if( this.oTreeRoot == undefined ) {
       throw "Tree has no been initialized";
     }

     // Walk through the tree until a leaf is reached
     oLeaf = this.walkTree( vecPoint, this.oTreeRoot );
     
     return oLeaf.lPrediction;
  };

  /**
  * Walk through a given tree using a given data point until a leaf is reached.
  * @method walkTree
  * @param {Vector} Data point.
  * @param {TreeNode} Current node.
  * @return {TreeNode} Reached leaf.
  */
  this.walkTree = function( vecPoint, oNode ) {
     // Leaf found?
     if( oNode.bIsLeaf == true ) {
        return oNode;
     }

     // Digging deeper (recursion)
     if( vecPoint[ oNode.iFeatureIndex ] <= oNode.fThreshold ) {
        return this.walkTree( vecPoint, oNode.oLeftTree );
     }
     else {
        return this.walkTree( vecPoint, oNode.oRightTree );
     }
  };

  /**
  * Method for learning/building a tree to fit a given set of labeled data (NOTE: Only real valued features are supported).
  * @method buildTree
  * @param {Matrix} lData List of data points.
  * @param {Vector} lLabels Labels of each data point.
  * @param {Integer} iDepth Max depth of tree.
  * @return {TreeNode} Root node of tree.
  */
  this.buildTree = function( lData, lLabels, iDepth ) {
     // Stop recursion?
     if( iDepth == 0 || this.computeErrorOfMajorityClassifier( lLabels ) == 0.0 ) {
       return this.createLeaf( lLabels );  // Tree is "closed" by a leaf
     }

     // Find best split
     var oSplit = this.findBestSplit( lData, lLabels );

     // Split on best split
     var oSplitData = this.doSplit( lData, lLabels, oSplit.iFeatureIndex, oSplit.fThreshold );

     // Recursive build of trees
     var oLeftTree = this.buildTree( oSplitData.lLeftData, oSplitData.lLeftLabels, iDepth - 1 );
     var oRightTree = this.buildTree( oSplitData.lRightData, oSplitData.lRightLabels, iDepth - 1 );

     // Build new node
     return new TreeNode( false, undefined, oLeftTree, oRightTree, oSplit.iFeatureIndex, oSplit.fThreshold );
  };

  /**
  * Build a leaf (prediction based on a majority classifier) using a given set of labels.
  * @method createLeaf
  * @param {Vector} lLabels Labels of each data point.
  * @return {TreeNode} Leaf makeing a prediction.
  */
  this.createLeaf = function( lLabels ) {
     return new TreeNode( true, this.majorityClassifier( lLabels ).lPred, undefined, undefined, undefined, undefined );
  };

  /**
  * Find the best split over a given set of labeled data.
  * @method findBestSplit
  * @param {Matrix} lData List of data points.
  * @param {Vector} lLabels Labels of each data point.
  * @return {Object} Object containing information about the best split ({ iFeatureIndex, fThreshold }).
  */
  this.findBestSplit = function( lData, lLabels ) {
     var oSplit = { iFeatureIndex: 0, fThreshold: 0.0 };

     // Find best feature for split
     var fBestError = Infinity;
     for( var i=0; i != this.iNumFeature; i++ ) {
        for( var j=0; j != lData.length; j++ ) {
          // Compute error of current split
          var fCurError = this.computeErrorOfSplit( lData, lLabels, i, lData[ j ][ i ] );

          // Better split found?
          if( fCurError < fBestError ) {
            fBestError = fCurError;
            oSplit.iFeatureIndex = i;
            oSplit.fThreshold = lData[ j ][ i ];
          }
        }
     }

     return oSplit;
  };

  /**
  * Split a given data set on a given feature using a given threshold.
  * @method doSplit
  * @param {Matrix} lData List of data points.
  * @param {Vector} lLabels Labels of each data point.
  * @param {Integer} iFeatureIndex Index of feature to split data.
  * @param {Float} Threshold used for splitting.
  * @return {Object} Object containing splitted data ({ lLeftData:, lLeftLabels, lRightData, lRightLabels}).
  */
  this.doSplit = function( lData, lLabels, iFeatureIndex, fThreshold ) {
     var oSplit = { lLeftData: [], lLeftLabels: [], lRightData: [], lRightLabels: [] };

     // Compute split
     for( var i=0; i != lData.length; i++ ) {
       if( lData[ i ][ iFeatureIndex ] <= fThreshold ) {
         oSplit.lLeftData.push( lData[ i ] );
         oSplit.lLeftLabels.push( lLabels[ i ] );
       }
       else {
         oSplit.lRightData.push( lData[ i ] );
         oSplit.lRightLabels.push( lLabels[ i ] );
       }
     }

     return oSplit;
  };

  /**
  * Compute the error (sume over entropy of left and right set) of a given split.
  * @method computeErrorOfSplit
  * @param {Matrix} lData List of data points.
  * @param {Vector} lLabels Labels of each data point.
  * @param {Integer} iFeatureIndex Index of feature to split data.
  * @param {Float} fThreshold Threshold used for splitting.
  * @return {Double} Computed error of the split.
  */
  this.computeErrorOfSplit = function( lData, lLabels, iFeatureIndex, fThreshold ) {
     var fError = 0.0;

     // Do split (only temp)
     var oSplit = this.doSplit( lData, lLabels, iFeatureIndex, fThreshold );

     // Compute error on left & right branch
     return this.computeErrorOfMajorityClassifier( oSplit.lLeftLabels ) + this.computeErrorOfMajorityClassifier( oSplit.lRightLabels );
  };

  /**
  * Compute the error (entropy) of the majority classifier (probabilistic) for a given set of labels.
  * @method computeErrorOfMajorityClassifier
  * @param {Vector} lLabels List of labels (used to fit the majority classifier).
  * @return {Float} Error of the majority classifier.
  */
  this.computeErrorOfMajorityClassifier = function( lLabels ) {
     var fError = 0.0;

     // Compute error
     var oPred = this.majorityClassifier( lLabels );
     for( var i=0; i != this.iNumClasses; i++ ) {
        if( oPred.lPred[ i ] == 1 ) {  // Predicton 100% => single class only! => No error!
          return fError;
        }
     }
     for( var i=0; i != lLabels.length; i++ ) {
        var iLabel = lLabels[ i ];
        fError += oPred.lPred[ iLabel ] * Math.log( oPred.lPred[ iLabel ] );
     }
     fError *= -1.0;

     return fError;
  };

  /**
  * A probabilistic majority classifier over a given set of labels.
  * @method majorityClassifier
  * @param {Vector} lLabel List of labels used to fit the classifier.
  * @return {Object} Classifier as an object of the following format: { lPred, iLabel }.
  */
  this.majorityClassifier = function( lLabels ) {
     var lPred = vml_utils.FillList( this.iNumClasses, 0.0 );
     var iPredClass = 0;

     // Count different class/labels
     for( var i=0; i != lLabels.length; i++ ) {
       lPred[ lLabels[ i ] ] += 1.0;
     }

     // Normalize them to obtain probabilities
     var fBestClassProb = 0;
     for( var i=0; i != this.iNumClasses; i++ ) {
       lPred[ i ] /= lLabels.length;

       if( lPred[ i ] > fBestClassProb ) {
         fBestClassProb = lPred[ i ];
         iPredClass = i;
       }
     }

     return { lPred: lPred, iLabel: iPredClass };
  };
}
