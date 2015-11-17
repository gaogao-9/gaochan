window.MENU = new Core.Create("Menu");
MENU.ParamDefine = function(gl, fn, nd, ev){
	gl.PosMode = {TOP : "top", SIDE : "side"};
	gl.position = gl.PosMode.TOP;
};
MENU.FuncDefine = function(gl, fn, nd, ev){
	fn.getPosition = function(wid,hei){
		var newVal = (wid<hei) ? gl.PosMode.TOP : gl.PosMode.SIDE;
		if(newVal != gl.position){
			ev.MenuPosChanged({
				target : $("."+gl.position),
				oldVal : gl.position,
				newVal : newVal
			});
		}
		return newVal;
	};
	fn.SetSideMenuHeight = function(){
		var vHei = nd.win.height();
		var sHei = 0;
		var delta,sum,hHei,nHei;
		var paddingThin = 40;
		
		$("#side>*").each(function(index,target){
			sHei += $(target).height();
		});
		delta = vHei - sHei - paddingThin;
		hHei = nd.hisBody.height();
		nHei = nd.navBody.height();
		
		sum = hHei + delta;
		Core.DbgLog($(window).height(),vHei,sHei);
		if(nHei>=240){
			nd.hisBody.css("height",sum+"px");
			hHei = nd.hisBody.height();
		}
		else if(sum>=500) return vHei;
		Core.DbgLog(hHei);
		sHei = 0;
		$("#side>*").each(function(index,target){
			sHei += $(target).height();
		});
		
		delta = vHei - sHei - paddingThin;
		sum = nHei + delta;
		if(hHei<=100){
			nd.navBody.css("height",sum+"px");
		}
	};
};
MENU.EventDefine = function(gl, fn, nd, ev){
	ev.MenuPosChanged = function(eve){
		$(eve.target).each(function(index,node){
			$(node).removeClass(eve.oldVal);
			$(node).addClass(eve.newVal);
			$("#"+eve.oldVal).css("display","none");
			$("#"+eve.newVal).css("display","");
		});
	};
	ev.WindowResize = function(eve){
		gl.position = fn.getPosition($(eve.target).width(),$(eve.target).height());
		if(gl.position == gl.PosMode.SIDE) fn.SetSideMenuHeight();
		//Core.DbgLog(gl.position);
	};
};
MENU.NodeDefine = function(gl, fn, nd, ev){
	nd.win  = $(window);
	nd.hisBody = $("#side .history div.body:eq(0)");
	nd.navBody = $("#side .navigation div.body:eq(0)");
};
MENU.NodeSet = function(gl, fn, nd, ev){
};
MENU.StyleSet = function(gl, fn, nd, ev){
};
MENU.EventSet = function(gl, fn, nd, ev){
	nd.win.on("resize",ev.WindowResize);
};
MENU.BeginInvoke = function(gl, fn, nd, ev){
	gl.position = fn.getPosition(nd.win.width(),nd.win.height());
	if(gl.position == gl.PosMode.SIDE) fn.SetSideMenuHeight();
	//Core.DbgLog(gl.position);
};
MENU.RunAt(function(){
	if(!window.UA) return RunMode.CONTINUE;
	if(UA.gl.isMobile) return RunMode.END;
	return RunMode.ALL;
});