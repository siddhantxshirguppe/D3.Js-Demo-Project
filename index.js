
var hardCodeDataSet = [8,20,90,40,65];
//sample bitcoin price api 
const api = 'https://api.coindesk.com/v1/bpi/historical/close.json?start=2017-12-31&end=2018-04-01';
var chart_height = 400;
var chart_width = 600;
var margin = { top: 50, right: 20, bottom: 30, left: 50 };
var bar_width = chart_width/hardCodeDataSet.length;
var bar_padding = 20
//--------------------------------------
var vegaLiteSpec = 
{
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "config": {
        "background": "lightgray"  
      },
    "title": {
        "text": "Vegalite Embedded Demo Chart",
        "fontSize": 16
      },
    "height":chart_height,
    "width":chart_width,
    "data": {
        "values": [
            {"category": "type a", "value": 8},
            {"category": "type b", "value": 20},
            {"category": "type c", "value": 90},
            {"category": "type d", "value": 40},
            {"category": "type e", "value": 65},

        ]
    },

    "params": [{
      "name": "highlight",
      "select": {"type": "point", "on": "mouseover"}
    }
    ],

    "mark": {
    "type": "bar",
    "stroke": "black",
    "cursor": "pointer",
    "size": bar_width - bar_padding 
  },

    "encoding": {
        "x": {"field": "category", "type": "ordinal"},
        "y": {"field": "value", "type": "quantitative"},
        
        "color": {
        //works in vega-lite editor but not when embedded in d3. debug this later
        /*
          "condition": {
            "param": "highlight",
            "empty": false,
            "value": "red"
          },
          */
          "value": "yellow"
        }
        

      }
};

//------------------------------

function drawVegaLiteChart(vegaLiteSpec)
{
    var d3_body = d3.select('body');    
    // Select the container div
    var vega_1 = d3_body.select('#vega-container');

    // Embed the Vega-Lite chart in the container
    vegaEmbed(vega_1.node(), vegaLiteSpec);

}

//------------------------------------

function drawHardcodeD3Chart(hardCodeDataSet) 
{
    var d3_body = d3.select('body');  
    var svg_1 = d3_body.select('#svg_1');

    var width = chart_width - margin.left - margin.right;
    var height = chart_height - margin.top - margin.bottom;

    var bar_width = width/hardCodeDataSet.length;
    console.log("bar width:"+bar_width);
    svg_1.style("background-color", 'grey')
    .attr('width',chart_width)
    .attr('height',chart_height);

    var g = svg_1.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var yScale = d3.scaleLinear()
        .domain([0, d3.max(hardCodeDataSet)])
        .range([0,height]);

    //need a seperate scale because axis numbers should start from bottom
    var yAxisScale = d3.scaleLinear()
    .domain([0, d3.max(hardCodeDataSet)])
    .range([height,0]);

    var ordinalValues = ["type A", "type B", "type C", "type D","type E"];
    var xScale = d3.scaleBand()
    .domain(ordinalValues)
    .range([0, width])
    .padding(0.1); 

    console.log("x scale:"+xScale);

/*
    var x_axis = d3.axisBottom()
        .scale(xScale);

    var y_axis = d3.axisLeft()
        .scale(yScale);
*/

    g.append("g")
    .attr("transform", "translate(0," + (height) + ")")
    .call(d3.axisBottom().scale(xScale));


    g.append("g")
        .call(d3.axisLeft().scale(yAxisScale))
        .append("text")
        .attr("fill", "blue")
        .attr("transform", "rotate(-90)")
        .text("Yaxis-values")

    var bars = g.append("g")
    .selectAll('rect')
    .data(hardCodeDataSet)
    .enter()
    .append('rect')
    .attr('y',(d)=>(height-yScale(d)))
    .attr('height',(d)=>(yScale(d)))
    .attr("width", (d)=>(bar_width - bar_padding))
    .classed("bar_style", true)
    .attr("transform", (d, i) => {
        const translate = [bar_width * i, 0];
        return `translate(${translate})`;
    });

    g.append("g")
    .selectAll('text')
    .data(hardCodeDataSet)
    .enter()
    .append('text')
    .text((d)=>{return `${d}`})
    .attr('height',40)
    .attr('width',40)
    .attr('y',(d)=>{return height-yScale(d) + 20})
    .attr('fill','yellow')
    .attr("transform", (d, i) => {
        const translate = [bar_width * i, 0];
        return `translate(${translate})`;
    });

    svg_1.append("text")
    .attr("x", chart_width/ 2)
    .attr("y", 25)
    .attr("text-anchor", "middle") 
    .style("font-size", "24px")
    .classed("chart_title",true)
    .text("Demo hardcoded data D3.js chart");


    d3.selectAll(".bar_style")
        .on('mouseover', function() {
            d3.select(this).style('fill', 'red'); // Change bar color on mouseover
        })
        .on('mouseout', function() {
            d3.select(this).style('fill', 'steelblue'); // Change bar color back on mouseout
        });

}

