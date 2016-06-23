title: 碎片知识
date: 2016-03-20 01:00:00
tags: ['碎片知识']
---

记载各种碎片知识。

偶尔遇到一些小问题，总是尽快解决后就抛诸脑后，久而久之便会淡忘，下次碰到又不认识了。
觉得可以先放在这里，每一个小知识点都记录着，每一个point都尽可能简要，（有必要的话）择日深入探索一下。

既然是碎片知识的简要整理，那不排除部分内容来源于别处的可能，这种情况，一方面我会先验证他人的一些结论（诸位可以放心享用），另一方面也会在小节后面附上参考链接，以便各位深入阅读。

<!-- more -->
-  [1. 关于测试各种浏览器](#1-关于测试各种浏览器)
-  [2. 推荐的chrome插件们](#2-推荐的chrome插件们)
-  [3. HTML5前端框架](#3-HTML5前端框架)
-  [4. setInterval的delay参数](#4-setInterval的delay参数)
-  [5. void操作符与undefined](#5-void操作符与undefined)
-  [6. querySelector和querySelectorAll](#6-querySelector和querySelectorAll)
-  [7. 如何运用js中的call及apply](#7-如何运用js中的call及apply)
-  [8. 浏览器请求接口时的并发限制](#8-Max parallel http connections in a browser?)
-  [9. 感受PostCSS插件Autoprefixer](#9-感受PostCSS插件Autoprefixer)
-  [10. why npm scripts](#10-why-npm-scripts)
-  [11. 前端JS调试技巧](#11-前端JS调试技巧)
-  [12. 巧用按位非~运算符](#12-巧用按位非~运算符)
-  [13. 彻底理解0.1 + 0.2 === 0.30000000000000004的背后](#13-彻底理解0.1 + 0.2 === 0.30000000000000004的背后)

## 1. 关于测试各种浏览器
（1）[BrowserStack](https://www.browserstack.com) 提供一个平台让我们能在真实的浏览器中运行我们的项目。

主要用于：windows下看mac里的浏览器，mac下看windows的ie，升级要付费。（后来发现，我才打开过一个网页，就开始提醒再用要付费了）

（2）[testObject](https://testobject.com) 用于Android开发云端自动化测试。升级也要付费。

提供多种Android & iOS设备、操作系统版本，用于手动/自动测试Android应用。（"Hundreds of real physical Android and iOS devices for your manual and automated tests."）

## 2. 推荐的chrome插件们

[tunnello](https://tunnello.com) 一个chrome浏览器插件便可翻墙。亲测有效：先注册（可用邮箱/facebook / google账号），来激活这个插件即可使用。（想当年翻个墙有多心塞）

stormzhang很给力的推荐：[私人珍藏的Chrome插件，吐血推荐](http://stormzhang.com/devtools/2016/01/15/google-chrome-extension/)（该list里所有chrome插件我都安装了~）用得比较多的是：1.Momentum、2.OneTab、3.Pocket、4.Page Ruler、8.Octotree、10.Postman

## 3. HTML5前端框架
[AUI](http://www.auicss.com/)一个靠谱的移动前端框架，看[文档](http://www.auicss.com/?m=Home&c=Document)
纯css框架，提供了聊天界面、瀑布流、九宫格、计数列表等组件，解決了很多复杂的布局，不需要什么学习成本，拿来就用。

## 4. setInterval的delay参数
setInterval发现不写间隔也能运行，也就说明并非如 [setInterval-W3School](http://www.jb51.net/shouce/htmldom/jb51.net.htmldom/htmldom/met_win_setinterval.asp.html) 所说“millisec（即我说的delay参数）是必须的”。结论是：“如果没有传值，则为默认值，默认值为10，单位是毫秒”，更多请看：[setInterval-W3.org](https://www.w3.org/TR/2011/WD-html5-20110525/timers.html#dom-windowtimers-setinterval)（delay在这里又称为timeout）。

## 5. void操作符与undefined
Javascript中，void 0 究竟是什么鬼呢？
``` bash
typeof void 0           // 得到"undefined"
console.log(void 0)     // 输出undefined
```
无论void后的表达式是什么，void操作符都会返回undefined。

既然`(void 0) === undefined`，那直接写undefined不就行了么？
还真不行，因为undefined在javascript中不是保留字。
（事实上，在IE5.5~8中我们可以将其当作变量那样对其赋值，IE9+及其他现代浏览器中赋值给undefined将无效）
``` bash
var undefined = "hello world";
console.log(undefined);     // 会输出"hello world"
```
于是，采用void方式获取undefined便成了通用准则。如[underscore.js里的isUndefined](https://github.com/jashkenas/underscore/blob/master/underscore.js)便是这么写的：
``` bash
// Is a given variable undefined?
_.isUndefined = function(obj) {
    return obj === void 0;
};
```
除了返回undefined外，void还有什么其它作用吗？生成：
（1）空超链接，设置`href="javascript:void(0)"`，确保点击它会执行一个纯粹无聊的void(0)，而不会刷新页面。
（2）（验证为不可行）空image，设置`src='javascript:void(0)'`？验证了一下，是不行哒~（详见<a href="/2016/04/09/生成一个空src的图片/">生成一个空src的图片</a>）

参考文献：[谈谈Javascript中的void操作符](http://blog.sae.sina.com.cn/archives/3864)

## 6. querySelector和querySelectorAll
常识：
* querySelector和querySelectorAll IE8+浏览器支持。
* querySelector返回的是单个DOM元素；querySelectorAll返回的是NodeList.
* 我们一般用的多的是document.querySelectorAll, 实际上，也支持dom.querySelectorAll，如：
``` bash
document.querySelector("#my-id").querySelectorAll("img")
```
[MDN Document.querySelectorAll()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)
[MDN Element.querySelectorAll()](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll)
[HTML DOM querySelector() 方法](http://www.runoob.com/jsref/met-document-queryselector.html)

一个关键的注意点（标明querySelectorAll与jquery元素查找的区别）：[CSS选择器是独立于整个页面的！](http://www.zhangxinxu.com/wordpress/2015/11/know-dom-queryselectorall/)

要想querySelectorAll后面选择器不受全局影响，也是有办法的，就是使用目前还处于实验阶段的:scope伪类，其作用就是让CSS是在某一范围内使用。
[Can I user :scope伪类](http://caniuse.com/#feat=style-scoped)，注意chrome目前都不支持（还是先不考虑了）

## 7. 如何运用js中的call及apply
[如何理解和熟练运用js中的call及apply？](https://www.zhihu.com/question/20289071)

## 8. Max parallel http connections in a browser?
[Max parallel http connections in a browser?](http://stackoverflow.com/questions/985431/max-parallel-http-connections-in-a-browser)
Max Number of default simultaneous persistent connections per server/proxy（各浏览器默认的最大并发请求数）:
> Firefox 2:  2
Firefox 3+: 6
Opera 9.26: 4
Opera 12:   6
Safari 3:   4
Safari 5:   6
IE 7:       2
IE 8:       6
IE 10:      8
Chrome:     6

以chrome为例，并发请求数最大为6，所以>6的并发请求会被搁置，这种情况要想优化，只能让某些接口合并了。

## 9. 感受PostCSS插件Autoprefixer
项目中样式一直使用预处理器less，偶遇[博文](https://github.com/icepy/_posts/issues/29)提到[postCSS](https://github.com/postcss/postcss)，试用了一下还真不错。

> PostCSS插件 [CSSNext](https://github.com/MoOx/postcss-cssnext) 用下一代CSS书写方式兼容现在浏览器
PostCSS插件 [Autoprefixer](https://autoprefixer.github.io/) 为CSS补全浏览器前缀
PostCSS插件 [CSS Grace](https://github.com/cssdream/cssgrace) 让CSS兼容旧版IE

一种使用姿势是用gulp来执行样式代码转化任务，在gulpfile.js里：
``` bash
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssgrace  = require('cssgrace');
var cssnext  = require('cssnext');
gulp.task('css', function () {
  var processors = [
    autoprefixer({browsers: ['last 3 version'],
      cascade: false,
      remove: false
    }),
    cssnext(),
    cssgrace
  ];
  return gulp.src('./src/css/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dist'));
});
gulp.task('watch', function(){
  gulp.watch('./src/css/*.css', ['css']);
});
gulp.task('default', ['watch', 'css']);
```
然，对于autoprefixer和cssnext，sublime既然有此插件（cssgrace就没有了），为何不直接用呢，于是有更轻松的姿势：

* 在sublime里"ctrl+shift+p"、"Package Control: Install Package"，然后搜autoprefixer
* 安装好后，选择菜单"Preferences > Key Bindings – User"，配置：
``` bash
[
    { "keys": ["ctrl+alt+shift+p"], "command": "autoprefixer" }
]
```
重启sublime即可使用（憋说话，去感受）~

## 10. why npm scripts
之前接触到gulp等构建工具，后来看到这么一句话：（from [前端技术栈 - 2016年3月](http://zhuanlan.zhihu.com/p/20639855)）
> 包管理：npm
没什么好说的，基本没有竞争者。这里有一点要强调下：`请好好利用npm script`

于是翻了一下，发现npm scripts越来越火的原因：http://www.cnblogs.com/zldream1106/p/5204599.html

结合看项目：[npm-build-boilerplate](https://github.com/damonbauer/npm-build-boilerplate)


## 11. 前端JS调试技巧
[《一探前端开发中的JS调试技巧》](http://www.cnblogs.com/miragele/p/5394396.html)：
- [DOM断点调试](http://www.cnblogs.com/miragele/p/5394396.html#DOM_u65AD_u70B9_u8C03_u8BD5)
  * 当节点内部子节点变化时断点（Break on subtree modifications）
  * 当节点属性发生变化时断点（Break on attributes modifications）
  * 当节点被移除时断点（Break on node removal）
- [XHR Breakpoints](http://www.cnblogs.com/miragele/p/5394396.html#XHR_Breakpoints)
  我们可以通过“XHR Breakpoints”右侧的“+”号为异步断点添加断点条件，当异步请求触发时的URL满足此条件，JS逻辑则会自动产生断点。
- [Event Listener Breakpoints](http://www.cnblogs.com/miragele/p/5394396.html#Event_Listener_Breakpoints)
  事件监听器断点，即根据事件名称进行断点设置。当事件被触发时，断点到事件绑定的位置。事件监听器断点，列出了所有页面及脚本事件，包括：鼠标、键盘、动画、定时器、XHR等等。

## 12. 巧用按位非~运算符
惊奇在 [针针见血：怎么消除JavaScript中的代码坏味道](https://github.com/gaohailang/blog/issues/5)里发现一段代码：
``` bash
let startsWithVowel = word => !!~VOWELS.indexOf(word[0]);   // 判断word的第一个字母是否在元音集合里
```


查了一下“~”是什么意思，大约是：
> ~是对位求反 1变0， 0变1。
`~num` 简单的理解就是改变运算数的符号并减去1，当然，这是只是简单的理解能转换成number类型的数据。

因此，判断 word 是否在 str 里面，以前是：
``` bash
let containsWord = word => str.indexOf(word) !== -1
// 或
let containsWord = word => str.indexOf(word) >= 0
```

现在可以：
``` bash
let containsWord = word => !!~str.indexOf(word)
```
另外，判断 str 是否以 prefix 开头，可以：
``` bash
let startsWith = prefix => !str.indexOf(prefix)
// 等价于 str.indexOf(prefix) === 0
// 等价于 str.slice(0, prefix.length) === prefix
（有评测说slice的效率更高。这里不使用indexOf()的原因是，indexOf会扫描整个字符串，如果字符串很长，indexOf的效率就会很差。）
```
此外，ES6也支持了[startsWith](http://es6.ruanyifeng.com/?search=startsWith&x=4&y=6#docs/string#includes-startsWith-endsWith)，所以不妨直接用：`str.startsWith(word)`

显得“高洋”很多~

## 13. 彻底理解0.1 + 0.2 === 0.30000000000000004的背后
参考：
（1）[JS魔法堂：彻底理解0.1 + 0.2 === 0.30000000000000004的背后](https://segmentfault.com/a/1190000005022170)
（2）[How numbers are encoded in JavaScript](http://www.2ality.com/2012/04/number-encoding.html)