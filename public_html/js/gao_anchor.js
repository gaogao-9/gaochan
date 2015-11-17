window.ANCHOR = new Core.Create("Anchor");
ANCHOR.ParamDefine = function(gl, fn, nd, ev){
	gl.anchor = location.hash;
	gl.scrollPos = 0;
};
ANCHOR.FuncDefine = function(gl, fn, nd, ev){
	fn.GetScrollPos = function(){
		return nd.win.scrollTop();
	};
	fn.BeginHashAnimation = function(start,end){
		$('html, body').stop().animate(
			{scrollTop : end},
			{
				duration : Math.abs(end-start)/10 + 300 | 0,
				easing : "easeOutExpo"
			}
		);
		//Core.DbgLog("pos",start,end);
	};
	fn.GetHashByScroll = function(pos){
	};
	fn.ArticleAlphaUpdate = function(pos){
		if(UA.gl.isMobile) return;
		
		var target,tOffset,delta,rate;
		var wHei = nd.win.height();
		for(var i=0,iLen=nd.articles.length-1;i<iLen;++i){
			target = $(nd.articles[i]);
			tOffset = target.offset();
			delta = pos - tOffset.top;
			rate = Math.max(0, Math.min(1, 2*(delta/wHei+1)));
			target.css("opacity",rate);
		}
	};
	fn.AddHash = function(hash){		
		if(typeof history.pushState !== "undefined"){
			history.pushState(null,null,"/"+hash);
		}
	};
};
ANCHOR.EventDefine = function(gl, fn, nd, ev){
	ev.WindowLoad = function(){
		fn.ArticleAlphaUpdate(gl.scrollPos);
	};
	ev.WindowResize = function(eve){
		fn.GetHashByScroll(gl.scrollPos);
		fn.ArticleAlphaUpdate(gl.scrollPos);
	};
	ev.WindowScroll = function(eve){
		gl.scrollPos = fn.GetScrollPos();
		fn.GetHashByScroll(gl.scrollPos);
		fn.ArticleAlphaUpdate(gl.scrollPos);
	};
	
	ev.HashLinkClick = function(eve){
		var href = $(this).attr("href");
		var hash = href.match(/#[a-zA-Z0-9]+/);
		if(hash==null) return false;
		var target = $(hash[0]);
		if(target.length==0) return false;
		var tOffset = target.offset();
		
		fn.BeginHashAnimation(gl.scrollPos,tOffset.top);
		fn.AddHash(hash);
		
		return false;
	};
};
ANCHOR.NodeDefine = function(gl, fn, nd, ev){
	nd.win = $(window);
	nd.hashLink = $("a[href*='#']");
	nd.articles = $("#contents>article");
};
ANCHOR.NodeSet = function(gl, fn, nd, ev){
};
ANCHOR.StyleSet = function(gl, fn, nd, ev){
	if(!UA.gl.isMobile){
		nd.articles.css("opacity",0);
		$(nd.articles[0]).css("opacity",1);
		$(nd.articles[nd.articles.length-1]).css("opacity",1);
	}
};
ANCHOR.EventSet = function(gl, fn, nd, ev){
	nd.win.on("load",ev.WindowLoad);
	nd.win.on("resize",ev.WindowResize);
	nd.win.on("scroll",ev.WindowScroll);
	
	nd.hashLink.on("click",ev.HashLinkClick);
};
ANCHOR.BeginInvoke = function(gl, fn, nd, ev){
};
ANCHOR.Run(RunMode.ALL);