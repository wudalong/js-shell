# 项目介绍 #
使用了Mozilla的Rhino Javscript解析器(http://www.mozilla.org/rhino/), 实现的一个独立运行javascript的shell. Rhino是使用Java开发的JS解析器. 在此shell下很容易的调用Java的代码。

在js-shell中加入一些独立运行必须的方法，如import, print等。在语法特性上兼容标准的Javascript.

项目以开发通用的js库为主，目标是实现js的通用化。使js可以更多的用在普通的应用开发,例如桌面应用，网络应用等。让javascript和java两个没有血缘关系的亲兄弟走的更近。

注：1. 此项目以兴趣学习为主，欢迎热爱Javascript的朋友[加入](joinus.md)。
> 2. 由于开发人员的兴趣的改变，可能项目的更新和维护工作，比较缓慢。
> 3. 暂时没有发布的时间计划.
> 4. QQ群：38343054

意见和建议：http://code.google.com/p/js-shell/wiki/feedback
**[一些梦想](todolist.md)**

# 最近更新 #
  1. [js-shell-0.2](history.md) 第一个正式版
  1. [js-shell-0.1.1](releasenotes.md)测试版发布



第一个演示版本：

1. 实现了$import方法, 初始化Runtime.js library:
![http://js-shell.googlecode.com/svn/trunk/screen-shoot/screen-2.jpg](http://js-shell.googlecode.com/svn/trunk/screen-shoot/screen-2.jpg)

2. 一个调用Swing的例子:

![http://js-shell.googlecode.com/svn/tags/js-shell-0.1/screen-shoot/swing.jpg](http://js-shell.googlecode.com/svn/tags/js-shell-0.1/screen-shoot/swing.jpg)