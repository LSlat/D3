// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 650;

// Define the chart's margins
var chartMargin = {
  top: 20,
  right: 30,
  bottom: 70,
  left: 50
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select div, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from data.csv
d3.csv("data.csv").then(function(data) {
  // console.log(data); 

  // Cast each data % value as a number
  data.forEach(function(data) {
    data.abbr = data.abbr
    data.poverty = +data.poverty
    data.healthcare = +data.healthcare
    console.log("State:", data.abbr);
    console.log("Poverty%:", data.poverty);
    console.log("Healthcare%:", data.healthcare);
  });

  // scales for chart
  var xScale = d3.scaleLinear()
  .domain([8.5, d3.max(data, d => d.poverty) + 1])
  .range([0, chartWidth]);
  console.log([0, d3.max(data, d => d.poverty)])
  
  var yScale = d3.scaleLinear()
    .domain([3, d3.max(data, d => d.healthcare) + 1])
    .range([chartHeight, 0]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xScale);
  var leftAxis = d3.axisLeft(yScale);

  // Append axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // Create circles
  var circlesGroup = chartGroup.append("g").selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.poverty))
  .attr("cy", d => yScale(d.healthcare))
  .attr("r", "14")
  .attr("fill", "red")
  .attr("opacity",".5");

  var textGroup = chartGroup.append("g").selectAll("text")
  .data(data)
  .enter()
  .append("text")
  .text(function(d) {console.log(d.abbr); return d.abbr})
  .attr("x", d => xScale(d.poverty))
  .attr("y", d => yScale(d.healthcare))
  .attr("text-anchor", "middle");

  // Create axes labels
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - chartMargin.left + 0)
  .attr("x", 0 - (chartHeight / 2))
  .attr("dy", "1em")
  .attr("class", "axisText")
  .text("Lacks Healthcare (%)");

  chartGroup.append("text")
  .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 20})`)
  .attr("class", "axisText")
  .text("In Poverty (%)");

  // Initialize tool tip
  var toolTip = d3.tip()
  .attr("class", "d3-tip")
  .offset([80, -60])
  .html(function(d) {
    return (`${d.abbr}<br>Healthcare: ${d.healthcare}<br>Poverty: ${d.poverty}`);
  });

  // Create tooltip in the chart
  chartGroup.call(toolTip);

  // Create event listeners to display and hide the tooltip
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
    })
  // onmouseout event
  .on("mouseout", function(data, index) {
    toolTip.hide(data);
    });

    textGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
      })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
      });
}); 
