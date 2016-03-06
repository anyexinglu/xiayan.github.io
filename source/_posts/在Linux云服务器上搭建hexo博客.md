title: "在Linux云服务器上搭建hexo博客"
subtitle: "-bash: hexo: command not found"
date: 2016-02-28 18:00:00
tags: ['hexo', 'nodejs', 'nvm']
---
在Linux云服务器上搭建hexo博客，思路：
- 安装node环境
- 安装 & 启动hexo
- 给hexo设置一个主题
- nvm use 4.3.1 & nvm alias default stable 来设置默认的nodejs版本
<!-- more -->
## 1. 安装node环境：
（1）nvm可以用来管理node的版本。新创建的BCC（[百度云服务器](https://bce.baidu.com/doc/BCC/ProductDescription.html)）实例，执行nvm list，发现：

 ![nvm](/img/nvm.jpg)
也就是说，当前云服务器还没安装nvm。
（2）于是，需先安装nvm。
（注：nvm —— Install and managing different versions of node and installing local versions into repos.）
进入user/local目录下，执行安装命令：
``` bash
$ cd usr/local
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.30.2/install.sh | bash
```
成功，提示需重新建立连接：
 ![nvm_install](/img/nvm_install.jpg)
于是重启，发现nvm list起作用了：
 ![nvm_list](/img/nvm_list.jpg)
（3）安装好nvm后，就可以安装node了。可以先通过 nvm ls-remote 命令查看可安装的版本。
我选择安装nodejs当前最新版4.3.1：
``` bash
$ nvm install 4.3.1
```
安装成功，执行nvm list，就有了：
 ![nodejs_install](/img/nodejs_install.jpg)

## 2. 安装 & 启动hexo吧：
如下图，创建code目录，参照[hexo官网](https://hexo.io/zh-cn)执行指令：
``` bash
$ npm install hexo-cli -g
$ hexo init blog
$ cd blog
$ npm install
$ hexo server
```

## 3. 查看效果 & 安装主题：
打开[hexo新博客](http://182.61.7.176:4000)（182.61.7.176是我BCC的公网ip），看到默认有一篇hello world文章：
 <img src="/img/init.jpg" width = "300" alt="init" align=center />
默认主题丑丑哒，得挑一个主题养养眼[hexo有哪些好看的主题？](https://www.zhihu.com/question/24422335/answer/46357100)。
（注：窃以为这两个主题也不错：[next](https://github.com/iissnan/hexo-theme-next)，[pacman](https://github.com/A-limon/pacman)）
我挑了一个比较大众的[yilia](https://github.com/litten/hexo-theme-yilia)。
在usr/code/blog（即hexo根目录）下执行：
``` bash
$ git clone https://github.com/litten/hexo-theme-yilia.git themes/yilia
```
然后修改hexo根目录下的 _config.yml： theme: yilia
 ![yilia](/img/yilia.jpg)
更新主题
``` bash
$ cd themes/yilia
$ git pull
```
颜值瞬间提升有木有：
 <img src="/img/yilia_yanzhi.jpg" width = "300" alt="init" align=center />

## 4. !!! 但下次想启动hexo sever时会发现（重头戏来了）：
hexo和npm的命令都不认识了，发现是node的问题，提示：
-bash: hexo: command not found
执行：
``` bash
$ nvm use 4.3.1
```
后，hexo sever终于可以用了：
 ![command_not_found](/img/command_not_found.jpg)
显然，这样还不够（因为下次想启动hexo sever还得nvm use一下）。
所以应该再执行：
``` bash
$ nvm alias default stable 或者：nvm alias default 4.3.1
```
 ![default_node](/img/default_node.jpg)
这样下次就可以直接到/usr/code/blog目录下执行hexo server了。[欢呼雀跃吧~~~，滚回去睡了 ![bye](/img/bye.png)~]
