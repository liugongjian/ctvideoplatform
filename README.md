# 视频云平台

---
视频云平台


# Documentation
---

# Build
git clone https://10.30.90.89:10080/zhaodan/videoplayform.git

```
cd /face-gate                            # operation file
npm install                             # install package
npm run dev                              # with incremental compile and auto reload
npm run build                            # build
npm run deploy                           # publish if needed ,details and config url in command/publish.sh
```
open [http://localhost:8123](http://localhost:8123)

# 备注
本仓库代码包含：
  公共部分，包含重写antd组件的src/components，资源src/assets，样式字体src/style

# Other
webpack+eslint+react+redux+antd+less
commit有钩子，推荐安装eslint插件
结构
- src 根目录
    - container 放的业务页面，是redux的connect入口
        - component 各自业务用的组件
        - *.less 各自的样式
    - redux  
        - middleware redxu 中间件
        - reducer reducer+action+type 默认导出reducer 导出action  以业务为单位
    - components 单纯的组件
    - style 公共样式
        - fonts 字体
    - assets 资源图片等
    - utils 工具
    - template html入口模板
    - routers.js route 
    - icons.js 分离antd icons(3.9后默认把icon的svg打到进来了)包按需加载
    - index.js 
    
发起请求的中间件处理写法

`如果是异步action可以传promise(支持Function和Promise)；
type支持数组和字符串。`

默认用法：
```
export function loadAction() {
  return {
    type: LOAD_SUCCESS, 
    data: '加载完成'
  };
}
```

数组用法：
```
export function loadAction() {
  return {
    type: [LOAD, LOAD_SUCCESS, LOAD_FAIL],  //数组顺序分别处理start pending complete
    promise: apiClient => apiClient.get('116385/project/1')
  };
}
```

字符串用法：
```
export function loadAction() {
  return {
    type: LOAD_SUCCESS  //只会处理 complete
    promise: apiClient => apiClient.get('116385/project/1')
  };
}
```


- components
    - Button
    - Icon
    - FormItem  重写（支持右提示）
   

    - *menu
    - table
    - tab
    - select
    
    - Popover
    - search
    - input
    - radio

- 注意事项
  -  Etable组件，中给table加了
     ```less
        :global{
          table{
            table-layout: fixed;
          }
        }
     ```
     不加这个，antd的table样式会有问题，但是加了这个，当table中文字多的时候，多余变...或者table滑动会有问题，在自己的页面less中加入
     ```less
        :global{
          table{
            table-layout: auto;
          }
        }
     ```
  - 路由请按照格式添加，详细的在routeconfig文件中有注释
  - ！！！不要写任何的行内样式！！！
  - 可以不使用less in js ，自己写less文件注意格式和层级，避免影响他人组件
  - 记得开启编辑器的eslint检查
- 项目中需要的文档
  - [antd 3.x ](https://3x.ant.design/components/button-cn/) 