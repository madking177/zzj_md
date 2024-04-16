# frida精彩文章收集

很多关于hook so层的代码案例

https://kevinspider.github.io/frida/frida-hook-so/

## dlopen

```
dlopen函数是加载so（share object）文件用的

自动依次调用 init init_array jni_onload函数

init init_array在dlopen函数内调用，jni_onload是so加载完毕后调用

寻找init init_array的hook点，这个点在是执行so之前已经加载完毕 但是init，init_array 还没有执行，hook_call_constructor
```

## hook系统的pthread_create函数

```
常规hook点
构造函数 ，1指向线程的指针，2用来设置线程属性，3 ？ 4传递个给线程的参数
```

## 监控内存读写

```
frida监控某个函数访问了某块内存 process-setExceptionHandler（callback）
思路 修改内存权限 app访问了内存报错 触发回调函数获取相关信息后，复原内存权限返回true恢复线程

比如hook dlopen函数，在onleave函数执行set_read_write_break函数，设置异常回调，然后内存权限改为---
发生异常后触发回调函数
callback接受一个对象，记录异常消息，异常类型，异常地址，以及寄存器信息。
memo-protect修改的是内存页权限，因此会不准确，最佳推荐unidbg

```