//----------------------------------------------

function drawBitcoinDataD3Chart(bitcoinAPI)
{
    document.addEventListener("DOMContentLoaded", function(event) {
        fetch(bitcoinAPI)
            .then(function(response) { return response.json(); })
            .then(function(data) {
                var parsedData = parseData(data);
                drawChart(parsedData);
            })
            .catch(function(err) { console.log(err); })
        });
}


function parseData(data) {
    var arr = [];
    for (var i in data.bpi) {
        arr.push({
            date: new Date(i), 
            value: +data.bpi[i] 
        });
    }
    return arr;
}


function drawChart(data) {

    var width = chart_width - margin.left - margin.right;
    var height = chart_height - margin.top - margin.bottom;

    var svg_2 = d3.select('#svg_2')
        .attr("width", chart_width)
        .attr("height", chart_height);

        svg_2.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "grey");
    
    svg_2.append("text")
    .attr("x", chart_width/ 2)
    .attr("y", 25)
    .attr("text-anchor", "middle") 
    .style("font-size", "24px")
    .classed("chart_title",true)
    .text("Demo bitcoin api D3.js chart");

    var g = svg_2.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x_scale = d3.scaleTime()
        .rangeRound([0, width])
        .domain(d3.extent(data, function(d) { return d.date }));

    var y_scale = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain(d3.extent(data, function(d) { return d.value }));


    var line = d3.line()
        .x(function(d) { return x_scale(d.date)})
        .y(function(d) { return y_scale(d.value)});

    //append the x and y axis 

    g.append("g")
        .attr("transform", "translate(0," + (height) + ")")
        .call(d3.axisBottom(x_scale))


    g.append("g")
        .call(d3.axisLeft(y_scale))
        .append("text")
        .attr("fill", "blue")
        .attr("transform", "rotate(-90)")
        .text("Price ($)")

    //apend the line chart
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);


    //append the data point circles marks 
    var originalRadius = 4;

    g.append("g")
        .selectAll(".data-point")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return x_scale(d.date); })
        .attr("cy", function(d) { return y_scale(d.value); })
        .attr("r", originalRadius)  // Radius of the circle
        .attr("fill", "green");

    var circles_group = g.selectAll("circle");

    //setup mouse hover actions

    circles_group.on("mouseover", function() {
        console.log("inside mouseover");
            var circle = d3.select(this);
            
            circle.attr("r", originalRadius + 5)
            .attr("fill", "yellow");
        })
        .on("mouseout", function() {
            var circle = d3.select(this);
            circle.attr("r", originalRadius)
            .attr("fill", "green");// Restore the original circle radius
        });

        console.log("mouse on points!!");

}


//--------draw functions---------

//drawing the vegaLite spec chart
drawVegaLiteChart(vegaLiteSpec);

//drawing the hardcoded d3 chart
drawHardcodeD3Chart(hardCodeDataSet);

//drawing the bitcoin api d3 chart
drawBitcoinDataD3Chart(api);





