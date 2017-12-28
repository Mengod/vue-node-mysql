<template>
    <div>
        <el-header>
            <el-steps :active="2">
                <el-step title="已完成" icon="el-icon-search" description="搜索设备"></el-step>
                <el-step title="已完成" icon="el-icon-edit" description="写入IP和认证账号"></el-step>
                <el-step title="进行中" icon="el-icon-refresh" description="重启网络"></el-step>
            </el-steps>
        </el-header>
        <el-main>
            <el-col :span="24" style="margin-bottom:20px">
                <el-col :span="8">
                    <el-input placeholder="请输入sn号或mac号" prefix-icon="el-icon-search" v-model="searchText">
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <el-button type="primary" icon="el-icon-search" @click="search()">筛选</el-button>
                    <el-button type="primary" icon="el-icon-refresh" @click="reset()">重置</el-button>
                </el-col>
            </el-col>
            <el-col :sm="12" :md="12" style="margin-bottom:20px">
                <el-button type="primary" icon="el-icon-refresh" v-if="!isStart" @click="reboot()" :disabled="isLoading">重启</el-button>
                <el-button type="success" icon="el-icon-close" v-if="isStart" @click="stop()">暂停</el-button>
            </el-col>
            <el-col :sm="12" :md="12">
                <el-button style="float:right" type="primary" icon="el-icon-caret-left" @click="last()">上一步</el-button>
            </el-col>
            <el-table v-loading="isLoading" element-loading-text="命令执行中，请稍候" style="width: 100%" :data="devicesCopy.slice((currentPage-1)*pageSize,currentPage*pageSize)" :total="devicesCopy.length">
                <el-table-column type="index">
                </el-table-column>
                <el-table-column prop="mac" label="mac号" sortable>
                </el-table-column>
                <el-table-column prop="sn" label="sn号" sortable>
                </el-table-column>
                <el-table-column prop="isReboot" label="状态" sortable>
                    <template slot-scope="scope">
                        <div>
                            <span v-text="scope.row.isReboot?'已重启':'未重启'"></span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="sizes,total, prev, pager, next" :current-page="currentPage" :page-size="pageSize" :page-sizes="[10,20,50,100,200]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="devicesCopy.length"></el-pagination>
            </el-row>
        </el-main>
    </div>
</template>
<script>
export default {
    mounted: function() {
        this.$nextTick(function() {
            let self = this;
            var macs = localStorage.getItem('macs');
            if (!macs) {
                console.log(0)
                self.$message.error("请先搜索设备");
                self.$router.push("/search");
                return false;
            }
            self.initWebsocket();
        })
    },
    data() {
        return {
            isStart: false,
            isLoading: false,
            searchText: "",
            pageSize: 10,
            currentPage: 1,
            socket: null,
            //查询出的所有设备
            devices: [],
            //用于页面展示的设备数组
            devicesCopy: [],
            macs: []
        };
    },
    methods: {
        //初始化websocket
        initWebsocket() {
            let self = this;
            if ('WebSocket' in window) {
                self.socket = new WebSocket(self.wsURL + "/rebootNetwork");
                // self.socket = new WebSocket("ws://127.0.0.1:8099/rebootNetwork");
                self.socket.onmessage = function(event) {
                    console.log(JSON.parse(event.data))

                    self.isLoading = false;
                    self.devices = JSON.parse(event.data);
                    self.devicesCopy = JSON.parse(event.data);
                }
                //Error callback  
                self.socket.onerror = function() {
                    console.log("error!")
                    self.$message.error("链接失败，请刷新重试");
                };

                //socket opened callback  
                self.socket.onopen = function(event) {
                    console.log("websocket opened!")
                }

                //socket closed callback  
                self.socket.onclose = function() {
                    console.log("websocket closed!")
                    self.$message.info("链接已断开");
                }
            } else {
                alert('Sorry, websocket not supported by your browser.')
            }
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
        },
        handleSizeChange(size) {
            this.pageSize = size;
        },
        reboot() {
            this.isStart = true;
            this.isLoading = true;
            this.send(this.socket, localStorage.getItem('macs'));
        },
        stop() {
            this.isStart = false;
            this.isLoading = false;
            this.send(this.socket, "stop");
        },
        last() {
            this.$router.push("/write");
        },
        search() {
            let self = this;
            var searchDevices = [],
                searchText = self.searchText.toLowerCase();
            for (var i = 0, len = self.devices.length; i < len; i++) {
                var mac = self.devices[i].mac ? self.devices[i].mac : "",
                    sn = self.devices[i].sn ? self.devices[i].sn : "";
                mac = mac.toLowerCase();
                sn = sn.toLowerCase();
                if (mac.indexOf(searchText) >= 0 || sn.indexOf(searchText) >= 0) {
                    searchDevices.push(self.devices[i])
                }
            }
            self.devicesCopy = searchDevices;
        },
        reset() {
            if (this.searchText) {
                this.searchText = "";
            }
        }
    }
};
</script>
<style scoped>
.el-row {
    width: 90%;
    margin: auto;
}
.el-main form {
    margin: 20px 0;
}
.el-main .el-button {
    margin-left: 10px;
}
</style>