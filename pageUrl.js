const page = {
	pageUrl:{
		test:"./test.js"
	},
	getEntry:function(){
		return page.parsePageUrl(0,page.pageUrl,{},"");
	},
	getOutput:function(){
		return {
			filename: '[name].bundle.js',
		    path:__dirname + '/dist',
		    publicPath: '/dist/'
		}
	},
	parsePageUrl:function(count,parseObj,resultObj,namespace){
		if(count > 10000){
			return resultObj;
		}
		for(key in parseObj){
			if(typeof parseObj[key] == "string"){
				resultObj[namespace+key] = parseObj[key];
			}else if(typeof parseObj[key] == "object"){
				page.parsePageUrl(count++,parseObj[key],resultObj,key + ".");
			}		
		}
		return resultObj;
	}	
}

module.exports = page;

