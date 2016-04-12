title: 【译】Immutable数据结构和JavaScript
date: 2016-04-03 13:10:00
tags: ['immutable']
---

英文原版：http://jlongster.com/Using-Immutable-Data-Structures-in-JavaScript

之前谈到，我准备重写我的上一篇博客（[原文](http://jlongster.com/The-Seasonal-Blog-Redux)），并深入探讨我研究的一些东西。那今天，我准备讲讲JavaScript中的immutable(不可变)数据结构，特指[immutable.js](https://github.com/facebook/immutable-js)与[seamless-immutable](https://github.com/rtfeldman/seamless-immutable)这两个库。当然也有其他的一些库，无非是持久化的数据结构，或者复制原始的Javascript对象。最后我也简单介绍一下[transit-js](https://github.com/cognitect/transit-js) —— 一个序列化anything的好方法。

<!-- more -->

这不大适用于[Redux](https://github.com/rackt/redux)。所以我在介绍普遍的immutable数据结构时，也会提及其在Redux中使用的注意点。在Redux中，你有一个单独的app state对象，需要改变它的状态。有许多方法，但是它们各有利弊：

在Redux中，需要注意[reducers](https://rackt.org/redux/docs/basics/Reducers.html)是如何组合以形成app的state的。Redux提供的默认方法（combineReducers）假设你将多个值绑定至单个JavaScript对象，比如绑定至单个Immutable.js对象中，你就需要自己写combineReducers来实现它。如果你想序列化app的state，且你假定它完全由Immutable.js对象来实现，那么这是有必要的。

总的来说，这适用于JavaScript中大多数immutable对象。当然有时会有一些荒谬，因为你违反了默认语义，且模糊了类型。这些要看你的app看项目情况和你的设定。

此前有一个将不可变数据结构原生地添加到JavaScript中的[提议](https://github.com/sebmarkbage/ecmascript-immutable-data-structures)，只是不清楚能不能走通。不过它必然能解决将其用于JavaScript中的大多问题。

## Immutable.js

Immutable.js出自Facebook，是immutable数据结构最流行的实现之一。它极其给力，通过使用高级的[tries](https://en.wikipedia.org/wiki/Trie)（树）或实现structural sharing（结构共享），充分实现了持久化数据结构。所有的修改返回新的值，但是它们的内部结构是共享的，这极大减少了内存使用（以及GC thrashing，即垃圾回收的系统抖动）。这意味着如果你将1000个元素添加到向量中，它不会真的创建出含1001个元素的向量。很有可能内部只有少量对象分配了内存。

结构化共享数据结构的进步，大大受益于Okasaki的[开创性工作](http://www.amazon.com/Purely-Functional-Structures-Chris-Okasaki/dp/0521663504)。它打破了"immutable值太慢，不适用于实际的app"的枷锁，能让许许多多app变得更快。那些需要深度读取并复制数据（以防止数据被他人改变）的app会从immutable数据结构中轻松受益（比如简单地复制一次大型数组，immutable数据结构比起mutable结构能大大降低性能损耗）。

另一个例子：[ClojureScript](https://github.com/clojure/clojurescript)发现，UI如果采用immutable数据结构，其性能会有巨大的提升。如果你改变了UI，你会经常需要触及DOM（因为你也不知道其值是否需要更新）。React虽然减少了DOM的变化，但仍需要生成虚拟的DOM节点。这时如果组件immutable，你甚至不需要生成虚拟DOM。一个简单的===等式即可告诉你是否需要更新。

这好得不像是真的？既然immutable数据结构这么好，那为什么不一直使用呢？嗯，有些语言，如ClojureScript和Elm确实是这么做的。但是在JavaScript中会困难一些，因为不符合原生设定，所以我们需要权衡一下利弊。

## 空间及垃圾回收效率

我已经解释了，为什么structural sharing让immutable数据结构更有效：数组里某个数据的变动，只会影响其上层的数据，而不用破坏整体结构。如果你要防止变动，就得打破复制的对象。

在Redux中，数据结构的immutability（不可变性）是强制的。除非你返回了新的值，不然屏幕不会有任何更新。因此immutability大有优点，如果你想避免复制，你可能需要看看Immutable.js。

## 引用 & 值相等

比方说，你存了一个对象的引用，叫做obj1。不久后又来了一个obj2。如果你从没改变这个对象，那么obj1 === obj2是成立的，你也知道没有任何改变。在许多架构中，比如React，让你能轻松做优化。

这叫"reference equality"（引用相等），即你可以简单对比两个引用。但也有个概念叫做"value equality"（值相等），你可以通过obj1.equals(obj2)来判断两个对象是否identical（同一）。而如果它们是immutable数据，那只需将其当作值来处理即可。

在ClojureScript中，一切都是值，甚至默认的等式运算也是检验其值是否相等（就像===）。如果你想比较两个实例，你会用identical吗？value equality的优点是，它比全面的递归扫描来得更高效（如果结构是共享的，那就会跳过这个环节）。

那这（value equality）怎么用呢？我已经解释了它如何优化React —— 只需在shouldComponentUpdate里检查一下，如果state是同一的，那就跳过render环节。

此外我发现，在Immutable.js中使用===并没有进行value equality的检验（显然，你不能覆盖JavaScript的语义）。Immutable.js只是对同质的对象使用值校验，所以我在任何地方检验两对象是否相等时，它用的都是value equality。

比如说，Map对象的key也是检验value equality。这意味着，我可以在一个Map里存储一个对象，然后通过提供一个同形式的对象来获取它：

``` bash
let map = Immutable.Map();
map = map.set(Immutable.Map({ x: 1, y: 2}), "value");
map.get(Immutable.Map({ x: 1, y: 2 })); // -> "value"
```
这里有许多很好的含义。比方说，我有一个函数，参数是一个query对象，指定了要从服务器端读取的字段。
``` bash
function runQuery(query) {
  // pseudo-code: somehow pass the query to the server and
  // get some results
  return fetchFromServer(serialize(query));
}

runQuery(Immutable.Map({
  select: 'users',
  filter: { name: 'James' }
}));
```
如果我想把查询结果缓存下来，只需这么做：
``` bash
let queryCache = Immutable.Map();
function runQuery(query) {
  let cached = queryCache.get(query);
  if(cached) {
    return cached;
  } else {
    let results = fetchFromServer(serialize(query));
    queryCache = queryCache.set(query, results);
    return results;
  }
}
```
我可以将查询对象当作一个值，然后把结果作为key来存储。后续如果出现同样的查询，虽然查询的query对象不是同一个，我还是可以直接从上述的缓存结果中抽取出返回值。

value equality可以简化多种多样的模式。事实上，我在[querying for posts](https://github.com/jlongster/blog/blob/master/src/reducers/posts.js#L34)（ps，点不通）中就用到了这种技术。

## JavaScript互操作
Immutable.js数据结构的主要缺点正是其能实现上述特性的原因：它们不是JavaScript的基本数据类型。一个Immutable.js对象完全不同于一个JavaScript对象。

这意味着，你必须用map.get("property") 而不是map.property, array.get(0)而不是array[0]。Immutable.js也将提供兼容JavaScript的API，虽然它们其实是不同的（比如说，push必须返回一个新的数据，而不是修改现有的数组实例）。当然你可能会觉得这违背了默认JavaScript数据可变的语义。

事情变得复杂的情况是：你比较在意这些，或者你已经开始了一个项目，以至于你完全不能用Immutable不可变对象。对于小函数中的局部对象，你没有这个必要。而要是你将所有的对象/数组等创建为immutable，你就得引入可以使用正常的JavaScript对象/数组等的第三方库。

结果是，你永远不会知道，你在处理的是一个JavaScript对象还是一个Immutable的不可变对象。这让函数之间的推导变得更难了，在你用到immutable对象的地方可能很清楚，但是当它被传到别处后就不清楚了。

有时你可能会想将一个常规的JavaScript对象传进一个Immutable map中 —— 千万别这么做。在一个对象中，混淆了immutable和mutable状态会产生困惑。

有两种解决方案：

1.用一个类型系统，如TypeScript或Flow。这样大可不必记住系统中的immutable数据结构经过哪些地方了。不过许多project不愿意采取此项措施，因为这需要十分不同的编码风格。
2.隐藏数据结构的细节。如果你在系统中的特定地方用到了Immutable.js，不要让系统外的anything来直接获取数据结构。一个很好的例子就是Redux及其子app的state。如果子app的state是一个Immutable.js对象，就不要强制让React组件来直接调用Immutable.js的API。

有两种方法可以实现。第一种是用[typed-immutable](https://github.com/gozala/typed-immutable)这样的库，然后给你的对象加上类型。通过创建record(一种标签式数据结构)，你对Immutable.js对象进行了轻量的封装，从而通过定义一种getter方法来提供map.property接口，该getter正是基于由record类型提供的字段。从这样的对象中读取到的数据可以视为常见的JavaScript对象来处理。你仍然不能改变它，不过这正是你想要贯彻的。

第二种是提供一种方法来查询对象，并让所有读数据的请求都来执行一个查询。通常这样是行不通的，但在Redux中它很可行，因为我们拥有唯一的app state，且你想隐藏掉数据设计。不过，强制所有的React组件都依赖于数据设计意味着你永远不能改变app state的实际结构，而以后你很可能需要这么做。

查询不必是复杂的深度数据查询机制，它们也可以是很简单的函数。在我的博客里我还没这么做，但假想我有一些函数，像getPost(state, id)和getEditorSettings(state)，它们都接收state参数并返回我要查询的内容，我不用关心他们存在state里面的什么地方。这样就有一个问题：我可能还是要返回immutable对象，所以我可能还是得将其先写到JavaScript对象中，或者使用上文提到的record数据类型。

总的来说：JavaScript互操作是一个很现实的问题。切勿从immutable对象中引用JavaScript对象，而是通过如[typed-immutable](https://github.com/gozala/typed-immutable)提供的record类型来解决。这样也有其它优点，比如改变/读取无效字段时抛出错误。最后，如果你正在用Redux，千万不要过度依赖于app的state结构，因为日后你可能需要改变它。将数据实现抽象出来，就解决了immutable数据互操作的问题。

## seamless-immutable

[seamless-immutable](https://github.com/rtfeldman/seamless-immutable)是另一种实现immutability（数据不可变性）的方法，它也是一种使用正常JavaScript对象的轻量级解决方案。它没有新的数据结构，也就没有structural sharing（结构共享），这意味着，你更新对象时需要先复制一份（你只需要浅拷贝即可），自然也就没有上文说的性能和value equality的优点。

相应地也会有更好的JavaScript互操作。所有的数据结构都是JavaScript字面量。不同的是seamless-immutable在其上调用了Object.freeze，所以你就不能改变它们（在严格模式，即ES6模块默认模式下，试图修改会报错）。另外，它为各实例提供了一些修改数据的方法，就像merge会返回一个合并了新属性的新对象。

它缺失一些通用的修改immutable数据结构的方法，比如Immutable.js中的[setIn](http://facebook.github.io/immutable-js/docs/#/Map/setIn)和[mergeIn](http://facebook.github.io/immutable-js/docs/#/Map/mergeIn)可以修改了一个深层嵌套的对象。不过这个实现起来很简单，我计划给该project添加上这些方法。

它不会混淆不可变和可变对象。seamless-immutable会将被其封装的所有对象都转为深层immutable的，其后续添加的值也会自动转化。实践中，Immutable.js的工作原理也十分类似、其Immutable.fromJS也会深层转化，以及其它一些方法如obj.merge。但是obj.set不会，所以你可以存储任意的数据类型。但是这对于seamless-immutable是不可能的，所以你不能突然存入一个mutable（可变的）JavaScript对象。

我认为，每个库都应像保持其自身的处理方式，毕竟它们目标不同。比如，seamless-immutable会自动转化，你就不能随意存入它不认识的数据类型，它也就不适用于除基本内置类型外的数据类型（实际上，它目前还不支持Map和Set）。

seamless-immutable是一个有诸多长处的小型库，但是也丢失了immutable数据结构的一些优点，比如value equality。如果你比较关心JavaScript互操作，那它就是一个理想的解决方案，尤其是你在迁移现有代码时，因为你可以慢慢切换到不可变模式，而不需重写所有相关代码片段。

## 最后一节: 用transit-js来序列化

最后要考虑的是序列化（serialization）。如果你用自定义数据类型，那么JSON.stringify就不再适用了。不过话说回来JSON.stringify从来不是一个好方法，它都不能序列化ES6里的Map和Set实例。

由[David Nolen](https://twitter.com/swannodette)写的库[transit-js](https://github.com/cognitect/transit-js)定义了可扩展的数据转化格式。默认情况下不能转化Map或Set实例，但关键是你可以将其转为transit认识的类型。其实它用以序列化 & 反序列化整个Immutable.js数据类型集的[全部代码](https://github.com/glenjamin/transit-immutable-js/blob/master/index.js)还不到150行。

Transit用以编码类型的代码也是非常小。比方说，它知道map的键可能是复杂的类型，所以它可以轻松序列化Map类型。使用[transit-immutable-js](https://github.com/glenjamin/transit-immutable-js)库（上文提到的）来支持Immutable.js，我们可以这么做：
``` bash
let { toJSON, fromJSON } = require('transit-immutable-js');

let map = Immutable.Map();
map = map.set(Immutable.Map({ x: 1, y: 2 }), "value");

let newMap = fromJSON(toJSON(map));
newMap.get(Immutable.Map({ x: 1, y: 2 })); // -> "value"
```

Value equality结合transit的map序列化的模式可跨系统持续使用。事实上，我的博客由服务器端建立好查询缓存，然后在服务器渲染时将缓存发送到客户端，所以缓存一直是完整不变的，这也是我切换到transit的主要原因。

transit也能很方便地序列化ES6 Map类型，但如果你总是有一些复杂的键，我不确定你如何在不使用value equality的前提下使用这些未序列化的实例。虽然有可能需要序列化它们。

如果你混合有正常的JavaScript对象及Immutable.js对象，那么用transit序列化它们也能保其不变。但我还是不推荐将两者混合，因为transit必须将所有对象反序列化为合适的类型，而使用原生的JSON意味着在反序列化时你必须将它们转化为Immutable.js类型（如Immutable.fromJS(JSON.parse(str))）。

你还可以扩展transit来序列化任何东西，如Date实例或其它自定义类型。看看[transit-format](https://github.com/cognitect/transit-format)是怎么编码类型的。

若你采用seamless-immutable，你就限制了必须使用内置JavaScript类型（这样才与JSON兼容），这样才可用JSON.stringify。当然相应地就没有了拓展性，这些都需要自行权衡。


## 总结

Immutability即不可变性有许多裨益，但你是否需要Immutable.js提供的全面持久数据就要看你的app了。我猜许多app都可以用复制对象的方法解决，因为它们很小。

简单的同时也会失去那些特性，如API受限，且你不能用value equality了。此外，后续如果你又想要structural sharing（结构共享）的性能，再想转化为Immutable.js就更难了。

通常我会建议你对外隐藏数据结构的细节，特别是用Immutable.js时。并转为JavaScript对象及数组的默认协议，如obj.property和arr[0]。或许可以用这些接口来快速封装Immutable对象，但是有必要深入研究。

在Redux尤其如此，因为你以后会需要改变app state结构，就算它们都是正常的JavaScript对象。外部用户不应打断你在app state里移动数据，所以应该提供一个查询app state结构的方案，至少抽象出获取数据的函数。也有较为复杂的方案[Relay](https://github.com/facebook/relay)和[Falcor](http://netflix.github.io/falcor/)能解决同样的问题，因为查询语言是获取数据的默认途径。


[1] [mori](http://swannodette.github.io/mori/)是另一个持久数据结构接口（从ClojureScript抽出），而[React's immutability helpers ](https://facebook.github.io/react/docs/update.html) 则是另一个能浅复制JavaScript对象的库。
[2] 我列了一些现有的[不可变类型相关库](https://gist.github.com/jlongster/bce43d9be633da55053f)。