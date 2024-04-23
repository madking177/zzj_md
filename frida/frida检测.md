```
ptrace占坑
ptrace(0, 0 ,0 ,0);
开启一个子进程附加父进程
守护进程
子进程附加父进程 目的是不让别人附加
普通的多进程
进程名检测，遍历运行的进程列表，检测frida-server是否运行
端口检测，检测frida-server默认端口27042是否开放
D-Bus协议通信
Frida使用D-Bus协议通信，可以遍历/proc/net/tcp文件，或者直接从0-65535
向每个开放的端口发送D-Bus认证消息，哪个端口回复了REJECT，就是frida-server
扫描maps文件
maps文件用于显示当前app中加载的依赖库
Frida在运行时会先确定路径下是否有re.frida.server文件夹
若没有则创建该文件夹并存放frida-agent.so等文件，该so会出现在maps文件中
扫描task目录
扫描目录下所有/task/pid/status中的Name字段
寻找是否存在frida注入的特征
具体线程名为gmain、gdbus、gum-js-loop、pool-frida等
通过readlink查看/proc/self/fd、/proc/self/task/pid/fd下所有打开的文件，检测是否有Frida相关文件
常见用于检测的系统函数
strstr、strcmp、open、read、fread、readlink、fopen、fgets
扫描内存中是否有Frida库特征出现，例如字符串LIBFRIDA
hluwa的去掉字符串特征的frida-server
https://github.com/hluwa/strongR-frida-android
补充
通常比较会被检测的文件
riru的特征文件
/system/lib/libmemtrack.so
/system/lib/libmemtrack_real.so
cmdline 检测进程名，防重打包
status 检测进程是否被附加
stat 检测进程是否被附加
task/xxx/cmdline 检测进程名，防重打包
task/xxx/stat 检测进程是否被附加
task/xxx/status 检测线程name是否包含Frida关键字
fd/xxx 检测app是否打开的Frida相关文件
maps 检测app是否加载的依赖库里是否有Frida
net/tcp 检测app打开的端口
huluda-server处理了re.frida.server文件夹以及该文件夹下的文件的名字
使用这个server，不放在/data/local/tmp目录下，基本可以不用关心fd和maps的检测
frida-gadget
```