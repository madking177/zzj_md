# /proc/xxx/？ 下的信息罗列

/proc/xx/？目录下关联运行时具体进程信息



| 文件名            | 含义与用途                                                   |
| ----------------- | :----------------------------------------------------------- |
| `attr`            | LinuxSecurityModules（LSM）属性，如SELinux上下文信息。       |
| `cmdline`         | 存储进程启动时的完整命令行参数，包括程序名和所有参数。       |
| `coredump_filter` | 控制当进程发生崩溃时，哪些内存区域会被包含在核心转储文件中。 |
| `cwd`             | 符号链接到当前工作目录（Current Working Directory）。        |
| `exe`             | 一个指向进程执行文件（通常是可执行程序或脚本）的符号链接。   |
| `fd`, `fdinfo`    | 分别列出进程打开的所有文件描述符及其详细信息。每个子目录名对应一个打开的文件描述符号码。 |
| `limits`          | 列出进程的资源限制，如最大文件描述符数、最大内存大小、CPU时间等。 |
| `maps`            | 描述进程的内存映射情况，包括内存区域的起始地址、结束地址、访问权限、映射文件等信息。 |
| `mountinfo`       | 提供进程挂载点的详细信息，包括挂载源、挂载点、挂载选项、挂载ID等。 |
| `mountstats`      | 提供已挂载文件系统的统计信息，如缓存命中率、I/O计数等。      |
| `ns`              | 列出进程所使用的命名空间（Namespace）的inode编号。           |
| `oom_score`       | 与内存不足（OOM）杀手相关，表示进程的OOM评分（默认计算值）。 |
| `oom_score_adj`   | 与内存不足（OOM）杀手相关，表示用户调整的OOM评分。评分越高，当系统内存紧张时，该进程越可能被终止。 |
| `pagemap`         | 为进程的每一页内存提供一个“物理页面号”，有助于分析内存使用情况。 |
| `root`            | 符号链接到进程的根目录（即chroot环境的根，如果没有则与真实根相同）。 |
| `schedstat`       | 包含进程调度统计信息，如运行时间、睡眠时间、上下文切换次数等。 |
| `smaps`           | 类似于`maps`，但为每个内存区域提供了更详细的内存映射信息，如私有/共享大小、RSS、PSS、Swap等。 |
| `stack`           | （仅适用于旧内核）提供进程内核栈的内存映射信息。在新内核中，这部分信息通常包含在`smaps`中。 |
| `stat`            | 提供简化的进程状态信息，如PID、父PID、状态、CPU使用时间、内存使用情况等。 |
| `status`          | 提供比`stat`更详细的进程状态信息，包括线程组ID、进程名、TTY、优先级、nice值、调度策略等。 |
| `task`            | 一个目录，包含该进程组中所有线程的子目录，每个子目录名对应一个线程ID。进入子目录可以查看线程信息。 |
| `wchan`           | 显示进程当前是否在等待系统调用完成，以及它正在等待哪个函数（以内核符号形式表示）。 |

**较少见的文件：**

| 文件名         | 含义与用途                                                   |
| -------------- | ------------------------------------------------------------ |
| `auxv`         | 存储进程启动时传递给它的辅助向量（Auxiliary Vector），包含system启动相关的元数据。 |
| `clear_refs`   | 用于清除进程的内存引用计数，通常由内核维护，不建议用户直接操作。 |
| `comm`         | 只读文件，包含进程名。与`cmdline`不同，它不包含参数，且可以被`prctl(PR_SET_NAME)`系统调用修改。 |
| `cpuset`       | 与CPU亲和性和内存亲和性相关的控制文件，用于将进程分配到特定的CPU和内存节点。 |
| `environ`      | 列出进程环境变量及其值。                                     |
| `io`           | 提供进程的I/O统计信息，如磁盘读写次数、带宽等。              |
| `loginuid`     | 记录登录用户的UID，用于审计目的。                            |
| `mem`          | （已弃用）提供进程的内存映射信息。现在应使用`maps`和`smaps`代替。 |
| `mounts`       | 列出进程可见的挂载点列表，类似于全局的`/proc/mounts`，但只包含该进程所在命名空间的挂载点。 |
| `net`          | 包含网络相关的信息，如套接字统计、TCP连接状态等。            |
| `oom_adj`      | （已弃用）与`oom_score_adj`类似，用于调整进程的OOM评分。在较新内核中，应使用`oom_score_adj`。 |
| `personality`  | 表示进程所采用的执行特性（Personality），影响某些系统调用的行为。 |
| `sessionid`    | 表示进程所属的会话ID，用于识别同一会话系统的进程组。         |
| `smaps_rollup` | 类似于`smaps`，但汇总了进程所有内存区域的相关信息。          |

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