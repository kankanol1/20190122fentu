
function dealWith( fn,delay,mastExec ){
	var timer;
	var lastTime = new Date();
	return function(arg){
		var now = new Date();
		clearTimeout( timer );
		if( now-lastTime < mastExec ){
			timer = setTimeout( ()=>{
				fn(arg);
				lastTime = now;
			},delay );
		}else{
			fn(arg);
			lastTime = now;
		}
	}
}
function slider( params ){
	var {wrap,max,min,val,inputFn,dir} = params;
	if( val < min ){
		val = min;
	}else if( val > max ){
		val = max;
	}
	var sliderLine = document.createElement("div");
	var sliderDot = document.createElement("div");
	var sliderDotExtend = document.createElement("div");
	
	sliderDot.style.cssText = `width:0px;height:0px;transform:translate(-50%,-50%);opacity:1.0;position:relative;top:0;left:0;`;
	if( dir === "x" ){
		sliderLine.style.cssText = `width:${getComputedStyle(wrap).width};height:1px;background-color:#ccc;position:relative;`;
		sliderDotExtend.style.cssText = `width:50px;height:20px;border:1px solid #999;border-radius:10px;background-color:#fff;transform:translate(-50%,-50%);position:absolute;top:0;left:0;`;
	}else{
		sliderLine.style.cssText = `width:1px;height:${getComputedStyle(wrap).height};background-color:#ccc;position:relative;`;
		sliderDotExtend.style.cssText = `width:20px;height:50px;border:1px solid #999;border-radius:10px;background-color:#fff;transform:translate(-50%,-50%);position:absolute;top:0;left:0;`;
	}
	
	sliderDot.appendChild(sliderDotExtend);
	wrap.appendChild(sliderLine);
	sliderLine.appendChild(sliderDot);
	
	var maxLeft = dir === "x" ? sliderLine.offsetWidth : sliderLine.offsetHeight;
	var scale = (max-min)/maxLeft;
	var nowLeft = dir === "x" ? ((val-min)/(max-min))*maxLeft : maxLeft - ((val-min)/(max-min))*maxLeft;
	var oriY,nowY,oriX,nowX;
	sliderDot.val = val;
	sliderDot.style[ dir === "x" ? "left" : "top" ] = `${nowLeft}px`;
	var isDown = false;
	let touchStart = ()=>{
		({clientY:oriY,clientX:oriX} = event);
		isDown = true;
		event.preventDefault();
	};
	let touchMove = ()=>{
		if( !isDown ){
			return;
		};
		({clientX:nowX,clientY:nowY} = event);
		var temp = ( dir === "x" ? nowX-oriX : nowY-oriY ) + nowLeft;
		if( temp < 0 ){
			temp = 0;
		} else if( temp > maxLeft ){
			temp = maxLeft;
		}
		sliderDot.style[ dir === "x" ? "left" : "top" ] = `${temp}px`;
		sliderDot.val = dir === "x" ? temp/maxLeft*(max-min)+min : max-(temp/maxLeft*(max-min));
		(typeof inputFn === "function") && inputFn(sliderDot.val);
		event.preventDefault();
	};
	let touchEnd = ()=>{
		nowLeft = parseFloat(getComputedStyle(sliderDot)[dir === "x" ? "left" : "top"]);
		isDown = false;
	};
	sliderDot.addEventListener( "mousedown",touchStart );
	document.addEventListener( "mousemove",touchMove );
	document.addEventListener( "mouseup",touchEnd );
	return {
		setVal( v ){
			nowLeft = dir === "x" ? ((v-min)/(max-min))*maxLeft : maxLeft - ((v-min)/(max-min))*maxLeft;
			sliderDot.val = v;
			sliderDot.style[ dir === "x" ? "left" : "top" ] = `${nowLeft}px`;
		}
	}
}
	