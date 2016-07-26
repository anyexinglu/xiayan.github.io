title: Q & A
date: 2016-03-13 23:00:00
tags: ['q&a']
---
<a href="/2016/03/13/Q%20&%20A/"><img disableFancybox="true" src="/img/q&a.jpg"></a>

<!-- more -->

既知大脑不宜作存储，何不另开知识库？
铛铛铛铛~ 就是这些了：
-  [1. 改完域名规则，等了TTL分钟未生效怎么办](#1-改完域名规则，等了TTL分钟未生效怎么办)
-  [2. XXX license should be a valid SPDX license expression](#2-XXX-license-should-be-a-valid-SPDX-license-expression)
-  [3. 使fancybox忽略某些图片](#3-使fancybox忽略某些图片)
-  [4. 想要测试各种浏览器](#4-想要测试各种浏览器)
-  待补充...
## 1. 改完域名规则，等了TTL分钟未生效怎么办
配置改完后，我等了TTL分钟（如图为1分钟）后，
 ![TTL](/img/TTL.jpg)
发现页面访问不了，执行：
``` bash
> ping yangxiayan.com
或
> dig yangxiayan.com（linux下才有dig命令）
```
猜测是配置的规则没生效，再苦等20分钟，仍不能访问，最后ipconfig /flushdns 一下才行：
``` bash
> ipconfig /flushdns	// 目的是清除local DNS缓存
```
因local DNS在进行解析的时候会生成缓存，以便下次访问同样域名时，加快速度，这个会有一定的保存时间。如果期间域名更改过了，虽然DNS服务器上已经更新，但本地还有DNS缓存，造成还是访问老的IP地址。而执行`ipconfig /flushdns`命令可以让本地的那些缓存立即失效。
（若仍不行，应该是你配错了~）

顺便解释一下TTL（Time To Live）：
 ![ttl_set](/img/ttl_set.jpg)
看完我决定改成10分钟。


## 2. XXX license should be a valid SPDX license expression
[一本书的例子源码](https://github.com/backstopmedia/bleeding-edge-sample-app)clone到本地，启动后发现warn提醒（[`npm WARN EPACKAGEJSON bleeding-edge-sample-app@0.0.1 license should be a valid SPDX license expression`](https://github.com/backstopmedia/bleeding-edge-sample-app/issues/56)看第四个回复）
 ![spdx](/img/spdx.jpg)
（1）何为spdx？
- 官网介绍 [Software Package Data Exchange](http://spdx.org/about-spdx),
- 视频介绍 [video](http://www.linuxfoundation.org/programs/legal/compliance/webinars/introduction-to-spdx)
- FAQs [FAQs](https://spdx.org/about-spdx/faqs)

SPDX规范是指，注明开源软件包的许可及其内容组成，以规范user的权利（USE, REPRODUCTION, AND DISTRIBUTION）。该规范定义了传递此类信息的通用文件格式。
> The SPDX Specification enables suppliers and consumers of software that contains open source code to provide a "bill of materials" that describes the open source licenses and components that are included.  The specification defines a common file format to communicate this information.

（2）SPDX的license list：
目前NPM禁止给package.json的license字段设置非spdx的值，故上述报错也是因为，`"license": "Apache 2.0"`在[the full list of SPDX license IDs](https://spdx.org/licenses)里找不到，因为license list里只有Apache-2.0。将其改为[`"license": "Apache-2.0"`](https://spdx.org/licenses/Apache-2.0.html#licenseText)后，warn没有了，问题得到了解决~

-----------------------
此外，顺便学习一下package.json里license相关设置。（参见[what SPDX license should I use for private modules?](https://github.com/npm/npm/issues/8773)）
最直接的是，看[package.json](https://docs.npmjs.com/files/package.json)里关于license的解释：
> You should specify a license for your package so that people know how they are permitted to use it, and any restrictions you're placing on it.

- `"private": true`：表示不想发布这个package。private设置为true后，license的值可以随意，因为不检查了。
> If you set "private": true in your package.json, then npm will refuse to publish it.
- `"license": "UNLICENSED"`：表示不想给别人使用你代码的许可。（You do not wish to grant others the right to use a private or unpublished package & Consider setting "private": true to prevent accidental publication）
　　若发现设置license为UNLICENSED无效，或应升级npm版本：In newer versions of npm, UNLICENSED is supported and is the correct license to include for private packages.（newer versions of npm: npm@3.3.1 and higher for npm@3, and npm@2.14.2 and higher for npm@2.）
- `"license": "SEE LICENSE IN <filename>"`：你使用的许可证并无SPDX标识，可以通过filename来指定。If you are licensing it to others, put the terms in a file, and SEE LICENSE IN file.

同时我们应该关注npm的升级，以防版本更新后，上述字段变了含义。

## 3. 使fancybox忽略某些图片
有没有注意到，点击上方“Q & A”图片，并没有出现预览效果，而是超链接到本页。
那么，是怎么使fancybox忽略这张图片的呢？
其实只需使其支持自定义属性就行：
 ![yilia_if](/img/yilia_if.jpg)
然后便可以使用disableFancybox这个属性：
``` bash
<a href="/2016/03/13/Q%20&%20A/"><img disableFancybox="true" src="/img/q&a.jpg"></a>
```

## 4. 想要测试各种浏览器
[BrowserStack](https://www.browserstack.com) 提供一个平台让我们能在真实的浏览器中运行我们的项目。

主要用于：windows下看mac里的浏览器，mac下看windows的ie，不过升级要付费。

[testobject](http://testobject.com) 