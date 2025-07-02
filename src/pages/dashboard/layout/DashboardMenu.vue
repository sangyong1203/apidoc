<template>
    <el-drawer
        class="menu-drawer"
        :model-value="isOpen"
        size="80%"
        :before-close="onCloseDrawer"
        direction="ttb"
        :with-header="false"
        :modal="true"
    >
        <div class="left-menu">
            <el-button text class="close-btn" circle @click="closeDrawer">X</el-button>
            <template v-for="(item, idx) in state.menu" :key="idx">
                <div class="first-menu"  v-if="item.useYn==='Y'">
                    <div
                        v-if="item.children.length === 0"
                        class="menu-item"
                        @click="handleSelect(item.title , item.path)"
                    >
                        <el-icon> <component :is="item.icon"></component> </el-icon>
                        <router-link :to="{ path: item.path }"  >  {{ item.title }} </router-link>
                    </div>
                    <div v-else class="menu-item">
                        <el-icon> <component :is="item.icon"></component> </el-icon>
                        <span>{{ item.title }} </span>
                    </div>
                            
                    <!-- 2단 -->
                     
                    <div class="second-menu" v-for="(child, idx2) in item.children" :key="idx2">
                        <template v-if="child.useYn==='Y'">
                            <div
                                v-if="child.children.length === 0"
                                class="menu-item"
                                @click="handleSelect(child.title , child.path)"
                            >
                            <router-link :to="{ path: child.path }" >  {{ child.title }} </router-link>
                            </div>
                            <div v-else class="menu-item">
                            <span>{{ child.title }} </span>
                            </div>
                            <!-- 3단 -->
                            <div class="third-menu" v-for="(grandChild, idx3) in child.children" :key="idx3">
                                <div class="menu-item" @click="handleSelect(grandChild.title , grandChild.path)"  v-if="grandChild.useYn==='Y'">
                                    <router-link :to="{ path: grandChild.path }" >  {{ grandChild.title }} </router-link>
    
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </template>
        </div>
    </el-drawer>
</template>

<script lang="ts" setup>
import { reactive, computed, ref } from 'vue'
import { useMenuStore } from '@/stores/MenuStore'
import { useNavStore } from '@/stores/NavStore'
import { useLangStore } from '@/stores/LangStore'
import { toRefs } from 'vue'
import ComUtil from '@/common/utils/ComUtil'

const menuStore = useMenuStore()

export interface Props {
    isOpen: boolean
}

const prop = defineProps<Props>()
const { isOpen } = toRefs(prop)

const emit = defineEmits(['update:isOpen'])

// Url 진입시 메뉴 활성화
const state: any = reactive({
    menu: computed(() => menuStore.getMenu()),
})

const navStore = useNavStore()

const onCloseDrawer = (done: any) => {
    emit('update:isOpen', false)
    done()
}
const closeDrawer = () => {
    emit('update:isOpen', false)
}

const handleSelect = (menuName:string, path: string) => {
    navStore.setNav(searchRecursive(menuStore.getMenu(), path))
    navStore.setRoute(path)
    navStore.setAuthAction(menuStore.getMenu(), path)
    ComUtil.setNewpageSession() // 세창 이동시 필요하는 함수 when open in a new browser tab, to transport session data
} 

// 라우터 path를 기준으로 메뉴를 찾아서 메뉴명(풀경로) 반환
const searchRecursive = (items: any, path: string) => {
    const nav: Array<{ name: string; path: string }> = []
    items.forEach((item: any) => {
        if (item.path === path) {
            nav.push({ name: item.title, path: item.path })
        } else if (item.children) {
            const ids = searchRecursive(item.children, path)
            if (ids.length) {
                nav.push({ name: item.title, path: item.path })
                ids.forEach(itemA => nav.push({ name: itemA.name, path: itemA.path }))
            }
        }
    })
    return nav
}

</script>

<style scoped>
/* 메뉴 */

.left-menu {
    height: 100%;
    display: flex;
    padding: 30px 30px 30px 40px;
    background-color: #000000c9;
    overflow: scroll;
}
:deep(.el-overlay) {
    top: 44px !important;
}
.first-menu {
    flex: 1;
    height: 100%;
    overflow: hidden;
    margin-left: 8px;
    min-width: 150px;
    max-width: 400px;
}
/* .first-menu:nth-child(6){
    min-width: 170px;
    flex: unset;
}
.first-menu:nth-child(7){
    min-width: 180px;
    flex: unset;
}
.first-menu:nth-child(8){
    min-width: 180px;
    flex: unset;
}
.first-menu:nth-child(9){
    min-width: 180px;
    flex: unset;
} */

.second-menu {
    margin-left: 22px;
}
.third-menu {
    margin-left: 22px;
}
.el-icon {
    width: 18px;
    height: 18px;

    margin-right: 4px;
}
.menu-item {
    padding: 10px 10px;
    display: flex;
    align-items: center;
    color: #dddddd;
}
.menu-item span {
    font-size: 16px !important;
}
.menu-item:hover {
    background-color: var(--color-main20);
}

.overflow {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 40px;
    width: 100%;
    display: block;
}
.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;
}
.close-btn:hover {
    color: var(--color-main);
}

a{
    color: #dddddd;
    font-size: 16px;
    text-decoration: none;
}


</style>
