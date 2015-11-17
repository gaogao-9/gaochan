window.UA = new Core.Create("UserAgent");
UA.ParamDefine = function(gl, fn, nd, ev){
    var agent = navigator.userAgent;
	
    gl.isMobile  = false;
    gl.isAndroid = false;
    gl.isIOS     = false;
    gl.isOpera   = false;
    gl.isOpera12 = false;
    gl.isIE      = false;
    gl.isIE8     = false;
    gl.isIE9     = false;
    gl.isIE10    = false;
    gl.isIE11    = false;
    gl.isFirefox = false;
    gl.isChrome  = false;
    gl.isSafari  = false;
	
    if(~agent.indexOf('iPhone') || ~agent.indexOf('iPad') || ~agent.indexOf('iPod') || ~agent.indexOf('Android')){
        gl.isMobile = true;
		(~agent.indexOf('Android')) ? gl.isAndroid = true : gl.isIOS = true;
    }
	
    if(window.opera || (~agent.indexOf('OPR') && ~agent.indexOf('AppleWebKit') && ~agent.indexOf('Chrome'))){
        gl.isOpera = true;
		if(window.opera) gl.isOpera12 = true;
    }
	else if(~agent.indexOf('AppleWebKit') && ~agent.indexOf('Chrome')) {
        gl.isChrome = true;
    }
	else if(~agent.indexOf('AppleWebKit') && ~agent.indexOf('Safari')) {
        gl.isSafari = true;
    }
	else if(!-[1,]){
        gl.isIE  = true;
        gl.isIE8 = true;
    }
	else if(document.uniqueID && !window.matchMedia){
        gl.isIE  = true;
        gl.isIE9 = true;
	}
	else if(/*@cc_on!@*/false){
        gl.isIE   = true;
        gl.isIE10 = true;
    }
	else if(~agent.indexOf('Trident')){
        gl.isIE   = true;
        gl.isIE11 = true;
    }
	else if(document.getElementById){
        gl.isFirefox = true;
    }
	
	Core.DbgLog("UserAgent",gl);
};
UA.Run(RunMode.DEFINE);