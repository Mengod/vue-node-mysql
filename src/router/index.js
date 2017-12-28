import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/common/Home.vue';

import Devices from '../components/page/Devices.vue';
import Ip from '../components/page/Ip.vue';


import Search from '../components/page/Search.vue';
import Write from '../components/page/Write.vue';
import Reboot from '../components/page/Reboot.vue';

Vue.use(Router);

let routes = [{
    path: '/devices',
    type: 1,
    title: '设备列表',
    component: Home,
    children: [{
        path: '/',
        name: 'devices',
        component: Devices
    }]
}, {
    path: '/ips',
    type: 1,
    title: 'IP列表',
    component: Home,
    children: [{
        path: '/',
        name: 'users',
        component: Ip
    }]
}];

let router = new Router({
    // 'mode': 'history', // 去掉URL的#号，需要配置服务器http://router.vuejs.org/zh-cn/essentials/history-mode.html
    'linkActiveClass': 'active',
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.length === 0) { //如果未匹配到路由
        if (from.name) {
            next({ name: from.name })
        } else {
            next("/devices");
        }
    } else {
        next();
    }
})

export default router;