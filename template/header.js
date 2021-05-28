/**
 * Created by liudongxu on 2018/6/22.
 */
function hover(ele,over,out){
    ele.addEventListener('mouseover',over,false);
    ele.addEventListener('mouseout',out,false);
}
var IP=apiIp
var navList = [
    {
        label: '',
        icon: 'icon-sub',
        sub: [
            {
                label: '计算',
                group: [
                    {
                        label: '弹性云主机',
                        icon: 'icon-vm',
                        path: 'http://www.ctyun.cn/v3control/control_vms'
                    },
                    {
                        label: '快照',
                        icon: 'icon-dashboard',
                        path: 'http://www.ctyun.cn/v3control/vms_snapshot',
                        type: 'cs'
                    }

                ]
            },
            {
                label: '存储',
                group: [
                    {
                        label: '云硬盘',
                        icon: 'icon-ebs-nav',
                        path: 'http://www.ctyun.cn/v3control/storage'
                    },
                    {
                        label: '对象存储',
                        icon: 'icon-ebs-nav',
                        path: 'http://www.ctyun.cn/control/control_oos'
                    }
                ]
            },
            {
                label: '安全',
                group: [
                    {
                        label: '虚拟私有云',
                        icon: 'icon-vpc-nav',
                        path:'http://www.ctyun.cn/v3control/vpc'
                    },
                    {
                        label: '弹性负载均衡',
                        icon: 'icon-lb-nav',
                        path: 'http://www.ctyun.cn/v3control/slblist',
                        type: 'cs'
                    },
                    {
                        label: 'Web应用防火墙（企业版)',
                        icon: 'icon-lb-nav',
                        path: 'http://www.ctyun.cn/v3control/toctcs'
                    },
                ]
            },
            {
                label: '应用服务',
                group: [
                    {
                        label: '云备份',
                        icon: 'icon-domain-nav',
                        path: 'http://www.ctyun.cn/appcontrol/cloudbackup'
                    },
                    {
                        label: '域名服务',
                        icon: 'icon-monitor-nav',
                        path: 'http://www.ctyun.cn/domain/domain_control_vms'
                    }
                ]
            },
            {
                label: '数据库',
                group: [
                    {
                        label: '关系型数据库',
                        icon: 'icon-domain-nav',
                        path: 'http://itpaas.ctyun.cn/RDS2/index.html#/rdsConsole/insManagement/list'
                    },
                    {
                        label: '分布式数据库',
                        icon: 'icon-monitor-nav',
                        path: 'http://itpaas.ctyun.cn/DRDS/#/instance-list'
                    },
                    {
                        label: '分布式缓存',
                        icon: 'icon-monitor-nav',
                        path: 'http://itpaas.ctyun.cn/DCS2/#/user/list'
                    }
                ]
            },
            {
                label: '中间件',
                group: [
                    {
                        label: '分布式消息服务',
                        icon: 'icon-domain-nav',
                        path: 'http://itpaas.ctyun.cn/MQ2/'
                    }
                ]
            },
        ]
    }
];
var layout={
    init:function(option,ele){
        var header=this.createHead(option);
        var footer = this.creatFooter();
        if(ele){
            ele.appendChild(header);
            ele.appendChild(footer);
        }else{
            //插入到body
            var body = document.getElementsByTagName('body')[0];
            body.appendChild(header);
            body.appendChild(footer);
        }

    },
    createHead:function(option){
        return this.creatElement(option);
    },
    creatElement:function (option) {
        var head=document.createElement('div');
        head.className='console-header';
        head.appendChild(this.creatLeft(option));
        head.appendChild(this.creatRight(option));
        return head;
    },
    creatLeft:function(option){
        var headerLeft=document.createElement('div');
        headerLeft.className='header-left';

        var logo=document.createElement('div');
        logo.className='logo';
        logo.onclick=function(){
            location.href='http://www.ctyun.cn'
        }
        var img=document.createElement('img');
        img.src=IP+'/static/share/logo.png';
        logo.appendChild(img);

        var dropdown=document.createElement('div');
        dropdown.className='console-dropdown';
        var ul=document.createElement('ul');
        ul.className='navList';
        var _this=this;
        navList.forEach(function(item){
            var li=document.createElement('li');
            if(item.sub){
                li.className='subnav nav';
                var label=document.createElement('label');
                label.className='navlabel';
                var server=document.createElement('span');
                server.className='name';
                server.innerHTML='服务列表'
                var svgh=document.createElement('span');
                svgh.className='icon-list';
                label.appendChild(server);
                label.appendChild(svgh);
                var secondNav=document.createElement('div');
                secondNav.className='secondNav hide';

                var listNav=document.createElement('div');
                listNav.className='listNav';

                // var secondNav=document.createElement('div');
                // secondNav.className='secondNav hide';
                listNav.appendChild(_this.secondNav(item.sub));
                secondNav.appendChild(listNav);

                li.appendChild(label);
                li.appendChild(secondNav);
                hover(li,function(){
                    secondNav.className='secondNav show';
                },function(){
                    secondNav.className='secondNav hide';
                })
            }else{
                li.className='nav';
                var label=document.createElement('label');
                var span=document.createElement('span');
                var svg=document.createElement('span');
                svg.className=item.icon;
                span.innerHTML=item.label;
                label.appendChild(svg);
                label.appendChild(span);
                li.appendChild(label);
                li.onclick=function(){
                    window.location.href=item.path
                }


            }
            ul.appendChild(li);
        })
        dropdown.appendChild(ul);

        var center=document.createElement('div');
        center.className='center'
        center.innerHTML='控制中心'
        center.onclick=function(){
            window.location.reload();
        }
        headerLeft.appendChild(logo);
        headerLeft.appendChild(center);
        headerLeft.appendChild(dropdown);
        return headerLeft
    },
    secondNav:function(data){
        var ul=document.createElement('ul');
        data.forEach(function(item){
            var li=document.createElement('li');
            if(item.group){
                if(item.class){
                    li.className=item.class;
                }else{
                    li.className='li';
                }
                var label=document.createElement('label');
                label.innerHTML=item.label;
                li.appendChild(label);
                item.group.forEach(function(val){
                    var div=document.createElement('div');
                    if(val.type){
                        div.className=val.type
                    }

                    var span=document.createElement('span');
                    var svg=document.createElement('span');
                    span.innerHTML=val.label;
                    svg.className=val.icon;
                    // div.appendChild(svg);
                    div.appendChild(span);
                    if(val.class){
                        div.className=val.class
                    }else{
                        div.onclick=function(){
                            location.href=val.path;
                        };
                    }
                    li.appendChild(div);
                })
            }else{
                li.className='firstNav';
                var div=document.createElement('div');
                var span=document.createElement('span');
                var svg=document.createElement('span');
                span.innerHTML=item.label;
                svg.className=item.icon;
                div.appendChild(svg);
                div.appendChild(span);
                div.onclick=function(){
                    location.href=item.path;
                };
                li.appendChild(div);
            }

            ul.appendChild(li);
        });
        return ul;
    },
    creatRight:function(option){
        var headerRight=document.createElement('div');
        headerRight.className='header-right';

        var list=document.createElement('div');
        list.className="node-list";

        var selected=document.createElement('div');
        selected.className='nodes'
        list.appendChild(selected);


        var address=document.createElement('span');
        address.className='address'
        var addressicon=document.createElement('span');
        addressicon.className='icon-address'
        address.appendChild(addressicon)

        var node=document.createElement('span');
        node.className='node'
        node.innerHTML=''


        var icon=document.createElement('span');
        icon.className='icon'
        var iconImg=document.createElement('span');
        iconImg.className='icon-list'
        icon.appendChild(iconImg)

        selected.appendChild(address);
        selected.appendChild(node);
        selected.appendChild(icon);

        var ulList=document.createElement('ul');

        var AG=document.createElement('li');
        AG.className='AG'
        var AGlabel=document.createElement('label');
        AGlabel.innerHTML='A-G'
        var AGlist=document.createElement('ul');
        AGlist.className='AGlist'
        AG.appendChild(AGlabel)
        AG.appendChild(AGlist)


        var HK=document.createElement('li');
        HK.className='HK'
        var HKlabel=document.createElement('label');
        HKlabel.innerHTML='H-K'
        var HKlist=document.createElement('ul');
        HKlist.className='HKlist'
        HK.appendChild(HKlabel)
        HK.appendChild(HKlist)


        var LS=document.createElement('li');
        LS.className='LS'
        var LSlabel=document.createElement('label');
        LSlabel.innerHTML='L-S'
        var LSlist=document.createElement('ul');
        LSlist.className='LSlist'
        LS.appendChild(LSlabel)
        LS.appendChild(LSlist)

        var TZ=document.createElement('li');
        TZ.className='TZ'
        var TZlabel=document.createElement('label');
        TZlabel.innerHTML='T-Z'
        var TZlist=document.createElement('ul');
        TZlist.className='TZlist'
        TZ.appendChild(TZlabel)
        TZ.appendChild(TZlist)

        ulList.className='select hide';
        ulList.appendChild(AG)
        ulList.appendChild(HK)
        ulList.appendChild(LS)
        ulList.appendChild(TZ)



        var nodeInfo=document.createElement('div');
        nodeInfo.className='nodeInfo hide'

        var nodeTitle=document.createElement('div');
        nodeTitle.className='title'
        var nodeLabel=document.createElement('label');
        var returnNode=document.createElement('span');
        returnNode.className='returnF'
        returnNode.innerHTML='<&nbsp返回'
        returnNode.onclick=function(){
            document.getElementsByClassName('select')[0].className='select show'
            document.getElementsByClassName('nodeInfo')[0].className='nodeInfo hide'
        }
        nodeTitle.appendChild(nodeLabel)
        nodeTitle.appendChild(returnNode)

        var nodelist=document.createElement('ul');
        nodeInfo.appendChild(nodeTitle)
        nodeInfo.appendChild(nodelist)


        list.appendChild(ulList);
        list.appendChild(nodeInfo);


        var regainList;
        var ajax = new XMLHttpRequest();


        var AGarray=['A','B','C','D','E','F','G']
        var HKarray=['H','I','J','K']
        var LSarray=['L','M','N','O','P','Q','R','S']
        var TZarray=['T','U','V','W','X','Y','Z']


        ajax.open('get',IP+'/console/index/menu/?regionid=all&accountId='+option.accountId);
        ajax.send();
        ajax.onreadystatechange = function  () {
            if (ajax.readyState==4 &&ajax.status==200) {
                regainList=JSON.parse(ajax.responseText).results;
                var RegionId=option.RegionId
                var step=1;
                // node.innerHTML=regainList[0].parentName
                var nodeSelect
                regainList.forEach(function(item,index){
                    item.platforms.forEach(function(val,i){
                        if(val.uuid==RegionId){
                            nodeSelect=val.zoneName
                        }
                    })
                    var li
                    var dataList
                    if(AGarray.indexOf(item.parentPinyin_start) > -1){
                        li= document.createElement('li');
                        var span=document.createElement('span');
                        span.innerHTML=item.parentName
                        li.appendChild(span)
                        AGlist.appendChild(li)
                    }else if(HKarray.indexOf(item.parentPinyin_start) > -1){
                        li= document.createElement('li');
                        var span=document.createElement('span');
                        span.innerHTML=item.parentName
                        li.appendChild(span)
                        HKlist.appendChild(li)
                    }else if(LSarray.indexOf(item.parentPinyin_start) > -1){
                        li= document.createElement('li');
                        var span=document.createElement('span');
                        span.innerHTML=item.parentName
                        li.appendChild(span)
                        LSlist.appendChild(li)
                    }else if(TZarray.indexOf(item.parentPinyin_start) > -1){
                        li= document.createElement('li');
                        var span=document.createElement('span');
                        span.innerHTML=item.parentName
                        li.appendChild(span)
                        TZlist.appendChild(li)
                    }
                    li.onclick = function () {
                        nodeLabel.innerHTML=item.parentName
                        onSelectedNode(item,nodelist);
                    }


                    // if(item.uuid&&item.uuid==RegionId){
                    //     step++
                    //     // selected.innerHTML=item.name?item.name:item.zoneName;
                    //     onSelected(item,'default');
                    // }
                    // var option= document.createElement('li');
                    // option.value=item.uuid;
                    // option.innerHTML=item.name?item.name:item.zoneName;
                    // ulList.appendChild(option);
                    // option.onclick=function(){
                    //     onSelected(item);
                    // }

                })
              if(nodeSelect){
                node.innerHTML=nodeSelect
              }else{
                node.innerHTML=regainList[0].platforms[0].zoneName
              }
                // if(step==1){
                //     // selected.innerHTML=regainList[0].name?regainList[0].name:regainList[0].zoneName;
                //     console.log(regainList[0])
                //     onSelected(regainList[0],'default');
                // }

            }
        }    //获取资源池列表


        var user=document.createElement('div');
        user.className='user';

        var useShow=document.createElement('div');
        useShow.className='useShow';

        var userImg=document.createElement('span');
        userImg.className='userImg';
        var img=document.createElement('img');
        img.src=IP+'/static/share/user-head.png'
        userImg.appendChild(img)

        var userList=document.createElement('span');
        userList.className='userList'
        var name=document.createElement('span');
        name.className='userName'

        var sanjiao=document.createElement('span');
        sanjiao.className='icon-list'
        userList.appendChild(name)
        userList.appendChild(sanjiao)

        useShow.appendChild(userImg)
        useShow.appendChild(userList)

        var infoList=document.createElement('ul');
        infoList.className='infoList hide'

        var my_account=document.createElement('li');
        my_account.className='my_account'
        var my_account_a=document.createElement('a');
        my_account_a.innerHTML='用户中心'
        my_account.appendChild(my_account_a)


        var my_beian=document.createElement('li');
        my_beian.className='my_beian'
        var my_beian_a=document.createElement('a');
        my_beian_a.innerHTML='我的备案'
        my_beian.appendChild(my_beian_a)

        var my_order=document.createElement('li');
        my_order.className='my_order'
        var my_order_a=document.createElement('a');
        my_order_a.innerHTML='我的订单'
        my_order.appendChild(my_order_a)

        var my_services=document.createElement('li');
        my_services.className='my_services'
        var my_services_a=document.createElement('a');
        my_services_a.innerHTML='提交工单'
        my_services.appendChild(my_services_a)

        var logout=document.createElement('li');
        logout.className='logout'
        var logout_a=document.createElement('a');
        logout_a.innerHTML='退出登录'
        logout_a.href=IP+'/logout'
        logout.appendChild(logout_a)

        infoList.appendChild(my_account)
        infoList.appendChild(my_order)
        infoList.appendChild(my_services)
        infoList.appendChild(my_beian)
        infoList.appendChild(logout)


        user.appendChild(useShow)
        user.appendChild(infoList)

        var msg=document.createElement('div');
        msg.className='msg'
        var msg_a=document.createElement('a');
        msg_a.href='#'
        var msg_img=document.createElement('span');
        msg_img.className='icon-msg'
        msg_a.appendChild(msg_img)
        msg.appendChild(msg_a)

        var quota=document.createElement('div');
        quota.className='quota'
        var quota_a=document.createElement('a');
        var quota_img=document.createElement('span');
        quota_img.className='icon-quota'
        quota_a.appendChild(quota_img)
        quota.appendChild(quota_a)


        var help=document.createElement('div');
        help.className='help'
        var help_a=document.createElement('a');
        var help_img=document.createElement('span');
        help_img.className='icon-help'
        help_a.appendChild(help_img)
        help.appendChild(help_a)


        var xhr = new XMLHttpRequest();
        xhr.open('get',IP+'/console/index/user/?regionid=all&accountId='+option.accountId);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState==4 &&xhr.status==200) {
                var data=JSON.parse(xhr.responseText);
                name.innerHTML=data.customer_name?data.customer_name:'admin'
                my_account_a.href=data.my_account_url
                my_order_a.href=data.my_order_url
                my_services_a.href=data.my_services_url
                my_beian_a.href=data.my_beian_url
                quota_a.href=data.my_quota_url
                help_a.href=data.my_help_url


            }
        }
                                   //用户信息

        // var info=document.createElement('ul');
        // info.className='hide';
        // var licenter=document.createElement('li');
        // var liout=document.createElement('li');
        // var center=document.createElement('a');
        // // center.href='www.ctyun.cn';
        // licenter.onclick=function(){
        //     window.location.href='http://www.ctyun.cn'
        // }
        // center.innerHTML='个人中心'
        // var out=document.createElement('a');
        // out.href='http://36.111.164.230:83/logout';
        // out.innerHTML='退出登录'
        //
        // info.appendChild(licenter);
        // info.appendChild(liout);
        // licenter.appendChild(center);
        // liout.appendChild(out);
        // use.appendChild(span);
        // use.appendChild(info);



        headerRight.appendChild(list);
        headerRight.appendChild(user);
        // headerRight.appendChild(msg);
        // headerRight.appendChild(quota);
        headerRight.appendChild(help);

        selected.onclick=function(event){
            event = event || window.event
            event.stopPropagation()
            if(ulList.className=='select hide'){
                address.className='address addressBlue'
                ulList.className='select show'
            }else{
                address.className='address'
                ulList.className='select hide'
            }
            infoList.className='infoList hide'

        };
        document.addEventListener('click',function(){
            address.className='address'
            document.getElementsByClassName('select')[0].className='select hide'
            document.getElementsByClassName('nodeInfo')[0].className='nodeInfo hide'
            infoList.className='infoList hide'
        })
        ulList.onclick=function(event){
            event = event || window.event
            event.stopPropagation()
        };
        nodeInfo.onclick=function(event){
            event = event || window.event
            event.stopPropagation()
        };

        useShow.onclick=function(event){
            event = event || window.event
            event.stopPropagation()
            if(infoList.className=='infoList show'){
                infoList.className='infoList hide'
            }else{
                infoList.className='infoList show'
            }
            ulList.className='select hide'
            address.className='address'

        }
        infoList.onclick=function(event){
            event = event || window.event
            event.stopPropagation()
        };

        function fiterStack(data,fiter){
            for(var i=0;i<data.length;i++){
                data[i].style.display=fiter;
            }
        }
        function passClick(adress){
            window.location.href=adress;
            // alert(adress)
        }
        function filterPaas(data){
            for(var i in data){
                var pass=document.getElementsByClassName(i)[0];
                pass.className=i+' show';
                (function(i){
                    pass.onclick=function(){
                        passClick(data[i])
                    }
                })(i)
            }
        }
        function onSelectedNode(data,nodelist){
            document.getElementsByClassName('select')[0].className='select hide'
            document.getElementsByClassName('nodeInfo')[0].className='nodeInfo show'
            nodelist.innerHTML=''
            var li
            data.platforms.forEach(function(item,index){
                li= document.createElement('li')
                var a = document.createElement('a')
                a.href=item.zoneUrl
                a.innerHTML=item.zoneName
                li.appendChild(a)
                nodelist.appendChild(li)
            })

        }
        function onSelected(item,type){
            // selected.innerHTML=item.name?item.name:item.zoneName;
            ulList.className='select hide';
            if(item.ctyun==1){
                if(type!=='default'){
                    window.location.href=item.zoneUrl
                }
            }else if(item.ctyun==0){
                var cslist=document.getElementsByClassName('cs');
                var oslist=document.getElementsByClassName('os');
                var paas=document.getElementsByClassName('paas')[0];
                if(item.type==1){
                    fiterStack(cslist,'block');
                    fiterStack(oslist,'none');
                }else if(item.type==2){
                    fiterStack(cslist,'none');
                    fiterStack(oslist,'block');
                }
                if(item.details.paas){
                    paas.className='paas show';
                    filterPaas(item.details.paas);
                }else{
                    paas.className='paas hide';
                }
                if(type!=='default'){
                    window.location.href=item.zoneUrl+'?uuid='+item.uuid
                }
            }

        }


        // hover(span,function(){
        //     info.className='show';
        // },function(){
        //     info.className='hide';
        // })
        // span.onhover=function(){
        //
        // };
        // hover(info,function(){
        //     info.className='show';
        // },function(){
        //     info.className='hide';
        // })
        // span.onhover=function(){
        //
        // };
        return headerRight
    },

    creatFooter:function(){
        var footer=document.createElement('div');
        var left=document.createElement('div');
        left.className='left'

        var left_leftg=document.createElement('span');
        left_leftg.className='footer-font'
        var left_img=document.createElement('span');
        left_img.className='icon-footerIcon'
        left_leftg.appendChild(left_img)
        var left_span=document.createElement('span');
        left_span.innerHTML='中文（简体）'
        left.appendChild(left_leftg)
        left.appendChild(left_span)

        var right=document.createElement('div');
        right.className='right'
        var beian=document.createElement('span');
        beian.innerHTML='©2018中国电信股份有限公司云计算分公司版权所有  京ICP备 12022551号  增值电信业务经营许可证A2.B1.B2-20090001'
        var index=document.createElement('a');
        index.innerHTML='天翼云首页'
        index.href='http://www.ctyun.cn/'
        var portal=document.createElement('a');
        portal.innerHTML='用户协议'
        portal.href='http://www.ctyun.cn/terms'
        var falv=document.createElement('a');
        falv.innerHTML='法律声明'
        falv.href='http://www.ctyun.cn/law'
        var line1=document.createElement('span');
        line1.className='line'
        var line2=document.createElement('span');
        line2.className='line'
        var line3=document.createElement('span');
        line3.className='line'
        right.appendChild(beian)
        right.appendChild(line1)
        right.appendChild(index)
        right.appendChild(line2)
        right.appendChild(portal)
        right.appendChild(line3)
        right.appendChild(falv)

        footer.appendChild(left)
        footer.appendChild(right)
        footer.className='console-footer';
        // footer.innerHTML='©2018中国电信股份有限公司云计算分公司版权所有 京ICP备 12022551号'
        return footer;
    }
};



