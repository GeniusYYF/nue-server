const nueRequest = {
    apiDict: {},
    create: function (apiDict, config) {
        console.log("request config:", config);
        // 将云函数包装为括号字符串
        // 数组形式
        if (config.codeNames && config.codeNames.length) {
            config.codeNames.forEach(name => {
                var paths = name.split("/")
                var path1 = paths[0];
                var path2 = paths[1];
                var path3 = paths[2];
                if (path3) {
                    apiDict[path1][path2][path3] = `(${apiDict[path1][path2][path3].toString()})`
                } else if (path2) {
                    for (let k in apiDict[path1][path2]) {
                        apiDict[path1][path2][k] = `(${apiDict[path1][path2][k].toString()})`
                    }
                } else {
                    for (let k in apiDict[path1]) {
                        for (let k2 in apiDict[path1][k]) {
                            apiDict[path1][k][k2] = `(${apiDict[path1][k][k2].toString()})`
                        }
                    }
                }
            })
        }
        // 字典形式
        if (config.codeNameDict) {
            for (let k in config.codeNameDict) {
                if (config.codeNameDict[k]) {
                    for (let k2 in config.codeNameDict[k]) {
                        if (config.codeNameDict[k][k2]) {
                            for (let k3 of config.codeNameDict[k][k2]) {
                                apiDict[k][k2][k3] = `(${apiDict[k][k2][k3].toString()})`
                            }
                        }
                    }
                }
            }
        }
        nueRequest.apiDict = apiDict;
        return this.request;
    },
    request: function (reqPath, query, res, config) {
        var reqPathList = reqPath.split("/");
        if (!reqPathList[0]) {
            reqPathList.shift(); // 防止第一项空白
        }
        if (!reqPathList[reqPathList.length - 1]) {
            reqPathList.pop(); // 防止最后一项空白
        }
        console.log("reqPathList", reqPathList);
        // console.log("apiDict", nueRequest.apiDict);
        var fun = {};
        for (let i = 0; i < reqPathList.length; i++) {
            if (i === 0) {
                fun = nueRequest.apiDict[reqPathList[i]]
            } else {
                fun = fun[reqPathList[i]]
            }
            // console.log("fun", fun, i);
            if (!fun) {
                break;
            }
        }
        if (fun) {
            if (typeof fun === "function") {
                return fun(query, res, config)
            } else {
                // res.data = JSON.stringify(fun); // 非函数
                // res.data = fun.toString(); // 非函数
                res.data = fun;
                return res;
            }
        } else {
            res.code = 0;
            res.msg = "未找到接口！";
            return res
        }
    },
}

module.exports = nueRequest