爽YY | 魔镜
====================
> 实时观察同行网店[店铺销售]和[推广数据]的免费浏览器插件,支持淘宝、天猫、京东

## 线上版本
产品地址：[http://www.moojing.com/extension](http://www.moojing.com/extension)

###部署环境
1. [slimit] (https://pypi.python.org/pypi/slimit/)

### 依赖的Javascript库 
* [jQuery] (http://jquery.com) (tested with version 1.8.0+)
* [HighCharts] (http://www.highcharts.com) (tested with version 2.3.3+)
* [Noty] (http://ned.im/noty) (tested with version 2.0.3+)
* [Bootstrap] (http://getbootstrap.com/) (tested with version 2.2.1+)
* jQuery Plugins (cookie, json, base64)
* messenger (跨域及frame之间通信)
* xdr (异步调用跨域)
  <br>
上述javascript文件均可在dist目录下找到

### 目录结构描述
```
├── Readme.md                           // help 
├── ironman                             
│   ├── 360                             // 360浏览器扩展（满足360的应用规范）
│   │   │── css                         // css样式文件
│   │   │── js                          // Content Script Javascript文件
│   │   │   ├── ironman_depend.min.js   //压缩后的依赖库JS文件
│   │   │   ├── ironman.js              // 初始化全局变量、构建命名空间、加载模块化JS文件
│   │   │   ├── ironman_static.min.js   //压缩后的模块化JS文件
│   │   │── manifest.json       // 扩展描述文件
│   │   │── init.js             // backgroud Javascript文件
│   │   │── content.js          // Content Script Javascript文件
│   ├── chrome                  // 基于chrome内核的浏览器扩展，适用于谷歌、猎豹、百度、QQ、UC等浏览器
│   ├── sougou                  // 搜狗浏览器扩展
│   ├── source                  // 模块化JS文件
├── dist                        // 依赖的Javascript库(所有文件都做过命名空间修改)
├── build                       // 构建
│   ├── package.sh              // 编译打包crx文件
│   ├── depend.sh               // 压缩Javascript库
│   ├── make_static_js          // 压缩模块化js文件
├── test                               
├── LICENSE                            
└── release-notes.txt                  
```
### 构建扩展文件
要在本地进行编译、打包扩展文件，运行package.sh脚本即可. 参考[Packaging scripts] (https://developer.chrome.com/extensions/crx)
````bash
cd {YOUR_WORKGING_DIRECTORY}\build
./package.sh  {YOUR_EXTENSION_SOURCE_DIR} {YOUR_PEM_FILE} 
````
<br> EXTENSION_SOURCE_DIR是扩展源码目录，本项目的路径是 ironman/chrome 和 ironman/360
<br> PEM_FILE是私钥文件，如何获取参考[Packaging] (https://developer.chrome.com/extensions/packaging)
######构建搜狗浏览器扩展文件
将ironman/sougou文件夹下的文件压缩后更改压缩文件的扩展名为.sext即可. 参考[搜狗开发文档](http://ie.sogou.com/open/doc/?id=1_2&title=%E5%88%B6%E4%BD%9CHelloWorld%E6%89%A9%E5%B1%95)

开源许可协议
================
[GPL License](https://opensource.org/licenses/gpl-license)

