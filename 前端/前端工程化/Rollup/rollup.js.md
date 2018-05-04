[TOC]

# 介绍 Introduction

## 概览 Overview

Rollup是一个JS打包工具，用于将多个小的代码文件编译为一个大而复杂的代码文件，比如一个库或应用。它使用了全新的标准的ES6模块规范，而非以往的非标准模块解决方案（如CommonJS，AMD等）。通过使用ES6模块系统，你可以自由地、无缝地组合你喜欢的库中的函数。ES6模块未来可能会得到原生支持，但现在Rollup就可以让你使用他。



## 快速开始 Quick start

使用`npm install --global rollup`来安装。Rollup既可通过命令行[command line interface](https://github.com/rollup/rollup/wiki/Command-Line-Interface)配合可选的配置文件来使用，也可以通过 [JavaScript API](https://github.com/rollup/rollup/wiki/JavaScript-API)来使用。

> 库打包示例：[rollup-starter-lib](https://github.com/rollup/rollup-starter-lib)
>
> 应用打包示例：[rollup-starter-app](https://github.com/rollup/rollup-starter-app)

这些命令假设你的应用的入口文件时main.js，并且你希望将所有文件打包为一个名为bundle.js的文件。

对于浏览器：

```bash
# compile to a <script> containing a self-executing function ('iife')
# 编译为一个<script>标签，其包含一个立即执行函数。
$ rollup main.js --o bundle.js --f iife
```

对于Node.js：

```bash
# compile to a CommonJS module ('cjs')
# 编译为一个CommonJS模块
$ rollup main.js --o bundle.js --f cjs
```

对于浏览器和Node.js：

```bash
# UMD format requires a bundle name
# 便以为UMD模块。需要指定一个bundle名称。
$ rollup main.js --o bundle.js -f umd --name "myBundle"
```



## Why



## Tree-shaking

除了让你可以使用ES6模块以外，Rollup还会对你import的模块进行静态分析，从而去除所有你并未真正使用的代码。这你让你可以在已有的工具和模块之上编写代码，并且不会引入额外的依赖和让应用体积膨胀。

举例来说，当你使用CommonJS时，若引用了一个库，则这个库将作为一个对象被整体导入，不管是否使用了其中所有内容：

```js
// import the entire utils object with CommonJS
var utils = require( './utils' );
var query = 'Rollup';
// use the ajax method of the utils object
utils.ajax( 'https://api.example.com?search=' + query ).then( handleResponse );
```

但当使用ES6模块时，我们不需要导入这个utils对象，而只需要导入ajax这个函数即可：

```js
// import the ajax function with an ES6 import statement
import { ajax } from './utils';
var query = 'Rollup';
// call the ajax function
ajax( 'https://api.example.com?search=' + query ).then( handleResponse );
```

Rollup只包含所需的最低限度的代码，因此其打包出来的库或应用更加轻量、快速、简洁。由于这种方式依赖于显示的imoprt和export声明，这比单纯地运行一个自动精简缩小器来侦测编译后代码的未使用变量要有效得多。



## 兼容性 Compatibility

### 导入CommonJS

Rollup可以通过[rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs)来导入现有的CommonJS模块。

### 发布ES6模块（发布以ES6模块形式编写的代码）

为了让你使用ES6模块编写的代码能够被使用CommonJS的工具（如Node.js或webpack）所使用，你可以使用Rollup将代码打包为UMD或CommnJS格式，然后在package.json文件中将main属性指向编译出的文件。

如果你的package.json文件有module字段，则能够识别ES6模块的工具（比如Rollup和webpack2）可以直接导入ES6的版本。



# 常见问题

## 为什么说ES模块比CommonJS模块好？

* ES模块是标准的
* ES模块时静态的，可以对其进行静态分析，进而执行“摇树优化（tree-shaking）”，以及其他高级特性，如循环依赖（circular references）和动态绑定（live bindings）。

## 什么是“摇树优化（tree-shaking）”？

Tree-shaking，也被称作“live code inclusion”，是指去除项目中未真正使用的代码的过程。

## 怎么让Rollup导入CommonJS模块？

Rollup默认实现ES6模块规范，而不是CommnJS模块规范。加载CommonJS模块，以及Node的模块解析逻辑都是实现在可选的插件中的，而非默认包含于Rullup核心中。因此，为了加载CommonJS模块，你需要安装[CommonJS](https://github.com/rollup/rollup-plugin-commonjs)和[node-resolve](https://github.com/rollup/rollup-plugin-node-resolve)插件，然后在rollup.config.js文件中启用它们。

## Rollup是否是用于构建库或应用的？

Rollup已经被大量大小JS库所使用，并且也可以用于构建大小应用。但是，如果你希望在使用code-splitting或者动态加载，你需要额外的运行时来处理缺失代码加载的问题。我们推荐使用[SystemJS Production Build](https://github.com/systemjs/systemjs#browser-production)，因为它可以和Rollup的system格式完美集成。你也可以选择使用一个AMD loader。



# 教程 Tutorial

## 创建你的第一个bundle

使用Rollup的最简单方式是命令行。目前，我们将全局安装Rollup（后面我们会学习如何本地安装到项目中，从而让你的构建过程可移植）。

输入下面的命令来全局安装Rollup：

```bash
npm install rollup --global # or `npm i rollup -g` for short
```

限制即可运行rollup命令：

```bash
rollup
```

由于没有传递参数，因此Rollup将打印出使用指南。这与使用`rullup --help`或`rollup -h`效果一样。

创建示例项目。

现在可以开始创建一个bundle了：

```bash
rollup src/main.js -f cjs
```

`-f`选项是`--format`选项的缩写，用于指定bundle的类型。这里我们指定的是CommonJS，即可以直接在Node.js中使用的模块。由于我们没有指定输出文件，故打包结果会直接输出到`stdout`。

你可以通过以下方式将输出结果保存为文件：

```bash
rollup src/main.js -o bundle.js -f cjs
```

（你可可以通过输出重定向的方式来保存文件，`rollup src/main.js -f cjs>bundle.js`。但后面我们会看到，这当需要生成sourcemap时，这种方式灵活性不够。）

## 使用配置文件

当我们需要指定多个选项时，通过命令行参数的形式来配置会非常麻烦，且每次都要重复输入。

我们可以创建一个配置文件，其中包含我们所需的所有选项配置。配置文件也是一个JS文件，它比命令行灵活得多。

在项目根目录下创建一个名为`rollup.config.js`的文件，然后添加如下代码：

```js
export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  }
};
```

为了是配置文件生效，我们需要使用`--config`或`-c`选项：

```js
rollup -c
```

这将使rollup默认使用rollup.config.js文件作为选项配置。

你可以显式指定命令行选项来覆盖配置文件中的对应配置：

```bash
rollup -c -o bundle-2.js
```

（注意，Rollup自己处理配置文件，因此我们可以使用`export default`语法，而不像其他很多配置文件一样使用module.exports。但配置文件并没有经过babel或类似工具转译，因此配置文件中只能使用你正在使用的Node.js所支持的语法。）

你也可以手动指定配置文件路径：

```bash
rollup --config rollup.config.dev.js
rollup --config rollup.config.prod.js
```

## 使用插件

目前，我们已经创建了一个简单的bundle，其包含的内容是：一个入口文件通过相对路径导入了一个module。当构建更复杂的bundle时，你经常需要更多的灵活性，比如：导入通过npm安装的模块，通过Babel进行编译，使用JSON文件等等。

为此，我们需要使用插件（plugin），它们将修改Rollup打包过程中在关键节点的行为。所有可用的插件可参阅：[the Rollup wiki](https://github.com/rollup/rollup/wiki/Plugins)。

在本教程中，我们将使用 [rollup-plugin-json](https://github.com/rollup/rollup-plugin-json)，它让Rollup可以从JSON文件中导入数据。

首先，在package.json中增加script：

```js
{
  "name": "rollup-tutorial",
  "version": "1.0.0",
  "scripts": {
    "build": "rollup -c"
  }
}
```

然后，安装插件：

```bash
npm install --save-dev rollup-plugin-json
```

然后，修改src/main.js文件，导入package.json的内容。

然后，编辑`rollup.config.js`文件，加入JSON plugin。

```js
// rollup.config.js
import json from 'rollup-plugin-json';

export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [ json() ]
};
```

然后，通过`npm run build`执行构建。结果如下：

```js
'use strict';

var version = "1.0.0";

function main$1 () {
    console.log(`version: ${version}`);
}

module.exports = main$1;

```

注意，在上面的例子中，整个package.json包含一个大的json对象，但只有我们真正使用的字段（即version字段）被导入了，其余所有字段都被忽略。这就是tree-shaking的实战应用。

## 实验性的代码分割（Code Splitting）

为了使用实验性的代码分割功能，我们需要添加第二个入口文件src/main2.js，它动态加载main.js。

```js
// src/main2.js
export default function () {
  return import('./main.js').then(({ default: main }) => {
    main();
  });
}
```

接下来，我们将两个入口文件都作为参数传递给rollup，另外，通过`--dir`选项指定一个输出目录，而非单个特定输出文件。最后，还需要开启experimental标记。

```bash
rollup src/main.js src/main2.js -f cjs --dir dist --experimentalCodeSplitting --experimentalDynamicImport
```



# 命令行接口

Rollup通常通过命令行调用。你可以提供一个配置文件来简化命令行的使用，同时也可以启用一些高级功能。

## 配置文件

配置文件时可选的，但是它非常强大和方便，故强烈推荐使用。

一个配置文件就是一个ES6模块，它导出一个包含配置的默认对象。典型的，该文件名字叫`rollup.config.js`，且放置与项目根目录。

所有可配置项请参阅：[big list of options](https://rollupjs.org/guide/en#big-list-of-options)。

```js
// rollup.config.js
export default { // can be an array (for multiple inputs)
  // core input options
  input,     // required
  external,
  plugins,

  // advanced input options
  onwarn,
  perf,

  // danger zone
  acorn,
  acornInjectPlugins,
  treeshake,
  context,
  moduleContext,
  
  // experimental
  experimentalCodeSplitting,
  experimentalDynamicImport,

  output: {  // required (can be an array, for multiple outputs)
    // core output options
    format,  // required
    file,
    dir,
    name,
    globals,

    // advanced output options
    paths,
    banner,
    footer,
    intro,
    outro,
    sourcemap,
    sourcemapFile,
    interop,
    extend,

    // danger zone
    exports,
    amd,
    indent,
    strict,
    freeze,
    legacy,
    namespaceToStringTag
  },

  watch: {
    chokidar,
    include,
    exclude,
    clearScreen
  }
};
```

你可以从配置文件中export一个数组，用于从多个不同的入口构建多个bundle。可用于watch模式。若想为同一个入口文件构建多份输出，可以为output提供一个数组：

```js
// rollup.config.js (building more than one bundle)
export default [{
  input: 'main-a.js',
  output: {
    file: 'dist/bundle-a.js',
    format: 'cjs'
  }
}, {
  input: 'main-b.js',
  output: [
    {
      file: 'dist/bundle-b1.js',
      format: 'cjs'
    },
    {
      file: 'dist/bundle-b2.js',
      format: 'es'
    }
  ]
}];
```

如果你想异步创建配置，则可让配置文件返回一个Promise，该Promise而后会Resolve一个object或array。

```js
// rollup.config.js
import fetch from  'node-fetch';
export default fetch('/some-remote-service-or-file-which-returns-actual-config');
```

同样的，也可以这样做：

```js
// rollup.config.js (Promise resolving an array)
export default Promise.all([
  fetch('get-config-1'),
  fetch('get-config-2')
])
```

当你想做以下事情时，你必须使用一个配置文件：

* 将一个项目打包为多个输出文件。
* 使用Rollup插件，比如[rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve)和[rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs)，它们可让你加载CommnJS模块。
  * rollup-plugin-commonjs将CommonJS模块转化为ES6模块，从而让Rollup可以进行静态分析。
  * rollup-plugin-node-resolve可让Rollup在定位模块时，使用[Node resolution algorithm](https://nodejs.org/api/modules.html#modules_all_together)，从而成功定位node_modules中的模块。

为了使用配置文件，需要传递`--config`或`-c`标记：

```bash
# use Rollup with a rollup.config.js file
$ rollup --config

# alternatively, specify a custom config file location
$ rollup --config my.config.js
```

在配置文件中，你还可以导出一个函数。该函数接收当前命令行所有参数构成的对象作为参数，然后返回一个配置对象或数组。这让你可以根据参数动态构建配置对象或数组。你也可以自定义命令行参数，只需要在参数名前加上前缀`config`。

```js
// rollup.config.js
import defaultConfig from './rollup.default.config.js';
import debugConfig from './rollup.debug.config.js';

export default commandLineArgs => {
  if (commandLineArgs.configDebug === true) {
    return debugConfig;
  }
  return defaultConfig;
}
```

现在，你可以执行`rollup --config --configDebug`，从而让debugConfig被启用。

## 命令行参数Command line flags

配置文件中很多配置项，都有对应的命令行参数。可通过命令行参数来覆盖配置文件中的配置。

```
-c, --config                Use this config file (if argument is used but value
                              is unspecified, defaults to rollup.config.js)
-i, --input                 Input (alternative to <entry file>)
-o, --file <output>         Output (if absent, prints to stdout)
-f, --format [es]           Type of output (amd, cjs, es, iife, umd)
-e, --external              Comma-separate list of module IDs to exclude
-g, --globals               Comma-separate list of `module ID:Global` pairs
                              Any module IDs defined here are added to external
-n, --name                  Name for UMD export
-m, --sourcemap             Generate sourcemap (`-m inline` for inline map)
-l, --legacy                Support IE8
--amd.id                    ID for AMD module (default is anonymous)
--amd.define                Function to use in place of `define`
--no-strict                 Don't emit a `"use strict";` in the generated modules.
--no-indent                 Don't indent result
--environment <values>      Environment variables passed to config file
--no-conflict               Generate a noConflict method for UMD globals
--no-treeshake              Disable tree-shaking
--intro                     Content to insert at top of bundle (inside wrapper)
--outro                     Content to insert at end of bundle (inside wrapper)
--banner                    Content to insert at top of bundle (outside wrapper)
--footer                    Content to insert at end of bundle (outside wrapper)
--no-interop                Do not include interop block
```

此外，以下参数也可使用：

`-h/--help`：打印帮助文档。

`-v/--version`：打印Rollup版本号。

`-w/--watch`：开启watch模式，从而在源文件发生变化时，自动重新构建。

`--silent`：不要在控制台中打印warning。

`--environment <values>`：通过设置`process.ENV`来将额外的参数值传递给配置文件。

比如，你可以设置如下命令：

```json
// in package.json
{
  "scripts": {
    "build": "rollup -c --environment INCLUDE_DEPS,BUILD:production"
  }
}
```

则当你运行build时，配置文件将接受到`process.env.INCLUDE_DEPS === 'true'`和`process.env.BUILD === 'development'`。



# JavaScript API

Rollup提供了JavaScript API，从而可以在Node.js中直接调用Rollup。通常情况下，我们不会使用JS API，而是通过命令行来构建应用。除非你要扩展Rollup本身，或者有更高深的目的，比如通过代码生成bundle。



# 与其他工具集成

## npm packages

默认情况下，Rollup并不知道如何解析npm安装的module。

#### rollup-plugin-node-resolve

[rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve)可让Rollup在定位模块时，使用Node resolution algorithm，从而成功定位node_modules中的模块。

```bash
npm install --save-dev rollup-plugin-node-resolve
```

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js'
    format: 'cjs'
  },
  plugins: [ resolve() ]
};
```



#### rollup-plugin-commonjs
[rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs)将CommonJS模块转化为ES6模块，从而让Rollup可以进行静态分析。

注意，**rollup-plugin-commonjs必须放在其他转化module的插件之前**，以避免其他插件破坏CommonJS的检测。

## Peer dependencies

当编写插件库时，需要指定哪些库是peer dependency，即外部依赖external。

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [resolve({
    // pass custom options to the resolve plugin
    customResolveOptions: {
      moduleDirectory: 'node_modules'
    }
  })],
  // indicate which modules should be treated as external
  external: ['lodash']
};
```

如上配置后，lodash将被视为外部模块，不会被打包到你的库中。结果如下：

```js
// bundle.js
'use strict';

require('lodash');

```

其效果可以描述为：将ES6的模块引用方式转化为commonjs的引用方式，但是不会导入模块实际代码。

也可为一个函数。

## Babel

最简单的方式，使用[rollup-plugin-babel](https://github.com/rollup/rollup-plugin-babel)。

```bash
npm i -D rollup-plugin-babel
```

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
};
```

接下来，我们还需要创建一个babel配置文件，路径为`src/.babelrc`：

```json
{
  "presets": [
    ["env", {
      "modules": false
    }]
  ],
  "plugins": ["external-helpers"]
}
```

注意这里有一些不同寻常的地方：

* 我们设置了`"modules":false`，这是为了防止babel自动将我们的ES6模块语法转化为CommonJS模块语法。记住，Rollup要依赖ES6模块机制来进行静态分析。
* 我们使用了**external-helpers**插件，它让Rollup可以只在bundle首部引入一次各种helpers，而不是每次在每个需要使用的模块中都引用一次。
* 我们将`.babelrc`文件放置在了src中，而不是项目根目录下。这让我们可以拥有多个不同的.babelrc文件，以用于不同目的。比如测试。（?）

接下来，我们还需要安装：

```bash
npm i -D babel-preset-env babel-plugin-external-helpers
```

## Gulp



# ES模块语法

