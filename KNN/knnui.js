function vml_KnnUi(){this.oDataGen=null;this.oAlgo=null;this.lGrid=[];this.lCurve=[];this.lDecBound=[];this.Init=function(){this.oDataGen=new vml_DataGen();this.oDataGen.Init(undefined,false);this.oAlgo=new vml_knn();document.getElementById("fitBtn").addEventListener("click",this.Fit.bind(this),false)};this.PlotRegressionCurve=function(){var a=[this.oDataGen.lData[0]];a.push({label:"Regression curve",data:this.lCurve,lines:{show:true}});$.plot("#"+this.oDataGen.strPlotDiv,a,this.oDataGen.oPlotSettings);a.splice(a.length-1,1)};this.PlotDecisionBoundary=function(){var a=new vml_PlotHelper();a.CreateHeatmapScatterPlot(this.lDecBound,[{lData:this.oDataGen.oClassA.Data,name:"Class A",color:"red",size:3.5},{lData:this.oDataGen.oClassB.Data,name:"Class B",color:"black",size:3.5}],"plotArea",0.05)};this.Fit=function(){if(this.oDataGen.oClassA.Data.length>0&&this.oDataGen.oClassB.Data.length==0){this.FitRegression()}else{this.FitClassification()}};this.FitClassification=function(){this.oDataGen.bSingleDataType=false;this.lGrid=vml_utils.BuildGridWithoutBias(-5,5,-5,5,0.05);var e=this.oDataGen.oClassA.Data;var d=this.oDataGen.oClassB.Data;var a=[];var c=[];for(var b=0;b!=e.length;b++){a.push(e[b]);c.push(-1)}for(var b=0;b!=d.length;b++){a.push(d[b]);c.push(1)}this.oAlgo.Init(a,c,this.GetNumberOfNeighbours());this.ComputeDecisionBoundary();this.PlotDecisionBoundary();this.oDataGen.bSingleDataType=false};this.FitRegression=function(){this.oDataGen.bSingleDataType=true;this.lGrid=vml_utils.BuildGrid1d(-5,5);var d=this.oDataGen.oClassA.Data;var a=[];var c=[];for(var b=0;b!=d.length;b++){a.push([d[b][0]]);c.push(d[b][1])}this.oAlgo.Init(a,c,this.GetNumberOfNeighbours());this.ComputeRegressionCurve();this.PlotRegressionCurve();this.oDataGen.bSingleDataType=false};this.ComputeDecisionBoundary=function(){this.lDecBound=[];for(var a=0;a!=this.lGrid.length;a++){var b=this.lGrid[a];var c=this.oAlgo.PredictClassification(b)[0];this.lDecBound.push(b.concat([c]))}};this.ComputeRegressionCurve=function(){this.lCurve=[];for(var b=0;b!=this.lGrid.length;b++){var a=this.lGrid[b];this.lCurve.push([a,this.oAlgo.PredictRegression([a])])}};this.GetNumberOfNeighbours=function(){var a=document.getElementById("k").value;if(a==""||a==undefined){return 1}else{return parseInt(a)}}};