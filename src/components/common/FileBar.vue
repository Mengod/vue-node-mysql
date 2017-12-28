<template>
    <div>
        <el-button type='primary' v-for="action in innerFiledDef.def" v-if="action.show" @click="action.handler(action)" :icon="action.icon" :disabled="action.disabled">{{action.name}}</el-button>
        <snwith-import ref="snwithImport" :uploadUrl="innerFiledDef.def['import'].url"></snwith-import>
    </div>
</template>
<script>
import snwithImport from "../common/snwithImport.vue";
export default {
    name: "FileBar",
    components: {
        snwithImport
    },
    props: {
        fileBtns: [Array],
        tableColumn: [Array]
    },
    data() {
        return {
            searchParam: "",
            uploadUrl: "/ipAuth/import"
        };
    },
    created() {
        this.$root.hub.$on("searchForm", value => {
            //Hub接收事件
            this.searchParam = value;
        });
    },
    destroyed: function() { //离开摧毁钩子监听
        this.$root.hub.$off();
    },
    computed: {
        innerFiledDef() {
            //表单文件操作按钮
            return Object.assign({}, {
                    def: [],
                    width: 5,
                    offset: 0
                },
                this.getFileDef()
            );
        }
    },
    methods: {
        getFileDef() {
            var data = {
                width: 19,
                def: {
                    import: {
                        name: "导入",
                        type: "import",
                        show: false,
                        icon: "el-icon-upload",
                        handler: data => {
                            this.$refs.snwithImport.uploadVisible = true;
                        }
                    },
                    export: {
                        name: "导出",
                        type: "export",
                        show: false,
                        icon: "el-icon-download",
                        handler: data => {
                            this.$msgbox({
                                title: "提示",
                                message: "确认导出？",
                                showCancelButton: true,
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                beforeClose: (action, instance, done) => {
                                    if (action === "confirm") {
                                        let self = this;
                                        instance.confirmButtonLoading = true;
                                        instance.confirmButtonText = "执行中...";

                                        var tableColumn = self.tableColumn;

                                        var columns = tableColumn.map(function(item) {
                                            return {
                                                field: item.prop,
                                                desc: item.label
                                            }
                                        })

                                        var form = $("<form>"); // 定义一个form表单
                                        form.append("<input type='hidden' name='token' value='" + localStorage.getItem('token') + "'>")
                                        form.attr('style', 'display:none'); // 在form表单中添加查询参数
                                        form.attr("target", "");
                                        form.attr('method', 'post');
                                        form.attr('action', self.baseURL + this.innerFiledDef.def["export"].url + this.searchParam);
                                        $('body').append(form); // 将表单放置在web中

                                        for (var i = 0; i < columns.length; i++) {
                                            if (columns[i].field) {
                                                var fieldInput = $('<input>');
                                                fieldInput.attr('type', 'hidden');
                                                fieldInput.attr('name', 'xlsColumns[' + i + '].field');
                                                fieldInput.attr('value', columns[i].field);
                                                form.append(fieldInput);
                                                var descInput = $('<input>');
                                                descInput.attr('type', 'hidden');
                                                descInput.attr('name', 'xlsColumns[' + i + '].desc');
                                                descInput.attr('value', columns[i].desc);
                                                form.append(descInput); // 显示字段
                                            }
                                        }
                                        form.submit();
                                        done();
                                        instance.confirmButtonLoading = false;
                                    } else {
                                        done();
                                    }
                                }
                            }).then(action => {});
                        }
                    },
                }
            };
            jQuery.each(this.fileBtns, function(index, val) {
                data.def[val.name].show = true;
                data.def[val.name].url = val.url;
            });
            return data;
        },
    }
};
</script>
<style scoped>
.el-dropdown {
    float: right;
}
</style>