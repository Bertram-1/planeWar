var QFTools = {
	/*
	 	返回dom对象或者dom集合
	 * @params selector string 选择器
	 * @params [parent] DOMObject 父级对象
	 * @return DOMObject || DOMCollection
	 * 
	 * */
	
	$: function(selector,parent){
		parent = parent || document;
		/*if(selector.charAt(0) === "#"){
			return parent.getElementById(selector.splice(1));
		}*/
		
		switch(selector.charAt(0)){
			case "#":
				return parent.getElementById(selector.slice(1));
			case ".":
				return parent.getElementsByClassName(selector.slice(1));
			default:
				return parent.getElementsByTagName(selector);
		}
	},
	/*
	 	获取内部或者外部样式
	 * @params obj DOMObject 获取样式的元素对象
	 * @params attr string  属性名称
	 * @return string 属性值
	 * 
	 * */
	getStyle: function(obj, attr){
		/*if(obj.currentStyle){ // ie
			return obj.currentStyle[attr];
		}
		return getComputedStyle(obj, false)[attr];*/
		
		
		//return obj.currentStyle ? obj.currentStyle[attr] :  getComputedStyle(obj, false)[attr];
		
		try{
			return getComputedStyle(obj, false)[attr];
		}catch(e){
			return obj.currentStyle[attr];
		}
	},
	
	/*
	 	使元素绝对居中
	 * @params obj DOMObject 要居中的元素对象
	 * */
	
	showCenter: function(obj){
		var _this = this; //留住this
		obj.style.display = "block";
		obj.style.position = "absolute";
		//计算left和top
		function calc(){
			console.log(this);
			var left = (_this.getBody().width - obj.offsetWidth)/2;
			var top = (_this.getBody().height - obj.offsetHeight)/2;
			obj.style.left = left + "px";
			obj.style.top = top + "px";
		}
		calc();
		window.onresize = calc;
		
	},
	/*
	 	得到浏览器的宽高
	 * @return object {width,height}
	 * */
	getBody: function(){
		return {
			width: document.documentElement.clientWidth || document.body.clientWidth,
			height: document.documentElement.clientHeight || document.body.clientHeight
		}
		/*window.innerHeight
		window.innerWidth*/
	},
	/*
	 	事件监听
	 * @params obj DOMObject 事件监听对象
	 * @params event string 事件句柄
	 * @params fn  Function 事件处理函数
	 * 
	 * */
	on: function(obj, event, fn){
		if(obj.attachEvent){
			obj.attachEvent("on"+event,fn);
		}else{
			obj.addEventListener(event,fn,false);
		}
	},
	
	/*
	 	移出事件监听
	 * @params obj DOMObject 事件监听对象
	 * @params event string 事件句柄
	 * @params fn  Function 事件处理函数
	 * */
	off: function(obj, event, fn){
		if(obj.detachEvent){
			obj.detachEvent("on"+event, fn);
		}else{
			obj.removeEventListener(event, fn);
		}
	},
	
	/* 获取一个元素到浏览器边缘的距离

	*  @param obj 要获取距离的元素
	* @return {left, top}
	*/
	getPosition: function(obj){
		var position = {
			left: 0,
			top: 0
		}
		//只要存在父级，那么就继续找
		while(obj.offsetParent){
			//进行累加
			position.top += obj.offsetTop;
			position.left += obj.offsetLeft;
			//层级往上增加一个，继续找父级的offsetParent
			obj = obj.offsetParent;
		}

		return position;
	},

	createDiv: function(className){
		var div = document.createElement("div");
		div.className = className;
		document.body.appendChild(div);
		return div;
	}

}