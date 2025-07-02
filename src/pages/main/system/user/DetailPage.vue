<template>
    <PageHeader :title="L.사용자정보상세" :description="L.사용자의정보를조회할수있습니다"></PageHeader>
    <PageBody>
        <div class="detail-page">
            <el-descriptions size="large" :column="1" border>
                <el-descriptions-item :label="L.이름" label-align="center">{{ form.name }}</el-descriptions-item>
                <el-descriptions-item :label="L.전화번호" label-align="center">{{ form.phone_number }}</el-descriptions-item>
                <el-descriptions-item :label="L.성별" label-align="center">{{ form.gender }}</el-descriptions-item>
                <el-descriptions-item :label="L.생년월일" label-align="center">{{ form.birthdate }}</el-descriptions-item>
                <el-descriptions-item :label="L.이메일" label-align="center">{{ form.email }}</el-descriptions-item>
                <el-descriptions-item :label="L.등록일" label-align="center">
                    {{ ComUtil.dateFormat(form.userCreateDate,'YYYY-MM-DD HH:mm:ss') }}
                </el-descriptions-item>
                <el-descriptions-item :label="L.수정일" label-align="center">
                    {{ ComUtil.dateFormat(form.userLastModifiedDate,'YYYY-MM-DD HH:mm:ss') }}
                </el-descriptions-item>
                <el-descriptions-item :label="L.소셜로그인" label-align="center">
                        <div style="display: flex; align-items: center;">
                            <div class="social-label">
                                <img class="social-icon" :src="googleIcon"/>
                                <span>{{ L.구글계정으로로그인 }}</span>
                            </div>
                            <el-radio-group v-model="form.google" style="display: flex;">
                                <el-radio value="Y">{{ L.사용 }}</el-radio>
                                <el-radio value="N">{{ L.미사용 }}</el-radio>
                            </el-radio-group>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <div class="social-label">
                                <img class="social-icon" :src="kakaoIcon"/>
                                <span>{{ L.카카오계정으로로그인 }}</span>
                            </div>
                            <el-radio-group v-model="form.kakao" style="display: flex;">
                                <el-radio value="Y">{{ L.사용 }}</el-radio>
                                <el-radio value="N">{{ L.미사용 }}</el-radio>
                            </el-radio-group>
                        </div>

                </el-descriptions-item>
                
            </el-descriptions>
        </div>
        <template #footer>
            <OperationBox top-line>
                <OperationButton type="목록"  @click="goBack"/>
            </OperationBox>
        </template>
    </PageBody>
</template>
<script lang="ts" setup>
import { OperationBox, OperationButton } from '@/components'
import { Service } from './model_service/Service'
import { ref, onMounted } from 'vue'
import { useNavStore } from '@/stores/NavStore'
import { useLangStore } from '@/stores/LangStore'
import ComUtil from '@/common/utils/ComUtil'
import googleIcon from  '@/assets/icons/common/google-icon.png'
import kakaoIcon from  '@/assets/icons/common/kakao-icon.png'

// 다국어 설정 
const L = useLangStore().lang.systemUser

const obj = new Service()
const form:any = ref(obj.item)

// 뒤로 가기
const goBack = () => {
    useNavStore().backTo()
}

// 상세 데이터 불러오기
const getInfoData = async () => {
    let navData = useNavStore().getNavData()
    await obj.getInfo({sub:navData.sub})
    form.value = obj.item
}
onMounted(()=>{
    getInfoData()
})
</script>
<style lang="scss" scoped>
.detail-page{
    width: 800px;
}
.social-label{
    margin-right: 12px; width: 180px; display: flex; align-items: center;
    span{
        font-size: 14px;
        line-height: 24px
    }
}
.social-icon{
    width: 24px; margin-right: 4px
}
</style>
