var http = require('http');
var path = require('path');
var url = require('url');
var writer = require(path.resolve(__dirname,"lib","writer.js"));
var port = process.env.PORT || 8080;

http.createServer(function(input,output){
	var urlInfo = url.parse(input.url,true);
	var writerInfo;
	var resHTML = "";
	
	//拡張子情報をurlInfoに追加
	urlInfo.extention = (function(){
		var res;
		if(~(res = urlInfo.pathname.lastIndexOf("."))){
			return urlInfo.pathname.slice(res+1);
		}
		return null;
	})();
	//ファイル名(フルネーム)情報をurlInfoに追加
	urlInfo.fullname = (function(){
		var res,tmp;
		if(~(res = urlInfo.pathname.lastIndexOf("/"))){
			tmp = urlInfo.pathname.slice(res+1);
			if(tmp.length==0) return null;
			return tmp;
		}
		return null;
	})();
	//ファイル名情報をurlInfoに追加
	urlInfo.name = (function(){
		var res,tmp;
		if(!urlInfo.fullname) return null;
		if(!urlInfo.extention) return urlInfo.fullname;
		
		tmp = urlInfo.fullname.slice(0,urlInfo.fullname.lastIndexOf(urlInfo.extention)-1);
		while(true){
			if(tmp.length==0) return null;
			if(!~(res = tmp.lastIndexOf("."))) break;
			tmp = tmp.slice(0,res);
		}
		
		return tmp;
	})();
	//public_html内と仮定したディレクトリパスを取得
	urlInfo.pubpath = (function(){
		return path.resolve(__dirname,"public_html","."+urlInfo.pathname);
	})();
	//console.log(urlInfo);
	
	switch(true){
		case urlInfo.pathname == "/":
		case urlInfo.pathname == "/index.html":
			writerInfo = writer.WriteIndexHTML(urlInfo);
			break;
		case !urlInfo.name:
		case !urlInfo.extention:
			writerInfo = writer.WriteErrorHTML(urlInfo,404);
			break;
		default:
			writerInfo = writer.WriteContents(urlInfo,output);
	}
	
	output.writeHead(writerInfo.status,writerInfo.header);
	if(writerInfo.html != null){
		output.write(writerInfo.html);
	}
	if(writerInfo.isClose){
		output.end();
	}
}).listen(port);
console.log("がおさんち起動っ");
