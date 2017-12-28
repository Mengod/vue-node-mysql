import Vue from 'vue';
import axios from 'axios';

// axios.defaults.timeout = 5000; //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; //配置请求头

var ENV = process.env.NODE_ENV;

if (ENV === 'development') {
    // dev
    Vue.prototype.baseURL = 'http://10.60.189.5:8099';
    Vue.prototype.wsURL = 'ws://10.60.189.5:8099';
    // Vue.prototype.baseURL = 'http://127.0.0.1:8099';
} else if (ENV === 'test') {
    // test
    Vue.prototype.baseURL = 'http://10.60.100.53:8082';
} else if (ENV === 'production') {
    // build
    Vue.prototype.baseURL = './';
    Vue.prototype.wsURL = 'ws://127.0.0.1:8099';
}

axios.defaults.baseURL = Vue.prototype.baseURL;


export default {
    //返回一个Promise(发送post请求)
    post(url, params) {
        return new Promise((resolve, reject) => {
            axios.post(url, params)
                .then(response => {
                    resolve(response.data);
                }, err => {
                    reject(err);
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    //返回一个Promise(发送get请求)
    get(url, params) {
        return new Promise((resolve, reject) => {
            axios.get(url, params)
                .then(response => {
                    resolve(response.data);
                }, err => {
                    reject(err);
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
}