<template>
    <el-card id="cardContent">
        <div slot="header">
            <span>{{title}}列表</span>
            <i class="iconfont icon-quanping" @click="launchFullscreen('cardContent')"></i>
        </div>
        <div class="snwith-table">
            <el-row class="tool-bar">
                <el-col v-if="fileBtns">
                    <file-bar :fileBtns='fileBtns' :tableColumn="tableColumn"></file-bar>
                </el-col>
            </el-row>
            <el-table stripe :data='tableData' @sort-change='handleSort' border fit :default-sort="defaultSort" :row-class-name="tableRowClassName" style='width: 100%;overflow: auto;'>
                <slot></slot>
            </el-table>
            <div class="pagination pagination-wrap">
                <el-pagination @size-change='handleSizeChange' @current-change='handleCurrentChange' :current-page='innerPaginationDef.currentPage' :page-sizes='innerPaginationDef.pageSizes' :page-size='innerPaginationDef.pageSize' :layout='innerPaginationDef.layout' :total='total'>
                </el-pagination>
            </div>
        </div>
    </el-card>
</template>
<script>
import FileBar from "./FileBar";
export default {
    name: "SnwithTable",
    components: {
        FileBar
    },
    props: {
        title: "",
        url: "",
        tableColumn: [Array],
        fileBtns: [Array],
        paginationDef: {
            type: Object,
            default () {
                return {};
            }
        }
    },
    data() {
        return {
            searchParam: "",
            tableData: [],
            total: 0,
            sortData: {},
            saveForm: {},
            selection: [],
            editBtnDisabled: true,
            deleteBtnDisabled: true
        };
    },
    created() {
        this.$root.hub.$on("searchForm", value => {
            //Hub接收事件
            this.searchParam = value;
            this.handleCurrentChange(1);
        });
    },
    destroyed: function() { //离开摧毁钩子监听
        this.$root.hub.$off();
    },
    computed: {
        innerPaginationDef() {
            //分页控件初始化
            return Object.assign({}, {
                    layout: "sizes, total, prev, pager, next",
                    pageSize: 10,
                    pageSizes: [10, 20, 50, 100, 200],
                    currentPage: 1
                },
                this.paginationDef
            );
        },
        defaultSort() {
            var data = {};
            jQuery.each(this.tableColumn, function(index, val) {
                if (val.order) {
                    data.prop = val.prop;
                    data.order = val.order;
                }
            });
            return data;
        }
    },
    destroyed: function() {
        this.$root.hub.$off();
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (this.$parent.tableRowClassName) {
                return this.$parent.tableRowClassName({ row, rowIndex })
            }
        },
        //分页请求
        page() {
            let _this = this;
            var pagination = {
                page: this.innerPaginationDef.currentPage,
                size: this.innerPaginationDef.pageSize,
                prop: this.sortData.prop,
                order: this.sortData.order
            };
            var url = this.url + "/page";
            if (this.searchParam) {
                //搜索
                url += this.searchParam;
            }
            this.http.post(url, pagination).then(function(response) {
                _this.total = response.total;
                _this.tableData = response.data;
                if (_this.title == "资源") {
                    _this.$parent.reloadResourceList();
                }
            });
        },
        reset() {
            this.searchParam = "";
            this.handleCurrentChange(1);
        },
        search(value) {
            this.searchParam = value;
            this.handleCurrentChange(1);
        },
        handleSort(obj) {
            this.sortData = obj;
            this.page();
        },
        handleSizeChange(size) {
            this.innerPaginationDef.pageSize = size;
            this.page();
        },
        handleCurrentChange(currentPage) {
            this.innerPaginationDef.currentPage = currentPage;
            this.page();
        }
    }
};
</script>
<style>
.snwith-table .tool-bar {
    margin-bottom: 20px;
}

.el-table th>.cell,
.el-table .cell {
    white-space: nowrap;
    text-overflow: none;
    overflow: none;
}

.el-table .warning-row {
    background: #FFC9C9;
}

.el-table .success-row {
    background: #f0f9eb;
}
</style>