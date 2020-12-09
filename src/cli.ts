#!/usr/bin/env node
import * as commander from "commander";
import {translate} from "./main";

const program = new commander.Command();

program
    .version(`0.0.1`)
    .name('fy')
    .usage('<English>')
    .arguments('<English>')
    .action((...args)=>{ //获得命令行执行当前文件后的字符串
        //console.log(args[0])
        translate(args[0])
    })


program.parse(process.argv)