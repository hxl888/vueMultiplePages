# vueMultiplePages

>  Vue.js vueMultiplePages project

## Build Setup


``` bash
此项目写的比较单一简单(可以初略的看 可以应急vue多页面打包)
# install dependencies
npm install

# serve with hot reload at localhost:8081
npm run dev (需要手动打开浏览器地址)

手动打开例如: http://localhost:8081/pages/index.html || http://localhost:8081/annualCeremony2019/annualCeremonyPendant2019.html

# build for production with minification
npm run test
npm run build

1.
buildEntry.js (当项目中没有此文件的时候 npm run build 会自动生成一个buildEntry.js 在本目录下面)
为打包配置入口文件
不配置则按照默认打包所有pages下的所有页面

2.
配置如下：
例如只对pages下的list 进行单独打包的话 数组里面写上'pages/list'、 
多个的话后面继续累加；（数组为空的话则默认打包pages下的所的html页面）

{"entryDir": "winterCarnival2019","entryData": ["winterCarnival2019/winterCarnivalPendant2019", "winterCarnival2019/winterCarnivalTan2019"]}
或者 
{"entryDir": "pages","entryData": ["pages/list"]}

同时需要手动修改html对应的单页面中的正则部分 
例如："entryDir": "winterCarnival2019" 为 winterCarnival2019 需要将html中正则部分替代为对应的 winterCarnival2019 文件名字 以至于打包后对应的css、js路径能够更改为线上地址

3.
注：在pages 下面还可以单独新建文件加例如项目中的pages下面的winterCarnival2019文件夹，
打包出来的文件会单独放到和pages平级的目录下面（此时 buildEntry.js 配置文件 
可以在数组里面写成 ‘winterCarnival2019/winterCarnivalPendant2019’ 就会单独打包出来 winterCarnival2019 下的 winterCarnivalPendant2019.html）


```
