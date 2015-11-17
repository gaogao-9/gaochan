var path = require('path');
var fs = require('fs');
var location = require(path.resolve(__dirname,"location.js"));
var siteInfo = require(path.resolve(__dirname,"siteInfo.js"));
var stylePath = require(path.resolve(__dirname,"stylePath.js"));
var scriptPath = require(path.resolve(__dirname,"scriptPath.js"));

var PadZero = function(str,num){
	var output = "";
	var sLen = (str+"").length;
	while(output.length+sLen < num){
		output += "0";
	}
	output += str;
	return output.slice(-num);
};

module.exports = {
	contents : function(contents){
		var output,data;
		data = contents.split("\n");
		return function(all,tabs,value){
			output = "";
			for(var key in data){
				output += tabs + data[key] + '\n';
			}
			
			return output.slice(0,-1);
		};
	},
	navigation : function(page){
		var output,data;
		return function(all,tabs,value){
			output = "";
			for(var key in siteInfo["PAGETITLE"]){
				output += tabs + '--><li class="borderBox';
				output += (page == siteInfo["PAGETITLE"][key]) ? ' selected">' : '">';
				output += (page == siteInfo["PAGETITLE"][key]) ? '<span' : '<a href="/#' + key + '"';
				output += ' title="' + siteInfo["PAGETITLE"][key] + '">';
				output += siteInfo["PAGETITLE"][key];
				output += (page == siteInfo["PAGETITLE"][key]) ? '</span>' : '</a>';
				output += '</li>';
				output += '<!--\n';
			}
			
			return tabs + output.slice(tabs.length+3,-5);
		};
	},
	history : function(page){
		var output,data;
		data = page.split("\n");
		return function(all,tabs,value){
			output = "";
			for(var i=0,iLen=data.length;i<iLen;i+=3){
				output += tabs + '<p>' + data[i] + ' ' + data[i+1] + '<br>' + data[i+2] + '</p>\n';
			}
			
			return output.slice(0,-1);
		};
	},
	lastupdate : function(page){
		var output,udt,utc,dt;
		var stat = fs.statSync(path.resolve(location["HOME"],"history.html"));
		return function(all,tabs,value){
			output = "JST ";
			
			udt = new Date(stat.mtime);
			utc = udt.getTime() + (udt.getTimezoneOffset() * 60000);
			dt = new Date(utc + (3600000 * 9));
			
			output += PadZero(dt.getFullYear(),2);
			output += "/";
			output += PadZero(dt.getMonth()+1,2); //これまじで+1するの忘れるからやめてくれ
			output += "/";
			output += PadZero(dt.getDate(),2);
			output += " ";
			output += PadZero(dt.getHours(),2);
			output += ":";
			output += PadZero(dt.getMinutes(),2);
			output += ":";
			output += PadZero(dt.getSeconds(),2);
			
			return tabs + output;
		};
	},
	style : function(name){
		var tags = stylePath["all"];
		var output;
		if(name && stylePath[name]){
			tags = tags.concat(stylePath[name]);
		}
		return function(all,tabs,value){
			output = "";
			for(var key in tags){
				output += tabs + '<link href="/css/' + tags[key] + '" rel="stylesheet" type="text/css">\n';
			}
			
			return output.slice(0,-1);
		};
	},
	script : function(name){
		var tags = scriptPath["all"];
		var output,target;
		if(name && scriptPath[name]){
			tags = tags.concat(scriptPath[name]);
		}
		return function(all,tabs,value){
			output = "";
			for(var key in tags){
				target = tags[key].split(",");
				
				output += tabs + '<script src="/js/' + target[0] + '"'+((target.length>1) ? (' ' + target[1]) : '')+'></script>\n';
			}
			
			return output.slice(0,-1);
		};
	},
	title : function(){ //わざわざ関数にする理由とは・・・ｳｺﾞｺﾞｺﾞｺﾞ
		return function(all,tabs,value){
			return tabs + siteInfo["TITLE"];
		};
	},
	subtitle : function(){ //わざわざ関数にする理由とは・・・ｳｺﾞｺﾞｺﾞｺﾞ
		return function(all,tabs,value){
			return tabs + "";
		};
	},
	image : function(){
		var params,pLen;
		return function(all,tabs,tag,value){
			var output = '<a target="_blank" href="[HREF]"><img src="[SRC]" alt="[ALT]"></a>';
			
			params = value.split(",");
			pLen = params.length;
			
			output = output.replace("[HREF]",params[1]+"."+params[0]);
			output = output.replace("[ALT]",params[pLen-1]);
			switch(pLen){
				case 3:
					output = output.replace("[SRC]",params[1]+"."+params[0]);
					break;
				case 4:
					output = output.replace("[SRC]",params[1]+"_"+params[2]+"."+params[0]);
					break;
			}
			
			return tabs + output;
		};
	},
	norobot : function(name){
		var output;
		return function(all,tabs,value){
			output = tabs;
			
			output += (name=="index") ? '<!--検索ロボット氏～～～もっと見てくだされ～～～-->' : '<meta NAME="ROBOTS" CONTENT="NOINDEX,NOFOLLOW,NOARCHIVE">' ;
			
			return output;
		};
	},
	link : function(){
		var params,pLen;
		return function(all,tabs,tag,value){
			var output = '<a target="_blank" href="[HREF]" title="[TITLE]">[CONTENTS]</a>';
			var contents = '<img src="[SRC]" alt="[ALT]">';
			
			params = value.split(",");
			pLen = params.length;
			
			output = output.replace("[HREF]",params[0]);
			output = output.replace("[TITLE]",params[1]);
			switch(pLen){
				case 2:
					contents = params[1];
					break;
				case 3:
					contents = contents.replace("[SRC]",params[pLen-1]);
					contents = contents.replace("[ALT]",params[1]);
					break;
			}
			
			output = output.replace("[CONTENTS]",contents);
			
			return tabs + output;
		};
	},
	errorCode : function(errCode){
		return function(all,tabs,value){
			return tabs + errCode;
		};
	},
	errorMessage : function(errMes){
		return function(all,tabs,value){
			return tabs + errMes;
		};
	}
};