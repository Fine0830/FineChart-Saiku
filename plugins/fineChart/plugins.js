/**
 * Created by Fine on 2016/8/4.
 */
var fineChart = function(chartParam){

	var chartType = {
		ScatterChart:function(argsScatter){
			d3.select('#'+argsScatter.options.canvas).selectAll("svg").remove();
			var svg = d3.select('#'+argsScatter.options.canvas).append("svg")
				.attr("width", argsScatter.options.width)
				.attr("height", argsScatter.options.height+50)
				.append("g")
				.attr("transform", "translate("+argsScatter.options.width*0.3+",0)")
			d3.selectAll(".d3-tip").remove();
			var chinaJsonPath = "/js/saiku/plugins/fineChart/mapdata/china.json";
			var top5Info = [],
				top5Array = [],
				dataNodes = argsScatter.data.resultset,
				headerCnt  = argsScatter.headerCnt,
				lengthCol  = argsScatter.headerCnt.length, //type is DETA_CELL number
				countryPath = "/js/saiku/plugins/fineChart/mapdata/citycoordinates.json";
			var tip = d3.behavior.tip()
				.attr('class', 'd3-tip')
				.offset([-10, 0]);
			svg.call(tip);
			d3.json(chinaJsonPath, function (error, root) {
				if (error)
					return console.error(error);
				var zoomScale = getZoomScale(root.features, argsScatter.options.width, argsScatter.options.height);
				var projection = d3.geo.mercator()
					.center([107, 38])
					.scale(zoomScale * 43)
					.translate([argsScatter.options.width / 5, argsScatter.options.height / 2]);
				var path = d3.geo.path().projection(projection);
				svg.selectAll(".chinaPathScatter")
					.data(root.features).enter()
					.append("path")
					.attr("class", "chinaPathScatter")
					.attr("stroke", "#000")
					.attr("stroke-width", 0.3)
					.attr("stroke-dasharray", "5,5")
					.attr("fill", function () {
						var overColor = "#F1F1F1";
						return overColor;
					})
					.attr("d", path)
				var maxArray = [],
					minArray = [],
					titleLoc = 0,
					vauleData = [],
					maxColor1 = d3.rgb(84,164,182),//value is gt 0
					minColor1 = d3.rgb(164,182,113),
					maxColor = d3.rgb(164,182,113),
					minColor = d3.rgb(220,102,85);
				for(var p=0;p<lengthCol;p++){
					vauleData[p]=[];
				}
				titleLoc = dataNodes[0].length - lengthCol;
				dataNodes.forEach(function(j){
					var y = 0;
					for(var c=titleLoc;c<j.length;c++){
						vauleData[y].push(j[c].v);
						y++;
					}
				})
				vauleData.forEach(function(g){
					maxArray.push(d3.max(g));
					minArray.push(d3.min(g));
				})
				var sortArray=vauleData[0].sort(compare);
				for(var o = 0;o<5;o++){
					top5Array.push(sortArray[o]);
				}
				dataNodes.forEach(function(d){
					for(var s=0;s< d.length;s++){
						if(d[s]==null){
							d[s]=d[s-1];
						}
					}
				})
				d3.json(countryPath, function (error, root) {
					if (error)
						return console.error(error);
					if(lengthCol<=1){
						var minValue=minArray[0],
							maxValue=maxArray[0];
					}else if(lengthCol>1){
						var minValue=minArray[0],
							maxValue=maxArray[0],
							paraRange = d3.scale.linear()
								.domain([minArray[1],maxArray[1]])
								.range([0,1]);
					}
					//value is gt 0
					var paraNumber = d3.scale.linear()
						.domain([minValue,maxValue])
						.range([0,1]);
					root.coordinates.forEach(function (d) {
						var proLocation = projection(d.cp);
						dataNodes.forEach(function (g) {
							var titleLoc = g.length - lengthCol;
							if (d.name == g[titleLoc-1]) {
								if(lengthCol<=1){
									if(g[titleLoc].v>0){
										//size change
										var computeVaule = d3.interpolate(2,10);
										var t = paraNumber(g[titleLoc].v);
										var dataVaule = computeVaule(t);
										//color change
										var computeColor1 = d3.interpolate(minColor1,maxColor1);
										var w = paraNumber(g[titleLoc].v);
										var vauleColor = computeColor1(w);
									}else{
										var dataVaule = 4;
										var computeColor1 = d3.interpolate(minColor,maxColor);
										var w = paraNumber(g[titleLoc].v);
										var vauleColor = computeColor1(w);
									}
								}else if(lengthCol>=2){
									//size change
									if(g[titleLoc].v>0){
										var computeVaule = d3.interpolate(2,10);
										var t = paraNumber(g[titleLoc].v);
										var dataVaule = computeVaule(t);
									}else{
										var dataVaule = 4;
									}
									//color change
									if(g[titleLoc+1].v>0){
										var computeColor1 = d3.interpolate(minColor1,maxColor1);
										var w = paraRange(g[titleLoc+1].v);
										var vauleColor = computeColor1(w);
									}else{
										var computeColor1 = d3.interpolate(minColor,maxColor);
										var w = paraRange(g[titleLoc+1].v);
										var vauleColor = computeColor1(w);
									}
								}
								top5Array.forEach(function(t){
									if(g[titleLoc].v==t){
										var top5Obj = {
											dataInfo:g,
											titleLoc:titleLoc,
											location:[proLocation[0],proLocation[1]],
											dataVaule:dataVaule
										}
										top5Info.push(top5Obj);
									}
								})
								svg.append("circle")
									.attr({
										"class": "scatterCity",
										"cx": proLocation[0],
										"cy": proLocation[1],
										"r": 0,
										"position":"relative",
										"z-index":"100",
										"fill": vauleColor})
									.on("mouseover",function(){
										d3.select(this)
											.attr("stroke","#000")
										var tipsName = g[titleLoc-1],
											tipsArray = [],
											tipsData = [];
										for(var k =titleLoc;k< g.length;k++){
											tipsData.push(g[k].f);
										}
										tip.html(function(){
											for(var t = 0;t<headerCnt.length;t++){
												var saveHeader = [],
													headerStr = [];
												saveHeader.push(headerCnt[t]);
												saveHeader.push(tipsData[t]);
												headerStr = saveHeader.join(" : ");
												tipsArray.push(headerStr);
											}
											return tipsName+" :</br>"+tipsArray.join("</br>");
										});
										tip.show();
									})
									.on("mouseout",function(){
										d3.select(this)
											.attr("stroke",vauleColor)
										tip.hide();
									})
									.transition()
									.duration(1000)
									.attr("r", dataVaule);
							}
						})
					})
				})
				setInterval(function(){
					svg.selectAll("g").remove();
					var svgCircle = svg.selectAll(".threeCircle")
						.data(top5Info)
						.enter().append("g")
						.attr("transform", function(d){
							return "translate("+d.location[0]+","+d.location[1]+")"
						});
					svgCircle.selectAll(".circleLine")
						.data([1,2,3])
						.enter().append("circle")
						.attr({
							"class": "circleLine",
							"r": function(){
								var d = this.parentElement.__data__
								return d.dataVaule
							}
						})
						.style({
							"fill":"rgba(255,255,255,0)",
							"stroke":"#50A3BA",
							"stroke-width":2.5,
							"position":"relative",
							"opacity":0.7
						})
						.on("mouseover",function(){
							var d = this.parentElement.__data__;
							var tipsName = d.dataInfo[titleLoc-1],
								tipsArray = [],
								tipsData = [];
							for(var k =titleLoc;k< d.dataInfo.length;k++){
								tipsData.push(d.dataInfo[k].f);
							}
							tip.html(function(){
								for(var t = 0;t<headerCnt.length;t++){
									var saveHeader = [],
										headerStr = [];
									saveHeader.push(headerCnt[t]);
									saveHeader.push(tipsData[t]);
									headerStr = saveHeader.join(" : ");
									tipsArray.push(headerStr);
								}
								return tipsName+" :</br>"+tipsArray.join("</br>");
							});
							tip.show();
						})
						.on("mouseout",function(){
							tip.hide();
						})
						.transition()
						.duration(function(d){
							return d*2000;
						})
						.delay(0)
						.attr({
							"r":function(){return this.parentElement.__data__.dataVaule+20}
						})
						.style("stroke-width",0)
						.remove();

				},3000)
				colorRange(svg,minColor,maxColor1,argsScatter.options,maxArray[1],minArray[1],headerCnt);
				var argsSize = {
					svg:svg,
					headerCnt:headerCnt,
					options:argsScatter.options
				}
				sizeRange(argsSize)
			})
		},
		BubbleChart:function(bubbleObj){
			d3.select('#'+bubbleObj.options.canvas).selectAll("svg").remove();
			var svg = d3.select('#'+bubbleObj.options.canvas).append("svg")
				.attr({
					"width": bubbleObj.options.width ,
					"height":bubbleObj.options.height
				})
				.append("g")
				.attr("transform", "translate(0,0)");
			var dataArr = bubbleObj.data.resultset,
				lengthCol  = bubbleObj.headerCnt.length,
				dataNodes = [],
				color = d3.scale.category20c();
			var bubble = d3.layout.pack()
				.sort(null)
				.size([bubbleObj.options.width, bubbleObj.options.height])
				.padding(3.5);
			var node = svg.selectAll(".node")
				.data(bubble.nodes(classes(dataArr))
					.filter(function(d) {
						return !d.children;
					}
				)
			)
				.enter().append("g")
				.attr("class", "node")
				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
			var tip = d3.behavior.tip()
				.attr({'class':'d3-tip'})
				.offset([-10, 0]);
			svg.call(tip);
			node.append("circle")
				.on("mouseover",function(d){
					var tipsArray = [];
					for(var t = 0;t<d.valueArr.length;t++){
						var transferHeader = [],
							headerStr = [];
						transferHeader.push(bubbleObj.headerCnt[t]);
						transferHeader.push(d.valueArr[t]);
						headerStr = transferHeader.join(" : ");
						tipsArray.push(headerStr);
					}
					tip.html(d.className+" :</br>"+tipsArray.join("</br>"));
					tip.show();
				})
				.on("mouseleave",function(){
					tip.hide();
				})
				.attr("transform", function() { return "translate(" + 0 + "," + 0 + ")"; })
				.attr("r", function(d) {
					return d.r;
				})
				.style("fill", function(d,i) {
					return color(d.packageName);
				})
				.style("cursor","default");
			var divide = 0;
			var subLength=0;
			var flag=0;
			if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){divide = 3;subLength=6;flag=1;}
			else if (navigator.userAgent.indexOf('Firefox') >= 0){divide = 3;subLength=6;flag=1;}
			else if (navigator.userAgent.indexOf('Opera') >= 0){divide = 20;}
			else{divide=5;subLength=6;flag=2;}
			var text = node.append("text")
				.on("mouseover",function(d,i){
					var tipsArray = [];
					for(var t = 0;t<d.valueArr.length;t++){
						var transferHeader = [],
							headerStr = [];
						transferHeader.push(bubbleObj.headerCnt[t]);
						transferHeader.push(d.valueArr[t]);
						headerStr = transferHeader.join(" : ");
						tipsArray.push(headerStr);
					}
					tip.html(d.className+" :</br>"+tipsArray.join("</br>"));
					tip.show();
				})
				.on("mouseleave",function(){
					tip.hide();
				})
				.attr("dy", ".3em")
				.style("text-anchor", "middle")
				.text(function(d) { return d.className.substring(0, d.r/subLength ); })
				.style("fill", "black")
				.attr("font-size",function(d){
					if(flag==1){
						if(d.r/divide<=12){return 12;}
					}
					return d.r/divide;
				})
				.style("cursor","default");
			function classes(root){
				root.forEach(function(d){
					var titleLoc = d.length - lengthCol,
						dataFloat = [],
						negative = null;
					for(var a = titleLoc;a<d.length;a++){
						dataFloat.push(d[a].f);
					}
					if(titleLoc-2>=0){
						var packageNum = d[titleLoc-2];
					}else{
						var packageNum = d[titleLoc-1];
					}
					if(d[titleLoc].v<=0){
						negative = 0
						d[titleLoc].v = -(d[titleLoc].v);
					}
					if(d[titleLoc-1]!= null){
						var dataObj = {
							packageName: packageNum,
							className: d[titleLoc-1],
							value: d[titleLoc].v,
							valueArr:dataFloat,
							negativePara:negative
						}
						dataNodes.push(dataObj);
					}
				})
				return {children: dataNodes};
			}
			return svg;
		}
		}
	chartType[chartParam.options.type](chartParam);
}
//array sort function
var compare = function (value1, value2) {
	if (value1 < value2) {
		return 1;
	} else if (value1 > value2) {
		return -1;
	} else {
		return 0;
	}
}

