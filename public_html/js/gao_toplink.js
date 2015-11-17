window.TOPLINK = new Core.Create("TopLink");
TOPLINK.ParamDefine = function(gl, fn, nd, ev){
	gl.pictArr = [];
	
	fn.InitWinkInfo();
	gl.isPlayingAnimation2 = false;
	
	gl.isDisp = false;
};
TOPLINK.FuncDefine = function(gl, fn, nd, ev){
	fn.InitWinkInfo = function(){
		gl.winkTimerId = null;
		gl.winkState = 0;
		gl.winkLimit = fn.GetWinkLimit(true);
	};
	fn.AnimationLoop = function(){
		switch(gl.winkState){
			case 0:
				nd.pict.attr("src",gl.pictArr[0]);
				gl.winkLimit = fn.GetWinkLimit();
				break;
			case 1:
				nd.pict.attr("src",gl.pictArr[1]);
				gl.winkLimit = 100;
				break;
		}
		gl.winkState = (gl.winkState+1)%2;
		gl.winkTimerId = setTimeout(fn.AnimationLoop,gl.winkLimit);
	};
	fn.AnimationLoop2 = function(cnt){
		gl.isPlayingAnimation2 = true;
		
		if(cnt>0) setTimeout(fn.AnimationLoop2,400,cnt-1);
		else{
			gl.isPlayingAnimation2 = false;
			if(gl.winkTimerId != null){
				clearTimeout(gl.winkTimerId);
				fn.InitWinkInfo();
			}
			fn.AnimationLoop(true);
		}
	};
	fn.AnimatePictDisplay = function(isShow){
		nd.toplinkWrap.stop().animate(
			{
				'bottom' : (isShow ? 0 : -300)+'px'
			},
			{
				duration : 1000,
				easing : "easeInOutElastic"
			}
		);
	};
	fn.AjaxDonePictList = function(data){
		Array.prototype.push.apply(gl.pictArr,data.split("\n")); //いわゆるconcat
		fn.AnimationLoop();
		nd.toplinkWrap.removeClass("legacy");
	};
	fn.AjaxFailPictList = function(err){
		Core.DbgLog("toplinkのイメージリストが取得できなかったみたい。","↓err詳細↓",err);
	};
	fn.GetWinkLimit = function(isFirst){
		if(isFirst) return Math.random()*3000+3000;
		return (Math.random()*10|0) ? Math.random()*3000+3000|0 : Math.random()*50+50|0;
	};
};
TOPLINK.EventDefine = function(gl, fn, nd, ev){
	ev.PictDisplayStateChange = function(eve){
		fn.AnimatePictDisplay(eve.newVal);
	};
	ev.WindowScroll = function(eve){
		var delta = nd.win.scrollTop() - nd.about.offset().top;
		
		if(gl.isDisp && delta<0){
			ev.PictDisplayStateChange({newVal : false,oldVal : true});
			gl.isDisp = !gl.isDisp;
		}
		else if(!gl.isDisp && delta>=0){
			ev.PictDisplayStateChange({newVal : true,oldVal : false});
			gl.isDisp = !gl.isDisp;
		}
	};
	ev.PictMouseenter = function(eve){
		if(gl.winkTimerId != null){
			clearTimeout(gl.winkTimerId);
			fn.InitWinkInfo();
		}
		$(this).attr("src",gl.pictArr[2])
	};
	ev.PictMouseleave = function(eve){
		if(gl.winkTimerId != null){
			clearTimeout(gl.winkTimerId);
			fn.InitWinkInfo();
		}
		if(!gl.isPlayingAnimation2) fn.AnimationLoop();
	};
	ev.PictClick = function(eve){
		nd.pict.attr("src",gl.pictArr[3]);
		if(!gl.isPlayingAnimation2) fn.AnimationLoop2(1);
	};
};
TOPLINK.NodeDefine = function(gl, fn, nd, ev){
	nd.win = $(window);
	nd.about = $("#about");
	
	nd.toplinkWrap = $("#toplink");
	nd.toplink = $("#toplink a");
	nd.pict = $('<img></img>');
};
TOPLINK.NodeSet = function(gl, fn, nd, ev){
	nd.toplink.empty().append(nd.pict);
};
TOPLINK.StyleSet = function(gl, fn, nd, ev){
	gl.pictArr.push(nd.toplink.css("background-image").replace(/^url\(\"?([^\"]+)\"?\)$/,function(all,data){
			return data;
		})
	);
	nd.pict.attr("src",gl.pictArr[0]);
	
	nd.toplinkWrap.css("bottom","-300px");
};
TOPLINK.EventSet = function(gl, fn, nd, ev){
	nd.win.on("scroll",ev.WindowScroll);
	
	nd.pict.on("mouseenter",ev.PictMouseenter);
	nd.pict.on("mouseleave",ev.PictMouseleave);
	nd.pict.on("click",ev.PictClick);
};
TOPLINK.BeginInvoke = function(gl, fn, nd, ev){
	$.ajax({
		type : "GET",
		url : "/img/toplink/images.txt",
		dataType : "text"
	}).done(
		fn.AjaxDonePictList
	).fail(
		fn.AjaxFailPictList
	);
};
TOPLINK.RunAt(function(){
	if(!window.UA) return RunMode.CONTINUE;
	if(UA.gl.isMobile) return RunMode.END;
	return RunMode.ALL;
});