// import http from './http';

export default {
    install(Vue, options) {
        // Vue.prototype.http = http;

        // 时间格式化
        Vue.prototype.formatTimeLabel = function(time, upTime) {
            if (time) {
                return moment(time).format('YYYY-MM-DD h:mm:ss');
            } else {
                return "";
            }
        };

        // 筛选条件格式化
        Vue.prototype.getSearchParams = function(obj) {
            var temp = '';
            jQuery.each(obj, function(key, val) {
                if (val == null) return;
                if (key.indexOf('_') > 0) {
                    temp += '&' + key + '=' + val;
                }
            });
            return '?' + temp.substring(1, temp.length);
        };
    }
}