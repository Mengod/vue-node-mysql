<template>
    <div>
        <el-header>
            <el-steps :active="0">
                <el-step title="进行中" icon="el-icon-search" description="搜索设备"></el-step>
                <el-step title="未完成" icon="el-icon-edit" description="写入IP和认证账号"></el-step>
                <el-step title="未完成" icon="el-icon-refresh" description="重启网络"></el-step>
            </el-steps>
        </el-header>
        <el-main>
            <el-row>
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
                <el-col :span="24">
                    <el-button type="primary" icon="el-icon-caret-right" @click="next()" :disabled="devicesCopy.length<1" style="float:right">下一步</el-button>
                    <el-button type="primary" icon="el-icon-search" v-if="!isStart" @click="start()" :disabled="isLoading">开始搜索</el-button>
                    <el-button type="success" icon="el-icon-close" v-if="isStart" @click="stop()">结束搜索</el-button>
                </el-col>
                <el-table v-loading="isLoading" element-loading-text="命令执行中，请稍候" stripe style="width: 100%" :data="devicesCopy.slice((currentPage-1)*pageSize,currentPage*pageSize)" :total="devicesCopy.length">
                    <el-table-column type="index">
                    </el-table-column>
                    <el-table-column prop="mac" label="mac号" sortable>
                    </el-table-column>
                    <el-table-column prop="sn" label="sn号" sortable>
                    </el-table-column>
                </el-table>
                <el-pagination background layout="sizes,total, prev, pager, next" :current-page="currentPage" :page-size="pageSize" :page-sizes="[10,20,50,100,200]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="devicesCopy.length">
                </el-pagination>
            </el-row>
        </el-main>
    </div>
</template>
<script>
export default {
    mounted: function() {
        this.$nextTick(function() {
            let self = this;
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
                self.socket = new WebSocket(self.wsURL + "/searchDevice");
                self.socket.onmessage = function(event) {
                    console.log(event.data)
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
        start() {
            this.isStart = true;
            this.isLoading = true;
            console.log("send")
            this.send(this.socket, "start");
        },
        stop() {
            this.isStart = false;
            this.isLoading = false;
            console.log("stop")
            this.send(this.socket, "stop");
        },
        next() {
            var macs = this.devices.map(function(value, index) {
                return value.mac;
            });
            console.log(this.devices)
            localStorage.setItem("macs", macs);

            this.$router.push("/write");
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
        },
        handleSizeChange(size) {
            this.pageSize = size;
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