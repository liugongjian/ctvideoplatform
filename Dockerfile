FROM nginx:stable

# 注意修改对应nginx配置文件名称
# ARG confName=video_baseline.conf

#获取docker build 时--build-arg 所带的环境参数
ARG ENV

# 修改时区、编码
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo '$TZ' > /etc/timezone
ENV LANG C.UTF-8

WORKDIR /usr/share/nginx/html

COPY ./video_baseline_${ENV}.conf /etc/nginx/conf.d/video_baseline.conf

ADD ./dist /usr/share/nginx/html/dist