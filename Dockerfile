FROM nginx:alpine

# 将构建的文件复制到nginx目录
COPY . /usr/share/nginx/html/

# 配置nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露80端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"] 