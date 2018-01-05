## 先用TSC编译，再用node来执行。

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



## 用ts-node来执行

1.安装TypeScript。

2.使用tsc --init初始化ts配置文件，然后修改配置，启用SourceMap：

```json
{
  "compilerOptions": {
    "target": "es5",                          /* Specify ECMAScript target version: 'ES3'
    "module": "commonjs",                     /* Specify module code generation: 'commonjs', 
    "sourceMap": true,                     /* Generates corresponding '.map' file. */
    "outDir": "./dist",                        /* Redirect output structure to the directory. */
    "strict": true                            /* Enable all strict type-checking options. */
  }
}
```

3.安装ts-node。这里全局安装或本地安装都行，反正lauch.json配置文件中指明正确的地址就行。不过要是本地安装，则TypeScript也要本地安装。

```
cnpm install -g ts-node
cnpm install --save-dev ts-node
```

4.配置lauch.json:

```json
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug by ts-node",
            "program": "${workspaceFolder}/node_modules/ts-node/dist/_bin.js",//需要本地安装ts-node，不然应指向全局安装的地址
            "args": [
                "${workspaceFolder}/index.ts"//真正执行的入口文件，以参数形式提供
            ],
            "cwd": "${workspaceFolder}",
            "protocol": "inspector",
            "outFiles": [
                "${workspaceFolder}/**/*.js"
            ]
        }
    ]
}
```

参考资料：https://segmentfault.com/a/1190000010605261