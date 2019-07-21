# HumanFaceLibMag_front

> A minimal vue admin template with Element UI & axios & iconfont & permission control & lint

# install dependency
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# develop
npm run dev

This will automatically open http://localhost:9528

## Build

```bash

# build for production environment
npm run build:prod
```
#ERROR 如果出错删除package-lock.json, node_modules,再执行
npm i

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```


## License

[MIT](https://github.com/PanJiaChen/vue-admin-template/blob/master/LICENSE) license.
provide by panjiachen, re-edit by ChenJie