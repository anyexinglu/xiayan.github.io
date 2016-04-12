title: "原型继承与Object.prototype.propertyIsEnumerable"
date: 2016-04-05 08:00:00
tags: ['prototype', '继承']
---
propertyIsEnumerable() 方法返回一个布尔值，表明指定的属性名是否是当前对象可枚举的自身属性。
每个对象都有 propertyIsEnumerable 方法。该方法可以判断出指定对象里的属性是否可枚举，也就是说该属性是否可以通过 for...in 循环等遍历到。
> 不过有些属性虽然可以通过 for...in 循环遍历到，但因为它们不是自身属性，而是从原型链上继承的属性,所以该方法也会返回false。如果对象没有指定的属性，该方法返回 false。

<!-- more -->

结合这段代码看继承属性（采自[er框架](https://github.com/ecomfe/er)）：
``` bash
var dontEnumBug = !(({ toString: 1 }).propertyIsEnumerable('toString'));

/**
 * 设置继承关系
 *
 * @param {Function} type 子类
 * @param {Function} superType 父类
 * @return {Function} 子类
 */
util.inherits = function (type, superType) {
    var Empty = function () {};
    Empty.prototype = superType.prototype;
    var proto = new Empty();

    var originalPrototype = type.prototype;
    type.prototype = proto;

    for (var key in originalPrototype) {
        proto[key] = originalPrototype[key];
    }
    if (dontEnumBug) {
        // 其实还有好多其它的，但应该不会撞上吧(╯‵□′)╯︵┻━┻
        if (originalPrototype.hasOwnProperty('toString')) {
            proto.toString = originalPrototype.toString;
        }
        if (originalPrototype.hasOwnProperty('valueOf')) {
            proto.valueOf = originalPrototype.valueOf;
        }
    }
    type.prototype.constructor = type;

    return type;
};
```
上段代码可以看出，子类对父类的原型继承（prototype inherit）是通过在util里定义了inherits来实现的，并没有直接采用这种方式：
``` bash
function superType(){
    //...
}

type.prototype = new superType(); // type的原型是superType，无参数地调用了一次 superType 的构造器！
```
因为如果superType的构造器比较复杂，或者操作DOM，那么这种情况下无参数多调用一次构造器，可能造成严重性能问题的。

所以util里定义的inherits这么实现：
``` bash
var Empty = function () {};
Empty.prototype = superType.prototype;
var proto = new Empty();
// 然后：
type.prototype = proto;
```
这样解决了父类构造器延迟构造的问题之后，原型继承就比较适用了，并且这使用起来还不会影响 instanceof 返回值的正确性（type instanceof superType），这是与其他模拟方式相比最大的好处。
``` bash
var aa = new type();
console.log(aa instanceof type);        // true
console.log(aa instanceof superType);   // true
```

----------------
了解更多，见月影大神的 [从本质认识JavaScript的原型继承和类继承](http://blog.h5jun.com/post/inherits.html)