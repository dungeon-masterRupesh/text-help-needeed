var coin = document.getElementById('coin');
var button = document.getElementById('button');
var multiple = document.getElementById('multiple');
var reset = document.getElementById('reset');
var result = document.getElementById('result');
var headsCounter = document.getElementById('headsCounter');
var TailsCounter = document.getElementById('TailsCounter');
function round(n1,n2){
  return Math.round(n1*Math.pow(10,n2))/Math.pow(10,n2);
}
var cointimes=[0,0];
var probTheo=[.5,.5];
headsCounter.innerHTML = '<h1> Number of heads: ' + cointimes[0] + '</h1>';
tailsCounter.innerHTML = '<h1> Number of tails: ' + cointimes[1] + '</h1>';
/* On click of button spin coin ainamtion */
function coinToss() {
  /* Random number 0 or 1  */
  var x = Math.floor(Math.random() * 2);
  result.innerHTML = '';
  /* If statement */
  if (x === 0) {
  	coin.innerHTML = '<img id="tail" class="tailsCounter animate-coint" src="https://upload.wikimedia.org/wikipedia/en/d/d8/British_fifty_pence_coin_2015_reverse.png"/> <img id="heads" class="heads animate-coinh" src="https://upload.wikimedia.org/wikipedia/en/5/52/British_fifty_pence_coin_2015_obverse.png"/>';
    window.setTimeout(function(){cointimes[0] += 1;
    result.innerHTML = 'You got heads';
    headsCounter.innerHTML = '<h1> Number of heads: ' + cointimes[0] + '</h1>';
  updateCoin();},1600);
  } else {
  coin.innerHTML = '<img id="head" class="heads animate-coinh" src="https://upload.wikimedia.org/wikipedia/en/5/52/British_fifty_pence_coin_2015_obverse.png"/><img id="tails" class="tails animate-coint" src="https://upload.wikimedia.org/wikipedia/en/d/d8/British_fifty_pence_coin_2015_reverse.png"/>';
   window.setTimeout(function(){cointimes[1] += 1;
    result.innerHTML = 'You got tails';
     tailsCounter.innerHTML = '<h1> Number of tails: ' + cointimes[1] + '</h1>';
    updateCoin();},1600);

}
}
function multipletoss(animation,times){
	//the animation feature not yet implemented
	if (animation){
		var a=0;
		while(a<times){
			coinToss();
			a++;
		}
	}
	//without animation
	else{
		var count = 0;
    var interval = setInterval(function() {
    var x = Math.floor(Math.random() * 2);
    if (x === 0) { cointimes[0]++;}
      else{
        cointimes[1]++;
      }
      count++;
      headsCounter.innerHTML=count;
      updateCoin();
      if (count === times){
          window.clearInterval(this);
        }
  }, 100);
	headsCounter.innerHTML = '<h1> Number of heads: ' + cointimes[0] + '</h1>';
	tailsCounter.innerHTML = '<h1> Number of tails: ' + cointimes[1] + '</h1>';
}
}
//function for reset
function restart() {
	cointimes[0] = 0;
	cointimes[1] = 0;
	result.innerHTML = '';
	headsCounter.innerHTML = '';
	tailsCounter.innerHTML = '';
	coin.innerHTML = '';
}
button.onclick = function() {
  coinToss();
}
//Tosses coin multiple times
multiple.onclick = function() {
  var times = prompt("Enter no. of flips");
  //var animation = confirm("Click Ok to show all animations or cancel to show final result");
  multipletoss(false,times);
}
//the animation feature is not currently implemented
//resets the page
reset.onclick = function() {
  restart();
}
//for graph
var coinData = [{data:[{value:0,side:'head'},{value:0,side:'tail'}],state:'Observed'},
        {data:[{value:probTheo[0],side:'head'},{value:probTheo[1],side:'tail'}],state:'Theoretical'}];
//Create SVG
var svgCoin = d3.select("#graphs").append("svg").attr("height",500).attr("width","100%");;

