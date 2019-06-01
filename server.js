const express = require('express');
const http = require('http'); 
const bodyParser = require("body-parser"); 
const querystring = require('querystring');
const multiparty = require('multiparty');
const httpRequest = require('./nodeServer/httpRequest.js');
const httpAction = require('./nodeServer/httpAction.js');
const fileUpload = require('./nodeServer/fileUpload.js');
const projectConfig = require('./config/projectConfig.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

var server = app.listen(8090, function () {
});

var requestHead = projectConfig.requestHead;

app.post(requestHead+"/fileUpload/*",function(req,res){
  let headParam = httpAction.getFileRequestHead(req.originalUrl,requestHead+'/fileUpload/');
  if(headParam){
    if(!httpAction.checkDomain(headParam.host)){
      res.json(JSON.parse('{"msg":"你请求接口的域名不在合法域名白名单中"}'));
      return;
    }
    try{
    	fileUpload.fileUpload(req,function(fileName,data){
	      let param = {
	        sessionId:headParam.param.sessionId,          
	        input:"1506588286000",
	        div:"ff221d60ec46236becdca3ea40136da7",
	        token:"62a144bdd4984ba381998d62779902be"
	      };
	      param[fileName] = data.toString("base64");
	      try{
	        httpRequest.httpPost(headParam.host,headParam.path,param,function(result){
	          if(result){
	            res.json(JSON.parse(result));
	          }
	        },function(err){
	            res.json(err);
	        });
	      }catch(e){
	        console.log(e);
          res.json(JSON.parse('{"msg":"服务器繁忙，请稍后访问"}'));
	      }       
	    })
    }catch(e){
      console.log(e);
      res.json(JSON.parse('{"msg":"服务器繁忙，请稍后访问"}'));
    }    
  }  
});

app.post(requestHead+"/aliFileUpload/*",function(req,res){
	let headParam = httpAction.getFileRequestHead(req.originalUrl,requestHead+'/aliFileUpload/');
	try{
		fileUpload.aliFileUpload(req,headParam.param,function(result){
			if(result){
	        res.json(result);
	    }
      return;
		})
	}catch(e){
      console.log(e);
      res.json(JSON.parse('{"msg":"服务器繁忙，请稍后访问"}'));
      return;
    } 	
});

app.get(requestHead+'/json/*', function (req, res) {
  let headParam = httpAction.getRequestHead(req.originalUrl,requestHead+/json/);
  if(headParam){
    if(!httpAction.checkDomain(headParam.host)){
      res.json(JSON.parse('{"msg":"你请求接口的域名不在合法域名白名单中"}'));
      return;
    }
    try{
      httpRequest.httpGet(headParam.host,headParam.path,req.query,function(result){
        if(result){    
          res.json(JSON.parse(result));          
        }
        return;
      },function(err){
          console.log(err);
          res.json(JSON.parse('{"msg":"服务器繁忙，请稍后访问"}'));
          return;
      });
    }catch(e){
      console.log(e);
      res.json(JSON.parse('{"msg":"服务器繁忙，请稍后访问"}'));
      return;
    }    
  }
});

app.post(requestHead+'/json/*', function (req, res) {
  let headParam = httpAction.getRequestHead(req.originalUrl,requestHead+"/json/");
  if(headParam){
    if(!httpAction.checkDomain(headParam.host)){
      res.json(JSON.parse('{"msg":"你请求接口的域名不在合法域名白名单中"}'));
      return;
    }
    try{
      httpRequest.httpPost(headParam.host,headParam.path,req.body,function(result){       
        if(result){
          res.json(JSON.parse(result));        
        }
        return;
      },function(err){
          console.log(err);
          res.json(JSON.parse('{"msg":"服务器繁忙，请稍后访问"}'));
          return;
      });
    }catch(e){
      console.log(e);
      res.json(JSON.parse('{"msg":"服务器繁忙，请稍后访问"}'));
      return;
    }    
  }
});

app.get(requestHead+"*",function(req,res){
   let url = httpAction.getRequestUrl(req.url,requestHead);
   let pathUrl = httpAction.getFullPageUrl(url);
   let cek = httpAction.checkRootDirectory(pathUrl);
   if(cek){
      res.sendfile( __dirname+pathUrl); 
   }else{
      res.json(JSON.parse('{"msg":"你访问的目录受到保护，请联系我们的技术员"}'));
      return;
   }   
});
