function vml_DataGen(){this.oClassA={Data:[],Symbol:"circle",Label:"Class A",Color:"#FF0000"};this.oClassB={Data:[],Symbol:"circle",Label:"Class B",Color:"#000000"};this.bSingleDataType=false;this.rangeX={min:-5,max:5};this.rangeY={min:-5,max:5};this.bShowAxis=false;this.strPlotDiv="plotArea";this.lData=[{label:this.oClassA.Label,color:this.oClassA.Color,data:this.oClassA.Data,points:{show:true,symbol:this.oClassA.Symbol}},{label:this.oClassB.Label,color:this.oClassB.Color,data:this.oClassB.Data,points:{show:true,symbol:this.oClassB.Symbol}}];this.oPlotSettings={xaxis:this.rangeX,yaxis:this.rangeY,grid:{show:false,clickable:true}};this.Init=function(b,a){dialogPolyfill.registerDialog(document.getElementById("exportDlg"));dialogPolyfill.registerDialog(document.getElementById("importDlg"));document.getElementById("resetBtn").addEventListener("click",this.Reset.bind(this),false);document.getElementById("btnExportToJSON").addEventListener("click",this.ExportJSON.bind(this),false);document.getElementById("btnExportToCSV").addEventListener("click",this.ExportCSV.bind(this),false);document.getElementById("btnImportFromJSON").addEventListener("click",this.ImportJSON.bind(this),false);document.getElementById("btnImportFromCSV").addEventListener("click",this.ImportCSV.bind(this),false);document.getElementById("importCloseBtn").addEventListener("click",this.ImportClose.bind(this),false);document.getElementById("importUpload").addEventListener("change",this.ImportUpload.bind(this),false);if(a==true){this.bSingleDataType=true}else{this.bSingleDataType=false}if(b!=undefined){this.strPlotDiv=b}this.Plot();$("#"+this.strPlotDiv).bind("plotclick",this.PlotClickEvent.bind(this))};this.Plot=function(){this.lData=[{label:this.oClassA.Label,color:this.oClassA.Color,data:this.oClassA.Data,points:{show:true,symbol:this.oClassA.Symbol}}];if(this.bSingleDataType==false){this.lData.push({label:this.oClassB.Label,color:this.oClassB.Color,data:this.oClassB.Data,points:{show:true,symbol:this.oClassB.Symbol}})}$.plot("#"+this.strPlotDiv,this.lData,this.oPlotSettings)};this.PlotClickEvent=function(b,a,c){this.InsertNewDataPoint([a.x,a.y],document.getElementById("genClassA").checked);this.Plot()};this.InsertNewDataPoint=function(a,b){if(b==true){this.oClassA.Data.push(a)}else{this.oClassB.Data.push(a)}};this.ExportDataToJSON=function(){return JSON.stringify([this.oClassA.Data,this.oClassB.Data])};this.ImportDataFromJSON=function(b){var a=JSON.parse(b);this.oClassA.Data=a[0];this.oClassB.Data=a[1]};this.ExportDataToCSV=function(){var c="x, y, t\r\n";var a="";for(var b=0;b!=this.oClassA.Data.length;b++){a+=this.oClassA.Data[b][0]+","+this.oClassA.Data[b][1]+",0\r\n"}for(var b=0;b!=this.oClassB.Data.length;b++){a+=this.oClassB.Data[b][0]+","+this.oClassB.Data[b][1]+",1\r\n"}return c+a};this.ImportDataFromCSV=function(c){this.oClassA.Data=[];this.oClassB.Data=[];var b=c.split("\n");for(var d=1;d!=b.length;d++){if(b[d]==""){continue}var a=b[d].split(",");if(a[2]=="0"){this.oClassA.Data.push([a[0],a[1]])}else{if(a[2]=="1"){this.oClassB.Data.push([a[0],a[1]])}}}};this.ExportJSON=function(){var a=this.ExportDataToJSON();document.getElementById("exportData").value=a;document.getElementById("exportDownloadBtn").setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(a));document.getElementById("exportDownloadBtn").setAttribute("download","data.json");document.getElementById("exportDlg").showModal()};this.ExportCSV=function(){var a=this.ExportDataToCSV();document.getElementById("exportData").value=a;document.getElementById("exportDownloadBtn").setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(a));document.getElementById("exportDownloadBtn").setAttribute("download","data.csv");document.getElementById("exportDlg").showModal()};this.ImportClose=function(){document.getElementById("importDataBtn").removeEventListener("click",this.funcImportEvent,false)};this.ImportJSON=function(){this.funcImportEvent=this.ImportDataJsonBtn.bind(this);document.getElementById("importDataBtn").addEventListener("click",this.funcImportEvent,false);document.getElementById("importData").value="";document.getElementById("importDlg").showModal()};this.ImportCSV=function(){this.funcImportEvent=this.ImportDataCsvBtn.bind(this);document.getElementById("importDataBtn").addEventListener("click",this.funcImportEvent,false);document.getElementById("importData").value="";document.getElementById("importDlg").showModal()};this.ImportUpload=function(a){if(a.target.files.length!=1){return}vml_FileHelper.ReadFileAsStringAsync(a.target.files[0],function(b){document.getElementById("importData").value=b;this.funcImportEvent();document.getElementById("importDlg").close()}.bind(this))};this.ImportDataJsonBtn=function(){var a=document.getElementById("importData").value;this.ImportDataFromJSON(a);this.Plot();this.ImportClose()};this.ImportDataCsvBtn=function(){var a=document.getElementById("importData").value;this.ImportDataFromCSV(a);this.Plot();this.ImportClose()};this.Reset=function(){this.oClassA.Data=[];this.oClassB.Data=[];this.Plot()}};