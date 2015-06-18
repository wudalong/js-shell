# **js-shell-0.3** -- 2009-01-09 14:05
  * DB library --  封装了jdbc的部分接口
  * Socket library -- 封装了Java NIO部分方法
  * Logging library --
  * isArray, len 在Lang中方法.
  * 正式发布0.3

# **js-shell-0.2.1019** -- 2008-10-19 14:05
  * add printerr function

# **js-shell-0.2.0921** -- 2008-09-21 11:05
  * add tempFile

# **js-shell-0.2.06** -- 2008-09-06 11:05
  * Socket library is supported.
  * Logging library is supported.
  * A socket sample(EchoServer.js, EchoClient.js) added.

# **js-shell-0.2** -- 2008-09-01 11:05
  * 完成31个unit test.
  * 添加Browser unitest.
  * 添加cmp, min, max方法.
  * 正式发布0.2

# **js-shell-0.1.4.1** -- 2008-08-31 01:05
  * 从JQuery移植浏览器模拟对象, 改为Browser.js
  * 添加js\_dev.js,可以用不打包的方式运行.

# **js-shell-0.1.3.1** -- 2008-08-29 01:30
  * 添加了Unittest库, 实现了一个简单的例子
  * each方法,支持iterator功能.
  * 整合了Ext-js的extend方法.
  * 修复一些bug, 完善了Lang的文档.
![http://js-shell.googlecode.com/svn/trunk/screen-shoot/unittest.jpg](http://js-shell.googlecode.com/svn/trunk/screen-shoot/unittest.jpg)

# **js-shell-0.1.3** -- 2008-08-25 23:30
  * 实现了import方法, 支持在不同的命名空间加载js.
  * 整理Runtime.js 将公共的方法放到了Lang中,并且以只读的方式导出到全局对象.
  * 完善了方法map, grep, dir, each
  * 添加了extend方法,实现简单的继承.

# **js-shell-0.1.2** -- 2008-08-24 14:30
  * 加入jsdoc.js 生成API文档

# **js-shell-0.1.1** -- 2008-08-22 23:30
  * 添加ANT构建脚本
  * 更新启动脚本js.bat(win), js(linux)
  * 添加JavaScript作为启动程序
  * js-shell启动时默认加载Runtime library
  * 增加了两个examples.

1.一个调用Swing的例子:

![http://js-shell.googlecode.com/svn/tags/js-shell-0.1/screen-shoot/swing.jpg](http://js-shell.googlecode.com/svn/tags/js-shell-0.1/screen-shoot/swing.jpg)

2.Cygwin下运行Helloword:

![http://js-shell.googlecode.com/svn/tags/js-shell-0.1/screen-shoot/sygwin.jpg](http://js-shell.googlecode.com/svn/tags/js-shell-0.1/screen-shoot/sygwin.jpg)

3.Runtime自动被加载:

![http://js-shell.googlecode.com/svn/tags/js-shell-0.1/screen-shoot/runtime.jpg](http://js-shell.googlecode.com/svn/tags/js-shell-0.1/screen-shoot/runtime.jpg)