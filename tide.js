var context2D;
var nWidth;
var nHeight;
var startX = 0;
var startY;
var endX;
var theta = 0;
var hightide = "";
var lowtide = "";
var radius = 5;
var items = 0;


function initialize() {
	window.addEventListener('resize', initialize, false);

	var canvasElement = document.getElementById("world");

	context2D = canvasElement.getContext("2d");
	canvasElement.width  = window.innerWidth;
	canvasElement.height = window.innerHeight;
	nWidth = canvasElement.width;
	nHeight = canvasElement.height;
	context2D.clearRect(0, 0, nWidth, nHeight);

	bubblesize = (nHeight)/8;
	startY = nHeight / 2;



	requestAnimationFrame(moveWave);


hightide = []
lowtide = []
	for (i in items) {
	if (items[i].indexOf('high') >= 0) {
		hightide=hightide+items[i]
		hightide=hightide.replace("high","") }
	if (items[i].indexOf('low') >= 0) {
		lowtide=lowtide+items[i]
		lowtide=lowtide.replace("low","") }
  }

}
function start(nX, nY) {
	context2D.beginPath();
	context2D.strokeStyle = "rgba(0,150,255,1)";
  context2D.moveTo(nX, nY);
}

function bubble(x,y) {
	context2D.beginPath();
	context2D.strokeStyle = "rgba(255,255,255,.3)";
	context2D.lineWidth = nHeight/60;
  context2D.arc(x,y,bubblesize,0,2*Math.PI);
	context2D.stroke();

	context2D.beginPath();
	context2D.lineCap = 'round';
	context2D.strokeStyle = "rgba(255,255,255,.3)";
	context2D.lineWidth = nHeight/60;
	context2D.arc(x,y,bubblesize-(bubblesize/5),.6*Math.PI,.9*Math.PI);
	context2D.stroke();

	context2D.beginPath();
	context2D.lineCap = 'round';
	context2D.strokeStyle = "rgba(255,255,255,.3)";
	context2D.lineWidth = nHeight/40;
	context2D.arc(x,y,bubblesize-(bubblesize/5),1.74*Math.PI,1.76*Math.PI);
	context2D.stroke();


}

function moveWave(timestamp) {
	context2D.fillStyle = "rgba(0,200,255,.4)";
  //context2D.clearRect(0, 0, nWidth, nHeight);
   context2D.fillRect(0, 0, nWidth, nHeight);
	 context2D.fillStyle = "rgba(0,150,255,1)";
	 context2D.fillRect(0, nHeight/2, nWidth, nHeight);


	drawWave();


	drawLabel(hightide,nWidth/2,nHeight/4);
	bubble(nWidth/2,nHeight/4);
	drawLabel(lowtide,nWidth/2,((nHeight/4)*3));
	bubble(nWidth/2,((nHeight/4)*3));

	requestAnimationFrame(moveWave);
	theta -= 0.05;
	if (theta < 0) {
		theta += Math.PI * 2;
	}
}
function drawWave() {
	var pitch = 1;
	var angle = theta;
	var nY = startY + Math.sin(angle) * radius;
	start(startX, nY);
	for (var nX = startX + pitch; nX < nWidth; nX += pitch) {
		angle += 0.06;
		nY = startY + Math.sin(angle) * radius;
		context2D.lineTo(nX, nY);

	}
	context2D.stroke();

}

function drawLabel(text,x,y)
  {
  //context2D.save();
	fontsize=nHeight/30
  context2D.textAlign = 'center';
  context2D.font = 'normal '+fontsize+'px sans-serif';
  context2D.fillStyle = "rgba(255,255,255,.6)";
  context2D.fillText(text,x,y);
  //context2D.restore();
  }


function gettide() {

	$.get({
		url: "https://8u1nwui24g.execute-api.ap-southeast-2.amazonaws.com/prod/hightide",
    async: false,
		timeout: 7000,
		error: function(){
			      console.log("no tide data");
            return true;
        },
		success: function(responseData,status) {

		todaystide=responseData;
		console.log(todaystide);
		var todaystide = todaystide.replace(':00+10:00\"\,\"high',' high');
		var todaystide = todaystide.replace(':00+10:00\"\,\"high','high');
		var todaystide = todaystide.replace(':00+10:00\"\,\"low',' low');
		var todaystide = todaystide.replace(':00+10:00\"\,\"low','low');
    // Make it work with day light savings time.
		var todaystide = todaystide.replace(':00+11:00\"\,\"high',' high');
		var todaystide = todaystide.replace(':00+11:00\"\,\"high','high');
		var todaystide = todaystide.replace(':00+11:00\"\,\"low',' low');
		var todaystide = todaystide.replace(':00+11:00\"\,\"low','low');


		items=JSON.parse(todaystide)
		console.log("items:",items)
		return todaystide;
	}
	});
}

var todaystide = gettide();

function check() {
console.log ('checking...');
   if(typeof todaystide !== "undefined") {
		 document.getElementById("loader").classList.remove('drip');
		 console.log("todaystide:",todaystide);
		 window.onload = setTimeout(initialize);
		 clearInterval(myintervalid);

   }
 }

myintervalid = setInterval(check, 1000);
