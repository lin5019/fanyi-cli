"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate = void 0;
var querystring = __importStar(require("querystring"));
var md5 = require("md5");
var private_1 = require("./private");
var translate = function (word) {
    // console.log('word:')
    // console.log(word)
    //省略版的加盐随机数
    var salt = Math.random();
    //sign=appid+q+salt+密钥 的MD5值
    //appid和secretKey(密钥)需要API提供.
    var sign = md5(private_1.appid + word + salt + private_1.secretKey);
    //使用querystring模块拼接请求参数.
    var query = querystring.stringify({
        q: word,
        from: 'en',
        to: 'zh',
        appid: private_1.appid,
        salt: salt,
        sign: sign
    });
    var https = require('https');
    var options = {
        hostname: 'api.fanyi.baidu.com',
        port: 443,
        path: '/api/trans/vip/translate?' + query,
        method: 'GET'
    };
    var request = https.request(options, function (response) {
        var chunks = [];
        response.on('data', function (chunk) {
            chunks.push(chunk);
            //process.stdout.write(d);
        });
        response.on('end', function () {
            var s = Buffer.concat(chunks).toString();
            var obj = JSON.parse(s);
            //{ error_code: '52003', error_msg: '未授权' }
            if (obj.error_code) {
                console.log(obj);
                console.log(obj.error_msg);
                process.exit(500);
            }
            else {
                console.log(obj.trans_result[0].src);
                console.log(obj.trans_result[0].dst);
                process.exit(-1);
            }
        });
    });
    request.on('error', function (e) {
        console.error(e);
    });
    request.end();
};
exports.translate = translate;
