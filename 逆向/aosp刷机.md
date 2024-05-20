# 刷机

```shell
# 准备aosp代码包 略

cd aosp

source build/envsetup.sh
#清除缓存
make clobber 
lunch 

# 选择目标编译机器和平台

6

# 开始编译

make -j10



系统镜像文件：这些文件是可以直接刷入设备的 Android 系统镜像。它们通常位于 out/target/product/<device>/system.img。

恢复镜像：用于恢复模式的系统镜像，位于 out/target/product/<device>/recovery.img。

启动镜像：用于启动 Android 设备的镜像，位于 out/target/product/<device>/boot.img。

内核镜像：内核的编译输出，位于 out/target/product/<device>/kernel。

用户数据镜像：用户数据分区的镜像，位于 out/target/product/<device>/userdebug.img。

编译后的源代码：编译后的源代码文件，位于 out/target/common/obj/JAVA_LIBRARIES/ 目录下。

Android 应用包：编译后的 APK 文件，位于 out/target/product/<device>/system/priv-app/ 和 out/target/product/<device>/system/app/ 目录下。

编译日志：编译过程中的日志文件，位于 out/soong/.intermediates/ 目录下。

错误和警告：编译过程中的错误和警告信息，通常在编译结束时显示在终端。

编译配置文件：编译过程中使用的配置文件，如 build/target/product.mk 和 build/target/board.mk。

其他构建产物：根据编译过程中包含的模块和选项，可能还有其他构建产物，例如测试套件、文档等。

编译完成后，你可以在 out/target/product/<device> 目录下找到大部分的构建产物。<device> 是你的设备代码名，例如 bullhead（Nexus 5X）或 marlin（Pixel XL）。

请注意，AOSP 构建系统非常复杂，具体的输出可能会根据你的编译配置和 AOSP 版本有所不同。如果你需要更详细的信息，可以查看 build/envsetup.sh 脚本中的帮助信息，或者参考 AOSP 官方文档。
```



