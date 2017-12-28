<template>
    <div>
        <el-header>
            <el-steps :active="1">
                <el-step title="已完成" icon="el-icon-search" description="搜索设备"></el-step>
                <el-step title="进行中" icon="el-icon-edit" description="写入IP和认证账号"></el-step>
                <el-step title="未完成" icon="el-icon-refresh" description="重启网络"></el-step>
            </el-steps>
        </el-header>
        <el-main>
            <el-form :model="searchParam" :rules="rules" ref="searchForm" class="searchForm" label-width="100px">
                <el-row>
                    <el-col :span="24">
                        <el-col :span="8">
                            <el-form-item label="线路" prop="line">
                                <el-select v-model="searchParam['line']" placeholder="请选择" @change="changeLineFun" :loading="lineLoading">
                                    <el-option v-for="item in lines" :key="item.label" :label="item.label" :value="item.label">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="站点" prop="site">
                                <el-select v-model="searchParam['site']" :disabled="!searchParam['line']" placeholder="请选择" :loading="siteLoading">
                                    <el-option v-for="item in sites" :key="item.label" :label="item.label" :value="item.label">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-refresh" @click="resetLine()" style="float:right">重置</el-button>
                                <el-button type="primary" icon="el-icon-edit" v-if="!isStart" @click="execute()" style="float:right">执行</el-button>
                                <el-button type="success" icon="el-icon-close" v-if="isStart" @click="stop()" style="float:right">停止</el-button>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="24" style="margin-bottom:20px">
                        <el-col :span="6">
                            <el-input placeholder="请输入sn号或mac号" prefix-icon="el-icon-search" v-model="searchText">
                            </el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-button type="primary" icon="el-icon-search" @click="search()">筛选</el-button>
                            <el-button type="primary" icon="el-icon-refresh" @click="reset()">重置</el-button>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-caret-right" @click="next()" style="float:right">下一步</el-button>
                                <el-button type="primary" icon="el-icon-caret-left" @click="last()" style="float:right">上一步</el-button>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
            </el-form>
            <el-row>
                <el-col :sm="24" :md="24" style="padding-bottom:10px">
                    <p>共<span v-text="macs.length"></span>台设备|空闲ip数<span v-text="ip"></span></p>
                </el-col>
                <el-col :sm="24" :md="24" id="devicesContent">
                    <template v-for="(item, index)  in devicesCopy">
                        <div class="grid-content border" :class="{ shadow: item.isRun, gray: !item.sn , green: item.snSuccess&&item.fwverSuccess&&item.ipSuccess&&item.accountSuccess, red: (!item.snSuccess||!item.fwverSuccess||!item.ipSuccess||!item.accountSuccess)&&!item.isRun}">
                            <p>mac:<span v-text="item.mac"></span></p>
                            <p><i :class="item.snSuccess ? 'el-icon-success':'el-icon-error'"></i><span v-text="item.sn?item.sn:'未读取到sn号'"></span></p>
                            <p><i :class="item.fwverSuccess ? 'el-icon-success':'el-icon-error'"></i><span v-text="item.fwver?item.fwver:'未读取到版本号'"></span></p>
                            <p><i :class="item.ipSuccess ? 'el-icon-success':'el-icon-error'"></i><span v-text="item.ip?item.ip:'未读取到ip号'"></span></p>
                            <p><i :class="item.accountSuccess ? 'el-icon-success':'el-icon-error'"></i><span v-text="item.account?item.account:'未读取到认证账号'"></span></p>
                        </div>
                    </template>
                </el-col>
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
            console.log(macs)
            if (!macs) {
                console.log(0)
                self.$message.error("请先搜索设备");
                self.$router.push("/search");
                return false;
            }
            self.macs = macs.split(",");
            self.lineLoading = true;
            self.initWebsocket();
            self.http.get(self.baseURL + "/line").then(response => {
                console.log(response)
                self.lineLoading = false;
                if (response.code == 0) {
                    self.lines = response.data
                } else {
                    self.$message.error("连接失败," + response.message);
                }
            });

            $("#devicesContent").height(window.innerHeight - 495);
        })
    },
    data() {
        return {
            socket: null,
            isStart: false,
            canNext: true,
            lineLoading: false,
            siteLoading: false,
            searchText: "",
            searchParam: {},
            lines: [],
            sites: [],
            ip: 0,
            devices: [],
            devicesCopy: [],
            macs: [],
            rules: {
                line: [{
                    required: true,
                    message: "请选择线路",
                    trigger: 'change'
                }],
                site: [{
                    required: true,
                    message: "请选择站点",
                    trigger: 'change'
                }]
            }
        };
    },
    methods: {
        changeLineFun(item) {
            let self = this;
            self.siteLoading = true;
            delete self.searchParam['site'];
            self.http.get(self.baseURL + "/" + item + "/site").then(response => {
                self.siteLoading = false;
                console.log(response)
                if (response.code == 0) {
                    self.sites = response.data
                } else {
                    self.$message.error("连接失败," + response.message);
                }
            });
        },
        //重置
        resetLine() {
            this.searchParam = {};
            this.$refs["searchForm"].resetFields();
        },
        //初始化websocket
        initWebsocket() {
            let self = this;
            if ('WebSocket' in window) {
                self.socket = new WebSocket(self.wsURL + "/writeIPAndAuth");
                self.socket.onmessage = function(event) {
                    var data = event.data;
                    if (data == "finish") {
                        self.isStart = false;
                        self.$message.success("操作已完成");
                        // self.stop();
                    } else {
                        console.log(event.data);
                        self.ip = JSON.parse(data.split("&")[0]);
                        self.devices = JSON.parse(data.split("&")[1]);
                        self.devicesCopy = JSON.parse(data.split("&")[1]);

                        $("#devicesContent").scrollTop($("#devicesContent").height());
                    }
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
        //执行websocket
        execute() {
            let self = this;
            if (self.socket.readyState != 1) {
                //websocket断开重连
                self.initWebsocket();
            }
            self.$refs["searchForm"].validate((valid) => {
                if (valid) {
                    self.isStart = true;
                    console.log('submit!');
                    self.send(self.socket, self.searchParam["line"] + "&" + self.searchParam["site"] + "&" + self.macs);
                } else {
                    return false;
                }
            });
        },
        // 停止websocket
        stop() {
            this.isStart = false;
            this.socket.close();
        },
        last() {
            this.$router.push("/search");
        },
        next() {
            this.$router.push("/reboot");
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
                console.log(sn.indexOf(searchText))
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
.border {
    border: 1px solid #000;
    margin-right: -1px;
    margin-bottom: -1px;
}
.grid-content {
    padding: 10px;
    width: 200px;
    display: inline-block;
    height: 130px;
    vertical-align: top;
}
.grid-content p {
    line-height: 25px;
}
.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
.shadow {
    box-shadow: 0 0 15px 5px #888888 inset;
}
.red {
    background: #FFB6B6;
}

.green {
    background: #f0f9eb;
}
.gray {
    background: #fafafa;
}
.el-icon-success {
    color: #61D25B;
}
.el-icon-error {
    color: #FF4C4C;
}
.el-main .el-button {
    margin-left: 10px;
}
#devicesContent {
    overflow: auto;
}
</style>