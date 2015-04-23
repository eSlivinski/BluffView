
  // Initialize the SVG layer
  map._initPathRoot()    

  var svg = d3.select("#map").select("svg"),
        g = svg.append("g");


  var transform = d3.geo.transform({point: projectPoint}),
      path = d3.geo.path().projection(transform);




  d3.json("data/bluffToe.json", function(collection){

    var feature = g.selectAll("path")
        .data(collection.features)
        .enter().append("path")
        .attr('id', function(d){return ""+d.properties.sort+"_"+d.properties.year+""})
        .attr('class', function(d){return d.properties.sort+' '+d.properties.year+""})
        .attr('year', function(d){return d.properties.year})
        .attr('sort', function(d){return d.properties.sort})
        .attr('stroke-width', 1)
        .attr('stroke-opacity', function(d){return showFeatures(d.properties.year)});

        
        
        map.on("viewreset", reset);

        
        reset();
        // Reposition the SVG to cover the features.
        function reset() {
          feature.attr("d", path);
        }


        makeFeatures("2010", 50)


                  
  });
  d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };
  d3.selection.prototype.moveToBack = function() { 
      return this.each(function() { 
          var firstChild = this.parentNode.firstChild; 
          if (firstChild) { 
              this.parentNode.insertBefore(this, firstChild); 
          } 
      }); 
  };


  d3.json("data/GIS/wi2.json", function(error, topology) {
    var centers=[];

    var counties= svg.selectAll("path")
        .data(topojson.feature(topology, topology.objects.counties).features)
        .enter().append("path")
        .attr("d", path)
        .attr('stroke-width', function(d){
          centers.push({
            name:d.properties.CTY_NAME,
            center:map.containerPointToLatLng(path.centroid(d))
          });
          return (d.properties.CTY_NAME=="Ozaukee")?4:1})
        .attr('stroke-opacity', .8)
        .attr('fill-opacity', 0)
        .attr('stroke', 'white')
        .attr('class', 'wi')
        .call(sendToBack)
        .call(addLabels, centers)
        map.on("viewreset", reset);

        reset();
        // Reposition the SVG to cover the features.
        function reset() {
          counties.attr("d", path);
        }


  });
  function sendToBack(){
    d3.selectAll('.wi').moveToBack()
  }


  function addLabels(error, centers){
    labels= svg.selectAll('text')
      .data(centers)
      .enter().append('text')
      .text(function(d){return d.name})
      .attr('x', function(d){return d.center[1]})
      .attr('y', function(d){return d.center[0]})
      .attr('fill', 'white')
      .attr('opacity', 1)
      .attr('class', 'labels')
      .attr('font-size', 20)
      .attr('text-anchor', 'middle')
      map.on("viewreset", update);

        /* Reposition the Points */
        function update(){
          labels.attr("x",function(d) { return map.latLngToLayerPoint(d.center).x})
          labels.attr("y",function(d) { return map.latLngToLayerPoint(d.center).y})

        }
        update();

  }




    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip")
        .style("color", "white")
        .style("opacity", 1);


  function makeHalos(year){
    refernceFeatures = d3.selectAll('#Toe_'+year+', #Top_'+year+'')
    refernceFeatures.each(function(){
      target = d3.select(this)
      target_d = d3.select(this).attr("d")
      halo=g.append("path")
            .data(target.data())
            .attr("class", "halo")
            .attr("d", target_d)
            .attr("stroke-width", 15)
            .on("mouseover", function(d){
              d3.selectAll('[year="'+d.properties.year+'"][sort="'+d.properties.sort+'"]').attr("stroke-width", 10)
              return tooltip.style("visibility", "visible").text(d.properties.sort+" "+d.properties.year);})
            .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
            .on("mouseout", function(d){
              d3.selectAll('[year="'+d.properties.year+'"][sort="'+d.properties.sort+'"]').attr("stroke-width", function(){
                return (d3.select(this).attr('class')=='Tween') ? 3 : 1})
                return tooltip.style("visibility", "hidden");
            });

        map.on("viewreset", reset);

        reset();

        function reset(){
          d3.selectAll('.halo')
            .attr("d", path);
        }
    })
   
  }
  function makeFeatures(year, speed, transitionType){
    var startYear = $('.Tween:eq(0)').attr('year'),
        milliseconds=null;

        if (map.getZoom()<14){
          milliseconds= (speed=='fast') ? 1000 :
          (speed=='slow') ? 6000 : speed
        }else if (map.getZoom()<16){
          milliseconds= (speed=='fast') ? 4000 :
          (speed=='slow') ? 8000 : speed
        }else{
          transitionType='fade'
          milliseconds= (speed=='fast') ? 10000 :
          (speed=='slow') ? 20000 : speed
        };
        
        // Geography for the current year
        Toe_d0 = $('#Toe_d0').attr('d'),
        Top_d0 = $('#Top_d0').attr('d'),

        // Geography for the target year
        Toe_d1 = $('#Toe_'+year+'').attr('d'),
        Top_d1 = $('#Top_'+year+'').attr('d');


    $('.Tween').remove()

    // Redraw the Toe / Top
    var Toe = g.append("path")
        .attr('d', Toe_d0)
        .attr('class', 'Tween')
        .attr('year', ''+year+'')
        .attr('sort', 'Toe')
        .attr('id', 'Toe_d0')
        .attr('stroke-width', 3)
        .call(transition, Toe_d0, Toe_d1);


    var Top = g.append("path")
        .attr('d', Top_d0)
        .attr('class', 'Tween')
        .attr('year', ''+year+'')
        .attr('sort', 'Top')
        .attr('id', 'Top_d0')
        .attr('stroke-width', 3)
        .call(transition, Top_d0, Top_d1);

        map.on("viewreset", reset);


        // Reposition the SVG to cover the features.
        function reset() {
          Toe.attr('d', $('#Toe_'+year+'').attr('d'))
          Top.attr('d', $('#Top_'+year+'').attr('d'))
          
        }

        function transition(path, d0, d1) {
          if (transitionType==="fade"){

            path
            .attr("stroke-opacity", 0)
            .attr('d', function(){return d1})
            .transition()
            .duration(function(){return(speed=="fast")?500:3000})
            .attr("stroke-opacity", 1)
          }else{
          path.transition()
              .duration(milliseconds)
              .attrTween("d", pathTween(d1, 1)); // Most precise = 1
          }
        }

        function pathTween(d1, precision) {
          return function() {
            var path0 = this, //HTML path
                path1 = path0.cloneNode(),
                n0 = path0.getTotalLength(),
                n1 = (path1.setAttribute("d", d1), path1).getTotalLength(); //

            // Uniform sampling of distance based on specified precision.
            var distances = [0], i = 0, dt = precision / Math.max(n0, n1);
            while ((i += dt) < 1) distances.push(i);
            distances.push(1);

            // Compute point-interpolators at each distance.
            var points = distances.map(function(t) {
              var p0 = path0.getPointAtLength(t * n0),
                  p1 = path1.getPointAtLength(t * n1);
              return d3.interpolate([p0.x, p0.y], [p1.x, p1.y]);
            });

            return function(t) {
              return t < 1 ? "M" + points.map(function(p) { return p(t); }).join("L") : d1;
            };
          };
        }
        haloPaths()
  }

    // Use Leaflet to implement a D3 geometric transformation.
    function projectPoint(x, y) {
      var point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    };


    function showFeatures(year){

      list=$('.yearSubmenu i.fa-check-square-o').map(function(){
        return parseInt($(this).parent().attr("data"));
      }).get(),

      current= parseInt($('.sliderValue').html())
      answer = (list.indexOf(year)>=0)?1:0;

      return answer
    };


    function toggleOpacity() {


      d3.selectAll('.Toe, .Top').attr("stroke-opacity", function(d){
        

        var currentPath= d3.select(this),
        thisYear= d.properties.year

        answer = showFeatures(thisYear);
        return answer

      });

    }

  function haloPaths(){

      list=$('.yearSubmenu i.fa-check-square-o').map(function(){
        return parseInt($(this).parent().attr("data"));
      }).get();
      
      if (list.indexOf(parseInt($('.sliderValue').html()))<0){
        list.push(parseInt($('.sliderValue').html()))
      }
      // console.log(list, "haloPaths")

      $('.halo').remove()
      $(list).each(function(){
        makeHalos(this)
      })
  };



$('.yearSubmenu').on('click', function(){
  toggleOpacity();
  haloPaths();
})

  