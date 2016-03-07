title: "使用forever让node应用在后台持续运行"
date: 2016-03-06 12:00:00
tags: ['nodejs', 'forever']
---

【__简介__】 forever是一个简单的命令式nodejs的守护进程，能够启动，停止，重启App应用。让你在关闭terminal(cmd窗口)后，node应用仍能在后台保持运行状态~~~

【__本文概要__】本文想探讨的终极问题是：掌握forever在各种node应用中的使用姿势。

【__思路__】 node应用的启动方式有很多种，forever也不一样执行：
（1）`node xx.js`：可通过`forever start xx.js`使之后台持续work。
（2）`npm start`：需要从package.json里找到相应命令，然后通过`forever 相应命令`即可。
（3）`hexo server`这种的：在根目录下配一个`app.js`（其内容见下文第三节），让`node app.js`能启动，然后`forever app.js`便能work。

<!-- more -->

## 首先安装forever：
``` bash
$ [sudo] npm install forever -g		// 全局安装forever
```
然后 ——

## 第1种形式 `node xx.js` 的forever：
现场Demo一下：
（1）首先需要一个node应用，若没有，可两步搭建最easy的基于express的node应用：[安装Express](http://www.expressjs.com.cn/starter/installing.html)、[`node app.js`启动该实例](http://www.expressjs.com.cn/starter/hello-world.html)
（2）这种形式下，执行如下命令便可使服务进程一直开着：
``` bash
$ forever start app.js
```
如图：
<img src="/img/forever.gif" width = "300" alt="forever" align=center />
从上图可以看出，关闭了cmd命令窗口，服务仍启动着，只有执行`forever stop 进程id`才会停止它。
（妈妈再也不用担心我手滑关掉小黑框了~~~ ![learn](/img/learn.jpg)）

## 第2种形式 `npm start` 的forever
试了一下，不能傻傻地在前面加一个forever即~~forever npm start~~。（因为，[forever命令](https://www.npmjs.com/package/forever)中没有npm）
只好研究一下[What does npm start do in nodejs](http://javascript.tutorialhorizon.com/2015/08/11/what-does-npm-start-do-in-nodejs)。
就是如果package.json里配置了scripts-start：
 ![package_json](/img/package_json.jpg)
那么运行`npm start`等同于运行如上的`node server/http.server.js --debug --port 8080`。（没配则默认运行`node server.js`），所以`forever node server/http.server.js --debug --port 8080`一下就跑起来啦。

## 第3+种形式 `hexo server`等 的forever
在hexo server前面加一个forever来持久启动显然也是不行的（因为forever没有hexo这种命令）：
 ![forever_hexo](/img/forever_hexo.jpg)
（1）看到[hexo官网](http://www.liuzhixiang.com/hexo_site_cn/docs/server.html#Forever_/_PM2)上有提到forever，走了一点弯路：
 ![hexo_forever](/img/hexo_forever.jpg)
试了一下，根本不行，本质原因是：hexo没有init方法
[hexo has no method 'init' by fakefish](https://github.com/hexojs/hexo/issues/1548)，
[hexo has no method "init" by LaureKamalandua](https://github.com/hexojs/hexo/issues/1762)。

（2）虽然官网上面的方法不行，但是思路是对的，看到上面两个issue，是说hexo没有init方法：
``` bash
require('hexo').init({command: 'server'});		// 这样是不对的，因为hexo需要实例化
```
而作者的回复，大概hexo没有开放init，需要实例化一下hexo再init，故将app.js里的内容改成：
``` bash
var Hexo = require('hexo');
hexo = new Hexo(process.cwd(), {});
hexo.init((args) => hexo.call('server'));	// init后再启动server
```
然后`forever app.js`即可。

----------------------------------------

【__附录__】（正文内容已结束，以下是番外啦~~~）

关于hexo博客forever的问题。

*   我try的几种方式：
[Hexo博客后台运行技巧](http://www.tuijiankan.com/2015/05/08/hexo-forever-run/)
[如何让Hexo后台运行](http://shaoguoqing.com/2015/11/22/hexo_run_background/)

试了都不行，也尝试了作者提供的solution：
``` bash
var Hexo = require('hexo');
var hexo = new Hexo(process.cwd(), options);	// options肯定需要定义一下吧，不然用{}
hexo.then((args) => hexo.call('server'));
```
把options改成{}后再执行，
提示`hexo.then is not a function`：
 ![hexo_forever_exit1](/img/hexo_forever_exit1.jpg)
没有then方法（因为Hexo构造方法里没有return，更别说return一个promise了）。

*   最后改成：
``` bash
var Hexo = require('hexo');
var hexo = new Hexo(process.cwd(), {});
hexo.init((args) => hexo.call('server'));
```
方可（可以访问，关小黑窗也没问题）。

*   但linux下的就不这么幸运了：
执行`forever app.js`后和本地的windows一样可以访问，`forever list`也能看到它，但ctrl + c就不能访问了，更别提关了SecureCRT。（我也不知道为什么）问客服，客服说可以这样：
``` bash
hexo server &		// nohup hexo server &也行
```
不行（ctrl + c 关闭会话，仍可以访问。但是关闭SecureCRT就不可以访问了，putty也一样）。
<img src="/img/putty.gif" width = "400" alt="putty" align=center />

排查了一下，应该用`ctrl + d`关闭SecureCRT（putty也一样），而不是`ctrl + c`。这样就ok啦~~~！！！
另外，如果要stop这个进程，可以：
``` bash
ps -ef | grep hexo
（找到进程号）kill 进程号
```

另一种后台持续运行的方法是改etc/rc.local，即：
执行`vi /etc/rc.local`，在末尾加上：
``` bash
cd /usr/code/blog
hexo server
```
重启BCC，就算关闭SecureCRT，也可以持久访问了！

## 总结
见【思路】↑ 吧，就酱。