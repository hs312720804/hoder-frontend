极光引擎平台前端
---

## 开发
安装依赖
```bash
npm install
```

使用本地搭建的后端服务
```
npm run serve
```

使用前端测试服务器的后端服务
```
BACKEND=172.20.155.102:8009 npm run serve
```

## 构建
```
npm run build

```
## 部署
本项目是纯静态项目，需要使用 nginx 等来代理静态文件和转发后端请求，下面是一个示例
```
server {
    listen       8010 default_server;
    listen       [::]:8010 default_server;
    server_name  _;
    root         /path/to/hoder-frontend/dist;


    location /api/ {
        # 转发后端请求
        proxy_pass http://172.20.135.123:8011/;
    }
}

```
##本地启动，内网其它机子访问
一、BACKEND=172.20.151.205:8011 npm run serve
备注：ip地址为后端代码访问地址 172.20.135.133:8011 测试环境IP
二、修改vue.config.js配置
把127.0.0.0改成本机Ip
三、测试环境
http://beta-mgr-hoder.skysrt.com/#/launch/myPolicy
