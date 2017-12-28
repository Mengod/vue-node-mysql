<template>
    <el-form :model="searchParam" ref="searchForm" class="searchForm" label-width="100px">
        <el-row :gutter="20">
            <template v-for="item in tableColumn">
                <el-col :sm="12" :md="8" v-if="item.search">
                    <el-form-item v-if="item.type == 'input'" :label="item.label">
                        <el-input v-model="searchParam[item.prop+'_LIKE']"></el-input>
                    </el-form-item>
                    <el-form-item v-if="item.type == 'select'" :label="item.label">
                        <el-select v-if="item.key" v-model="searchParam[item.prop + '.' + item.key + '_EQ']" clearable placeholder="请选择">
                            <el-option v-if="item.data" v-for="item2 in item.data" :key="item2.id" :label="item2.name" :value="item2.id">
                            </el-option>
                        </el-select>
                        <el-select v-else v-model="searchParam[item.prop + '_EQ']" clearable placeholder="请选择">
                            <el-option v-if="item.data" v-for="item2 in item.data" :key="item2.id" :label="item2.name" :value="item2.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="item.type == 'switch'" :label="item.label">
                        <el-select v-model="searchParam[item.prop + '_EQ']" clearable placeholder="请选择">
                            <el-option v-if="item.data" v-for="item2 in item.data" :key="item2.id" :label="item2.name" :value="item2.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="item.type == 'datetime'" :label="item.label">
                        <el-date-picker v-model="opertateTime" clearable type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </template>
            <el-col :sm="12" :md="8">
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" class="form-btn search-btn" @click="search()">查询</el-button>
                    <el-button type="primary" icon="el-icon-close" class="form-btn" @click="reset()">重置</el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>
<script>
export default {
    name: "SnwithSearch",
    props: {
        tableColumn: [Array]
    },
    data() {
        return {
            searchParam: {},
            opertateTime: [],
            pickerOptions: {
                shortcuts: [{
                        text: "最近一周",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近一个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近三个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit("pick", [start, end]);
                        }
                    }
                ]
            }
        };
    },
    created() {
        this.tableColumn.forEach(column => {
            if (!column.hasOwnProperty("type")) {
                column.type = "input";
            }
        });
    },
    methods: {
        search() {
            if (this.opertateTime.length > 0) {
                var gteTime = moment(this.opertateTime[0]).format(
                    "YYYY-MM-DD HH:mm:ss"
                );
                var lteTime = moment(this.opertateTime[1]).format(
                    "YYYY-MM-DD HH:mm:ss"
                );
                this.searchParam.opertateTime_GTE = gteTime;
                this.searchParam.opertateTime_LTE = lteTime;
            }

            var searchParams = this.getSearchParams(this.searchParam);
            this.$root.hub.$emit("searchForm", searchParams);
        },
        reset() {
            if (this.opertateTime.length > 0) {
                this.opertateTime = [];
            }
            for (var i in this.searchParam) {
                this.searchParam[i] = "";
            }
        }
    }
};
</script>
<style type="text/css">
.searchForm .el-input,
.searchForm .el-input__inner {
    width: 100% !important;
    min-width: 200px;
}

.searchForm .el-date-editor .el-range__close-icon {
    position: absolute;
    right: 0;
    top: 0;
}
</style>