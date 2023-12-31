const nueServer = require("./server/index")

const apis = {
    nueServer: {
        test: {
            test1: (query, res, config) => {
                if (query && Object.keys(query).length) {
                    res.code = 1;
                    res.data = JSON.stringify(query);
                    res.msg = "数据为参数"
                } else {
                    res.code = 0;
                    res.data = {}
                    res.msg = "未收到参数"
                }
                return res
            }
        }
    },
    cloud: {
        test: {
            test1: () => {
                console.log("this is runtime fun")
                console.log("test api arguments:", arguments)
            }
        }
    }

};
const config = {
    "port": 9000,
    "users": {
        "b": "b"
    },
    request: {
        codeNames: ["nueServer"],
        codeNameDict: { cloud: { test: ['test1'] } }
    }
}
nueServer.createServer(apis, config)

console.log(nueServer);