// BENEATH THE SURFACE
// LD 29
// By Teh_Bucket

var Canvas = document.getElementById('game');
var out = document.getElementById('text');
var game = Canvas.getContext('2d');
var lag = 0; //for evening gameplay time at irregular framerates
var lastFrame = new Date().getTime();
var gravity = 3;

var ran = function(min,max){return Math.floor(Math.random()*(max + min - 1)+min)}

var input = {click:false,selected:null,}
var stage = {left:0,right:Canvas.width,top:0,bottom:Canvas.height,}
var circles = [{x:700,y:400,r:80,w:15,xForce:0,yForce:gravity,out:false,colora:'#47716b',colorb:'#BF6F36',colorc:'#30AB9A',colord:'#B38C71',},];
var newCircle = function(x,y,r){
	this.x = x;
	this.y = y;
	(r==0) ? r = ran(15,100) : r = r;
	this.r = r;
	this.w = r/5;
	this.xForce = Math.random() - .5;
	this.yForce = Math.random() - .5;
	(ran(0,1)==1) ? this.out=true : this.out=false;
	var c = colors[ran(0,colors.length-1)];
	this.colora = c.a;this.colorb = c.b;this.colorc = c.c; this.colord = c.d;
}

var colors = [{a:'#4C968C',b:'#FF700A',c:'#09E4C6',d:'#EFAA78'},{a:'#47716B',b:'#BF6F36',c:'#30AB9A',d:'#B38C71'},{a:'#196257',b:'#A64703',c:'039480',d:'#9B5727'},{a:'#80CBC0',b:'#FF9347',c:'#44F1DA',d:'#F7C29C'},{a:'#94CBC3',b:'#FFB078',c:'#72F1E0',d:'#F7D0B4'},];

var drawCirc = function(circ){with(circ){
	game.beginPath();
	game.arc(x,y,r,0,2*Math.PI,true);
	game.fillStyle = (out) ? colorb : colora;
	game.fill();
	game.strokeStyle = (out) ? colorc : colord;
	game.lineWidth = w;
	game.stroke();
}}

var collide = function(obj1,xx,yy,xDir,yDir){with(obj1){
	if(xx != null){
		x = xx + xDir*(r+w/2);
		xForce -= xForce*1.5;
		}
	if(yy != null){
		y = yy + yDir*(r+w/2);
		yForce -= yForce*1.5;
	}
}}

var addForce = function(obj,xF,yF){with(obj){
	xForce += xF;
	yForce += yF;
}}

var moveCirc = function(circ){with(circ){
	y += yForce*.9; //move first
	x += xForce*.9;
	(yForce == gravity) ? yForce = gravity : yForce += r/1000 * lag;
	//colission with stage
	if(y + r + w/2 >= stage.bottom){collide(circ,null,stage.bottom,0,-1)}
	if(y - r - w/2 <= stage.top){collide(circ,null,stage.top,0,1)}
	if(x + r + w/2 >= stage.right){collide(circ,stage.right,null,-1,0)}
	if(x - r - w/2 <= stage.left){collide(circ,stage.left,null,1,0)}
	//Colission with balls
	for(var i=0;i<circles.length;i++){
		var distance = (Math.abs(x - circles[i].x)+Math.abs(y - circles[i].y))/2;
		var sizes = r + w/2 + circles[i].r + circles[i].w/2;
		if(out==circles[i].out && distance <= sizes && distance != 0){
			var offx = Math.abs(x - circles[i].x);
			var offy = Math.abs(y - circles[i].y);
			console.log('collide',distance,sizes);
		}
	}
}}

var update = function(){
	lag = (new Date().getTime() - lastFrame)/5;
	lastFrame = new Date().getTime();
	Canvas.width = Canvas.width
	for(var i=0;i<circles.length;i++){
		drawCirc(circles[i]);
		moveCirc(circles[i]);
	}
}

var eachFrame = window.setInterval(update,1);

//CLICK handling
window.addEventListener('mousedown', function(e){
	var xx = e.clientX - Canvas.getBoundingClientRect().left;
	var yy = e.clientY - Canvas.getBoundingClientRect().top;
	for(var i=0;i<circles.length;i++){with(circles[i]){
		if(Math.abs(xx - x) <= r + w/2 && Math.abs(yy - y) <= r + w/2){
			input.click = true;
			input.selected = i;
		}
	}}
},false);

window.addEventListener('mousemove', function(e){
	if(input.click){
		var xx = e.clientX - Canvas.getBoundingClientRect().left;
		var yy = e.clientY - Canvas.getBoundingClientRect().top;
		with(circles[input.selected]){
			if(Math.abs(xx - x) <= r + w/2 && Math.abs(yy - y) <= r + w/2){
				var scale = (Math.abs(xx-x) + Math.abs(yy-y))/2; //how far mouse from radius
				w = (r - scale + w/2)/2;
				xForce = 0;
				yForce = 0;
			}
			else{
				w = r/5;
				out = !out;
				addForce(circles[input.selected],(xx - x)/w, (yy -y)/w);
				input.selected = null;
				input.click = false;
			}
		}
	}
},false);

window.addEventListener('mouseup', function(e){
	input.click = false;
	input.selected = null;
},false);
circles.push(new newCircle(30,50,0));
circles.push(new newCircle(ran(stage.left,stage.right),ran(stage.top,stage.bottom),0));
circles.push(new newCircle(ran(stage.left,stage.right),ran(stage.top,stage.bottom),0));
circles.push(new newCircle(ran(stage.left,stage.right),ran(stage.top,stage.bottom),0));