#!/bin/sh expect
echo "=============================开始打包============================="
npm run build && echo "=============================打包完成============================="
echo "=============================压缩文件============================="
tar -zvcf dist.tar.gz dist
echo "=============================开始上传============================="
scp -P 8600 dist.tar.gz ctyun@14.29.197.80:/home/ctyun/video-analyze-baseline