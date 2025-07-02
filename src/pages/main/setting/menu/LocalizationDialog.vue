<template>
    <BasicDialog
        :model-value="isShowDialog"
        title="다국어 등록"
        width="1500"
        height="850px"
        :buttonTypes="['저장']"
        @on-save="onSave"
        @on-close="onClose"
    >
        <SearchBox :on-search="getList">
            <DropdownList
                label="언어 "
                v-model="langType"
                placeholder="언어 선택"
                :list="languageCodes"
                option-label="name"
                option-value="code"
            />
            <DropdownList
                label="Page "
                v-model="pageName"
                placeholder="페이지 선택"
                :list="pageList"
                option-label="label"
                option-value="value"
            />
        </SearchBox>
        <OperationBox>
            <el-upload
                ref="upload"
                :limit="1"
                accept=".xlsx"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="onSelectFile"
            >
                <el-button style="margin-right: 5px">다국어 업로드</el-button>
            </el-upload>
            <el-button @click="excelDownload">엑셀다운로드</el-button>
            <el-button type="primary" bg @click="addPage">페이지 추가</el-button>
        </OperationBox>
        <el-table :data="langData" border>
            <el-table-column label="NO" type="index" />
            <el-table-column prop="page" label="Page" width="220px">
                <template #default="{ row, $index }">
                    <div style="display: flex">
                        <el-input :disabled="isDisabled" v-model="row.page"></el-input>
                        <el-button type="info" bg style="margin-left: 4px" @click="deletePage(row.page, $index)">
                            <el-icon><Delete /></el-icon>
                        </el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="langType" label="Lang Type" width="120px">
                <template #default="{ row }">
                    <DropdownList
                        width="100px"
                        v-model="row.langType"
                        placeholder="언어 선택"
                        :list="languageCodes"
                        option-label="name"
                        option-value="code"
                    />
                </template>
            </el-table-column>
            <el-table-column prop="labelList" label="Label List">
                <template #default="scoped">
                    <el-table :data="scoped.row.labelList" border>
                        <el-table-column prop="key" label="key">
                            <template #default="{ row }">
                                <el-input v-model="row.key"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="value" label="value">
                            <template #default="{ row }">
                                <el-input v-model="row.value"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column width="80px">
                            <template #default="{ $index }">
                                <el-button type="info" bg @click="deleteKeyValue(scoped.row, $index)"
                                    ><el-icon><Delete /></el-icon
                                ></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button style="width: 100%; margin: 8px 0" @click="addKeyValue(scoped.row)"
                        ><el-icon><Plus /></el-icon
                    ></el-button>
                </template>
            </el-table-column>
        </el-table>
    </BasicDialog>
</template>
<script lang="ts" setup>
import { BasicDialog } from '@/components'
import { ref } from 'vue'
import { fetch } from '@/common/modules/axios'
import * as XLSX from 'xlsx'
import { makeExcelAndDownload } from '@/common/xlsx'
import { Notification, useGlobalDialog } from '@/common/dialog/ComDialog'

type LangDataType = {
    page: string
    langType: string
    labelList: {
        key: string
        value: string
    }[]
}
const isShowDialog = ref(false)
const langData = ref<LangDataType[]>([]) // 다국어데이터
const langType = ref<string>('ko') // 언어
const pageList = ref<{ key: string; value: string }[]>([]) // Page dropdown list
const pageName = ref<string>('') // page 명
const isDisabled = ref(true)
// 다국어 데티어 호출
const getList = async () => {
    getLangList(langType.value, pageName.value).then(res => {
        langData.value = []
        langData.value = res.data
    })
}
// 데이터 저장
const onSave = async () => {
    useGlobalDialog('저장 하시겠습니까?', '확인', 'YN')
        .onConfirm(() => {
            saveLangData()
            // onClose()
        })
        .onCancel(() => {})
}
// 해당 페이지 다국어 데이터 삭제
const deletePage = (pageName:string, index: number) => {
    useGlobalDialog('해당 페이지 데이터를 삭제 하시겠습니까?', '확인', 'YN')
        .onConfirm(() => {
            langData.value.splice(index, 1)
            deleteLangData(langType.value, pageName)
            Notification.success('삭제 성공하였습니다.')
        })
        .onCancel(() => {})
}
// Label list에  key value 추가
const addKeyValue = (row: LangDataType) => {
    const item = {
        key: '',
        value: '',
    }
    row.labelList.push(item)
}
// Label list에  key value 삭제
const deleteKeyValue = (row: LangDataType, index: number) => {
    row.labelList.splice(index, 1)
}
// 다국어 데이터 추가
const addPage = () => {
    const item = {
        page: '',
        langType: '',
        labelList: [],
    }
    langData.value = []
    langData.value.push(item)
    isDisabled.value = false
}