//Create Container
var containerCoin = svgCoin.append('g').attr("height","100%").attr("width","100%");
var yScaleCoin = d3.scale.linear().domain([0,1]).range([0,250]);
var x0ScaleCoin = d3.scale.ordinal().domain(['Observed','Theoretical']).rangeRoundBands([0, 400]);
var x1ScaleCoin = d3.scale.ordinal().domain(['head','tail']).rangeRoundBands([0, 100]);
var states = containerCoin.selectAll("g.state").data(coinData).enter().append("g").attr("class", "state");
var rects = states.selectAll("rect").data(function(d) { return d.data; }).enter().append("rect");
var sides = states.selectAll("image").data(function(d) { return d.data; }).enter().append("image");
var axisCoin = svgCoin.append("g").attr("class", "x axis");
var xAxisCoin = d3.svg.axis().scale(x0ScaleCoin).orient("bottom").ticks(0);
var tipCoinObs = d3.tip().attr('id', 'tipCoinObs').attr('class', 'd3-tip').offset([-10, 0]);
var tipCoinTheo = d3.tip().attr('id','tipCoinTheo').attr('class', 'd3-tip').offset([-10, 0]);
function updateCoin() {
  var total = Math.max(1,cointimes[0]+cointimes[1]);
  var probObs = [cointimes[0]/total,cointimes[1]/total];
  coinData[0].data[0].value = probObs[0];
  coinData[0].data[1].value = probObs[1];
  coinData[1].data[0].value = probTheo[0];
  coinData[1].data[1].value = probTheo[1];
  tipCoinObs.html(function(d) { return round(d.value,3) +' = '+d.value*total+'/'+total;});
  tipCoinTheo.html(function(d,i) { return round(d.value,3);});

  states
    .attr("transform", function(d) { return "translate(" + x0ScaleCoin(d.state) + "," + 80 + ")"; })
    .attr("class", function(d) { return d.state; });
  rects
    .transition() // NEW
    .duration(50)
    .attr("width", x1ScaleCoin.rangeBand())
    .attr("x", function(d,i) { return x1ScaleCoin(d.side)+i*20+100; })
    .attr("y", function(d) { return yScaleCoin(1-d.value); })
    .attr("height", function(d) { return yScaleCoin(d.value); })
    .attr("class", function(d) { return d.side; });
containerCoin.selectAll('g.Observed rect').each(function(){
    d3.select(this).on('mouseover', tipCoinObs.show).on('mouseout', tipCoinObs.hide);
  })
  containerCoin.selectAll('g.Theoretical rect').each(function(){
    d3.select(this).on('mousedown', function(d){tipCoinTheo.show(d,this)})
            .on('mouseover', function(d){tipCoinTheo.show(d,this)})
            .on('mouseout', tipCoinTheo.hide)
  })
}
updateCoin();
var width = d3.select('#graphs').node().clientWidth;
axisCoin.attr("transform", "translate(" + 50 + "," + 330 + ")").call(xAxisCoin);
svgCoin.attr("width", width).attr("height", 550).call(tipCoinObs).call(tipCoinTheo);





///
$(window).load(function () {
  drawCP();
  //drawComb();
  //drawSet();
});

//Handles Window Resize
$(window).on("resize", function () {
  drawCP();
  //drawComb();
  //drawSet();
});
var currentPerspective = 'universe'
var radius = 5;
var eventsData = [
        { x: 1/6, y: 0.2, width: 1/2, height: 0.05, name: 'A' },
        { x: 1/3, y: 0.4, width: 1/2, height: 0.05, name: 'B' },
        { x: 1/2, y: 0.6, width: 1/2, height: 0.05, name: 'C' }
    ];
var mapper = {0: "P(A)", 1: "P(B)", 2: "P(C)"};
//var m = document.getElementsByClassName(A);
//Create SVG
var svgBallCP = d3.select('#svgBallCP').append('svg');
var svgProbCP = d3.select('#svgProbCP').append('svg');

