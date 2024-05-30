function dlopen_ext() {
    Interceptor.attach(Module.getExportByName(null, 'android_dlopen_ext'), {
        onEnter: function (args) {
            this.path = Memory.readUtf8String(args[0]);
            console.log('android_dlopen_ext\t', this.path)


        }, onLeave: function (retval) {
            let so_libexec = Process.findModuleByName("libexec.so")
        }
    });
}

function dlopen() {
    Interceptor.attach(Module.getExportByName(null, 'dlopen'), {
        onEnter: function (args) {
            this.path = Memory.readUtf8String(args[0]);
            console.log("dlopen\t" + this.path);
        }, onLeave: function (retval) {
        }
    });
}

dlopen()
dlopen_ext()