<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <form>
            <input type="text" name="username" v-model="userName">
            <br>
            <input type="text" name="age" v-model="age">
            <br>
            <a href="javascript:;" @click="addUser">提交</a>
        </form>
    </div>
</template>
<script>
export default {
    name: 'hello',
    data() {
        return {
            msg: 'Welcome to Your Vue.js App',
            userName: '',
            age: ''
        }
    },
    methods: {
        addUser() {
            var name = this.userName;
            var age = this.age;
            this.$http.post('/addUser', {
                username: name,
                age: age
            }, {}).then((response) => {
                console.log(response);
            })
        }
    }
}
</script>
<!-- <template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-menu"></i>设备列表</el-breadcrumb-item>
            </el-breadcrumb>
            <snwith-search ref="snwithSelect" :tableColumn="tableColumn"></snwith-search>
            <snwith-table ref="snwithTable" title="设备" :url="url" :tableColumn="tableColumn">
                <template v-for="item in tableColumn" v-if="item.show">
                    <el-table-column v-if="item.formatter" :prop="item.prop" :label="item.label" sortable="custom" :type='item.type' :width='item.width' :formatter="formatter"></el-table-column>
                    <el-table-column v-else :prop="item.prop" :label="item.label" sortable="custom" :type='item.type' :width='item.width'></el-table-column>
                </template>
            </snwith-table>
        </div>
    </div>
</template>
<script>
import snwithSearch from "../common/SnwithSearch.vue";
import snwithTable from "../common/SnwithTable.vue";

export default {
    mounted: function() {
        this.$nextTick(function() {
            let self = this;
            var pagination = {
                page: 1,
                size: 999
            };
            self.http.post("http://127.0.0.1:3000/api/user/addUser", pagination).then(response => {
                console.log(response)
            });
        })
    },
    components: {
        snwithSearch,
        snwithTable
    },
    data() {
        return {
            url: "/snMac",
            tableColumn: [{
                    label: "序号",
                    type: "index",
                    show: true
                },
                {
                    label: "MAC",
                    prop: "mac",
                    show: true,
                    search: true
                },
                {
                    label: "设备编码",
                    prop: "sn",
                    show: true,
                    search: true
                },
                {
                    label: "线路名",
                    prop: "line",
                    show: true,
                    search: true
                },
                {
                    label: "站点名",
                    prop: "site",
                    show: true,
                    search: true
                },
                {
                    label: "网关",
                    prop: "gateway",
                    show: true,
                    search: true
                },
                {
                    label: "IP地址",
                    prop: "ip",
                    show: false,
                    search: true
                },
                {
                    label: "认证账号",
                    prop: "account",
                    show: true,
                    search: true
                },
                {
                    label: "认证密码",
                    prop: "password",
                    show: true
                },
                {
                    label: "更新时间",
                    prop: "updateTime",
                    type: "datetime",
                    show: true,
                    formatter: true,
                    search: true,
                    order: "descending"
                }
            ]
        };
    },
    methods: {
        formatter(row, column) {
            if (column.property === "updateTime") {
                return this.formatTimeLabel(row.updateTime);
            }
        }
    }
};
</script> -->