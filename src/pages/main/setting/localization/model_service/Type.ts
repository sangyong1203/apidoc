export type SearchLangParams = { langType: string; page: string }
export type LangDataList = {
    page: string
    langType: string
    labelList: {
        key: string
        value: string
    }[]
}