//Create Clip Path
var clipCP = svgBallCP.append("clipPath").attr("id", "viewCP").append("rect");

//Create Container
var containerBallCP = svgBallCP.append('g').attr("clip-path", "url(#viewCP)");
var containerProbCP = svgProbCP.append('g');

//Create Scales
var xScaleCP = d3.scale.linear().domain([0, 1]);
var xWidthCP = d3.scale.linear().domain([0, 1]);
var yScaleCP = d3.scale.linear().domain([0, 1]);

var xScaleProbCP = d3.scale.ordinal().domain([0,1,2]);
var yScaleProbCP = d3.scale.linear().domain([0, 1]);


//Drag Functions
var dragRect = d3.behavior.drag()
         .origin(function() { return {x: d3.select(this).attr("x"),y:0};})
         .on('dragstart', function(){d3.select(this.parentNode).moveToFront();})

         .on('drag', function(d,i) {
            var x = Math.max(0,Math.min(xScaleCP.invert(d3.event.x),(1-eventsData[i].width)));
            eventsData[i].x = x;
            changePerspective(currentPerspective);
            updateRects(0);
          })
var dragLeft = d3.behavior.drag()
         .on('dragstart', function(){d3.select(this).moveToFront();})
         .on('drag', function(d,i) {
            var x = Math.max(0,Math.min(xScaleCP.invert(d3.event.x),(eventsData[i].x+eventsData[i].width),1));
            var change = eventsData[i].x - x;
            eventsData[i].x = x;
            eventsData[i].width = Math.max(0,eventsData[i].width + change);
            changePerspective(currentPerspective);
            updateRects(0);
         })
var dragRight = d3.behavior.drag()
         .on('dragstart', function(){d3.select(this).moveToFront();})
         .on('drag', function(d,i) {
            var w = Math.max(0,Math.min(xScaleCP.invert(d3.event.x)-eventsData[i].x,(1-eventsData[i].x)));
            eventsData[i].width = w;
            changePerspective(currentPerspective);
            updateRects(0);
         })

//Tool tip for Prob
var tipCP = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d,i) {
                var prob = calcOverlap(i,currentPerspective)/(xWidthCP.domain()[1]);
                return round(prob,2);});

//Ball SVG elements
var events = containerBallCP.selectAll('g.event').data(eventsData).enter().append('g').attr('class', 'event');

var rects = events.append('rect').attr('class', function(d){ return (d.name + ' shelf') }).call(dragRect);

var leftBorders = events.append('line').attr('class', function(d){ return (d.name + ' border') }).call(dragLeft);

var rightBorders = events.append('line').attr('class', function(d){ return (d.name + ' border') }).call(dragRight);

var texts = events.append('text').text(function(d){ return d.name }).attr('class', function(d){ return d.name + ' label'});

var circles = containerBallCP.append("g").attr("class", "ball").moveToBack();

//Prob SVG elements
var probEvents = containerProbCP.selectAll('g.event').data(eventsData).enter().append('g').attr('class', 'event');

var probRects = probEvents.append('rect').attr('class', function(d){ return (d.name + ' probability') }).on("mouseover", function(d,i) { tipCP.show(d,i);}).on("mouseout", function() { tipCP.hide();});;

var probAxis = containerProbCP.append("g").attr("class", "x axis");

var xAxis = d3.svg.axis().scale(xScaleProbCP).orient("top").tickFormat(function (d) { return mapper[d]});


