window.onload=function(){
	new Engine();
}

function Engine(){
	this.init();
}

Engine.prototype.init=function(){
	var _this=this;
	this.bodyMain=QFTools.$("#body_main");
	this.options=QFTools.$("#options");
	this.options.onclick=function(e){
		e=e||event;
		var target=e.target||e.srcElement;
		if(target.nodeName==="LI"){
			//获取难度
			_this.diff=target.value;
			//options要移出
			_this.bodyMain.removeChild(_this.options);
			//进入开场动画
			_this.startAnimation();
		}
	}
}

Engine.prototype.startAnimation = function(){
	//背景图动起来
	var top = 0;
	setInterval(function(){
		top -= 10;
		this.bodyMain.style.backgroundPositionY = top+"px";
	}.bind(this),30);
	//创建logo
	var logo = QFTools.createDiv("logo");
	//小飞机放屁
	var loading = QFTools.createDiv("loading");
	var n=0;
	var timer=setInterval(function(){
		n++;
		loading.style.background="url(images/loading"+(n%3+1)+".png)"
		if(n>2){
			clearInterval(timer);
			document.body.removeChild(loading);
			document.body.removeChild(logo);
			this.startGame();
		}
	}.bind(this),500);
}
Engine.prototype.startGame = function(){
	//创建敌机和战机 //链式操作
	myPlane.init().fire(this.diff);
	//创建敌机
	//40% 小敌机
	//20% 中敌机
	//5%  大敌机
	//35% 不出现敌机
	setInterval(()=>{
		var rand = Math.random().toFixed(2);
		if(rand < 0.4) new Enemy(1, this.bodyMain);
		else if(rand < 0.6) new Enemy(2, this.bodyMain);
		else if(rand < 0.65) new Enemy(3, this.bodyMain);
	},500);
}
//我方战机
var myPlane={
	aBulltes:[], //存所有子弹对象
	init:function(){
		this.bodyMain = QFTools.$("#body_main");
		//创建战机DOM元素
		this.ele  = QFTools.createDiv("my-warplain");
		//左右剧中
		this.ele.style.left = (QFTools.getBody().width - this.ele.offsetWidth)/2 + "px";
		//垂直居底
		this.ele.style.top = QFTools.getBody().height - this.ele.offsetHeight + "px";
		this.move();
		return this;
	},
	move:function(){
		//飞机跟随鼠标移动
		QFTools.on(document.body,"mousemove",function(e){
			e = e || event;
			//飞机的中心点跟随鼠标移动
			this.ele.style.top=e.clientY- this.ele.offsetHeight/2+"px";
			var _left=e.clientX - this.ele.offsetWidth/2;
			//判断左右边界
			if(_left<this.bodyMain.offsetLeft){
				_left=this.bodyMain.offsetLeft
			}
			if(_left>this.bodyMain.offsetLeft+this.bodyMain.offsetWidth-this.ele.offsetWidth){
				_left=this.bodyMain.offsetLeft+this.bodyMain.offsetWidth-this.ele.offsetWidth
			}
			this.ele.style.left = _left + "px";
		}.bind(this),false);
	},
	fire:function(diff){
		//创建子弹
		//创建子弹的时间间隔根据难度决定，难度值越小，游戏难度越大，时间间隔个越大
		this.duration=500/diff;
		setInterval(()=>{
			this.aBulltes.push(new Bullet().init(this.ele));
		},this.duration);
	}
}

