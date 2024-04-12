# frida常用代码段

## 对象打印为json-string

```js

function map_to_json(v) {
    var Gson = Java.use('com.google.gson.Gson').$new();
    return Gson.toJsonTree(v).getAsJsonObject()
}
```

## hook java.util.arraylist

```js
function hook_java_list() {
    var ArrayList = Java.use('java.util.ArrayList');

    ArrayList.add.overload('java.lang.Object').implementation = function (v1) {
        try {
            if (v1 == null) {
                return this.add(v1)
            }
            var text = (v1 + '').toLowerCase().trim()
            console.log(v1)

        } catch (e) {

        }
        return this.add(v1)
    }
    ArrayList.add.overload('int', 'java.lang.Object').implementation = function (v1, v2) {
        try {
            var text = (v2 + '').toLowerCase().trim()
            console.log(v2)

        } catch (e) {

        }
        this.add(v1, v2)
    }
}

```

## java 打印堆栈

```js
function print_call_trace() {
    console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()))
}
```