// 다국어 excel 파일을 읽어 LangDataType 형식인 구조로 변경
const onSelectFile = (file: any) => {
    const reader = new FileReader()
    reader.onload = function (event: any) {
        const data = new Uint8Array(event.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })

        // Read the first sheet
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // Convert the sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: 2 })
        // excel 데이터를 LangDataType 형식인 데이터로 구조로 변경
        const newArr: LangDataType[] = []
        jsonData.forEach((item: any) => {
            const d = {
                page: item.page,
                langType: item.langType,
                labelList: [],
            }
            if (newArr.some((itemA: any) => itemA.page === item.page)) return
            newArr.push(d)
        })
        newArr.forEach((item: any) => {
            jsonData.forEach((itemA: any) => {
                if (item.page === itemA.page) {
                    item.labelList.push({
                        key: itemA.key,
                        value: itemA.value,
                    })
                }
            })
        })

        langData.value = newArr
    }
    reader.readAsArrayBuffer(file.raw)
}
// 다국어 파일 다운로드
const tableHeader = ['page', 'langType', 'key', 'value']
const excelDownload = () => {
    const excelData: any = []
    if (langData.value.length === 0) {
        Notification.warning('다운로드할 데이터를 검색한 후 엑셀 다운로드 하세요.')
        return
    }
    langData.value.forEach((item: any) => {
        item.labelList.forEach((itemA: any) => {
            const newItem = {
                page: item.page,
                langType: item.langType,
                key: itemA.key,
                value: itemA.value,
            }
            excelData.push(newItem)
        })
    })
    makeExcelAndDownload(excelData, `다국어_${langType.value}`, tableHeader, `${langType.value}_lang`)
}
const onClose = () => {
    isShowDialog.value = false
    langData.value = []
    pageName.value = ''
}

// 다국어창 열기
const openDialog = async () => {
    isShowDialog.value = true
    getLangList(langType.value, pageName.value).then(res => {
        // Page dropdown리스트 데이터 생성
        pageList.value = res.data.map((item: any) => {
            return { label: item.page, value: item.page }
        })
    })
}
defineExpose({ openDialog })

// -----------------------  api ---------------------------------
// 다국어 데이터 호출 api
const saveLangData = () => {
    const payload = { body: langData.value }
    fetch()
        .post('/api/system/language', { payload })
        .then(res => {
            Notification.success('저장 성공하였습니다.')
            isDisabled.value = false
        })
        .catch(err => {
            console.log(err)
        })
}
// 다국어 데이터 호출 api
const getLangList = async (langType: string, pageName: string) => {
    const payload = { query: { langType: langType, page: pageName } }
    return fetch().get('/api/system/language', { payload })
}
// 다국어 데이터 삭제 api
const deleteLangData = async (langType: string, pageName: string) => {
    const payload = { body: { langType: langType, page: pageName } }
    fetch().delete('/api/system/language', { payload })
}
// ----------------------- 

// 각 국가 및 code  
const languageCodes = [
    { code: 'en', name: 'English' },
    { code: 'ko', name: 'Korean' },
    // { code: 'es', name: 'Spanish' },
    // { code: 'fr', name: 'French' },
    // { code: 'de', name: 'German' },
    // { code: 'zh', name: 'Chinese' },
    // { code: 'ja', name: 'Japanese' },
    // { code: 'ru', name: 'Russian' },
    // { code: 'it', name: 'Italian' },
    // { code: 'pt', name: 'Portuguese' },
    // { code: 'ar', name: 'Arabic' },
    // { code: 'hi', name: 'Hindi' },
    // { code: 'bn', name: 'Bengali' },
    // { code: 'pa', name: 'Punjabi' },
    // { code: 'ms', name: 'Malay' },
    // { code: 'vi', name: 'Vietnamese' },
    // { code: 'id', name: 'Indonesian' },
    // { code: 'th', name: 'Thai' },
    // { code: 'tr', name: 'Turkish' },
    // { code: 'nl', name: 'Dutch' },
    // { code: 'sv', name: 'Swedish' },
    // { code: 'fi', name: 'Finnish' },
    // { code: 'da', name: 'Danish' },
    // { code: 'no', name: 'Norwegian' },
    // { code: 'pl', name: 'Polish' },
    // { code: 'he', name: 'Hebrew' },
    // { code: 'el', name: 'Greek' },
    // { code: 'cs', name: 'Czech' },
    // { code: 'hu', name: 'Hungarian' },
    // { code: 'ro', name: 'Romanian' },
    // { code: 'sk', name: 'Slovak' },
    // { code: 'bg', name: 'Bulgarian' },
    // { code: 'uk', name: 'Ukrainian' },
    // { code: 'sr', name: 'Serbian' },
    // { code: 'hr', name: 'Croatian' },
    // { code: 'sl', name: 'Slovenian' },
    // { code: 'lt', name: 'Lithuanian' },
    // { code: 'lv', name: 'Latvian' },
    // { code: 'et', name: 'Estonian' },
    // { code: 'fa', name: 'Persian' },
    // { code: 'ur', name: 'Urdu' },
    // { code: 'ta', name: 'Tamil' },
    // { code: 'te', name: 'Telugu' },
    // { code: 'kn', name: 'Kannada' },
    // { code: 'ml', name: 'Malayalam' },
    // { code: 'mr', name: 'Marathi' },
    // { code: 'gu', name: 'Gujarati' },
    // { code: 'am', name: 'Amharic' },
    // { code: 'sw', name: 'Swahili' },
    // { code: 'af', name: 'Afrikaans' },
]
</script>
<style lang="scss" scoped>
:deep(.el-input__inner){
    --el-disabled-text-color: #555555 !important;
}
</style>
