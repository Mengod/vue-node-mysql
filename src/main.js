import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import util from './util';
import VueResource from 'vue-resource';

Vue.use(VueResource)

Vue.use(ElementUI);
Vue.use(util);

new Vue({
    router,
    render: h => h(App),
    data: {
        hub: new Vue()
    }
}).$mount('#app');