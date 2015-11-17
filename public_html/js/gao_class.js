window.RunMode = {END : -1,DEFINE : 0,ALL : 1,CONTINUE : 2};
window.Core = new (function(){
	this.DbgMode = 0;
	this.VERSION = "v1.2.0";
	this.STATUS = ["NoRunning", "FuncDefine", "EventDefine", "ParamDefine", "NodeDefine", "NodeSet", "StyleSet", "EventSet", "BeginInvoke", "Finish"];
	this.Create = (function(Core){
		return function(name){
			var self = this;
			self.statusCode = 0;
			
			var gl = self.gl = {};
			var fn = self.fn = {};
			var nd = self.nd = {};
			var ev = self.ev = {};
			
			self.ParamDefine = function(){
				Core.DbgLog("(注)" + name + "のParamDefineは未定義です");
			};
			self.FuncDefine = function(){
				Core.DbgLog("(注)" + name + "のFuncDefineは未定義です");
			};
			self.EventDefine = function(){
				Core.DbgLog("(注)" + name + "のEventDefineは未定義です");
			};
			self.NodeDefine = function(){
				Core.DbgLog("(注)" + name + "のNodeDefineは未定義です");
			};
			self.NodeSet = function(){
				Core.DbgLog("(注)" + name + "のNodeSetは未定義です");
			};
			self.StyleSet = function(){
				Core.DbgLog("(注)" + name + "のStyleSetは未定義です");
			};
			self.EventSet = function(){
				Core.DbgLog("(注)" + name + "のEventSetは未定義です");
			};
			self.BeginInvoke = function(){
				Core.DbgLog("(注)" + name + "のBeginInvokeは未定義です");
			};
			
			self.Run = function(mode){
				self.statusCode = 0;
				self.FuncDefine(gl,fn,nd,ev);
				self.statusCode++;
				self.EventDefine(gl,fn,nd,ev);
				self.statusCode++;
				self.ParamDefine(gl,fn,nd,ev);
				self.statusCode++;
				if(mode == RunMode.DEFINE){
					Core.DbgLog(name + "の定義だけしたの☆");
					return;
				}
				jQuery(function($) {
					self.NodeDefine(gl,fn,nd,ev);
					self.statusCode++;
					self.NodeSet(gl,fn,nd,ev);
					self.statusCode++;
					self.StyleSet(gl,fn,nd,ev);
					self.statusCode++;
					self.EventSet(gl,fn,nd,ev);
					self.statusCode++;
					self.BeginInvoke(gl,fn,nd,ev);
					self.statusCode++;
					Core.DbgLog(name + "の実行が完了したのっ♪");
					self.statusCode++;
				});
			};
			self.RunAt = function(func,cnt){
				if(typeof func !== "function") throw new Error("RunAtの第一引数には、タイミング制御の関数が必要です");
				
				cnt = (isNaN(cnt) || cnt == null) ? 100 : cnt;
				(function(){
					switch(func()-0){
						case RunMode.CONTINUE:
							if(cnt-->0) setTimeout(self.RunAt,10);
							break;
						case RunMode.ALL:
							self.Run(RunMode.ALL);
							break;
						case RunMode.DEFINE:
							self.Run(RunMode.DEFINE);
							break;
						default:
							cnt = -1;
							break;
					}
					if(cnt<0) Core.RlsLog("Extender."+name+"を中止しました。");
				})();
			};
		};
	})(this);
	this.DbgLog = function(){
		if (this.DbgMode == 1){
			this.RlsLog.apply(this, arguments);
		}
	};
	this.RlsLog = function(){
		if (typeof console !== "undefined"){
			for (var i=0,iLen=arguments.length;i<iLen;++i){
				console.log(arguments[i]);
			}
		}
	};
	this.DbgAlert = function(){
		if (this.DbgMode == 1){
			this.RlsAlert.apply(this, arguments);
		}
	};
	this.RlsAlert = function(){
		for (var i=0,iLen=arguments.length;i<iLen;++i){
			alert(arguments[i]);
		}
	};
})();