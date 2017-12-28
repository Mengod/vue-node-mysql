<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" mode="horizontal" background-color="#242f42" text-color="#fff" active-text-color="#409eff" unique-opened router>
            <template v-for="(item,index) in $router.options.routes">
                <el-menu-item v-if="item.type==1" :index="item.path">{{item.title}}</el-menu-item>
                <el-submenu v-if="item.type==2" :index="item.path">
                    <template slot="title">{{item.title}}</template>
                    <el-menu-item v-for="(item_c,index_c) in item.children" :index="item.path+item_c.path">{{item_c.title}}</el-menu-item>
                </el-submenu>
            </template>
        </el-menu>
    </div>
</template>
<script>
export default {
    computed: {
        onRoutes() {
            var path = this.$route.path;
            if (path == "/write" || path == "/reboot") {
                return "/search"
            } else {
                return this.$route.path;
            }
        }
    }
}
</script>
<style scoped>
.sidebar .el-menu--horizontal {
    float: right;
    margin-right: 5%;
    border-bottom: none !important;
}

.sidebar .el-submenu__title i {
    color: #fff !important;
}

.sidebar>ul {
    height: 100%;
}
</style>