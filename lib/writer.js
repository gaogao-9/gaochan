var path = require('path');
var fs = require('fs');
var location = require(path.resolve(__dirname,"location.js"));
var replacer = require(path.resolve(__dirname,"replacer.js"));

var GetTemplateHTML = function(){
	return fs.readFileSync(path.resolve(location["HOME"],"index.html"), "utf8");
};
var GetHistoryHTML = function(){
	return fs.readFileSync(path.resolve(location["HOME"],"history.html"), "utf8");
};
var GetContentsHTML = function(name){
	name = name || "error.html";
	return fs.readFileSync(path.resolve(location["CONTENTS"],name), "utf8");
};
var ReplaceHTML = function(html,target){
	html = html.replace(/(\t*)(<!--@NAVIGATION@-->)/g,replacer.navigation());
	html = html.replace(/(\t*)(<!--@HISTORY@-->)/g,replacer.history(GetHistoryHTML()));
	html = html.replace(/(\t*)(<!--@LASTUPDATE@-->)/g,replacer.lastupdate());
	html = html.replace(/(\t*)(<!--@STYLE@-->)/,replacer.style(target));
	html = html.replace(/(\t*)(<!--@SCRIPT@-->)/,replacer.script(target));
	html = html.replace(/(\t*)(<!--@TITLE@-->)/g,replacer.title());
	html = html.replace(/(\t*)(<!--@SUBTITLE@-->)/g,replacer.subtitle());
	html = html.replace(/(\t*)(<!--@NOROBOT@-->)/,replacer.norobot(target));
	html = html.replace(/(\t*)(<!--@img\[(.+)\]@-->)/g,replacer.image());
	html = html.replace(/(\t*)(<!--@link\[(.+)\]@-->)/g,replacer.link());
	
	return html;
};

exports.WriteIndexHTML = function(urlInfo){
	var writerInfo = {
		status : 200,
		html : GetTemplateHTML(),
		header  : {"Content-Type": "text/html"},
		isClose : true
	};
	var contents = "";
	contents += GetContentsHTML("top.html");
	contents += GetContentsHTML("about.html");
	contents += GetContentsHTML("tools.html");
	contents += GetContentsHTML("sketch.html");
	contents += GetContentsHTML("link.html");
	contents += GetContentsHTML("tips.html");
	
	writerInfo.html = writerInfo.html.replace(/(\t*)(<!--@CONTENTS@-->)/,replacer.contents(contents));
	writerInfo.html = ReplaceHTML(writerInfo.html,"index");
	
	return writerInfo;
};
exports.WriteErrorHTML = function(urlInfo,errCode){
	var writerInfo = {
		status : errCode,
		html : GetTemplateHTML(),
		header  : {"Content-Type": "text/html"},
		isClose : true
	};
	
	var contents = "";
	contents += GetContentsHTML("error.html");
	
	writerInfo.html = writerInfo.html.replace(/(\t*)(<!--@CONTENTS@-->)/,replacer.contents(contents));
	writerInfo.html = ReplaceHTML(writerInfo.html,"error");
	writerInfo.html = writerInfo.html.replace(/(\t*)(<!--@ERRORCODE@-->)/g,replacer.errorCode(errCode));
	
	switch(errCode){
		case 403 :
			writerInfo.html = writerInfo.html.replace(/(\t*)(<!--@ERRORMESSAGE@-->)/g,replacer.errorMessage("Forbidden"));
			break;
		case 404 :
			writerInfo.html = writerInfo.html.replace(/(\t*)(<!--@ERRORMESSAGE@-->)/g,replacer.errorMessage(((urlInfo.fullname)? (urlInfo.fullname + " is ") : "") + "Not Found"));
			break;
		case 500 :
			writerInfo.html = writerInfo.html.replace(/(\t*)(<!--@ERRORMESSAGE@-->)/g,replacer.errorMessage("Internal Server Error"));
			break;
		default :
			writerInfo.html = writerInfo.html.replace(/(\t*)(<!--@ERRORMESSAGE@-->)/g,replacer.errorMessage("原因不明のエラーが発生しました。"));
			break;
	}
	
	return writerInfo;
};
exports.WriteContents = function(urlInfo,res){
	var writerInfo = {
		status : 200,
		html : null,
		header  : {"Content-Type": "application/octet-stream"},
		isClose : false
	};
	if(urlInfo.pubpath.indexOf(path.resolve(__dirname,"../","public_html"))!=0){
		return exports.WriteErrorHTML(urlInfo,403);
	}
	if(!fs.existsSync(urlInfo.pubpath)){
		return exports.WriteErrorHTML(urlInfo,404);
	}
	var stat = fs.statSync(urlInfo.pubpath);
	if(stat.size == 0){
		return exports.WriteErrorHTML(urlInfo,500);
	}
	
    switch(urlInfo.extention){ //mintype分けめんどくさすぎﾜﾛ
		case "text" : 
		case "txt" : 
		    writerInfo.header["Content-Type"] = "text/plain";
			break;
		case "html" : 
		case "htm" : 
		    writerInfo.header["Content-Type"] = "text/html";
			break; 
		case "css" : 
		    writerInfo.header["Content-Type"] = "text/css";
			break;
		case "js" : 
		case "json" : 
		    writerInfo.header["Content-Type"] = "text/javascript";
			break;
		case "bmp" : 
		    writerInfo.header["Content-Type"] = "image/bmp";
			break;
		case "gif" : 
		    writerInfo.header["Content-Type"] = "image/gif";
			break;
		case "png" : 
		    writerInfo.header["Content-Type"] = "image/png";
			break;
		case "jpeg" : 
		case "jpg" : 
		    writerInfo.header["Content-Type"] = "image/jpg";
			break;
		default :
			break;
	}
	
	writerInfo.header["Content-Disposition"] = "inline; filename=\"" + urlInfo.fullname + "\"";
	writerInfo.header["Content-Length"] = stat.size;
	
	var readableStream = fs.createReadStream(urlInfo.pubpath, {encoding: null, bufferSize: 1});
	readableStream.on('data', function(data) {
		res.write(data);
	});
	readableStream.on('end', function() {
    	res.end();
	});
	
	return writerInfo;
};
