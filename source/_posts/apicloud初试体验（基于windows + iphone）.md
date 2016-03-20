title: apicloud初试体验（基于windows + iphone）
date: 2016-03-20 01:00:00
tags: ['apicloud']
---

[APICloud](http://www.apicloud.com)：

> APICloud使开发者可以使用HTML5轻松开发出高性能iOS、Android原生应用。由“云API”和“端API”两部分组成，可以帮助开发者快速实现移动应用的开发、测试、发布、管理和运营的全生命周期管理。

一开始注意到它，也是被这样“简单方便”的概念吸引的。前端工程师只需写写熟悉的html + js，然后生成app轻松发布到Android & ios各种平台（这早就应该有人做了，只是近来没发现哪些做得出名了）=> FE福音啊，web站点轻松挪到移动端~
<!-- more -->

本来看看也就算了。但是，不知怎么的，看到了一些负面评价：
附：[关于DCloud起诉APICloud侵权及不正当竞争的声明](http://www.dcloud.io/150604/index.html)、[apicloudshit](http://apicloudshit.com) （已瞎）

由于网上的言论，我一直持着不能尽信的态度（我不是当事人，又怎么分辨里面是否牵涉到利益关系神马的呢，几乎所有知名的平台，都充斥着正反面声音的），然后，疑罪从无（我可以揣着猜疑，但是不能证明是非）。如果真实，自有法律处理，企业道德也会遭到指责。而我们，“见贤思齐，见不贤而内自省”也。另一方面，作为一个互联网从业人员，我一向都能理解一些产品体验不完善啊有bug啊巴拉巴拉的，且其司上线至今才一年多，人比较少，尤其看到他们的team，更有恻隐之心了，故，可以的话还是像看待小孩一样怀着宽容的态度看之（毕竟创业不易啊，能活下来才能bb啦啦啦~~~）。

所以，回到产品本身，我想通过apicloud“开发”一个简单的app到手机。（藉此测试一下apicloud的使用体验）

看了一下入门视频 [创建第一个APICloud应用](http://resource.apicloud.com/video/apicloud.mp4)
感觉简单，就动手了。

具体步骤，参考[官方文档](http://docs.apicloud.com/APICloud/creating-first-app)。那里当然是顺利的情形，而我要讲的，（当然）是一波三折的：

#1. 安装环境：
（1）看视频，需要注册一下apicloud，登录console控制台新建一个应用：
 <img src="/img/createapp.jpg" width="300" alt="createapp" />
然后看到已有应用相关信息：
 <img src="/img/helloapp.jpg" width="300" alt="helloapp" />

（2）还要先安装一下其IDE [APICloud Studio](http://docs.apicloud.com/APICloud/ide-dev-guide)（当然你也可以安装其它IDE的插件）
在APICloud Studio选择上面的SVN项目，右键“检出为”，便生成了一个APP项目：
 ![checkout](/img/checkout.jpg)

（另外也有案例程序在[APICloud SDK](http://docs.apicloud.com/APICloud/download)，可下载之，找到里面的sample项目使用。）

（3）真机测试
在我的APP项目视图中选择一个需要真机测试的应用，然后在应用上右键选择一键真机同步测试，像这样（盗图的我可耻哈）：
 <img src="/img/zhenji.jpg" width="300" alt="zhenji" />
可是问题出来了（看我[回复的帖子](http://community.apicloud.com/bbs/forum.php?mod=viewthread&tid=22930&page=1&extra=#pid146294)）：
要测试iPhone手机需要先给电脑安装iTunes：
 <img src="/img/itunes.jpg" width="300" alt="itunes" />
装完后还不行，看了[这帖子](http://community.apicloud.com/bbs/forum.php?mod=viewthread&tid=1125&page=1&extra=#pid5171)
 <img src="/img/itools.jpg" width="300" alt="itools" />
说是要用itools安装apploader，于是改用itools：
遂在windows电脑和iPhone手机上都装了itools，然后从SDK的APICloud_SDK_v1.1.62\AppLoader_v1.1.64 里通过itools把apploader_v1.1.64_ios.ipa也安装到手机了，启动apploader提示：
 <img src="/img/distrust.jpg" width="300" alt="distrust" />
去设置里验证却提示无法验证（可我手机的网络连接明明ok哒）：
 <img src="/img/network.jpg" width="300" alt="network" />
这样死磕了一会儿，后来乱试就这么解决了：把wifi关了，启动“蜂窝移动数据”，再去验证，就通过了（apploader可以打开，但是目前空白）~
然后去APICloud Studio给项目右键“真机同步测试”就能出来了：
 <img src="/img/tongbushunli.jpg" width="300" alt="tongbushunli" />
装完再打开apploader，看到了hello app程序。
 <img src="/img/hello.png" width="300" alt="hello" />
（仿佛）大功告成，回家洗睡~~~ ![deyi](/img/deyi.png)

--------
感悟什么的（如果有的话），改天再补。先分享首歌：[那么骄傲](http://music.163.com/#/song?id=247864)