//Updates positions of rectangles and lines
function updateRects(dur) {
  rects.transition().duration(dur)
    .attr('x', function(d){ return xScaleCP(d.x) })
    .attr('y', function(d){ return yScaleCP(d.y) })
    .attr('width', function(d){ return xWidthCP(d.width) })
    .attr('height', function(d){ return yScaleCP(d.height) });

  leftBorders.transition().duration(dur)
    .attr('x1', function(d){ return xScaleCP(d.x) })
    .attr('y1', function(d){ return yScaleCP(d.y) })
    .attr('x2', function(d){ return xScaleCP(d.x) })
    .attr('y2', function(d){ return yScaleCP(d.y+d.height) });

  rightBorders.transition().duration(dur)
    .attr('x1', function(d){ return xScaleCP(d.x+d.width) })
    .attr('y1', function(d){ return yScaleCP(d.y) })
    .attr('x2', function(d){ return xScaleCP(d.x+d.width) })
    .attr('y2', function(d){ return yScaleCP(d.y+d.height) });

  texts.transition().duration(dur)
    .attr('x', function(d){ return xScaleCP(d.x + d.width/2) })
    .attr('y', function(d){ return yScaleCP(d.y + d.height + 0.05) });

  circles.selectAll('g').each(function(){
    d3.select(this).transition().duration(dur)
      .attr('transform', function(d){return 'translate(' + xScaleCP(d.p) + ',0)'});
  })

  probRects.transition().duration(dur)
    .attr('x', function(d,i){ return xScaleProbCP(i); })
    .attr('y', function(d,i){ return yScaleProbCP(calcOverlap(i,currentPerspective)/xWidthCP.domain()[1]); })
    .attr('width', function(d,i){ return xScaleProbCP.rangeBand(); })
    .attr('height', function(d,i){ return yScaleProbCP(1-calcOverlap(i,currentPerspective)/xWidthCP.domain()[1]); });

  //calcIndependence();
}

//Drops ball randomly from 0 to 1
function addBall(data){
  var dur = 1000;
  var p = Math.random();
  var pos = [{t: 0}, {t: 1}];
  var a, b, c, events = [];
  var bisector = d3.bisector(function(d){ return d.t }).right

  if(data[0].x <= p && p <= data[0].x + data[0].width) a = data[0]
  if(data[1].x <= p && p <= data[1].x + data[1].width) b = data[1]
  if(data[2].x <= p && p <= data[2].x + data[2].width) c = data[2]
  if(a) pos.splice(bisector(pos) - 1, 0, { t: a.y, event: a.name})
  if(b) pos.splice(bisector(pos) - 1, 0, { t: b.y, event: b.name})
  if(c) pos.splice(bisector(pos) - 1, 0, { t: c.y, event: c.name})
  if(a) events.push(a)
  if(b) events.push(b)
  if(c) events.push(c)
  var g = circles.append('g').datum({p: p, events: events })
      .attr('transform', function(d){return 'translate(' + xScaleCP(d.p) + ',0)'})
  var circle = g.append('circle')
                .attr('r', radius)
                .attr('cy', function(){ return yScaleCP(0) });

  pos.forEach(function(d, i){
    if(i === 0) return
    var dt = pos[i].t - pos[i - 1].t
    circle = circle
      .transition()
      .duration(dur * dt)
      .ease('bounce')
      .attr('cy', function(){ return yScaleCP(d.t) })
      .each('end', function(){ if(d.event) d3.select(this).classed(d.event, true) })
  })
  circle.each('end', function(d){
    d3.select(this.parentNode).remove();
  })
}

//Start and Stop ball sampling
var interval;
function start() {
  interval = setInterval(function() {
    addBall(eventsData);
  }, 1);
}
function stop() {
  clearInterval(interval);
}

//Handles start and stop buttons
$('.ballBtns').on('click', function(){
  var button = d3.select(this).attr('id');
  if(button=='start') start();
  if(button=='stop')  stop();
  $('#start').toggle();
  $('#stop').toggle();
})

//Handle Perspective Buttons
$('.perspective').on('click', function(){
  $('#'+currentPerspective).toggleClass('active');
  $(this).toggleClass('active');
  changePerspective(d3.select(this).attr('id'));
  updateRects(1000);
})

