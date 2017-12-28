<template>
    <el-dialog title="导入文件" :visible.sync="uploadVisible">
        <el-upload class="upload-demo" ref="upload" :action="baseURL+uploadUrl" :limit="limit" :file-list="fileList" :auto-upload="false" accept=".xls" :before-upload="beforeUpload" :on-exceed="handleExceed" :on-success="uploadSuccess" :on-error="uploadError">
            <el-button slot="trigger" size="small" type="primary" icon="el-icon-document">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="文件导入中">确认导入</el-button>
            <div slot="tip" class="el-upload__tip">只能上传excel文件，且不超过20MB</div>
        </el-upload>
        </el-upload>
    </el-dialog>
</template>
<script>
export default {
    name: "SnwithImport",
    props: {
        uploadUrl: ""
    },
    data() {
        return {
            uploadVisible: false,
            fullscreenLoading: false,
            fileList: [],
            limit: 1,
        };
    },
    methods: {
        handleExceed(files, fileList) {
            //文件超出个数限制时的钩子
            this.$message.warning("最多可提交 1 个文件");
        },
        beforeUpload(file) {
            this.fullscreenLoading = true;
        },
        submitUpload() {
            //上传文件
            this.$refs.upload.submit();
        },
        uploadSuccess() {
            //文件上传成功钩子
            this.uploadVisible = false;
            this.fullscreenLoading = false;
            this.$message.success("上传成功");
            this.fileList = [];
        },
        uploadError() {
            //文件上传失败钩子
            this.$message.error("上传失败");
        }
    }
};
</script>
<style scoped>
.el-dropdown {
    float: right;
}
</style>