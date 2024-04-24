# 爱加密脱壳

## fart镜像刷机脱壳

搜索fart 脱壳版8 进入链接0.01购买r0ysue大佬的脱壳镜像

https://github.com/r0ysue/AndroidSecurityStudy

## 定位 反调试 dump so文件以及修复

hook不上 发现strstr比较中出现frida的关键字，然后打印堆栈确定逻辑大致在libexec 的so文件里面

dump出so文件

```js
function print_c_stack(context, str_tag) {
    //打印堆栈
    console.log("=============================" + str_tag + " Stack start=======================");

    console.log(Thread.backtrace(context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\n'));
    console.log("=============================" + str_tag + " Stack end  =======================");
}
function so_dump(so_name) {
    
    //dump出内存中的so
    var module = Process.getModuleByName(so_name);
    console.log("[name]:", module.name);
    console.log("[base]:", module.base);
    console.log("[size]:", module.size);
    console.log("[path]:", module.path);
    // var currentApplication = Java.use("android.app.ActivityThread").currentApplication();

    // console.log('current application\t', currentApplication)
    // var dir = currentApplication.getApplicationContext().getFilesDir().getPath();
    // console.log(path)
    // var path = dir + "/" + module.name + "_" + module.base + "_" + module.size + ".so";
    
    //因为调用上层java代码的时候currentApplication为空 所以放弃直接改用c代码
    var path = '/sdcard/Download/libexec.so'
    var file = new File(path, "wb");
    if (file) {
        Memory.protect(module.base, module.size, 'rwx');
        var buffer = module.base.readByteArray(module.size);
        file.write(buffer);
        file.flush();
        file.close();
        console.log("dump_so=", path);


    }
}


function strstr() {
    Interceptor.attach(Module.findExportByName(null, 'strstr'), {
        onEnter: function (args) {
            var str1 = args[0].readCString();
            var str2 = args[1].readCString();
            this.match_frida_result = 0
            for (let l in frida_kw) {
                if (str1.indexOf(frida_kw[l]) > -1 || str2.indexOf(frida_kw[l]) > -1) {
                    console.log('strstr val1=', str1)
                    console.log('strstr val2=', str2)
                    this.match_frida_result = str1.indexOf(str2)
                    console.log('strstr indexof=', this.match_frida_result)
                    this.print_ret = 1
                    console.log('dump so =====start=====')
                    so_dump('libexec.so')
                    print_c_stack(this.context)
                    break
                } else {
                    this.print_ret = 0

                }
            }
        }, onLeave: function (retval) {
            if (this.print_ret == 1) {
                retval.replace(0)
                console.log('strstr result=\t', retval)
            }
        }
    });

}

Java.perform(function () {
    strstr()
})

```

但是dump出的so文件需要经过修复，sofixer可以修复so文件 ，具体原理可以看代码，下载即用

https://github.com/F8LEFT/SoFixer/releases

修复命令

SoFixer-Windows-64.exe -s libexec.so -o fix.so -m 0x0 -d

- -s 输入so

- -o 输出so （修复以后）

- -m so开始地址

- -d 目录

修复后的fix.so进入ida基本可用



## so分析新思路

https://xz.aliyun.com/t/13220?time__1311=mqmxnDBD9AqQwx05DIYYK0%3DFyqqfO0wrrD

### hook_pthread

因为检测一般都是单开线程去做 所以在定位好的so里面去找到pthread创建位置

```js
function hook_pthread(){
        var pthread_create_addr = Module.findExportByName(null, 'pthread_create
    var pthread_create = new NativeFunction(pthread_create_addr, "int", ["pointer", "pointer", "pointer", "pointer"]);

    Interceptor.replace(pthread_create_addr, new NativeCallback(function (parg0, parg1, parg2, parg3) {
        var so_name = Process.findModuleByAddress(parg2).name;
        var so_path = Process.findModuleByAddress(parg2).path;
        var so_base = Module.getBaseAddress(so_name);
        var offset = parg2 - so_base;
        var PC = 0;
        if ((so_name.indexOf("libexec.so") > -1)) {
            console.log("find thread func offset", so_name, offset);
        } else {
            PC = pthread_create(parg0, parg1, parg2, parg3);
        }
        return PC;
    }, "int", ["pointer", "pointer", "pointer", "pointer"]))
}
hook_pthread();
```

打印了pthread的调用位置之后记录下来

讲所有记录位置的pthread全部跳过,因为地址总是动态加载，读者可自行调试正确地址

```js
function hook_pthread() {

    var pthread_create_addr = Module.findExportByName(null, 'pthread_create');

    var pthread_create = new NativeFunction(pthread_create_addr, "int", ["pointer", "pointer", "pointer", "pointer"]);
    Interceptor.replace(pthread_create_addr, new NativeCallback(function (parg0, parg1, parg2, parg3) {
        var so_name = Process.findModuleByAddress(parg2).name;
        var so_path = Process.findModuleByAddress(parg2).path;
        var so_base = Module.getBaseAddress(so_name);
        var offset = parg2 - so_base;
        var PC = 0;
        if ((so_name.indexOf("libexec.so") > -1)) {
            console.log("find thread func offset", so_name, offset);
            if ((207076 === offset)) {
                console.log("anti bypass");
            } else if (207308 === offset) {
                console.log("anti bypass");
            } else if (283820 === offset) {
                console.log("anti bypass");
            } else if (286488 === offset) {
                console.log("anti bypass");
            } else if (292416 === offset) {
                console.log("anti bypass");
            } else if (78136 === offset) {
                console.log("anti bypass");
            } else if (293768 === offset) {
                console.log("anti bypass");
            } else {
                PC = pthread_create(parg0, parg1, parg2, parg3);
            }
        } else {
            PC = pthread_create(parg0, parg1, parg2, parg3);
        }
        return PC;
    }, "int", ["pointer", "pointer", "pointer", "pointer"]))
}
hook_pthread();
```

本来想自编译frida 因为没有搭建好对应环境，解决了现在暂时没必要针对性修改源码自编译frida了。

经历了上述脱壳，反调试过程基本就ok了，可以开始正常的逆向分析工作了。