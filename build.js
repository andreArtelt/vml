var runSync = require('child_process').execSync;

runSync('jsdoc -c conf.json');

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" --exclude "../Components/Evaluation/evaluation.js" --exclude "svmui.js" SVM/index_dev.htm --out-html SVM/index.htm', {stdio:[0,1,2]});

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" --exclude "../Components/Evaluation/evaluation.js" --exclude "polynomialRegUi.js" PolynomialRegression/index_dev.htm --out-html PolynomialRegression/index.htm', {stdio:[0,1,2]});

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" --exclude "../Components/Evaluation/evaluation.js" --exclude "perceptronui.js" Perceptron/index_dev.htm --out-html Perceptron/index.htm', {stdio:[0,1,2]});

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" --exclude "../Components/Evaluation/evaluation.js" --exclude "naivebayesui.js" NaiveBayes/index_dev.htm --out-html NaiveBayes/index.htm', {stdio:[0,1,2]});

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" --exclude "../Components/Evaluation/evaluation.js" --exclude "logisticRegressionUi.js" LogisticRegression/index_dev.htm --out-html LogisticRegression/index.htm', {stdio:[0,1,2]});

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" --exclude "../Components/Evaluation/evaluation.js" --exclude "knnui.js" KNN/index_dev.htm --out-html KNN/index.htm', {stdio:[0,1,2]});

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" --exclude "kmeansui.js" KMeans/index_dev.htm --out-html KMeans/index.htm', {stdio:[0,1,2]});

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" --exclude "../Components/TrainingCurvePlot/trainingCurvePlot.js" --exclude "gaussmixtureui.js" GaussMixture/index_dev.htm --out-html GaussMixture/index.htm', {stdio:[0,1,2]});

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" --exclude "../Components/Evaluation/evaluation.js" --exclude "decisionTreeUi.js" DecisionTree/index_dev.htm --out-html DecisionTree/index.htm', {stdio:[0,1,2]});

runSync('vulcanize --exclude "../Libs/" --exclude "../vmljs/" --exclude "../Components/DataGen/dataGen.js" DataGen/index_dev.htm --out-html DataGen/index.htm', {stdio:[0,1,2]});
