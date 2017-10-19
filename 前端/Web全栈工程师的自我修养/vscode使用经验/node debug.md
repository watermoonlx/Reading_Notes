使用Node时的简单配置如下：

```json
{
    // 使用 IntelliSense 以学习相关的 Node.js 调试属性。
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",//Debuuger的类型
            "request": "launch",//该Debug配置的启动方式，launch或者attach
            "name": "开始Debug",//该Debug配置的名称
            "preLaunchTask": "tsc",//运行程序前需要执行的任务，通常是编译、构建等任务。需要在task.json中指定。
            "program": "${workspaceRoot}/src/app.ts",//程序入口。由于Debugger默认启用的Sourcemap，故可以直接指定为ts文件地址。注意，这里的值如果设为${file}，则点击F5调试的就是当前打开文件。
            "outFiles": [
                "${workspaceRoot}/dist/**/*.js"    //当入口指定的是ts文件地址，且ts编译出的js文件于ts不在同一目录下时，则需要指定编译出的js的输出目录。
            ],
            "smartStep": true//该选项置为true，则可只debugger有SourceMap的文件。
        }
    ]
}
```

关于VS Code Debug的通用指南，可参考：https://code.visualstudio.com/docs/editor/debugging

关于Node的Debug指南，可参考：https://code.visualstudio.com/docs/nodejs/nodejs-debugging