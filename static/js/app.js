
function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("./data/samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildGaugeChart(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();



function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    buildGaugeChart(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("./data/samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }

  
// 1. Create the buildCharts function.
function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("./data/samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
      var samples= data.samples;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var resultsarray= samples.filter(sampleobject => 
          sampleobject.id == sample);
      //  5. Create a variable that holds the first sample in the array.
      var result= resultsarray[0]
    
      var ids = result.otu_ids;
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var labels = result.otu_labels;
      var values = result.sample_values;
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
  
     // var yticks = 
  
      // 8. Create the trace for the bar chart. 
      var bar_data =[
        {
          y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
          x:values.slice(0,10).reverse(),
          text:labels.slice(0,10).reverse(),
          type:"bar",
          orientation:"h"
    
        }
      ];
    
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: { t: 30, l: 150 }
      };
    
      Plotly.newPlot("bar", bar_data, barLayout);
  
      
      var layoutBubble = {
          margin: { t: 0 },
          xaxis: { title: "OTU ID" },
          hovermode: "closest",
        };
        
        var dataBubble = [ 
            {
                x: ids,
                y: values,
                text: labels,
                mode: "markers",
                marker: {
                    color: ids,
                    size: values,
                }
            }
        ];
        
        Plotly.newPlot("bubble", dataBubble, layoutBubble);
        
    });
  }

// Color palette for Gauge Chart
var arrColorsG = ['#4e79a7','#59a14f','#9c755f','#f28e2b','#edc948','#bab0ac','#e15759','#b07aa1','#76b7b2','#ffffff'];

//=============Gauge Chart Function=======================//

function buildGaugeChart(sample) {
  console.log("sample", sample);

  d3.json("./data/samples.json").then(data =>{

    var objs = data.metadata;
    //console.log("objs", objs);

    var matchedSampleObj = objs.filter(sampleData => 
      sampleData["id"] === parseInt(sample));
    //console.log("buildGaugeChart matchedSampleObj", matchedSampleObj);
    var data = matchedSampleObj[0];
    if(data.wfreq === null){
        data.wfreq = 0;
    
      }
    
      let degree = parseInt(data.wfreq) * (180/10);
    
      // Trig to calc meter point
      let degrees = 180 - degree;
      let radius = .5;
      let radians = degrees * Math.PI / 180;
      let x = radius * Math.cos(radians);
      let y = radius * Math.sin(radians);
    
      let mainPath = 'M -.0 -0.025 L .0 0.025 L ',
          pathX = String(x),
          space = ' ',
          pathY = String(y),
          pathEnd = ' Z';
      let path = mainPath.concat(pathX, space, pathY, pathEnd);
      
      let trace = [{ type: 'scatter',
         x: [0], y:[0],
          marker: {size: 50, color:'2F6497'},
          showlegend: false,
          name: 'Washing - Frequency',
          text: data.wfreq,
          hoverinfo: 'text+name'},
        { values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
        rotation: 90,
        text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
        textinfo: 'text',
        textposition:'inside',
        textfont:{
          size : 16,
          },
        marker: {colors:[...arrColorsG]},
        labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '2-1', '0-1',''],
        hoverinfo: 'text',
        hole: .5,
        type: 'pie',
        showlegend: false
      }];
    
      let layout = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '#2F6497',
            line: {
              color: '#2F6497'
            }
          }],
    
        title: '<b>Belly Button - Washing Frequency</b> <br> <b>Weekly Scrubbings</b>',
        height: 550,
        width: 550,
        xaxis: {zeroline:false, showticklabels:false,
                   showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                   showgrid: false, range: [-1, 1]},
      };
    
      Plotly.newPlot('gauge', trace, layout, {responsive: true});

 });   
}

