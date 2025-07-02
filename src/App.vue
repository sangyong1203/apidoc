<template>
    <!-- 업로드시 full screen progress bar -->
    <FullscreenProgress />

    <!-- App 화면 view-->
    <el-config-provider :locale="locale">
        <RouterView />
    </el-config-provider>
</template>

<script setup lang="ts">
import { FullscreenProgress } from '@/components'
import { RouterView } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
import { watch, ref } from 'vue'
/**
 * element-plus 다국어 파일을 local에 저장하여 사용하는 방식:
 * element-plus에 다국어 언어파일은 아래 링크에서 해당 파일을 복사 할 수  있다.
 * https://github.com/element-plus/element-plus/tree/dev/packages/locale/lang
 *
 * github에서 복사한 파일을 src/assets/language/el 경로에 저장하여 아래 처럼 import해서 적용한다
 *    import ko from '@/assets/language/el/ko'
 *    const locale = ko
 */
//------------------------------------------------------------------------------------

/**
 * element-plus 다국어 파일을 직접 element-plus에서 import해서 사용하는 방식:
 * import ko from 'element-plus/es/locale/lang/ko'
 */
import ko from 'element-plus/es/locale/lang/ko'
import en from 'element-plus/es/locale/lang/en'
import { useLangStore } from './stores/LangStore'
import { onMounted } from 'vue'

const langStore = useLangStore()
const locale: any = ref(ko)

watch(langStore, () => {
    if (langStore.langType === 'ko') locale.value = ko
    if (langStore.langType === 'en') locale.value = en
})

// 다국어 설정
onMounted(async () => {
    // 로컬에 있는 다국어 파일 사용하여 언어 설정 (파일폴더는 root 경로에 /public/langFile)
    await langStore.setLangFromExcelFile(langStore.langType ?? 'ko')
})
</script>

<style></style>
