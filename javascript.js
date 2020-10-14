let health;
d3.csv('wealth-health-2014.csv', d3.autoType).then(data=>{
    health=data;
    console.log('health', data);
    chart(health);
})

function chart(health) {
    const margin = {top:20, left:40, bottom:40, right:20};
    const width = 650 - margin.left - margin.right; 
    const height = 500 - margin.top - margin.bottom; 
    const svg = d3.select('.chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate('+margin.left+','+margin.top+')')
        //.attr('transform', 'translate('+margin.top+','+margin.bottom+')')

    const xScale = d3.scaleLog()
        .domain(d3.extent(health, d=>d.Income))
        .range([0,width])

    const yScale = d3.scaleLinear()
        .domain(d3.extent(health, d=>d.LifeExpectancy))
        .range([height,0])  
 

    colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    var regionSet = new Set();
    for(var i = 0; i < health.length; i++){
      regionSet.add(health[i].Region);
    };

    var regions = Array.from(regionSet);
    var ordinal = d3.scaleOrdinal()
      .domain(regions)
      .range(d3.schemeCategory10);
    
    var radiusScale = d3.scaleSqrt()
        .domain([0, 5e8])
        .range([2, 40])
    
    health.sort(function(a,b){
			return b.Population-a.Population;
	});

    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5,'s');

    svg.append('g')
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`)

    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(5,'s');

    svg.append('g')
        .call(yAxis)

    svg.selectAll('.income')
        .data(health)
        .enter()
        .append('circle')
        .attr('cx', d=>xScale(d.Income))
        .attr('cy', d=>yScale(d.LifeExpectancy))
        .attr("r", function(d) { 
            return radiusScale(d.Population); 
        })
        .style("stroke",'black')
        .style("fill", function(d) { 
            return ordinal(d.Region); 
        })
        .style("opacity", 0.75)
        .on("mouseenter", (event, d) => {
            const pos = d3.pointer(event, window);
            d3.select('.tooltip')
                .style("left", pos[0] + "px")
                .style("top", pos[1] + "px")
                .classed("hidden", false);
            document.getElementById('country').innerHTML =d.Country; 
            document.getElementById('life').innerHTML =d.LifeExpectancy;      
            document.getElementById('income').innerHTML =d.Income;  
            document.getElementById('population').innerHTML =d.Population;  
            document.getElementById('region').innerHTML =d.Region;  
            
        })
        .on("mouseleave", (event, d) => {
            d3.select(".tooltip").classed("hidden", true);
        });

    svg.append('text')
        .attr('x',width-35)
        .attr('y',height+30)
        .text('Income');

    svg.append('text')
        .attr('x',-150)
        .attr('y',-25)
        .text('Life Expectancy (years)')
        .attr("transform", "rotate(-90)");

    svg.selectAll('.legend')
        .data(regions)
        .enter()
        .append('rect')
        .style("stroke",'black')
        .style("fill", ordinal)
        .attr('width', 10)
        .attr('height', 10)
        .attr('x', 450)
        .attr('y', function(d,i){
            return 350+i*10;
        })

    svg.selectAll('legend')
        .data(regions)
        .enter()
        .append('text')
        .text(d=>d)                                     
        .attr('x', 465)
        .attr('y', function(d,i){
            return 360+i*10;
        })
       .attr('font-size',12);
 

    
}