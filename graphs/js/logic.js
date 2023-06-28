const url = "https://data.cdc.gov/resource/y268-sna3.json"

d3.json(url).then(function(data) {
    console.log(data);
});

function init() {
    let dropDownMenu = d3.select("#selDataset");

    d3.json(url).then((data) => {
        let year = data.year; 
        year.forEach((year) => {
            console.log(year);
            
            dropDownMenu.append("option")
            .text(year)
            .property("value", year);
        });

        let sample_one = year[0];
        console.log(sample_one);

        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);
    });
};

function buildMetadata(sample) {
    d3.json(url).then((data) => {
        let metadata = data.metadata; 
        let value = metadata.filter(result => result.id == sample);
        console.log(value)

        let valueData = value[0]; 
        d3.select("#sample-metadata").html("");

        Object.entries(valueData).forEach(([key,value])=> {
            console.log(key,value);
            
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

function buildBarChart(sample) {
    d3.json(url).then((data) => {
        let sampleInfo = data.samples;

        let value = sampleInfo.filter(result => result.year ==sample); 

        let valueData = value[0];

        let state_births = valueData.state_births;
        let state_rates = valueData.state_rates;

        console.log(state_birhts, state_rates);

        let yticks = state_birhts.slice(0,10).slice().reverse();
        let xticks = state_rates.slice(0,10).slice().reverse();

        let trace = {
            x: xticks,
            y: yticks,
            type: "bar", 
            orientation: "h"
        };
        
        let traceData = [trace]

        let layout = {
            title: "Teen Births 1990-2009",
            margin: {
                l: 150,
                r: 20,
                t: 50,
                b: 50
            }
        };

        Plotly.newPlot("bar", traceData, layout)
    });
};

//function buildBubbleChart(sample) {
   // d3.json(url).then((data) => {

        //let sampleInfo = data.samples; 

       //let value = sampleInfo.filter(result => result.id == sample);

       // let valueData = value[0]; 

       // let sample_values = valueData.sample_values;
        //let otu_ids = valueData.otu_ids;
        //let otu_labels = valueData.otu_labels;

       // console.log(sample_values, otu_ids, otu_labels);

       // let trace = {
           // x: otu_ids, 
            //y: sample_values, 
            //text: otu_labels,
            //mode: "markers", 
            //marker: {
                //size: sample_values,
//                 color: otu_ids, 
//                 colorscale: "Earth"
//             }
//         };

//         let traceData = [trace]

//         let layout = {
//             title: "Bacteria Per Sample", 
//             hovermode: "closest", 
//             xaxis: {title: "OTU ID"},
//             height: 600,
//             width: 1000
//         };

//         Plotly.newPlot("bubble", traceData, layout)
//     });
// };

function optionChanged(value) {
    console.log(value); 

    buildMetadata(value);
    buildBarChart(value); 
    //buildBubbleChart(value); 
};

init(); 