//Changes Perspective
function changePerspective(p){
  if(p=='a' && eventsData[0].width) {
    xScaleCP.domain([eventsData[0].x,(eventsData[0].x+eventsData[0].width)]);
    xWidthCP.domain([0,eventsData[0].width]);
    currentPerspective = 'a';
    mapper = {0: "P(A|A)", 1: "P(B|A)", 2: "P(C|A)"};
  } else if(p=='b' && eventsData[1].width) {
    xScaleCP.domain([eventsData[1].x,(eventsData[1].x+eventsData[1].width)]);
    xWidthCP.domain([0,eventsData[1].width]);
    currentPerspective = 'b';
    mapper = {0: "P(A|B)", 1: "P(B|B)", 2: "P(C|B)"};
  } else if(p=='c' && eventsData[2].width) {
    xScaleCP.domain([eventsData[2].x,(eventsData[2].x+eventsData[2].width)]);
    xWidthCP.domain([0,eventsData[2].width]);
    currentPerspective = 'c';
    mapper = {0: "P(A|C)", 1: "P(B|C)", 2: "P(C|C)"};
  } else if (p=='universe') {
    xScaleCP.domain([0,1]);
    xWidthCP.domain([0,1]);
    currentPerspective = 'universe';
    mapper = {0: "P(A)", 1: "P(B)", 2: "P(C)"};
  }
  probAxis.call(xAxis);
}


//Calculates overlap of rectangles
function calcOverlap(index, perspective){
  var a1,a2;
  if(perspective=='a') {
    a1 = eventsData[0].x;
    a2 = a1 + eventsData[0].width;
  } else if(perspective=='b') {
    a1 = eventsData[1].x;
    a2 = a1 + eventsData[1].width;
  } else if(perspective=='c') {
    a1 = eventsData[2].x;
    a2 = a1 + eventsData[2].width;
  } else if (perspective=='universe') {
    a1 = 0;
    a2 = 1;
  }

  var b1 = eventsData[index].x;
  var b2 = b1 + eventsData[index].width;

  var overlap = 0
  // if b1 is between [a1, a2]
  if(a1 <= b1 && b1 <= a2){
    // b is entirely inside of a
    if(b2 <= a2){
      overlap = b2 - b1
    }else {
      overlap = a2 - b1
    }
  }
  // if b2 is between [a1, a2]
  else if(a1 <= b2 && b2 <= a2){
    if(b1 <= a1){
      overlap = b2 - a1
    }else{
      overlap = b2 - b1
    }
  }
  // if b1 is left of a1 and b2 is right of a2
  else if(b1 <= a1 && a2 <= b2) {
    overlap = a2 - a1
  }
  return overlap
}
function drawCP() {
  var w = d3.select('#svgBallCP').node().clientWidth;
  var wProb = d3.select('#svgProbCP').node().clientWidth;
  var h = 500;
  var hProb = 200;
  var padding = 20;

  //Update svg size
  svgBallCP.attr("width", w).attr("height", h);
  svgProbCP.attr("width", wProb).attr("height", hProb).call(tipCP);;

  //Update Clip Path
  clipCP.attr("x", 0).attr("y", 0).attr("width", w-2*padding).attr("height", h-2*padding);

  //Update Container
  containerBallCP.attr("transform", "translate(" + padding + "," + padding + ")");
  containerProbCP.attr("transform", "translate(" + padding + "," + padding + ")");

  //Update Scale Range
  xScaleCP.range([0, (w - 2*padding)]);
  xWidthCP.range([0, (w - 2*padding)]);
  yScaleCP.range([0, (h-2*padding)]);

  xScaleProbCP.rangeRoundBands([0, wProb - 2*padding], .5);
  yScaleProbCP.range([hProb-2*padding, 0]);

  //Update Axis
  probAxis.attr("transform", "translate(" + 0 + "," + (hProb-2*padding+1) + ")").call(xAxis);

  //Update Rectangles
  changePerspective(currentPerspective);
  updateRects(0)
}
start();
