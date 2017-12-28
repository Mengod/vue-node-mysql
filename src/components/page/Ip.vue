<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-menu"></i>Ip列表</el-breadcrumb-item>
            </el-breadcrumb>
            <snwith-search ref="snwithSelect" :tableColumn="tableColumn"></snwith-search>
            <snwith-table ref="snwithTable" title="设备" :url="url" :tableColumn="tableColumn" :fileBtns="fileBtns">
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
    components: {
        snwithSearch,
        snwithTable
    },
    data() {
        return {
            url: "/ipAuth",
            fileBtns: [{
                name: "import",
                url: "/ipAuth/import"
            }, {
                name: "export",
                url: "/ipAuth/export"
            }],
            tableColumn: [{
                    label: "序号",
                    type: "index",
                    show: true
                },
                {
                    label: "IP地址",
                    prop: "ip",
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
                    label: "是否使用",
                    prop: "isUsed",
                    type: "switch",
                    show: true,
                    formatter: true,
                    search: true,
                    order: "descending",
                    data: [{
                            id: true,
                            name: "是"
                        },
                        {
                            id: false,
                            name: "否"
                        }
                    ]
                }
            ]
        };
    },
    methods: {
        formatter(row, column) {
            if (column.property === "isUsed") {
                var isUsed = row.isUsed ? "是" : "否"
                return isUsed;
            }
        }
    }
};
</script>