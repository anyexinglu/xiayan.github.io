title: "怎么让Linux云服务器上的hexo服务一直启动着"
date: 2016-03-05 11:00:00
tags: ['hexo', 'BCC']
---
问题描述（如图）：
 ![service](/img/service.jpg)
 何解呢？
<!-- more -->
## 尝试
（1）&
``` bash
$ hexo server &
```
ctrl + c 关闭会话，仍可以访问。但是关闭SecureCRT就不可以访问了。

（2）forever
[forever](https://www.npmjs.com/package/forever): A simple CLI tool for ensuring that a given node script runs continuously. 一个用来持续运行一个给定脚本的简单的命令行工具。
安装forever：
``` bash
$ npm install forever -g
```
然后到blog目录下执行：
``` bash
$ forever hexo server
```
不行（因为forever没有hexo这种命令）。
（2016.3.6补充：也尝试加app.js启动，参考[使用forever让node应用在后台持续运行](/2016/03/06/使用forever让node应用在后台持续运行/) 第3+种形式，但是linux下这方法不行：![remote_forever](/img/remote_forever.jpg)）

## 终极解决方案

改etc/rc.local
在etc/rc.local里加：
``` bash
cd ../usr/code/blog
hexo server &
```
重启BCC，可以访问了！