function Bullet(){

}
Bullet.prototype={
	//改变整个原型指向的时候，要把constructor指回构造函数本身
	constructor:Bullet,
	init:function(plane){
		//创建子弹元素
		this.ele=QFTools.createDiv("bullet");
		//给子弹初始坐标
		this.ele.style.top=plane.offsetTop-this.ele.offsetHeight+"px";
		this.ele.style.left=plane.offsetLeft+plane.offsetWidth/2-this.ele.offsetWidth/2+"px";
		this.move();
		return this;
	},
	move:function(){
		this.timer=setInterval(()=>{
			this.ele.style.top=this.ele.offsetTop-8+"px"
			//判断是否超出边界
			if(this.ele.offsetTop < -10) this.die();
		},30);
	},
	die:function(){
		clearInterval(this.timer);
		//执行爆炸动画
		this.ele.className = "bullet_die";
		setTimeout(()=>{
			this.ele.className= "bullet_die2";
			setTimeout(()=>{
				//爆炸动画结束之后100毫秒再从DOM中移出元素
				document.body.removeChild(this.ele);
			},100)
		},100);
		//从aBullets数组里把当前子弹移出
		//注意！这一段放在定时器外面同步执行
		for(var i = 0; i < myPlane.aBulltes.length; i++){
			//this就是当前子弹对象
			//查找this处于数组里面的第几个
			if(this === myPlane.aBulltes[i]){
				myPlane.aBulltes.splice(i,1);
			}
		}
	}
}

class Enemy{
	constructor(type,bodyMain){
		this.type=type;
		this.bodyMain=bodyMain;
		this.init();
	}
	init(){
		//type = 1 小敌机  speed = 5
		//type = 2 中敌机  speed = 3
		//type = 3 大敌机  speed = 1
		switch(this.type){
			case 1:
				this.ele = QFTools.createDiv("enemy-small");
				this.speed = 5;
				this.blood = 1;
			break;
			case 2:
				this.ele = QFTools.createDiv("enemy-middle");
				this.speed = 3;
				this.blood = 7;
			break;
			case 3:
				this.ele = QFTools.createDiv("enemy-large");
				this.speed = 1;
				this.blood = 15;
			break;
		}
		//计算敌机的初始left值，在游戏区范围内随机生成
		var min = this.bodyMain.offsetLeft;
		var max=this.bodyMain.offsetLeft+this.bodyMain.offsetWidth-this.ele.offsetWidth;
		var _left=parseInt(Math.random()*(max-min))+min;
		//计算敌机的初始top值 top值为刚好隐藏自己的位置 -height
		var _top=-this.ele.offsetHeight;
		this.ele.style.top = _top + "px";
		this.ele.style.left = _left + "px";
		this.move();
	}
	move(){
		this.timer=setInterval(()=>{
			//每个敌机根据自己的速度移动
			this.ele.style.top=this.ele.offsetTop+this.speed+"px";
			//判断移动边界
			if(this.ele.offsetTop > this.bodyMain.offsetHeight) this.die();
			//判断敌机跟我方战机的碰撞
			var mLeft=myPlane.ele.offsetLeft,
				mRight=mLeft+myPlane.ele.offsetWidth,
				mTop=myPlane.ele.offsetTop,
				mBottom=mTop+myPlane.ele.offsetHeight,
				eLeft=this.ele.offsetLeft,
				eRight=eLeft+this.ele.offsetWidth,
				eTop=this.ele.offsetTop,
				eBottom=eTop+this.ele.offsetHeight;
			if(!(eBottom<mTop||eTop>mBottom||eRight<mLeft||eLeft>mRight)){
				//得到所有没有碰撞的结果去反
				//敌机跟战机碰撞上了
				if(confirm("你死了，重新开始吗？")){
					window.location.reload(true);
				}
			}
			//检测敌机跟所有子弹的碰撞
			for(var i=0;i<myPlane.aBulltes.length;i++){
				var bLeft = myPlane.aBulltes[i].ele.offsetLeft,
					bRight = bLeft + myPlane.aBulltes[i].ele.offsetWidth,
					bTop = myPlane.aBulltes[i].ele.offsetTop,
					bBottom = bTop + myPlane.aBulltes[i].ele.offsetHeight;
				if(!(eBottom < bTop || bRight < eLeft || bBottom < eTop || eRight < bLeft)){
					console.log(this);
					//敌机跟子弹发生碰撞了
					myPlane.aBulltes[i].die();
					--this.blood;
					if(this.blood===0){
						this.die();
					}
				}
			}  

		},30)
	}
	die(){
		document.body.removeChild(this.ele);
		clearInterval(this.timer);
	}
}