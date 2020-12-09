import * as https from "https";
import * as querystring from "querystring";
import md5 = require("md5");
import {appid, secretKey} from "./private";
import {IncomingMessage} from "http";

export const translate = (word: string) => {
    // console.log('word:')
    // console.log(word)

    //省略版的加盐随机数
    const salt = Math.random()
    //sign=appid+q+salt+密钥 的MD5值
    //appid和secretKey(密钥)需要API提供.
    const sign = md5(appid + word + salt + secretKey)

    //使用querystring模块拼接请求参数.
    const query: string = querystring.stringify({
        q: word,
        from: 'en',
        to: 'zh',
        appid: appid,
        salt: salt,
        sign: sign
    })

    const options = {
        hostname: 'api.fanyi.baidu.com',
        port: 443,
        path: '/api/trans/vip/translate?' + query,
        method: 'GET'
    };

    const request = https.request(options, (response:IncomingMessage) => {
        const chunks:Buffer[] =[]
        response.on('data', (chunk) => {
            chunks.push(chunk)
            //process.stdout.write(d);
        });
        type baiduResult={
            from:string,
            to:	string,
            trans_result: [{src: string, dst: string}],
            error_code?: string,
            error_msg?: string,
        }
        response.on('end',()=>{
            let s = Buffer.concat(chunks).toString();
            let obj: baiduResult = JSON.parse(s);
            //{ error_code: '52003', error_msg: '未授权' }
            if(obj.error_code){
                console.log(obj)
                console.log(obj.error_msg)
                process.exit(500)
            }else {
                console.log(obj.trans_result[0].src)
                console.log(obj.trans_result[0].dst)
                process.exit(-1)
            }

        })

    });

    request.on('error', (e:Error) => {
        console.error(e);
    });
    request.end();

}