var getZoomScale = function(features, width, height){
	var longitudeMin = 100000;//最小经度
	var latitudeMin = 100000;//最小维度
	var longitudeMax = 0;//最大经度
	var latitudeMax = 0;//最大纬度
	features.forEach(function(e){
		var a = d3.geo.bounds(e);//[[最小经度，最小维度][最大经度，最大纬度]]
		if(a[0][0] < longitudeMin) {//左
			longitudeMin = a[0][0];
		}
		if(a[0][1] < latitudeMin) {/*上*/
			latitudeMin = a[0][1];
		}
		if(a[1][0] > longitudeMax) {/*右*/
			longitudeMax = a[1][0];
		}
		if(a[1][1] > latitudeMax) {/*下*/
			latitudeMax = a[1][1];
		}
	});
	var a = longitudeMax-longitudeMin;/*数值宽度*/
	var b = latitudeMax-latitudeMin;/*数值高度*/
	if(width/height>=a/b){
		return height/b;
	} else{
		return width/a;
	}
}

var sizeRange = function(argsSize){
	var circleData = [7,6,5,4,3]
	argsSize.svg.selectAll(".nodeCircle")
		.data(circleData)
		.enter().append("circle")
		.attr({
			"class":"nodeCircle",
			"cx":argsSize.options.width*0.65,
			"cy":function(d){return argsSize.options.height*0.75-d*20;},
			"r":function(d){return d;},
			"fill":"white",
			"stroke":"#1C5896"
		})
	if(argsSize.headerCnt){
		var ValueText = argsSize.svg.append("text")
			.attr("class","sizeText")
			.attr({
				"x": argsSize.options.width*0.65-5,
				"y": argsSize.options.height*0.75-circleData[0]*20-20,
				"text-anchor":"middle"
			})
			.text(function(){
				return argsSize.headerCnt[0];
			});
	}
	var maxValueText = argsSize.svg.append("text")
		.attr("class","sizeText")
		.attr({
			"x": argsSize.options.width*0.65-50,
			"y": argsSize.options.height*0.75 - circleData[0]*20
		})
		.text("Large")
	//.text(function(){
	//return minvalue[0];
	//});
	var minValueText = argsSize.svg.append("text")
		.attr("class","sizeText")
		.attr("x", argsSize.options.width*0.65-50)
		.attr("y", argsSize.options.height*0.75 - circleData[4]*20 +5)
		.text("Small")
	//.text(function(){
	//	return maxvalue[0];
	//});
}
//color range
var colorRange = function(svg,a,b,options,maxvalue,minvalue,headerCnt){
	var defs = svg.append("defs");
	var linearGradient = defs.append("linearGradient")
		.attr("id","linearColor")
		.attr("x1","0%")
		.attr("y1","0%")
		.attr("x2","0%")
		.attr("y2","100%");

	var stop1 = linearGradient.append("stop")
		.attr("offset","0%")
		.style("stop-color",b.toString());

	var stop2 = linearGradient.append("stop")
		.attr("offset","100%")
		.style("stop-color",a.toString());
	var colorLength = 150;
	var colorWidth = 20;
	var colorRect = svg.append("rect")
		.attr("x", options.width*0.65-7)
		.attr("y", options.height*0.75)
		.attr("width", colorWidth)
		.attr("height", colorLength)
		.style("fill","url(#" + linearGradient.attr("id") + ")");

	//add words
	if(headerCnt){
		var ValueText = svg.append("text")
			.attr({
				"class":"valueText",
				"x": options.width*0.65+5,
				"y": options.height*0.75-10,
				"text-anchor":"middle"
			})
			.text(function(){
				if(headerCnt[1]){
					var contentTitle = headerCnt[1];
				}else{
					var contentTitle = headerCnt[0];
				}
				return contentTitle;
			});
	}
	var minValueText = svg.append("text")
		.attr("class","valueText")
		.attr("x", options.width*0.65-40)
		.attr("y", options.height*0.75+10)
		.text("High")
	//.text(function(){
	//return minvalue[0];
	//});

	var maxValueText = svg.append("text")
		.attr("class","valueText")
		.attr("x", options.width*0.65-40)
		.attr("y", options.height*0.75+colorLength)
		.text("Low")
	//.text(function(){
	//	return maxvalue[0];
	//});
}

