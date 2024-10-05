// Build the metadata panel
function buildMetadata(sample) 
{
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field 
    let demo_info = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let results = demo_info.filter(id => id.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    d3.select('#sample-metadata').text('');

    // Use `.html("") to clear any existing metadata
    let sample_metadata = d3.select('#sample-metadata').html('');

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(results[0]).forEach(([key, value]) => 
    {
      sample_metadata.append("h5").text(`${key}: ${value}`);
    });

  });
}

// function to build both charts
function buildCharts(sample) 
{
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let id = samples.filter(take => take.id == sample);

    // Get the otu_ids, otu_labels, and sample_values
    let sample_values = id[0].sample_values; 
    let otu_ids = id[0].otu_ids; 
    let otu_labels = id[0].otu_labels; 

    // Build a Bubble Chart
    let bubble_chart = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        colorscale: 'Earth',
        size: sample_values
      }
    }]

    // Render the Bubble Chart
    let bubble_layout = {
      title: 'Bubble Chart',
      height: 500,
      width: 1000,
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of bacteria", range: [Math.min(...sample_values) - 10, Math.max(...sample_values) + 100] } 
    };
    Plotly.newPlot('bubble', bubble_chart, bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let bar_data = [{
      type: 'bar',
      x: sample_values.slice(0,10).reverse(),
      y: otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse(),
      text: otu_labels,
      orientation: 'h'
    }];

    // Render the Bar Chart
    let bar_layout = 
    {
      title: 'Bar Chart',
      height: 400,
      width: 1000            
    };  
    Plotly.newPlot('bar', bar_data, bar_layout);

  });
}

// Function to run on page load
function init() 
{
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sample_ids = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    console.log(sample_ids);
      for (id of sample_ids)
        {
        dropdown.append("option").text(id).property("value");
        };

    // Get the first sample from the list
    let first_entry = sample_ids[0];
    console.log(first_entry);

    // Build charts and metadata panel with the first sample
    buildMetadata(first_entry);
    buildCharts(first_entry);
  });
}

// Function for event listener
function optionChanged(newSample) 
{
  // Build charts and metadata panel each time a new sample is selected
  console.log(newSample);
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
