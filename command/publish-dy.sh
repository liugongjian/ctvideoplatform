#!/bin/sh expect
echo "=============================开始打包============================="
npm run build && echo "=============================打包完成============================="
echo "=============================压缩文件============================="
tar -zvcf dist.tar.gz dist
echo "=============================开始上传============================="
scp dist.tar.gz root@14.29.183.216:/opt/video-analyze-baseline