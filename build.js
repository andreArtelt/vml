var runSync = require('child_process').execSync;

runSync('jsdoc -c conf.json');

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" --exclude "../Components/Evaluation/evaluation.js" --exclude "bayesLinearRegressionUI.js" BayesianLinearRegression/index_dev.htm --out-html BayesianLinearRegression/index.htm', {stdio:[0,1,2]});

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" --exclude "../Components/Evaluation/evaluation.js" --exclude "lvqUI.js" SVM/index_dev.htm --out-html SVM/index.htm', {stdio:[0,1,2]});

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" --exclude "../Components/Evaluation/evaluation.js" --exclude "svmUI.js" LVQ/index_dev.htm --out-html LVQ/index.htm', {stdio:[0,1,2]});

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" --exclude "../Components/Evaluation/evaluation.js" --exclude "polynomialRegUI.js" PolynomialRegression/index_dev.htm --out-html PolynomialRegression/index.htm', {stdio:[0,1,2]});

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" --exclude "../Components/Evaluation/evaluation.js" --exclude "perceptronUI.js" Perceptron/index_dev.htm --out-html Perceptron/index.htm', {stdio:[0,1,2]});

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" --exclude "../Components/Evaluation/evaluation.js" --exclude "naiveBayesUI.js" NaiveBayes/index_dev.htm --out-html NaiveBayes/index.htm', {stdio:[0,1,2]});

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" --exclude "../Components/Evaluation/evaluation.js" --exclude "logisticRegressionUI.js" LogisticRegression/index_dev.htm --out-html LogisticRegression/index.htm', {stdio:[0,1,2]});

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" --exclude "../Components/Evaluation/evaluation.js" --exclude "knnUI.js" KNN/index_dev.htm --out-html KNN/index.htm', {stdio:[0,1,2]});

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" --exclude "kmeansUI.js" KMeans/index_dev.htm --out-html KMeans/index.htm', {stdio:[0,1,2]});

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" --exclude "../Components/TrainingCurvePlot/trainingCurvePlot.js" --exclude "gaussMixtureUI.js" GaussMixture/index_dev.htm --out-html GaussMixture/index.htm', {stdio:[0,1,2]});

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" --exclude "../Components/Evaluation/evaluation.js" --exclude "decisionTreeUI.js" DecisionTree/index_dev.htm --out-html DecisionTree/index.htm', {stdio:[0,1,2]});

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" DataGen/index_dev.htm --out-html DataGen/index.htm', {stdio:[0,1,2]});
