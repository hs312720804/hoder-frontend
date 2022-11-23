module.exports = {
  host: '172.20.155.102', // 服务器ip地址
  username: 'deploy',
  password: 'deploy@1234',
  port: 56100, // 端口
  pathUrl: '/data/www/saas/hoder-frontend/', // 上传至服务器的目标目录
  dist: 'dist', // 需要部署的打包过后的文件夹 根据项目不同值不同 一般为 dist static 或者build
  isRetainDistFolder: true // 是否保留dist目录
}
