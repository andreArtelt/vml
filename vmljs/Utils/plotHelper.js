// plotHelper.js
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
* Implementation of ploting.
* @class vml_PlotHelper
* @constructor
*/
function vml_PlotHelper() {
  /**
  * Create a combination of heatmap and scatter (optional) plot.
  * @method CreateHeatmapScatterPlot
  * @param {Matrix} lHeatData List of 3d (third dimension = color) data points.
  * @param {[Object]} lScatter List of data for scatter plot (each entry is an object of the following form: {lData, strName, strColor, fSize}).
  * @param {String} strDiv Id of cotnainer of plot.
  * @param {Float} fStepSize Distance between two values in the heatmap (heatmap is a simple grid hence fStepSize corresponds to the cell size).
  */
  this.CreateHeatmapScatterPlot = function( lHeatData, lScatter, strDiv, fStepSize ) {
    // Remove current plot
    document.getElementById( strDiv ).innerHTML = "";

    // Mapping to new coordinate system
    var x = d3.scale.linear( )
     .domain( [-5, 5] )
     .rangeRound( [0, 800] );

    var y = d3.scale.linear( )
     .domain( [ -5, 5 ] )
     .rangeRound( [ 0, 600 ] );

     var z = d3.scale.linear()
        .domain( [ 0.0, 0.5, 1.0 ] )
        .range( [ "#ff8080", "white", "blue" ]);

     var fWidth = 800 * fStepSize * 0.1;
     var fHeight = 600 * fStepSize * 0.1;

     // Draw heatmap (using canvas for better performance)
     document.getElementById( strDiv ).innerHTML = '<canvas id="HeatmapScatterPlot" width="800" height="600"></canvas>';
     var oCanvas = document.getElementById( "HeatmapScatterPlot" );
     var ctx = oCanvas.getContext( '2d' );

     for( var i=0; i != lHeatData.length; i++ ) {
       var vecX = x( lHeatData[ i ][ 0 ] );
       var vecY = y( -1.0 * lHeatData[ i ][ 1 ] ) - fHeight;
       ctx.fillStyle = d3.rgb( z( 1.0 - lHeatData[ i ][ 2 ] ) );
       ctx.fillRect( vecX, vecY, fWidth, fHeight );
      }

     // Draw scatter plot
     for( var i=0; i != lScatter.length; i++ ) {
       ctx.fillStyle = lScatter[ i ].color;
       ctx.strokeStyle = lScatter[ i ].color; 

       var r = lScatter[ i ].size;
       for( var j=0; j != lScatter[ i ].lData.length; j++ ) {
         var vecX = x( lScatter[ i ].lData[ j ][ 0 ] );
         var vecY = y( -1.0 * lScatter[ i ].lData[ j ][ 1 ] );

         if( lScatter[ i ].symbol == "circle" ) {
           ctx.beginPath();
           ctx.arc( vecX, vecY, r, 0, Math.PI * 2, false );
           ctx.closePath();
           ctx.fill();
         }
         else if( lScatter[ i ].symbol == "cross" ) {
           ctx.beginPath();
           ctx.moveTo( vecX, vecY );
           ctx.lineTo( vecX + 10, vecY );
           ctx.stroke();
           ctx.moveTo( vecX, vecY );
           ctx.lineTo( vecX - 10, vecY );
           ctx.stroke();
           ctx.moveTo( vecX, vecY );
           ctx.lineTo( vecX, vecY + 10 );
           ctx.stroke();
           ctx.moveTo( vecX, vecY );
           ctx.lineTo( vecX, vecY - 10 );
           ctx.stroke();
         }
         else {
           throw "Invalid symbol";
         }
       }
     }
  };

  // lScatter: {lData, name, color, size, symbol}
  this.CreateHeatmap2 = function( lData, lHeat, lScatter, strDiv ) {
    var lPlotData = [];

    // Build headmap
    var oHeatmap = { type: 'heatmap', x: [], y: [], z: [], showscale: false, connectgaps: true, hoverinfo: 'none' };

    for( var i=0; i != lData.length; i++ ) {
      oHeatmap.x.push( lData[ i ][ 0 ] );
      oHeatmap.y.push( lData[ i ][ 1 ] );
      oHeatmap.z.push( lHeat[ i ] );
    }

    lPlotData.push( oHeatmap );

    // Optional: Build scatter plot
    for( var i=0; i != lScatter.length; i++ ) {
      var oScatter = { x: [], y: [], mode: 'markers', type: 'scatter'/*, name: lScatter[ i ].name*/, hoverinfo: 'none', showlegend: false,
                       marker: {size: lScatter[ i ].size, color: lScatter[ i ].color }, symbol: lScatter[ i ].symbol };

      for( var j=0; j != lScatter[ i ].lData.length; j++ ) {
        oScatter.x.push( lScatter[ i ].lData[ j ][ 0 ] );
        oScatter.y.push( lScatter[ i ].lData[ j ][ 1 ] );
      }

      lPlotData.push( oScatter );
    }

    // Build some settings
    var oLayout = { showgrid: false, xaxis: {showgrid: false, showline: false, zeroline: false, showticklabels: false, ticks: '', width: 800, height: 600, autosize: false},
                    yaxis: {showgrid: false, showline: false, zeroline: false, showticklabels: false, ticks: '', height: 600, width: 800, autosize: false}, width: 800, height: 600,
                    hovermode: false, margin: { b: 0, l: 0, r: 0, t: 0, autoexpand: false } };

    // Plot
    document.getElementById( strDiv ).innerHTML = "";
    Plotly.newPlot( strDiv, lPlotData, oLayout );
  };


  this.CreateScatterPlot = function() {

  };
}
