// 自定义Api接口实现
const nueRequest = require("./request");

// 引入核心模块
const http = require("http"); // import * as http from 'node:http';
//导入url模块
const url = require("url");

// 响应头文件
const nueServer = {
	config: {
		"port": 9000,
		"users": {},
		request: {
			codeNames: [],
			codeNameDict: [],
		}
	},
	server: null,
	resHeader: {
		// 'Access-Control-Allow-Credentials': 'true',     // 后端允许发送Cookie
		'Access-Control-Allow-Origin': '*',    // 允许访问的域（协议+域名+端口）
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'DNT,X-Mx-ReqToken,Keep-Alive,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization,Accept-Encoding,Connection,Cookie,Host,Origin,Referer,User-Agent,token,tokenStamp',
		/* 
		 * 此处设置的cookie还是domain2的而非domain1，因为后端也不能跨域写cookie(nginx反向代理可以实现)，
		 * 但只要domain2中写入一次cookie认证，后面的跨域接口都能从domain2中获取cookie，从而实现所有的接口都能跨域访问
		 */
		// 'Set-Cookie': 'l=a123456;Path=/;Domain=www.domain2.com;HttpOnly'  // HttpOnly的作用是让js无法读取cookie
	},
	request: function () { },
	createServer: function (apis, config) {
		this.config = { ...this.config, ...config };
		// console.log(this.config);
		// 创建服务器(API返回的是一个实例)
		this.server = http.createServer((request, response) => {
		}).listen(this.config.port, () => {
			console.log(`${this.config.port} 服务器启动成功,等待客户端请求...`)
		})
		this.request = nueRequest.create(apis, this.config.request);
		this._onRequest();
		return this.server;
	},
	_onRequest: function () {
		// 监听客户端发起的请求
		this.server.on('request', (request, response) => {
			response.setHeader('Content-Type', 'text/html; charset=utf-8')
			//获取请求url的传值
			var reqUrl = url.parse(request.url, true)
			var reqPath = request.url.split("?")[0]
			var query = reqUrl.query;
			var body = reqUrl.body;
			let res = {
				code: 1,
				data: {},
				msg: "",
				date: new Date().toLocaleString(),
			}
			console.log(request.method," ================ ", res.date, " ================ ", reqPath, " ================ ", query, " ================ ", body);
			// const reqList = reqPath.split('/')
			// const api = reqList[1];
			// const reqInterface = reqPath.substring(api.length + 1);
			// console.log("收到请求：", request);
			// console.log("get请求参数：", query)
			// console.log("get请求路径：", reqPath);
			// console.log("get请求api：", api);
			// console.log("get请求接口：", reqInterface);
			// 跨域后台设置
			try {
				switch (request.method) {
					case "GET":
						this.request(reqPath, query, res, this.config);
						break;
					case "POST":
						this.request(reqPath, body, res, this.config);
						break;
					default:
						break;
				}
				response.writeHead(200, this.resHeader);
				response.write(JSON.stringify(res))
				response.end()
				// console.log("success:", res);
			} catch (e) {
				res.code = 500;
				res.msg = e.toString();
				response.writeHead(500, this.resHeader);
				response.write(JSON.stringify(res))
				response.end()
				console.error(res, e);
			}
			// 		case "/sql":
			// 			var opt = eval("(" + query.opt + ")"); // 括号必须加
			// 			console.log(opt)
			// 			res.msg = "sql查询"
			// 			res.data = Xyt.sql[query.api](opt)
			// 			break
			// 	}

			// }
		})
	}
}

module.exports = nueServer;
