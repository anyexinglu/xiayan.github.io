title: 生成一个空src的图片
date: 2016-04-09 14:00:00
tags: ['html']
---

如果想要先放一个空src的图片，后续在js里动态修改src，怎么做呢？

## 尝试：

（1）设置`src="javascript:void(0)"`，在IE下看似可行（IE 7-11不会请求src资源，且显示为空白）：
 <img src="/img/void in IE7-11.jpg" width="300" alt="void in IE7-11" />
<!-- more -->
但是在chrome下就不可行了（一些浏览器下会显示为破裂图片，我的浏览器是chrome 47.0.2526.106）：
 <img src="/img/void.jpg" width="300" alt="void" />
人家chrome明明很认真地去请求了这个资源（Request URL:javascript:void(0)会标红），且发现response data为空：
 <img src="/img/request void.jpg" width="300" alt="void" style="float: left; margin-right: 10px" />
 <img src="/img/request void 0.jpg" width="300" alt="void" />
而且想要隐藏掉碎图，光靠设置`width="0" height="0"`使长高为0、甚至设置了border样式为none等都不行。
 <img src="/img/dot.jpg" width="300" alt="void" />
只能设置`display:none`来隐藏掉它。后续在js里动态设置src时，再改一下样式让图片显示出来。

（2）设置`src="//:0"`
（该方法是[Ben Blank](http://stackoverflow.com/questions/5775469/whats-the-valid-way-to-include-an-image-with-no-src/5775621#5775621)的idea），作者认为：
> (a) Starting with // (omitting the protocol) causes the protocol of the current page to be used, preventing "insecure content" warnings in HTTPS pages.（//：使用当前协议）
(b) Skipping the host name isn't necessary, but makes it shorter.（不用host name：使得url更短）
(c) Finally, a port of :0 ensures that a server request can't be made (it isn't a valid port, according to the spec).（端口为0：使不去请求资源）

看port为0的更多解释：[TCP/UDP Port 0](http://compnetworking.about.com/od/tcpip/p/port-numbers-0.htm)
> Port 0 is officially a reserved port in TCP/IP networking, meaning that it should not be used for any TCP or UDP network communications. However, port 0 sometimes takes on a special meaning in network programming, particularly Unix socket programming. In that environment, port 0 is a programming technique for specifying system-allocated (dynamic) ports.（在TCP or UDP里没有用）

尝试了一下，发现确实不会请求服务器资源（嗯，`src="//www.baidu.com:0"`也一样不会），但呈现上和`src="javascript:void(0)"`是刚好相反的情况，在IE下为破碎图片，在chrome下显示空白。
虽然都可以通过设置长高为0或`display:none`来隐藏掉它。

看到也有不少评论：
 <img src="/img/src comments.jpg" width="300" alt="src comments" />

比如第一条，于是：
（3）尝试设置`src="about:blank"`或`src="file://null"`
试了不好：IE & chrome都有碎图，都会请求about:blank资源（Request URL:about:blank不会标红，而file://null/会），返回数据为空（This request has no response data available）。
 <img src="/img/about blank.jpg" width="300" alt="about blank" />
后者在Chrome的console log里还会提示：`Not allowed to load local resource: file://null/`

（4）嵌入一个`base64的空图片`
`<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="/>`
自然存在datauri属性的浏览器兼容问题（No support for IE7 or less is notable）[can I use datauri](http://caniuse.com/#feat=datauri)
浏览器确实是会请求这个资源（Request URL:data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=），但没有碎图，seems 不错，但其实IE下会有个小黑点（设置width为0可以隐去）：
 <img src="/img/black dot.jpg" width="300" alt="about blank" />

（5）设置`src="#"`, 或`src="#empty"`
其实相当于将本页作为资源链接，不就有碎图，还会请求页面两次：
 <img src="/img/twice.jpg" width="300" alt="about blank" />

（6）设置`src=""`或者不要src属性
IE及chrome都没有显示出来破裂图片什么的，也没有请求src资源，目测可以。
> But that is INVALID HTML so pick that carefully.
An image with no src is essentially meaningless and that is why the spec says that image must have an src pointing to some embedded resource in the first place.

## 综上所述：
* 设置`src="javascript:void(0)"`：IE下正常，但chrome下既会请求资源也会显示出碎图（chrome下设置宽高为0不能隐藏，设置display为none才行）；
* 设置`src="//:0"`：不会请求资源，但IE下会显示出碎图（IE下设置宽高为0或display为none可隐藏）；
* 设置`src="about:blank"`或`src="file://null"`：IE & chrome都碎图（chrome下设置宽高为0不能隐藏，IE下宽高为0或display为none可隐藏），都会请求资源；
* 嵌入一个`base64的空图片`：看似正常（IE和chrome下会请求资源，但没有碎图。不过IE下会有个小黑点，给图片设置width为0或display为none可隐去）。
* 设置`src="#"`或`src="#empty"`：请求页面资源两次，且会显示出碎图。
* 设置`src=""`或者不要src属性：正常（IE和chrome下不会请求资源，也不会显示出碎图）。

## 参考文献：
[1] [What's the valid way to include an image with no src?](http://stackoverflow.com/questions/5775469/whats-the-valid-way-to-include-an-image-with-no-src)
