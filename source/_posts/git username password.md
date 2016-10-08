title: windows下，git push如何免输用户名、密码
date: 2016-10-08 14:21:00
tags: ['git']
---

在windows下，git push要输用户名、密码，有时还会输错，实在麻烦。
于是探索了一下怎么可以省却。
从stackoverflow里看到：http://stackoverflow.com/questions/6565357/git-push-requires-username-and-password
于是，在原来的代码仓库下操作，将远程仓库改成ssh方式：
> git remote set-url origin ssh://g@gitlab.baidu.com:8022/bce-crm/crm.git
<!-- more -->

然后执行git push，发现报错：
<img src="/img/ssh-push.png">
接着参阅：http://gitlab.baidu.com/help/ssh/README
> To generate a new SSH key, use the following command:
ssh-keygen -t rsa -C "yangxiayan@baidu.com"

发现ssh-keygen命令不识别，所以要先在系统变量Path里加入ssh-keygen命令的根路径。
“Git生成密钥，出现ssh-keygen不是内部或外部命令” 解决步骤：
（1）点击“计算机”，搜索ssh-keygen，复制所在路径；
（2）右击“计算机”，属性-->高级系统设置-->环境变量-->系统变量,找到Path变量，进行编辑，End到最后，输入分号，粘贴复制的ssh-keygen所在的路径（比如我的：D:\Program Files (x86)\Git\bin），保存；
（3）重新cmd（记住要重新打开cmd窗口），执行ssh-keygen,成功！
继而执行：
``` bash
ssh-keygen -t rsa -C “yangxiayan@baidu.com”
```
ssh的一对密钥、公钥就此生成：
<img src="/img/id_rsa.png">
将id_rsa.pub打开，复制里面的公钥（也可以在.ssh目录下执行命令`cat id_rsa.pub | clip`将其复制到剪切板），粘贴到known_hosts中（[gitlab.baidu.com]:8022,[10.44.64.103]:8022 ssh-rsa ...），并粘贴到git仓库的SSH Keys设置里点Add key。
<img width="800" src="/img/ssh_key.png">
最后再在仓库下自由地`git push`。