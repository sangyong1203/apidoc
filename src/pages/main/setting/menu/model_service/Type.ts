// Type model
export type MenuModel = {
    id: number // 메뉴 아이디
    title: string // 메뉴 명
    titleEn: string // 메뉴 영어
    path: string // 경로
    icon: string // 아이콘
    stp: number // 순서
    useYn: 'Y' | 'N' // 사용여부
    children: MenuModel[]
}
export type List = Pick<MenuModel, 'id' | 'title' | 'titleEn' | 'path' | 'icon' | 'stp' | 'useYn' | 'children'>
export type Item = Pick<MenuModel, 'id' | 'title' | 'titleEn' | 'path' | 'icon' | 'stp' | 'useYn'>
export type CreateParams = Pick<MenuModel, 'title' | 'titleEn' | 'path' | 'icon' | 'stp' | 'useYn'>
export type UpdateParams = Pick<MenuModel, 'id' | 'title' | 'titleEn' | 'path' | 'icon' | 'stp' | 'useYn'>
export type DeletePrams = Pick<MenuModel, 'id'>

export type SearchLangParams = { langType: string; pageName: string }
export type LangDataList = {
    page: string
    langType: string
    labelList: {
        key: string
        value: string
    }[]
}
