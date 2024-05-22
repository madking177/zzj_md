//根据条件批量hook我们需要的类
var classz = Java.enumerateLoadedClassesSync();
for (var i = 0; i < classz.length; i++) {
    if (classz[i].indexOf("om.xiaojianbang.app.Utils") != -1) {
        var class_name = classz[i];

        console.log("class_name", class_name);

        var cz = Java.use(class_name);
        var methods = cz.class.getDeclaredMethods();
        for (var i1 = 0; i1 < methods.length - 1; i1++) {
            var classz_method_name = methods[i1].getName();

            console.log("classz_method_name => ", class_name, classz_method_name)
            try {
                var overloadAyy = cz[classz_method_name].overloads;
                console.log(overloadAyy)
                if (overloadAyy && overloadAyy.length > 0) {
                    for (var i2 = 0; i2 < overloadAyy.length; i2++) {
                        overloadAyy[i2].implementation = function () {
                            var params = "";
                            for (var j = 0; j < arguments.length; j++) {
                                params = params + arguments[j] + " "
                            }
                            console.log("params", class_name, classz_method_name, params)
                            return this[classz_method_name].apply(this, arguments);

                        };
                    }
                } else {
                    cz[classz_method_name].implementation = function () {
                        var params = "";
                        for (var j = 0; j < arguments.length; j++) {
                            params = params + arguments[j] + " "
                        }
                        console.log("params", class_name, classz_method_name, params)
                        return cz[classz_method_name].apply(this, arguments);


                    };
                }


            } catch (error) {
                console.log("异常类的加载，请特殊处理", class_name, classz_method_name)

            }

        }

    }
}